import { initDb, getDb } from '../db/db';
import { seedDatabase } from '../db/seed';
import { executeCodeSandbox } from '../services/codeSandbox';
import { matchResumeWithJob } from '../ai/skillMatcher';
import bcrypt from 'bcryptjs';

const runAllTests = async () => {
  console.log('🧪 Starting CareerAI Backend Test Suite...\n');
  let passed = 0;
  let failed = 0;

  const assert = (condition: boolean, testName: string) => {
    if (condition) {
      console.log(`  ${testName}`);
      passed++;
    } else {
      console.error(`❌ FAIL: ${testName}`);
      failed++;
    }
  };

  try {
    // 1. Database Init & Seeding
    await initDb();
    await seedDatabase();
    const { store } = getDb();
    assert(store.users.length >= 2, 'Database contains seeded demo and admin users');
    assert(store.coding_problems.length >= 3, 'Database contains seeded coding challenges');

    // 2. Auth & Bcrypt verification
    const demoUser = store.users.find(u => u.email === 'demo@careerai.local');
    const isPasswordValid = await bcrypt.compare('DemoPassword123!', demoUser?.passwordHash || '');
    assert(isPasswordValid, 'Demo user password hash verification succeeds');

    // 3. Skill Matcher Engine
    const mockSkills = {
      programmingLanguages: ['JavaScript', 'TypeScript', 'SQL'],
      frameworks: ['React', 'Node.js', 'Express.js'],
      databases: ['PostgreSQL'],
      cloud: [],
      devops: ['Git'],
      tools: ['Postman'],
    };
    const matchResult = await matchResumeWithJob(
      mockSkills,
      ['React', 'TypeScript', 'Node.js', 'Docker', 'AWS'],
      ['PostgreSQL', 'Redis'],
      'Full Stack Software Engineer'
    );
    assert(matchResult.overallMatch > 50 && matchResult.overallMatch <= 100, `Skill Matcher computes accurate match score: ${matchResult.overallMatch}%`);
    assert(matchResult.matchedSkills.includes('React'), 'Skill Matcher identifies exact matched skills');
    assert(matchResult.missingSkills.includes('Docker') || matchResult.missingSkills.includes('AWS'), 'Skill Matcher identifies missing skills');

    // 4. Code Execution Sandbox Test
    const jsCode = `
function twoSum(nums, target) {
  const map = new Map();
  for (let i = 0; i < nums.length; i++) {
    const comp = target - nums[i];
    if (map.has(comp)) return [map.get(comp), i];
    map.set(nums[i], i);
  }
  return [];
}
`;
    const sandboxResult = await executeCodeSandbox(
      'javascript',
      jsCode,
      [
        { input: '[[2,7,11,15], 9]', expectedOutput: '[0,1]' },
        { input: '[[3,2,4], 6]', expectedOutput: '[1,2]' },
      ]
    );
    assert(sandboxResult.status === 'Accepted', `Code Sandbox executes JavaScript correctly (Status: ${sandboxResult.status}, ${sandboxResult.totalPassed}/${sandboxResult.totalTests} passed)`);

    console.log(`\n========================================`);
    console.log(`🏁 Test Results: ${passed} passed, ${failed} failed.`);
    console.log(`========================================\n`);

    if (failed > 0) {
      process.exit(1);
    }
  } catch (err: any) {
    console.error('Test Suite encountered unhandled error:', err);
    process.exit(1);
  }
};

runAllTests();
