import appConfig from '@app/config';
import { AppDataSource } from '@app/database/data-source';
import { UserEntity } from '@app/entities/UserEntity';
import * as process from 'process';

const TryCatch = async (
    func: () => Promise<any> | any,
    messages: {
        success?: string | undefined;
        failure?: string | undefined;
    } = { success: undefined, failure: undefined },
) => {
    const { success, failure } = messages;
    try {
        await func();
        if (success) {
            console.info(success);
        }
    } catch (e) {
        console.error(failure || (e as Error).message);
        process.exit(1);
    }
};

const main = async () => {
    await TryCatch(() => AppDataSource.initialize(), {
        success: 'connected to DB',
        failure: 'unable to connect to DB',
    });
    const found = await UserEntity.findOneBy({
        email: appConfig.auth.testUserEmail,
    });

    if (found) {
        console.info('Test user already exists');
    } else {
        const testUser = UserEntity.create({
            name: 'Test User',
            email: appConfig.auth.testUserEmail,
        });

        await TryCatch(() => testUser.save(), {
            success: 'Test User created',
        });
        console.info(JSON.stringify(testUser, null, 4));
    }
    process.exit(0);
};

main();
