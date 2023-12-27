import { Transform, TransformOptions } from 'class-transformer';
import Decimal from 'decimal.js';
import { Column as TypeORMColumn, ValueTransformer, ColumnOptions } from 'typeorm';

class DecimalTransformer implements ValueTransformer {
    to(decimal?: Decimal): string | null {
        return decimal?.toString() || null;
    }

    from(decimal?: string): Decimal | null {
        return decimal ? new Decimal(decimal) : null;
    }
}

export function MoneyColumn(options: ColumnOptions & TransformOptions = {}): PropertyDecorator {
    const defaultColumnOptions: ColumnOptions = {
        unsigned: true,
        type: 'decimal',
        precision: 10,
        scale: 2,
        default: 0.0,
    };

    const { toPlainOnly = true, ...transformOptions } = options;
    const columnOptions: ColumnOptions = { ...defaultColumnOptions, ...options };

    return function (target: object, propertyName: string | symbol): void {
        TypeORMColumn({
            ...columnOptions,
            transformer: new DecimalTransformer(),
        })(target, propertyName);

        Transform(({ value }: { value?: Decimal }) => value?.toFixed?.(2) || value, {
            toPlainOnly,
            ...transformOptions,
        })(target, propertyName);
    };
}
