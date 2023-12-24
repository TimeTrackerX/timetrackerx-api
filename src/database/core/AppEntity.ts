import { PaginationAware } from '@app/database/core/PaginationAware';
import { BaseEntity, CreateDateColumn, DeleteDateColumn, PrimaryGeneratedColumn, UpdateDateColumn } from 'typeorm';
import { FindOptionsWhere } from 'typeorm/find-options/FindOptionsWhere';
import { QueryDeepPartialEntity } from 'typeorm/query-builder/QueryPartialEntity';
import { UpsertOptions } from 'typeorm/repository/UpsertOptions';

export abstract class AppEntity extends PaginationAware {
    @PrimaryGeneratedColumn()
    id!: number;

    @CreateDateColumn()
    created!: Date;

    @UpdateDateColumn()
    updated!: Date;

    @DeleteDateColumn()
    deleted!: Date | null;

    static async exists<T extends BaseEntity>(
        this: {
            new (): T;
        } & typeof BaseEntity,
        where: FindOptionsWhere<T> | FindOptionsWhere<T>[],
    ): Promise<boolean> {
        const count = await this.count({ where });
        return count > 0;
    }

    static async upsertOneAndReturn<T extends BaseEntity>(
        this: { new (): T } & typeof BaseEntity,
        entity: QueryDeepPartialEntity<T>,
        conflictPathsOrOptions: string[] | UpsertOptions<T>,
    ): Promise<T> {
        const { identifiers } = await this.upsert(entity, conflictPathsOrOptions);
        const where = identifiers.pop() as FindOptionsWhere<T>;
        return this.findOneByOrFail<T>(where);
    }
}
