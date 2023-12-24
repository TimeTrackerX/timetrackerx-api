import { QueueNames } from '@app/queue/core/queueNames';
import { QueueLogger } from '@app/utils/loggers';
import { Job, Queue, Worker, Processor, QueueOptions, WorkerOptions } from 'bullmq';

type QueueWorkerBuilderParams<DataType = any> = {
    name: QueueNames;
    queueOptions: QueueOptions;
    workerOptions: WorkerOptions;
    processor: Processor<DataType>;
};

type QueueRegistryEntry<DataType = any> = {
    name: QueueNames;
    queue: Queue<DataType>;
    processor: (job: Job<DataType>) => Promise<void>;
    worker: Worker<DataType>;
};

export default class QueueRegistry {
    static entries: Record<string, QueueRegistryEntry> = {};

    static getEntry(name: QueueNames) {
        const knownNames = Object.keys(this.entries);
        if (knownNames.includes(name)) {
            return this.entries[name];
        }

        throw new Error(`Unknown queue named "${name}". Known names are "${knownNames.join('", "')}"`);
    }

    static getWorkers() {
        return Object.values(this.entries).map(({ worker }) => worker);
    }

    static buildQueueWorker<DataType = any>({
        name,
        processor,
        queueOptions,
        workerOptions,
    }: QueueWorkerBuilderParams): [Queue<DataType>, Worker<DataType>] {
        QueueLogger.info(`Creating the ${name} Queue`);
        const queue = new Queue<DataType>(name, queueOptions);

        const worker = new Worker<DataType>(name, processor, {
            ...workerOptions,
            connection: {
                ...queueOptions.connection,
                ...workerOptions.connection,
            },
            autorun: false,
        } as WorkerOptions);
        this.entries[name] = { name, queue, processor, worker };
        return [queue, worker];
    }
}
