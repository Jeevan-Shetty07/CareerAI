import { exec } from 'child_process';
import fs from 'fs';
import path from 'path';
import { v4 as uuidv4 } from 'uuid';

export interface TestCase {
  input: string;
  expectedOutput: string;
}

export interface TestResult {
  testIndex: number;
  input: string;
  expectedOutput: string;
  actualOutput: string;
  passed: boolean;
  executionTimeMs: number;
  error?: string;
}

export interface ExecutionVerdict {
  status: 'Accepted' | 'Wrong Answer' | 'Time Limit Exceeded' | 'Runtime Error' | 'Compilation Error';
  totalPassed: number;
  totalTests: number;
  executionTimeMs: number;
  memoryKb?: number;
  testResults: TestResult[];
  compilerOutput?: string;
}

const SANDBOX_DIR = path.resolve(__dirname, '../../data/sandbox');
if (!fs.existsSync(SANDBOX_DIR)) {
  fs.mkdirSync(SANDBOX_DIR, { recursive: true });
}

export const executeCodeSandbox = async (
  language: 'javascript' | 'python' | 'java',
  code: string,
  testCases: TestCase[],
  timeoutMs: number = 3000
): Promise<ExecutionVerdict> => {
  const sessionId = uuidv4();
  const sessionDir = path.join(SANDBOX_DIR, sessionId);
  fs.mkdirSync(sessionDir, { recursive: true });

  const results: TestResult[] = [];
  let totalTime = 0;
  let overallStatus: ExecutionVerdict['status'] = 'Accepted';

  try {
    for (let i = 0; i < testCases.length; i++) {
      const tc = testCases[i];
      const start = Date.now();

      const runResult = await runSingleTest(language, code, tc.input, sessionDir, timeoutMs);
      const elapsed = Date.now() - start;
      totalTime += elapsed;

      const cleanActual = runResult.stdout.trim();
      const cleanExpected = tc.expectedOutput.trim();
      const passed = !runResult.error && (cleanActual === cleanExpected || cleanActual.replace(/\r\n/g, '\n') === cleanExpected.replace(/\r\n/g, '\n'));

      results.push({
        testIndex: i + 1,
        input: tc.input,
        expectedOutput: cleanExpected,
        actualOutput: runResult.stdout || runResult.stderr || '',
        passed: passed,
        executionTimeMs: elapsed,
        error: runResult.error,
      });

      if (!passed && overallStatus === 'Accepted') {
        if (runResult.timedOut) {
          overallStatus = 'Time Limit Exceeded';
        } else if (runResult.error) {
          overallStatus = 'Runtime Error';
        } else {
          overallStatus = 'Wrong Answer';
        }
      }
    }

    const passedCount = results.filter(r => r.passed).length;
    if (passedCount === testCases.length) {
      overallStatus = 'Accepted';
    }

    return {
      status: overallStatus,
      totalPassed: passedCount,
      totalTests: testCases.length,
      executionTimeMs: Math.round(totalTime / Math.max(1, testCases.length)),
      testResults: results,
    };
  } finally {
    // Cleanup temporary files
    try {
      fs.rmSync(sessionDir, { recursive: true, force: true });
    } catch (e) {
      // Ignore cleanup error
    }
  }
};

interface SingleRunOutput {
  stdout: string;
  stderr: string;
  error?: string;
  timedOut?: boolean;
}

const runSingleTest = (
  language: 'javascript' | 'python' | 'java',
  code: string,
  input: string,
  sessionDir: string,
  timeoutMs: number
): Promise<SingleRunOutput> => {
  return new Promise((resolve) => {
    let command = '';
    let fileName = '';

    if (language === 'javascript') {
      fileName = path.join(sessionDir, 'solution.js');
      // Wrap code with input feeder if not already standard I/O
      const wrappedCode = `
const fs = require('fs');
${code}

try {
  const inputStr = ${JSON.stringify(input)};
  // If the user defined a standard function like solution / twoSum / solve
  if (typeof solve === 'function') {
    const res = solve(inputStr);
    if (res !== undefined) console.log(typeof res === 'object' ? JSON.stringify(res) : res);
  } else if (typeof solution === 'function') {
    const res = solution(inputStr);
    if (res !== undefined) console.log(typeof res === 'object' ? JSON.stringify(res) : res);
  } else if (typeof twoSum === 'function') {
    try {
      const parsed = JSON.parse(inputStr);
      const res = Array.isArray(parsed) ? twoSum(...parsed) : twoSum(parsed);
      console.log(JSON.stringify(res));
    } catch {
      console.log(twoSum(inputStr));
    }
  } else if (typeof isValid === 'function') {
    console.log(isValid(inputStr.replace(/^"|"$/g, '')));
  } else if (typeof lengthOfLongestSubstring === 'function') {
    console.log(lengthOfLongestSubstring(inputStr.replace(/^"|"$/g, '')));
  }
} catch (err) {
  console.error(err.message);
  process.exit(1);
}
`;
      fs.writeFileSync(fileName, wrappedCode, 'utf8');
      command = `node "${fileName}"`;
    } else if (language === 'python') {
      fileName = path.join(sessionDir, 'solution.py');
      const wrappedPython = `
import sys
import json

${code}

try:
    raw_input = ${JSON.stringify(input)}
    if 'solve' in globals():
        res = solve(raw_input)
        if res is not None:
            print(json.dumps(res) if isinstance(res, (dict, list)) else res)
    elif 'twoSum' in globals():
        try:
            parsed = json.loads(raw_input)
            res = twoSum(*parsed) if isinstance(parsed, list) else twoSum(parsed)
            print(json.dumps(res))
        except:
            print(twoSum(raw_input))
    elif 'isValid' in globals():
        print(str(isValid(raw_input.strip('"'))).lower())
    elif 'lengthOfLongestSubstring' in globals():
        print(lengthOfLongestSubstring(raw_input.strip('"')))
except Exception as e:
    print(f"Error: {e}", file=sys.stderr)
    sys.exit(1)
`;
      fs.writeFileSync(fileName, wrappedPython, 'utf8');
      command = `python "${fileName}"`;
    } else if (language === 'java') {
      fileName = path.join(sessionDir, 'Solution.java');
      // For Java, write directly
      fs.writeFileSync(fileName, code, 'utf8');
      command = `java "${fileName}"`;
    }

    exec(command, { timeout: timeoutMs, maxBuffer: 1024 * 1024 }, (error, stdout, stderr) => {
      if (error) {
        const timedOut = error.killed && error.signal === 'SIGTERM';
        resolve({
          stdout: stdout.trim(),
          stderr: stderr.trim(),
          error: timedOut ? 'Time Limit Exceeded (Timeout)' : error.message,
          timedOut,
        });
      } else {
        resolve({
          stdout: stdout.trim(),
          stderr: stderr.trim(),
        });
      }
    });
  });
};
