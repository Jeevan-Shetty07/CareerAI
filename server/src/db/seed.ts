import bcrypt from 'bcryptjs';
import { v4 as uuidv4 } from 'uuid';
import { getDb } from './db';

export const seedDatabase = async () => {
  const { store, save } = getDb();

  // If already seeded with demo user, skip
  if (store.users.some(u => u.email === 'demo@careerai.local')) {
    console.log(' Database already seeded.');
    return;
  }

  console.log('🌱 Seeding CareerAI database with demo data...');

  const demoUserId = 'user-demo-jeevan-001';
  const adminUserId = 'user-admin-root-002';
  const demoHashedPassword = await bcrypt.hash('DemoPassword123!', 10);
  const adminHashedPassword = await bcrypt.hash('AdminPassword123!', 10);

  // 1. Users
  const demoUser = {
    id: demoUserId,
    email: 'demo@careerai.local',
    passwordHash: demoHashedPassword,
    role: 'USER' as const,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  };

  const adminUser = {
    id: adminUserId,
    email: 'admin@careerai.local',
    passwordHash: adminHashedPassword,
    role: 'ADMIN' as const,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  };

  store.users.push(demoUser, adminUser);

  // 2. Profiles
  const demoProfile = {
    id: 'prof-demo-001',
    userId: demoUserId,
    fullName: 'Jeevan Kumar',
    email: 'demo@careerai.local',
    avatarUrl: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=150',
    degree: 'Master of Computer Applications (MCA)',
    college: 'National Institute of Technology',
    graduationYear: '2025',
    targetRole: 'Full Stack Software Engineer',
    experienceLevel: 'Fresher / Entry-Level',
    preferredTechnologies: ['React', 'TypeScript', 'Node.js', 'PostgreSQL', 'Docker'],
    preferredLocation: 'Bengaluru, India / Remote',
    careerGoal: 'Secure a top-tier Full Stack Engineering role at a product tech company.',
    bio: 'Passionate software engineer building high-performance web applications, distributed APIs, and AI-enabled tools.',
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  };

  store.profiles.push(demoProfile);

  // 3. Resumes
  const demoResume = {
    id: 'resume-demo-001',
    userId: demoUserId,
    fileName: 'Jeevan_Kumar_MCA_Resume.pdf',
    rawText: 'Jeevan Kumar\nEmail: demo@careerai.local | Phone: +91 9876543210\nEducation: MCA, NIT (2025, CGPA 8.6)\nSkills: React, TypeScript, Node.js, Express, PostgreSQL, MongoDB, Git, Python, Java, Docker',
    personalInfo: {
      name: 'Jeevan Kumar',
      email: 'demo@careerai.local',
      phone: '+91 98765 43210',
      linkedin: 'https://linkedin.com/in/jeevan-kumar-dev',
      github: 'https://github.com/jeevankumar-dev',
      portfolio: 'https://jeevankumar.dev',
    },
    education: [
      {
        degree: 'Master of Computer Applications (MCA)',
        institution: 'National Institute of Technology',
        cgpa: '8.6/10',
        graduationYear: '2025',
      },
      {
        degree: 'Bachelor of Computer Applications (BCA)',
        institution: 'State University',
        cgpa: '8.4/10',
        graduationYear: '2023',
      },
    ],
    skills: {
      programmingLanguages: ['JavaScript', 'TypeScript', 'Java', 'Python', 'SQL'],
      frameworks: ['React', 'Node.js', 'Express.js', 'Next.js', 'Tailwind CSS'],
      databases: ['PostgreSQL', 'MongoDB', 'Redis'],
      cloud: ['AWS (S3, EC2 basic)'],
      devops: ['Docker', 'Git', 'GitHub Actions'],
      tools: ['Postman', 'VS Code', 'Vite', 'Linux'],
      softSkills: ['Problem Solving', 'Agile/Scrum', 'Technical Communication', 'Team Leadership'],
    },
    projects: [
      {
        projectName: 'DevConnect — Developer Community Platform',
        technologies: ['React', 'TypeScript', 'Node.js', 'PostgreSQL', 'Tailwind CSS'],
        description: 'Full-stack web application for developer networking, technical blogging, and project showcasing.',
        achievements: [
          'Engineered JWT authentication and role-based access control for 500+ active mock users.',
          'Optimized PostgreSQL queries using indexes, decreasing feed query latency by 45%.',
        ],
      },
      {
        projectName: 'AlgoVisualizer — Interactive Algorithm Visualizer',
        technologies: ['React', 'JavaScript', 'HTML5 Canvas', 'CSS Animations'],
        description: 'Interactive visualizer for pathfinding (Dijkstra, A*) and sorting algorithms (QuickSort, MergeSort).',
        achievements: [
          'Rendered 60 FPS animations on large grid matrices using requestAnimationFrame.',
        ],
      },
    ],
    experience: [
      {
        company: 'TechNova Solutions',
        role: 'Software Engineering Intern',
        duration: 'Jan 2024 - Jun 2024 (6 months)',
        responsibilities: [
          'Developed reusable UI components in React and TypeScript for customer dashboard.',
          'Constructed RESTful API endpoints in Node.js/Express with schema validation using Zod.',
          'Collaborated in weekly sprint planning and code review sessions.',
        ],
      },
    ],
    score: {
      overall: 82,
      atsCompatibility: {
        score: 88,
        explanation: 'Clean single-column ATS structure with standard headings, clear font hierarchy, and absence of unparseable graphics.',
      },
      skills: {
        score: 84,
        explanation: 'Comprehensive modern full-stack stack (React, TS, Node, Postgres). Adding deeper cloud architecture will push to 95+.',
      },
      projects: {
        score: 79,
        explanation: 'Strong end-to-end full-stack projects showing architectural depth. Consider showcasing a microservice or caching layer.',
      },
      experience: {
        score: 75,
        explanation: 'Valuable internship experience. Include more quantifiable performance metrics to stand out to top recruiters.',
      },
      achievements: {
        score: 65,
        explanation: 'Bullets describe what was built, but few bullets contain quantifiable business outcomes.',
      },
      formatting: {
        score: 91,
        explanation: 'Excellent visual hierarchy, standard bullet structure, and clean typography.',
      },
    },
    suggestions: [
      {
        id: 'sug-1',
        category: 'Achievements & Metrics',
        originalText: 'Constructed RESTful API endpoints in Node.js/Express with schema validation using Zod.',
        suggestedText: 'Architected 12+ secure RESTful API endpoints in Node.js/Express with Zod validation, cutting API payload error rate by 35%.',
        reason: 'Adding specific metrics and outcomes demonstrates tangible engineering impact.',
        impact: 'High',
        status: 'pending',
      },
      {
        id: 'sug-2',
        category: 'Action Verbs',
        originalText: 'Developed reusable UI components in React and TypeScript for customer dashboard.',
        suggestedText: 'Engineered a modular library of 20+ responsive React/TypeScript UI components, reducing frontend dev cycle time by 25%.',
        reason: 'Stronger action verbs like "Engineered" paired with component metrics showcase leadership.',
        impact: 'Medium',
        status: 'pending',
      },
      {
        id: 'sug-3',
        category: 'Cloud & Deployment',
        originalText: 'Docker, Git, GitHub Actions',
        suggestedText: 'Containerized full-stack services with Docker Compose and automated testing via GitHub Actions CI/CD pipeline.',
        reason: 'Clarifying practical application of DevOps tools proves hands-on proficiency.',
        impact: 'High',
        status: 'pending',
      },
    ],
    createdAt: new Date().toISOString(),
  };

  store.resumes.push(demoResume);

  // 4. Curated Jobs
  const curatedJobs = [
    {
      id: 'job-001',
      title: 'Full Stack Software Engineer',
      company: 'Razorpay',
      location: 'Bengaluru, India (Hybrid)',
      experienceLevel: 'Fresher / 0-2 Years',
      salaryRange: '₹14 LPA - ₹22 LPA',
      requiredSkills: ['React', 'TypeScript', 'Node.js', 'PostgreSQL', 'REST APIs', 'Git'],
      preferredSkills: ['Docker', 'AWS', 'Redis', 'Kafka'],
      responsibilities: [
        'Build responsive, high-throughput merchant dashboard interfaces in React and TypeScript.',
        'Develop low-latency transactional backend APIs in Node.js and PostgreSQL.',
        'Collaborate with product managers, QA engineers, and security specialists.',
        'Participate in code reviews and automated CI/CD deployment pipelines.',
      ],
      qualifications: [
        'B.Tech / MCA / BE in Computer Science or related engineering field.',
        'Strong fundamentals in Data Structures, Algorithms, and Object Oriented Design.',
        'Hands-on experience with modern JavaScript, React, and relational databases.',
      ],
      summary: 'High-growth fintech role building scalable payment checkout and developer experience tools.',
      createdAt: new Date().toISOString(),
    },
    {
      id: 'job-002',
      title: 'Frontend Engineer (React / Next.js)',
      company: 'Swiggy',
      location: 'Bengaluru, India (On-site / Hybrid)',
      experienceLevel: 'Fresher / 1-3 Years',
      salaryRange: '₹12 LPA - ₹18 LPA',
      requiredSkills: ['React', 'JavaScript', 'TypeScript', 'HTML5', 'CSS3 / Tailwind', 'Redux / TanStack Query'],
      preferredSkills: ['Next.js', 'Web Performance Optimization', 'Jest / Cypress'],
      responsibilities: [
        'Develop consumer-facing web surfaces with 60 FPS smooth animations and sub-second load times.',
        'Implement pixel-perfect designs with modular component architecture.',
        'Optimize bundle sizes, core web vitals, and asset caching strategies.',
      ],
      qualifications: [
        'Strong mastery of React component lifecycle, custom hooks, and state management.',
        'Eye for UI/UX detail and cross-browser accessibility.',
      ],
      summary: 'Deliver consumer web experiences used by millions of daily active users.',
      createdAt: new Date().toISOString(),
    },
    {
      id: 'job-003',
      title: 'Backend Systems Engineer',
      company: 'Zepto',
      location: 'Bengaluru / Mumbai, India',
      experienceLevel: '0-2 Years',
      salaryRange: '₹15 LPA - ₹24 LPA',
      requiredSkills: ['Node.js', 'PostgreSQL', 'Redis', 'REST APIs', 'Docker'],
      preferredSkills: ['Go', 'Kubernetes', 'Microservices', 'AWS'],
      responsibilities: [
        'Design microservices handling 10,000+ orders per minute with sub-50ms latency.',
        'Optimize relational database queries, table partition strategies, and Redis cache clusters.',
        'Write automated unit and integration tests for mission-critical dispatch services.',
      ],
      qualifications: [
        'Solid grasp of concurrency, event loops, and database indexing.',
        'Degree in Computer Science or related technical discipline.',
      ],
      summary: 'Fast-paced quick commerce backend team engineering real-time dispatch and routing algorithms.',
      createdAt: new Date().toISOString(),
    },
  ];

  store.jobs.push(...curatedJobs);

  // 5. Coding Problems
  const codingProblems = [
    {
      id: 'prob-two-sum',
      title: 'Two Sum',
      difficulty: 'Easy',
      category: 'Arrays & Hash Maps',
      topics: ['Arrays', 'Hash Table'],
      acceptanceRate: '92%',
      description: `Given an array of integers \`nums\` and an integer \`target\`, return *indices of the two numbers such that they add up to \`target\`*.\n\nYou may assume that each input would have ***exactly one solution***, and you may not use the same element twice.`,
      examples: [
        {
          input: 'nums = [2,7,11,15], target = 9',
          output: '[0,1]',
          explanation: 'Because nums[0] + nums[1] == 9, we return [0, 1].',
        },
        {
          input: 'nums = [3,2,4], target = 6',
          output: '[1,2]',
          explanation: 'Because nums[1] + nums[2] == 6, we return [1, 2].',
        },
      ],
      constraints: [
        '2 <= nums.length <= 10^4',
        '-10^9 <= nums[i] <= 10^9',
        '-10^9 <= target <= 10^9',
        'Only one valid answer exists.',
      ],
      starterCode: {
        javascript: `function twoSum(nums, target) {
  // Write your solution here
  const map = new Map();
  for (let i = 0; i < nums.length; i++) {
    const complement = target - nums[i];
    if (map.has(complement)) {
      return [map.get(complement), i];
    }
    map.set(nums[i], i);
  }
  return [];
}`,
        python: `def twoSum(nums, target):
    lookup = {}
    for i, num in enumerate(nums):
        complement = target - num
        if complement in lookup:
            return [lookup[complement], i]
        lookup[num] = i
    return []`,
        java: `import java.util.*;

public class Solution {
    public static int[] twoSum(int[] nums, int target) {
        Map<Integer, Integer> map = new HashMap<>();
        for (int i = 0; i < nums.length; i++) {
            int comp = target - nums[i];
            if (map.containsKey(comp)) {
                return new int[]{map.get(comp), i};
            }
            map.put(nums[i], i);
        }
        return new int[]{};
    }
    public static void main(String[] args) {
        int[] res = twoSum(new int[]{2,7,11,15}, 9);
        System.out.println(Arrays.toString(res));
    }
}`,
      },
      sampleTestCases: [
        { input: '[[2,7,11,15], 9]', expectedOutput: '[0,1]' },
        { input: '[[3,2,4], 6]', expectedOutput: '[1,2]' },
        { input: '[[3,3], 6]', expectedOutput: '[0,1]' },
      ],
      testCases: [
        { input: '[[2,7,11,15], 9]', expectedOutput: '[0,1]' },
        { input: '[[3,2,4], 6]', expectedOutput: '[1,2]' },
        { input: '[[3,3], 6]', expectedOutput: '[0,1]' },
      ],
    },
    {
      id: 'prob-valid-parentheses',
      title: 'Valid Parentheses',
      difficulty: 'Easy',
      category: 'Stack',
      topics: ['Stack', 'Strings'],
      acceptanceRate: '88%',
      description: `Given a string \`s\` containing just the characters \`'('\`, \`')'\`, \`'{'\`, \`'}'\`, \`'['\` and \`']'\`, determine if the input string is valid.\n\nAn input string is valid if:\n1. Open brackets must be closed by the same type of brackets.\n2. Open brackets must be closed in the correct order.\n3. Every close bracket has a corresponding open bracket of the same type.`,
      examples: [
        { input: 's = "()"', output: 'true' },
        { input: 's = "()[]{}"', output: 'true' },
        { input: 's = "(]"', output: 'false' },
      ],
      constraints: ['1 <= s.length <= 10^4', 's consists of parentheses only \`()[]{}\`.'],
      starterCode: {
        javascript: `function isValid(s) {
  const stack = [];
  const map = { ')': '(', '}': '{', ']': '[' };
  for (const char of s) {
    if (char === '(' || char === '{' || char === '[') {
      stack.push(char);
    } else {
      if (stack.pop() !== map[char]) return false;
    }
  }
  return stack.length === 0;
}`,
        python: `def isValid(s):
    stack = []
    mapping = {')': '(', '}': '{', ']': '['}
    for char in s:
        if char in mapping.values():
            stack.append(char)
        elif char in mapping:
            if not stack or stack.pop() != mapping[char]:
                return False
    return len(stack) == 0`,
        java: `import java.util.*;

public class Solution {
    public static boolean isValid(String s) {
        Stack<Character> stack = new Stack<>();
        for (char c : s.toCharArray()) {
            if (c == '(') stack.push(')');
            else if (c == '{') stack.push('}');
            else if (c == '[') stack.push(']');
            else if (stack.isEmpty() || stack.pop() != c) return false;
        }
        return stack.isEmpty();
    }
    public static void main(String[] args) {
        System.out.println(isValid("()[]{}"));
    }
}`,
      },
      sampleTestCases: [
        { input: '"()"', expectedOutput: 'true' },
        { input: '"()[]{}"', expectedOutput: 'true' },
        { input: '"(]"', expectedOutput: 'false' },
      ],
      testCases: [
        { input: '"()"', expectedOutput: 'true' },
        { input: '"()[]{}"', expectedOutput: 'true' },
        { input: '"(]"', expectedOutput: 'false' },
      ],
    },
    {
      id: 'prob-longest-substring',
      title: 'Longest Substring Without Repeating Characters',
      difficulty: 'Medium',
      category: 'Sliding Window',
      topics: ['Strings', 'Sliding Window', 'Hash Table'],
      acceptanceRate: '72%',
      description: `Given a string \`s\`, find the length of the **longest substring** without repeating characters.`,
      examples: [
        { input: 's = "abcabcbb"', output: '3', explanation: 'The answer is "abc", with the length of 3.' },
        { input: 's = "bbbbb"', output: '1', explanation: 'The answer is "b", with the length of 1.' },
      ],
      constraints: ['0 <= s.length <= 5 * 10^4', 's consists of English letters, digits, symbols and spaces.'],
      starterCode: {
        javascript: `function lengthOfLongestSubstring(s) {
  let maxLength = 0;
  let left = 0;
  const set = new Set();
  for (let right = 0; right < s.length; right++) {
    while (set.has(s[right])) {
      set.delete(s[left]);
      left++;
    }
    set.add(s[right]);
    maxLength = Math.max(maxLength, right - left + 1);
  }
  return maxLength;
}`,
        python: `def lengthOfLongestSubstring(s):
    char_set = set()
    left = 0
    max_len = 0
    for right in range(len(s)):
        while s[right] in char_set:
            char_set.remove(s[left])
            left += 1
        char_set.add(s[right])
        max_len = max(max_len, right - left + 1)
    return max_len`,
        java: `import java.util.*;

public class Solution {
    public static int lengthOfLongestSubstring(String s) {
        Set<Character> set = new HashSet<>();
        int max = 0, left = 0;
        for (int right = 0; right < s.length(); right++) {
            while (set.contains(s.charAt(right))) {
                set.remove(s.charAt(left++));
            }
            set.add(s.charAt(right));
            max = Math.max(max, right - left + 1);
        }
        return max;
    }
    public static void main(String[] args) {
        System.out.println(lengthOfLongestSubstring("abcabcbb"));
    }
}`,
      },
      sampleTestCases: [
        { input: '"abcabcbb"', expectedOutput: '3' },
        { input: '"bbbbb"', expectedOutput: '1' },
        { input: '"pwwkew"', expectedOutput: '3' },
      ],
      testCases: [
        { input: '"abcabcbb"', expectedOutput: '3' },
        { input: '"bbbbb"', expectedOutput: '1' },
        { input: '"pwwkew"', expectedOutput: '3' },
      ],
    },
  ];

  store.coding_problems.push(...codingProblems);

  // 6. Submissions (User solved Two Sum)
  store.coding_submissions.push({
    id: 'sub-001',
    userId: demoUserId,
    problemId: 'prob-two-sum',
    problemTitle: 'Two Sum',
    language: 'javascript',
    status: 'Accepted',
    totalPassed: 3,
    totalTests: 3,
    executionTimeMs: 42,
    createdAt: new Date().toISOString(),
  });

  // 7. Kanban Applications
  const initialApps = [
    {
      id: 'app-001',
      userId: demoUserId,
      company: 'Razorpay',
      role: 'Full Stack Engineer',
      location: 'Bengaluru, India',
      salary: '₹18 LPA',
      jobUrl: 'https://razorpay.com/careers',
      status: 'Interview',
      notes: 'Technical round scheduled on Friday with Engineering Manager.',
      appliedDate: '2026-09-15',
      createdAt: new Date().toISOString(),
    },
    {
      id: 'app-002',
      userId: demoUserId,
      company: 'Swiggy',
      role: 'Frontend Engineer',
      location: 'Bengaluru, India',
      salary: '₹16 LPA',
      jobUrl: 'https://swiggy.com/careers',
      status: 'Assessment',
      notes: 'Completed React & JavaScript online test with 95% score.',
      appliedDate: '2026-09-18',
      createdAt: new Date().toISOString(),
    },
    {
      id: 'app-003',
      userId: demoUserId,
      company: 'Zepto',
      role: 'Backend Engineer',
      location: 'Bengaluru, India',
      salary: '₹19 LPA',
      jobUrl: 'https://zeptonow.com',
      status: 'Applied',
      notes: 'Submitted resume tailored for Node.js and PostgreSQL backend.',
      appliedDate: '2026-09-20',
      createdAt: new Date().toISOString(),
    },
    {
      id: 'app-004',
      userId: demoUserId,
      company: 'Stripe',
      role: 'Software Engineer (APIs)',
      location: 'Remote',
      salary: '$110,000',
      jobUrl: 'https://stripe.com/jobs',
      status: 'Saved',
      notes: 'Target role for Q4. Complete Docker and AWS roadmap phases first.',
      appliedDate: '2026-09-22',
      createdAt: new Date().toISOString(),
    },
  ];

  store.applications.push(...initialApps);

  // 8. Notifications
  store.notifications.push(
    {
      id: 'notif-001',
      userId: demoUserId,
      title: 'Welcome to CareerAI!',
      message: 'Explore your personalized Career Readiness Dashboard and start an AI Mock Interview.',
      type: 'milestone',
      isRead: false,
      createdAt: new Date().toISOString(),
    },
    {
      id: 'notif-002',
      userId: demoUserId,
      title: 'Resume Analyzed Successfully',
      message: 'Your resume received an ATS score of 88/100. Review 3 AI suggestions to reach 95+.',
      type: 'resume',
      isRead: false,
      createdAt: new Date().toISOString(),
    }
  );

  save();
  console.log(' Seeding completed successfully.');
};
