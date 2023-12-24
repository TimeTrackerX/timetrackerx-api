import 'reflect-metadata';
import EnvClass from '@app/utils/EnvClass';
import dotenv from 'dotenv';
import dotenvExpand from 'dotenv-expand';
import * as process from 'process';

try {
    const myEnv = dotenv.config();
    dotenvExpand.expand(myEnv);
} catch (error) {
    const message = `Failed to load or expand environment variables due to ${(error as Error).message}`;
    throw new Error(message);
}
const Env = new EnvClass(process.env);

export default Env;
