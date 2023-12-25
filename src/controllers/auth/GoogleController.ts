import 'reflect-metadata';
import appConfig from '@app/config';
import AuthController from '@app/controllers/AuthController';
import { buildAuthorizeUrl } from '@app/services/google/googleOAuth2Client';
import { Request, Response } from 'express';
import { Get, JsonController, Redirect, Req, Res } from 'routing-controllers';

@JsonController('/auth/google')
export class GoogleController extends AuthController {
    @Get('/')
    @Redirect(':url')
    index(@Res() res: Response) {
        const url = buildAuthorizeUrl();
        res.redirect(url);
        return res;
    }

    @Get('/callback')
    async callback(@Req() req: Request) {
        const strategy = appConfig.auth.strategies.google;
        return this.userFromRequest(strategy, req);
    }
}
