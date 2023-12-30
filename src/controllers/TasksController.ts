import { TaskEntity } from '@app/entities/TaskEntity';
import { UserEntity } from '@app/entities/UserEntity';
import { CreateTaskForm, PatchTaskForm } from '@app/forms/TasksForm';
import { RestfulHandlerInterface } from '@app/services/RestResponse/core/RestfulHandlerInterface';
import { TasksHandler } from '@app/services/RestResponse/handlers/TasksHandler';
import { Request } from 'express';
import {
    Authorized,
    Body,
    CurrentUser,
    Delete,
    Get,
    JsonController,
    Param,
    Patch,
    Post,
    Req,
} from 'routing-controllers';

@JsonController('/api/tasks')
@Authorized()
export class TasksController {
    responseService: RestfulHandlerInterface<TaskEntity, CreateTaskForm, PatchTaskForm>;

    constructor() {
        this.responseService = new TasksHandler();
    }

    @Get('/')
    async list(@CurrentUser() user: UserEntity, @Req() req: Request) {
        return this.responseService.handleList(user, req);
    }

    @Get('/:id')
    read(@CurrentUser() user: UserEntity, @Param('id') id: number) {
        return this.responseService.handleRead(user, id);
    }

    @Post('/')
    create(@CurrentUser() user: UserEntity, @Body({ required: true }) payload: CreateTaskForm) {
        payload.user_id = user.id;
        return this.responseService.handleCreate(user, payload);
    }

    @Patch('/:id')
    async update(@CurrentUser() user: UserEntity, @Param('id') id: number, @Body() payload: PatchTaskForm) {
        const task = await TaskEntity.findOneByOrFail({ id });
        payload.user_id = user.id;
        payload.date_log_id = task.date_log_id;
        return this.responseService.handleUpdate(user, id, payload);
    }

    @Delete('/:id')
    delete(@CurrentUser() user: UserEntity, @Param('id') id: number) {
        return this.responseService.handleDelete(user, id);
    }
}
