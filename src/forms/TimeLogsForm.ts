import { ClientEntity } from '@app/entities/ClientEntity';
import { UserEntity } from '@app/entities/UserEntity';
import { ExistsInTable } from '@app/validation/ExistsInTable';
import { IsClientOwner } from '@app/validation/IsClientOwner';
import { Expose, Type } from 'class-transformer';
import { IsDate, IsDefined, IsOptional, Validate } from 'class-validator';

export class TimeLogForm {
    @Expose()
    @IsDefined()
    @ExistsInTable(ClientEntity, 'id')
    @Validate(IsClientOwner)
    client_id!: number;

    @Expose()
    @IsDefined()
    @ExistsInTable(UserEntity, 'id')
    user_id!: number;

    @Expose()
    @IsOptional()
    @Type(() => Date)
    @IsDate()
    time!: Date;
}
