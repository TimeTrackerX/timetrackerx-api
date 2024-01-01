import appConfig from '@app/config';
import { UserEntity } from '@app/entities/UserEntity';
import { ExpiredTokenError } from '@app/server/ExpiredTokenError';
import { AppLogger } from '@app/utils/loggers';
import jwt, { Algorithm } from 'jsonwebtoken';

const ALGO: Algorithm = 'HS256';
type Payload = {
    userId: number;
};
const fromUser = (user: UserEntity): string => {
    const payload: Payload = {
        userId: user.id,
    };
    return jwt.sign(payload, appConfig.auth.jwtSecret, {
        expiresIn: '1m',
        algorithm: ALGO,
    });
};

const toUser = async (token: string): Promise<UserEntity | null> => {
    try {
        const { userId } = jwt.verify(token, appConfig.auth.jwtSecret, { algorithms: [ALGO] }) as Payload;
        return UserEntity.findOneBy({
            id: userId,
        });
    } catch (err) {
        AppLogger.error(err);
        return null;
    }
};
const isValid = (token?: string | null): boolean => {
    if (!token) {
        return false;
    }
    try {
        jwt.verify(token, appConfig.auth.jwtSecret, { algorithms: [ALGO] });
        return true;
    } catch (e) {
        const error = e as Error;
        if (error.name === 'TokenExpiredError') {
            throw new ExpiredTokenError();
        }
        return false;
    }
};
const JwtService = { fromUser, toUser, isValid };
export default JwtService;
