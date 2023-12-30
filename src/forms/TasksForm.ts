import { DateLogEntity } from '@app/entities/DateLogEntity';
import { UserEntity } from '@app/entities/UserEntity';
import { ExistsInTable } from '@app/validation/ExistsInTable';
import { IsDateLogOwner } from '@app/validation/IsDateLogOwner';
import { Expose } from 'class-transformer';
import { IsDefined, IsString, Length, Validate } from 'class-validator';

export class TaskForm {
    @Expose()
    @IsDefined()
    @ExistsInTable(UserEntity, 'id')
    user_id!: number;

    @Expose()
    @IsDefined()
    @ExistsInTable(DateLogEntity, 'id')
    @Validate(IsDateLogOwner)
    date_log_id!: number;
}

export class CreateTaskForm extends TaskForm {
    @Expose()
    @IsDefined()
    @IsString()
    @Length(2, 1000)
    description!: string;
}

export class PatchTaskForm extends CreateTaskForm {}
