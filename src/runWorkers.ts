import 'reflect-metadata';
import { AppDataSource } from '@app/database/data-source';
import '@app/config';
import QueueRegistry from '@app/queue/core/QueueRegistry';
import { WorkerLogger } from '@app/utils/loggers';

const start = async () => {
    try {
        await AppDataSource.initialize();
        WorkerLogger.info(`DB connection established`);
    } catch (e) {
        throw new Error(`DB connection failed due to: "${(e as Error).message}"`);
    }

    QueueRegistry.getWorkers().forEach(worker => worker.run());
};

start().catch(WorkerLogger.error);
