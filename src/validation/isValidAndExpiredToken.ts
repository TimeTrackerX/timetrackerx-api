import JwtService from '@app/services/JwtService';
import { ValidatorConstraint, ValidatorConstraintInterface } from 'class-validator';

@ValidatorConstraint({ name: 'isValidAndExpiredToken', async: false })
export class IsValidAndExpiredToken implements ValidatorConstraintInterface {
    validate(token: string) {
        try {
            JwtService.isValid(token);
            return false;
        } catch (e) {
            const error = e as Error;
            return error.name === 'ExpiredTokenError';
        }
    }

    defaultMessage() {
        return `Token is invalid or not expired`;
    }
}
