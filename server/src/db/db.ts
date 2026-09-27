import { Pool } from 'pg';
import fs from 'fs';
import path from 'path';
import { config } from '../config/env';

// Memory/File-based fallback store in case PostgreSQL is unavailable locally
interface MemoryStore {
  users: any[];
  profiles: any[];
  resumes: any[];
  skills: any[];
  user_skills: any[];
  jobs: any[];
  job_analyses: any[];
  job_matches: any[];
  roadmaps: any[];
  roadmap_tasks: any[];
  interviews: any[];
  interview_questions: any[];
  interview_answers: any[];
  interview_reports: any[];
  coding_problems: any[];
  coding_submissions: any[];
  applications: any[];
  notifications: any[];
  ai_conversations: any[];
  ai_messages: any[];
  github_analyses: any[];
}

const dataDir = path.resolve(__dirname, '../../data');
const dataFilePath = path.join(dataDir, 'store.json');

if (!fs.existsSync(dataDir)) {
  fs.mkdirSync(dataDir, { recursive: true });
}

let memoryStore: MemoryStore = {
  users: [],
  profiles: [],
  resumes: [],
  skills: [],
  user_skills: [],
  jobs: [],
  job_analyses: [],
  job_matches: [],
  roadmaps: [],
  roadmap_tasks: [],
  interviews: [],
  interview_questions: [],
  interview_answers: [],
  interview_reports: [],
  coding_problems: [],
  coding_submissions: [],
  applications: [],
  notifications: [],
  ai_conversations: [],
  ai_messages: [],
  github_analyses: [],
};

// Load saved data if exists
if (fs.existsSync(dataFilePath)) {
  try {
    const raw = fs.readFileSync(dataFilePath, 'utf8');
    memoryStore = { ...memoryStore, ...JSON.parse(raw) };
  } catch (err) {
    console.warn('Could not parse local store.json, starting fresh');
  }
}

export const saveStore = () => {
  try {
    fs.writeFileSync(dataFilePath, JSON.stringify(memoryStore, null, 2), 'utf8');
  } catch (err) {
    console.error('Failed to persist store:', err);
  }
};

let pgPool: Pool | null = null;
let isPgConnected = false;

export const initDb = async () => {
  try {
    pgPool = new Pool({
      connectionString: config.databaseUrl,
      connectionTimeoutMillis: 3000,
    });
    
    // Test connection
    const client = await pgPool.connect();
    await client.query('SELECT 1');
    client.release();
    isPgConnected = true;
    console.log(' Successfully connected to PostgreSQL database.');
  } catch (err: any) {
    console.warn(` PostgreSQL not detected at ${config.databaseUrl} (${err.message}).`);
    console.log('⚡ CareerAI resilient persistent store initialized.');
    isPgConnected = false;
  }
};

export const getDb = () => {
  return {
    isPostgres: isPgConnected,
    pgPool,
    store: memoryStore,
    save: saveStore,
  };
};

export { memoryStore };
