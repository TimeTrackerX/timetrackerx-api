import { TEST_TOKEN } from '@app/auth/authCheck';
import appConfig from '@app/config';
import { UserEntity } from '@app/entities/UserEntity';
import { ExpiredTokenError } from '@app/server/ExpiredTokenError';
import { AppLogger } from '@app/utils/loggers';
import jwt, { Algorithm } from 'jsonwebtoken';

const ALGO: Algorithm = 'HS256';
type TokenPayload = {
    userId: number;
};
type RefreshPayload = {
    token: string;
};
const fromUser = (user: UserEntity): string => {
    const payload: TokenPayload = {
        userId: user.id,
    };
    return jwt.sign(payload, appConfig.auth.jwtSecret, {
        expiresIn: '1m',
        algorithm: ALGO,
    });
};

const toUser = async (token: string): Promise<UserEntity | null> => {
    try {
        const { userId } = jwt.verify(token, appConfig.auth.jwtSecret, { algorithms: [ALGO] }) as TokenPayload;
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
    if (token === TEST_TOKEN) {
        return true;
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

const createRefreshToken = (token: string): string => {
    const payload: RefreshPayload = {
        token,
    };
    return jwt.sign(payload, appConfig.auth.jwtSecret + token, {
        expiresIn: '1y',
        algorithm: ALGO,
    });
};

const isValidateRefreshToken = (token: string, refreshToken: string): boolean => {
    try {
        const payload = jwt.verify(refreshToken, appConfig.auth.jwtSecret + token, {
            algorithms: [ALGO],
        }) as RefreshPayload;
        return payload.token === token;
    } catch (e) {
        return false;
    }
};

const getUserIdFromRefreshToken = (token: string, refreshToken: string): number | null => {
    try {
        const refreshJwt = jwt.decode(refreshToken, {
            complete: true,
        });
        if (!refreshJwt) {
            return null;
        }
        const refreshPayload = refreshJwt.payload as RefreshPayload;
        const tokenJwt = jwt.decode(refreshPayload.token, {
            complete: true,
        });
        const { userId } = tokenJwt?.payload as TokenPayload;
        return userId;
    } catch (e) {
        return null;
    }
};
const JwtService = { fromUser, toUser, isValid, createRefreshToken, isValidateRefreshToken, getUserIdFromRefreshToken };
export default JwtService;
