import { TaskEntity } from '@app/entities/TaskEntity';
import { CreateTaskForm, PatchTaskForm } from '@app/forms/TasksForm';
import { RestfulHandlerBase } from '@app/services/RestResponse/core/RestfulHandlerBase';

export class TasksHandler extends RestfulHandlerBase<TaskEntity, CreateTaskForm, PatchTaskForm> {
    getEntityClass() {
        return TaskEntity;
    }

    getEntityName() {
        return 'Task';
    }
}
