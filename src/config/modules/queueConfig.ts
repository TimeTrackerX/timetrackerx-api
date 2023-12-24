import QueueRegistry from '@app/queue/core/QueueRegistry';
import { HelloWorldJobProps, processHelloWorldJob } from '@app/queue/hello-world';
import Env from '@app/utils/Env';
import { ConnectionOptions } from 'bullmq/dist/esm/interfaces/redis-options';

const queueUrlString = Env.asString('QUEUE_URL');
const queueUrl = new URL(queueUrlString);
const { hostname: host, port, username, password, pathname } = queueUrl;
const queueConnection: ConnectionOptions = {
    host,
    username,
    password,
    port: Number(port),
    db: Number(pathname.slice(1)),
};

QueueRegistry.buildQueueWorker<HelloWorldJobProps>({
    name: 'helloWorld',
    processor: processHelloWorldJob,
    queueOptions: {
        connection: queueConnection,
    },
    workerOptions: {
        connection: queueConnection,
    },
});
