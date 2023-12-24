import 'reflect-metadata';
import { UserEntity } from '@app/entities/UserEntity';
import { Authorized, CurrentUser, Get, JsonController } from 'routing-controllers';

@JsonController()
export class IndexController {
    @Get('/')
    home() {
        return {
            ok: true,
            message: 'still green',
        };
    }

    @Get('/identify')
    @Authorized()
    identify(@CurrentUser() user: UserEntity) {
        return user;
    }
}
