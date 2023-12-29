import {
    registerDecorator,
    ValidationArguments,
    ValidationOptions,
    ValidatorConstraint,
    ValidatorConstraintInterface,
} from 'class-validator';
import { BaseEntity } from 'typeorm';

type ExistsInTableArgs = [typeof BaseEntity, string];

@ValidatorConstraint({ async: true })
export class ExistsInTableConstraint implements ValidatorConstraintInterface {
    async validate(value: string | number, args: ValidationArguments): Promise<boolean> {
        const [entityClass, column] = args.constraints as ExistsInTableArgs;

        if (!entityClass || !column) {
            return false;
        }
        const existingRow = await entityClass.findOne({
            where: { [column]: value },
        });

        return !!existingRow;
    }

    defaultMessage(): string {
        return 'Specified value does not exist in the table.';
    }
}

export function ExistsInTable<Entity extends BaseEntity = BaseEntity>(
    entityClass: new () => Entity,
    column: keyof Entity,
    validationOptions?: ValidationOptions,
) {
    return function (object: object, propertyName: string) {
        registerDecorator({
            target: object.constructor,
            propertyName,
            options: validationOptions,
            constraints: [entityClass, column],
            validator: ExistsInTableConstraint,
        });
    };
}
