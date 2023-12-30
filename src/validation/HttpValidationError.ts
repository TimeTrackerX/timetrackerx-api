import { ValidationError } from 'class-validator';
import { HttpError } from 'routing-controllers';

export default class HttpValidationError extends HttpError {
    name = 'HttpValidationError';
    validationErrors: ValidationError[];

    constructor(validationErrors: ValidationError[], message: string = 'Validation Error') {
        super(422, message);
        Object.setPrototypeOf(this, HttpValidationError.prototype);

        this.validationErrors = validationErrors;
    }

    get errors() {
        const errors: {
            simple: { field: string; message: string }[];
            comprehensive: ValidationError[];
        } = {
            simple: [],
            comprehensive: [],
        };
        this.validationErrors.forEach(validationError => {
            delete validationError.value;
            errors.comprehensive.push(validationError);
            if (validationError.constraints) {
                const constraintMessages = Object.values(validationError.constraints);
                const message = constraintMessages.length > 0 ? constraintMessages.pop() : 'Unknown validation error';

                if (message) {
                    errors.simple.push({
                        field: validationError.property,
                        message,
                    });
                }
            }
        });
        return errors;
    }

    toJSON() {
        return {
            name: this.name,
            message: this.message,
            errors: this.errors,
        };
    }
}
