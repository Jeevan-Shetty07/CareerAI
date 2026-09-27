import app from './app';
import { config } from './config/env';
import { initDb } from './db/db';
import { seedDatabase } from './db/seed';

const startServer = async () => {
  try {
    console.log(' Initializing CareerAI backend...');
    await initDb();
    await seedDatabase();

    app.listen(config.port, () => {
      console.log(`====================================================`);
      console.log(`🚀 CareerAI Platform API Server running on port ${config.port}`);
      console.log(`🌐 Health endpoint: http://localhost:${config.port}/api/health`);
      console.log(`🔑 AI Provider: Google Gemini (${config.geminiApiKey ? 'Configured' : 'No Key - Fallback Active'})`);
      console.log(`====================================================`);
    });
  } catch (err: any) {
    console.error('Fatal Server Error:', err);
    process.exit(1);
  }
};

startServer();
