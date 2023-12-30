import { DateLogEntity } from '@app/entities/DateLogEntity';
import { ValidationArguments, ValidatorConstraint, ValidatorConstraintInterface } from 'class-validator';

interface IsDateLogOwnerValidationArguments extends ValidationArguments {
    object: {
        date_log_id?: number;
        user_id?: number;
    };
}

@ValidatorConstraint({ name: 'ownsDateLog', async: true })
export class IsDateLogOwner implements ValidatorConstraintInterface {
    async validate(id: number, { object }: IsDateLogOwnerValidationArguments) {
        const { date_log_id, user_id } = object;
        if (!date_log_id || !user_id) {
            return false;
        }
        const count = await DateLogEntity.findOneBy({
            id: date_log_id,
            user_id,
        });

        return !!count;
    }

    defaultMessage({ object }: IsDateLogOwnerValidationArguments) {
        return `Date Log id ${object.date_log_id} is not owned by user`;
    }
}
