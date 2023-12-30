import { PaginatedItems } from '@app/database/core/PaginationAware';
import { UserOwnedEntity } from '@app/database/core/UserOwnedEntity';
import { UserEntity } from '@app/entities/UserEntity';
import { Request } from 'express';

export interface RestfulHandlerInterface<
    Entity extends UserOwnedEntity,
    CreateForm extends object = Entity,
    PatchForm extends object = Entity,
> {
    handleList: (user: UserEntity, req: Request) => Promise<PaginatedItems<Entity>>;
    handleRead: (user: UserEntity, id: number) => Promise<Entity>;
    handleCreate: (user: UserEntity, payload: CreateForm) => Promise<Entity>;
    handleUpdate: (user: UserEntity, id: number, payload: PatchForm) => Promise<Entity>;
    handleDelete: (user: UserEntity, id: number) => Promise<Entity>;
}
