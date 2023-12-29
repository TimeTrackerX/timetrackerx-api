import { ClientEntity } from '@app/entities/ClientEntity';
import { UserEntity } from '@app/entities/UserEntity';
import { ExistsInTable } from '@app/validation/ExistsInTable';
import { IsClientOwner } from '@app/validation/IsClientOwner';
import { Expose, Type } from 'class-transformer';
import { IsDate, IsDefined, Validate } from 'class-validator';

export class DateLogForm {
    @Expose()
    @IsDefined()
    @ExistsInTable(ClientEntity, 'id')
    @Validate(IsClientOwner)
    client_id!: number;

    @Expose()
    @IsDefined()
    @ExistsInTable(UserEntity, 'id')
    user_id!: number;
}

export class CreateDateLogForm extends DateLogForm {
    @Expose()
    @IsDefined()
    @Type(() => Date)
    @IsDate()
    date_logged!: Date;
}

export class PatchDateLogForm extends DateLogForm {}
