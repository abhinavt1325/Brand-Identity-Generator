import 'dotenv/config';
import { buildApp } from './app';
import { logger } from './utils/logger';

const start = async () => {
  try {
    const app = await buildApp();
    const port = parseInt(process.env.PORT || '3000', 10);
    
    await app.listen({ port, host: '0.0.0.0' });
    logger.info(`🚀 Server running on port ${port}`);
  } catch (err) {
    logger.error(err);
    process.exit(1);
  }
};

start();
