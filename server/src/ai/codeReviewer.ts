import { generateStructuredJson } from './aiClient';

export interface CodeReviewResult {
  correctness: 'Optimal' | 'Correct' | 'Partially Correct' | 'Suboptimal' | 'Incorrect';
  timeComplexity: string;
  spaceComplexity: string;
  codeQualityScore: number; // 1-10
  readabilityFeedback: string;
  edgeCasesHandled: string[];
  edgeCasesMissed: string[];
  optimizationTips: string[];
  hint: string;
  optimalApproachSummary: string;
}

export const reviewCode = async (
  problemTitle: string,
  problemDescription: string,
  language: string,
  userCode: string,
  testVerdict: string
): Promise<CodeReviewResult> => {
  const systemPrompt = `You are a Senior Algorithm Engineer and Competitive Programming Coach.
Review the candidate's code submission for the problem "${problemTitle}".
Analyze correctness, time & space complexity, code cleanliness, and edge-case handling.
Provide progressive hints rather than immediately dumping the entire solution.`;

  const userPrompt = `Problem: ${problemTitle}
Problem Description:
${problemDescription}

Language: ${language}
Execution Verdict: ${testVerdict}

User's Code:
\`\`\`${language}
${userCode}
\`\`\`

Return a JSON object with this exact structure:
{
  "correctness": "Correct",
  "timeComplexity": "O(n)",
  "spaceComplexity": "O(n)",
  "codeQualityScore": 9,
  "readabilityFeedback": "Clean variable naming and clear logic flow. Good use of idiomatic Map methods.",
  "edgeCasesHandled": ["Empty input array", "Negative numbers", "Duplicate elements"],
  "edgeCasesMissed": ["Integer overflow on large values"],
  "optimizationTips": [
    "Consider pre-allocating hash map capacity if input length is known.",
    "Early return when target complement is encountered."
  ],
  "hint": "Think about whether you can solve this in single pass by checking if target - current exists in your lookup structure before adding it.",
  "optimalApproachSummary": "Single-pass Hash Map achieves optimal O(n) time and O(n) space complexity."
}`;

  const fallback: CodeReviewResult = {
    correctness: testVerdict === 'Accepted' ? 'Correct' : 'Partially Correct',
    timeComplexity: "O(n)",
    spaceComplexity: "O(n)",
    codeQualityScore: 8,
    readabilityFeedback: "The code is clearly written with standard naming conventions and straightforward control flow. Good separation of concerns.",
    edgeCasesHandled: [
      "Standard input arrays",
      "Positive and negative integer values",
      "Array length >= 2"
    ],
    edgeCasesMissed: [
      "Handling empty or single-element boundary inputs without throwing",
      "Large array bounds where integer overflow or memory exhaustion may occur"
    ],
    optimizationTips: [
      "Use a single pass hash lookup to avoid redundant iterations",
      "Guard against undefined or null inputs at the top of the function",
      "Avoid mutating input parameters directly"
    ],
    hint: "Examine if you can store visited values in a Hash Map to look up complements in O(1) time rather than nested loops.",
    optimalApproachSummary: "Optimal solution utilizes a Hash Map or Two-Pointer technique to achieve linear O(n) time complexity."
  };

  return await generateStructuredJson<CodeReviewResult>(userPrompt, systemPrompt, fallback);
};
