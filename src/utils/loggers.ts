import Env from '@app/utils/Env';
import pino, { LoggerOptions } from 'pino';

const transport = Env.isDev()
    ? {
          target: 'pino-pretty',
          options: {
              colorize: true,
          },
      }
    : undefined;

const defaultPinoConfig: LoggerOptions = {
    transport,
};

export const QueueLogger = pino({
    ...defaultPinoConfig,
    name: 'Queue',
});

export const WorkerLogger = QueueLogger.child({
    name: 'Worker',
});

export const AppLogger = pino({
    ...defaultPinoConfig,
    name: 'App',
});

export const DbLogger = pino({
    ...defaultPinoConfig,
    name: 'Database',
});

export const CacheLogger = pino({
    ...defaultPinoConfig,
    name: 'Cache',
});

export const SyncLogger = pino({
    ...defaultPinoConfig,
    name: 'Sync',
});
