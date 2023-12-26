import 'reflect-metadata';
import appConfig from '@app/config';
import AuthController from '@app/controllers/AuthController';
import { Request, Response } from 'express';
import { OAuth2Client } from 'google-auth-library';
import { Get, JsonController, Redirect, Req, Res } from 'routing-controllers';

@JsonController('/auth/google')
export class GoogleController extends AuthController {
    @Get('/')
    @Redirect(':url')
    index(@Res() res: Response) {
        const oauthClient = new OAuth2Client(appConfig.auth.configs.google);
        const url = oauthClient.generateAuthUrl({
            access_type: 'offline',
            scope: appConfig.auth.configs.google.scopes,
        });
        res.redirect(url);
        return res;
    }

    @Get('/callback')
    async callback(@Req() req: Request) {
        const strategy = appConfig.auth.strategies.google;
        return this.userFromRequest(strategy, req);
    }
}
