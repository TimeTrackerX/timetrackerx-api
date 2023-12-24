import QueueRegistry from '@app/queue/core/QueueRegistry';
import { WorkerLogger } from '@app/utils/loggers';
import { Job } from 'bullmq';

export type HelloWorldJobProps = {
    name: string;
};

export const processHelloWorldJob = async (job: Job<HelloWorldJobProps>) => {
    const { name } = job.data;
    WorkerLogger.info(`Hello ${name}`);
};

export const createHelloWorldJob = (data: HelloWorldJobProps) => {
    const { name, queue } = QueueRegistry.getEntry('helloWorld');
    return queue.add(name, data);
};
