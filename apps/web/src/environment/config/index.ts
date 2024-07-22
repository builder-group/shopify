import { logger } from '@/logger';

import { appConfig } from './app';

export * from './app';

logger.info('✅ Loaded configuration', { appConfig });
