import Env from '@app/utils/Env';
import pino from 'pino';

const DebugLogger = pino({
    name: 'Debug',
    transport: {
        target: 'pino-pretty',
        options: {
            colorize: true,
        },
    },
});

export const debug = (message: any) => {
    let line = 0;
    let functionName = 'unknown function';
    let file = 'unknown file';
    const fakeError = new Error();
    if (fakeError.stack) {
        const frame = fakeError.stack.split('\n')[2];
        line = Number(frame.split(':').reverse()[1]);
        functionName = frame.split(' ')[5];
        file = frame.split('(')[1].slice(0, -1);
    }
    Env.isDev() &&
        DebugLogger.info({
            functionName,
            file,
            line,
            message,
        });
};
