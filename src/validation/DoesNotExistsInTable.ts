import {
    registerDecorator,
    ValidationArguments,
    ValidationOptions,
    ValidatorConstraint,
    ValidatorConstraintInterface,
} from 'class-validator';
import { BaseEntity } from 'typeorm';

type DoesNotExistsInTableArgs = [typeof BaseEntity, string];

@ValidatorConstraint({ async: true })
export class DoesNotExistsInTableConstraint implements ValidatorConstraintInterface {
    async validate(value: string | number, args: ValidationArguments): Promise<boolean> {
        const [entityClass, column] = args.constraints as DoesNotExistsInTableArgs;

        if (!entityClass || !column) {
            return false;
        }

        const existingRow = await entityClass.findOne({
            where: { [column]: value },
        });

        return !existingRow;
    }

    defaultMessage(): string {
        return 'Specified value already exists in the table.';
    }
}

export function DoesNotExistsInTable<Entity extends BaseEntity = BaseEntity>(
    entityClass: typeof BaseEntity,
    column: keyof Entity,
    validationOptions?: ValidationOptions,
) {
    return function (object: object, propertyName: string) {
        registerDecorator({
            target: object.constructor,
            propertyName,
            options: validationOptions,
            constraints: [entityClass, column],
            validator: DoesNotExistsInTableConstraint,
        });
    };
}
