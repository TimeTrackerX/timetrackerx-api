import { AmericanCurrency } from '@app/validation/currencyDefaults';
import { Expose, Transform, Type } from 'class-transformer';
import { IsCurrency, IsDefined, IsInt, IsOptional, IsString, IsUrl, Length, Max, Min } from 'class-validator';

export class ClientForm {
    @Expose()
    @IsOptional()
    @IsString()
    @Length(1, 1000)
    description!: string;

    @Expose()
    @IsOptional()
    @IsUrl()
    logo_url!: string;

    @Expose()
    @IsOptional()
    @Type(() => String)
    @Transform(({ value }) => String(value), { toClassOnly: true })
    @IsCurrency(AmericanCurrency, {
        message: `$property must be a positive American currency`,
    })
    hourly_rate!: number;

    @Expose()
    @IsOptional()
    @IsInt()
    @Min(1)
    @Max(744)
    monthly_cap!: string;
}

export class CreateClientForm extends ClientForm {
    @Expose()
    @IsDefined()
    @IsString()
    @Length(2, 100)
    name!: string;
}

export class PatchClientForm extends ClientForm {
    @Expose()
    @IsOptional()
    @IsString()
    @Length(2, 100)
    name!: string;
}
