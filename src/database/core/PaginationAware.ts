import { Request } from 'express';
import { BaseEntity, FindManyOptions, FindOptionsOrder } from 'typeorm';
import { FindOneOptions } from 'typeorm/find-options/FindOneOptions';

export type FindPaginatedParams<T> = {
    limit?: number;
    page?: number;
} & FindOneOptions<T>;

export type Pagination = {
    limit: number;
    totalItems: number;
    page: number;
    totalPages: number;
    hasNext: boolean;
    hasPrev: boolean;
};

export type PaginatedItems<T> = {
    pagination: Pagination;
    items: T[];
};

export abstract class PaginationAware extends BaseEntity {
    static async findPaginated<T extends BaseEntity>(
        this: {
            new (): T;
        } & typeof BaseEntity,
        params: FindPaginatedParams<T>,
    ): Promise<PaginatedItems<T>> {
        const page = Math.abs(params.page || 1);
        const limit = Math.abs(params.limit || 10);
        const options: FindManyOptions<T> = {
            ...params,
            skip: (page - 1) * limit,
            take: limit,
        };
        const [items, totalItems] = await this.findAndCount<T>(options);
        const totalPages = Math.ceil(totalItems / limit);
        return {
            pagination: {
                page,
                limit,
                totalItems,
                totalPages,
                hasPrev: page > 1,
                hasNext: page < totalPages,
            },
            items,
        };
    }

    static findPaginatedFromRequest<T extends PaginationAware>(
        this: { new (): T } & typeof PaginationAware,
        req: Request,
        params: FindPaginatedParams<T> = {},
    ): Promise<PaginatedItems<T>> {
        const page = Number(req.query.page || 1);
        const limit = Number(req.query.limit || 10);
        const orderBy = String(req.query.orderBy || 'created');
        const orderDir = String(req.query.orderDir || 'DESC');

        const order = {
            [orderBy]: orderDir,
        } as FindOptionsOrder<T>;
        return this.findPaginated<T>({
            page,
            limit,
            order,
            ...params,
        });
    }
}
