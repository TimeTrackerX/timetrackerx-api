import { IsValidRefreshToken } from '@app/validation/IsValidRefreshToken';
import { IsValidAndExpiredToken } from '@app/validation/isValidAndExpiredToken';
import { Expose } from 'class-transformer';
import { IsDefined, IsJWT, Validate } from 'class-validator';

export class TokenRefresh {
    @Expose()
    @IsDefined()
    @IsJWT()
    @Validate(IsValidAndExpiredToken)
    token!: string;

    @Expose()
    @IsDefined()
    @IsJWT()
    @Validate(IsValidRefreshToken)
    refreshToken!: string;
}
