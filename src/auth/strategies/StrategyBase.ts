import { UserEntity } from '@app/entities/UserEntity';
import { Request } from 'express';

export type StrategyResponse = {
    user?: UserEntity;
    error?: Error;
};

export default interface StrategyBase<Config = object> {
    config: Config;
    userFromRequest: (req: Request) => Promise<StrategyResponse>;
}
