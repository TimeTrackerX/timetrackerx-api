import { DateLogEntity } from '@app/entities/DateLogEntity';
import { UserEntity } from '@app/entities/UserEntity';
import { Request } from 'express';
import { Authorized, CurrentUser, Get, JsonController, Param, Params, Req } from 'routing-controllers';

@JsonController('/api/date-logs')
@Authorized()
export class DateLogsController {
    @Get('/:client_id')
    async logsByClient(@CurrentUser() user: UserEntity, @Param('client_id') client_id: number, @Req() req: Request) {
        return await DateLogEntity.findPaginatedFromRequest(req, {
            where: {
                client_id,
                user_id: user.id,
            },
        });
    }

    @Get('/:client_id/:date_logged')
    async read(@CurrentUser() user: UserEntity, @Params() params: { client_id: number; date_logged: string }) {
        const { client_id, date_logged } = params;
        return await DateLogEntity.findOne({
            where: { client_id, date_logged, user_id: user.id },
            relations: ['client', 'time_logs', 'tasks'],
        });
    }
}
