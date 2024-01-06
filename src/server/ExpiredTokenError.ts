import { UnauthorizedError } from 'routing-controllers';

export class ExpiredTokenError extends UnauthorizedError {
    name = 'ExpiredTokenError';
    constructor() {
        super();
        Object.setPrototypeOf(this, ExpiredTokenError.prototype);
    }
}
