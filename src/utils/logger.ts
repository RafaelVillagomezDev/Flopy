import { config } from '@utils/config';

export const logger = {
  info: (...args: any[]) => {
    if (config.isDev) {
      console.log('[INFO]:', ...args);
    }
  },
  error: (...args: any[]) => {
    console.error('[ERROR]:', ...args);
  }
};