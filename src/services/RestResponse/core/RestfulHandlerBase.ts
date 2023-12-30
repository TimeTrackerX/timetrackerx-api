import { UserOwnedEntity } from '@app/database/core/UserOwnedEntity';
import { UserEntity } from '@app/entities/UserEntity';
import { RestfulHandlerInterface } from '@app/services/RestResponse/core/RestfulHandlerInterface';
import HttpValidationError from '@app/validation/HttpValidationError';
import Validation from '@app/validation/Validation';
import { Request } from 'express';
import { BadRequestError } from 'routing-controllers';
import { DeepPartial } from 'typeorm';
import { FindOptionsWhere } from 'typeorm/find-options/FindOptionsWhere';

export abstract class RestfulHandlerBase<
    Entity extends UserOwnedEntity = UserOwnedEntity,
    CreateForm extends object = Entity,
    PatchForm extends object = Entity,
> implements RestfulHandlerInterface<Entity, CreateForm, PatchForm>
{
    abstract getEntityName(): string;

    abstract getEntityClass(): { new (): Entity } & typeof UserOwnedEntity;

    async handleCreate(user: UserEntity, payload: CreateForm): Promise<Entity> {
        try {
            const data = await Validation.validate(payload);
            const partial = this.getEntityClass().create<Entity>({
                ...data,
                user_id: user.id,
            } as DeepPartial<Entity>);
            return await partial.save();
        } catch (e) {
            if (e instanceof HttpValidationError) {
                throw e;
            }
            const error = e as Error;
            throw new BadRequestError(`Unable to create ${this.getEntityName()} due to "${error.message}"`);
        }
    }

    async handleDelete(user: UserEntity, id: number): Promise<Entity> {
        const entity = await this.getEntityClass().findOneByOrFail<Entity>({
            id,
            user_id: user.id,
        } as FindOptionsWhere<Entity>);

        try {
            return await entity.softRemove();
        } catch (e) {
            const error = e as Error;
            throw new BadRequestError(`Unable to delete ${this.getEntityName()} due to "${error.message}"`);
        }
    }

    async handleList(user: UserEntity, req: Request) {
        const { pagination, items } = await this.getEntityClass().findPaginatedFromRequest(req, {
            where: {
                user_id: user.id,
            },
        });
        return { pagination, items: items as Entity[] };
    }

    async handleRead(user: UserEntity, id: number): Promise<Entity> {
        return this.getEntityClass().findOneByOrFail<Entity>({
            id,
            user_id: user.id,
        } as FindOptionsWhere<Entity>);
    }

    async handleUpdate(user: UserEntity, id: number, payload: PatchForm): Promise<Entity> {
        let entity: Entity = await this.getEntityClass().findOneByOrFail<Entity>({
            id,
            user_id: user.id,
        } as FindOptionsWhere<Entity>);
        const data = await Validation.validate(payload);
        entity = this.getEntityClass().merge<Entity>(entity, {
            ...data,
            user_id: user.id,
        } as DeepPartial<Entity>);

        try {
            return await entity.save();
        } catch (e) {
            const error = e as Error;
            throw new BadRequestError(`Unable to update ${this.getEntityName()} due to "${error.message}"`);
        }
    }
}
