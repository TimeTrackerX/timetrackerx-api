import HttpValidationError from '@app/validation/HttpValidationError';
import { validate } from 'class-validator';

export default class Validation {
    validationInstance: object;
    error?: HttpValidationError;
    isValid = false;

    constructor(validationInstance: object) {
        this.validationInstance = validationInstance;
    }

    async validate() {
        const errors = await validate(this.validationInstance, {
            validationError: { target: false },
            skipMissingProperties: true,
        });
        this.isValid = errors.length === 0;
        if (!this.isValid) {
            this.error = new HttpValidationError(errors);
        }
    }

    static async validate<T extends object = object>(validationInstance: T): Promise<T> {
        const validation = new Validation(validationInstance);
        await validation.validate();
        if (!validation.isValid) {
            throw validation.error;
        }

        return validation.validationInstance as T;
    }
}
