import JwtService from '@app/services/JwtService';
import { ValidatorConstraint, ValidatorConstraintInterface, ValidationArguments } from 'class-validator';

interface IsValidRefreshTokenArgs extends ValidationArguments {
    object: {
        token?: string;
        refreshToken?: string;
    };
}
@ValidatorConstraint({ name: 'isValidRefreshToken', async: false })
export class IsValidRefreshToken implements ValidatorConstraintInterface {
    async validate(refreshToken: string, { object }: IsValidRefreshTokenArgs) {
        const { token } = object;
        if (!token || !refreshToken) {
            return false;
        }

        return JwtService.isValidateRefreshToken(token, refreshToken);
    }

    defaultMessage() {
        return `Token is invalid or not expired`;
    }
}
