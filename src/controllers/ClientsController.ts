import { ClientEntity } from '@app/entities/ClientEntity';
import { DateLogEntity } from '@app/entities/DateLogEntity';
import { TimeLogEntity } from '@app/entities/TimeLogEntity';
import { UserEntity } from '@app/entities/UserEntity';
import { CreateClientForm, PatchClientForm } from '@app/forms/Client';
import { TimeLog } from '@app/forms/TimeLog';
import { RestfulHandlerInterface } from '@app/services/RestResponse/core/RestfulHandlerInterface';
import { ClientsHandler } from '@app/services/RestResponse/handlers/ClientsHandler';
import Validation from '@app/validation/Validation';
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

@JsonController('/api/clients')
@Authorized()
export class ClientsController {
    responseService: RestfulHandlerInterface<ClientEntity, CreateClientForm, PatchClientForm>;

    constructor() {
        this.responseService = new ClientsHandler();
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
    create(@CurrentUser() user: UserEntity, @Body({ required: true }) payload: CreateClientForm) {
        return this.responseService.handleCreate(user, payload);
    }

    @Patch('/:id')
    update(@CurrentUser() user: UserEntity, @Param('id') id: number, @Body() payload: PatchClientForm) {
        return this.responseService.handleUpdate(user, id, payload);
    }

    @Delete('/:id')
    delete(@CurrentUser() user: UserEntity, @Param('id') id: number) {
        return this.responseService.handleDelete(user, id);
    }

    @Post('/:id/clock')
    async clockIn(@CurrentUser() user: UserEntity, @Param('id') id: number, @Body() payload: TimeLog) {
        payload.user_id = user.id;
        payload.client_id = id;
        payload.time = payload.time || new Date();
        const { user_id, client_id, time } = await Validation.validate(payload);

        const dateLog = await DateLogEntity.findOrCreateByDate({
            date: time,
            user_id,
            client_id,
        });
        let timeLogId: number | null = null;
        const timeLogs = dateLog.time_logs || [];
        const alreadyClockedIn = timeLogs.reverse().find(timeLog => timeLog.clock_out === null);
        if (alreadyClockedIn) {
            alreadyClockedIn.clock_out = time;
            await alreadyClockedIn.save();
            timeLogId = alreadyClockedIn.id;
        } else {
            const timeLog = TimeLogEntity.create({
                user_id,
                date_log_id: dateLog.id,
                clock_in: time,
                clock_out: null,
            });
            await timeLog.save();
            timeLogId = timeLog.id;
        }

        return await TimeLogEntity.findOneBy({ id: timeLogId });
    }
}
