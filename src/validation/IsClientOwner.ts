import { ClientEntity } from '@app/entities/ClientEntity';
import { ValidatorConstraint, ValidatorConstraintInterface, ValidationArguments } from 'class-validator';

interface IsClientOwnerValidationArguments extends ValidationArguments {
    object: {
        client_id?: number;
        user_id?: number;
    };
}
@ValidatorConstraint({ name: 'ownsClient', async: true })
export class IsClientOwner implements ValidatorConstraintInterface {
    async validate(clientId: number, { object }: IsClientOwnerValidationArguments) {
        const { client_id, user_id } = object;
        if (!client_id || !user_id) {
            return false;
        }
        const count = await ClientEntity.findOneBy({
            id: client_id,
            user_id,
        });

        return !!count;
    }

    defaultMessage({ object }: IsClientOwnerValidationArguments) {
        return `Client id ${object.client_id} is not owned by user`;
    }
}
