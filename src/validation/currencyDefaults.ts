import { ValidationOptions } from 'class-validator/types/decorator/ValidationOptions';
import ValidatorJS from 'validator';

export const AmericanCurrency: ValidatorJS.IsCurrencyOptions & ValidationOptions = {
    symbol: '',
    require_symbol: false,
    allow_space_after_symbol: false,
    symbol_after_digits: false,
    allow_negatives: false,
    parens_for_negatives: false,
    negative_sign_before_digits: false,
    negative_sign_after_digits: false,
    allow_negative_sign_placeholder: false,
    thousands_separator: ',',
    decimal_separator: '.',
    allow_decimal: true,
    require_decimal: false,
    digits_after_decimal: [2],
    allow_space_after_digits: false,
};
