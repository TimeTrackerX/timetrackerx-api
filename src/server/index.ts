import { authorizationChecker, currentUserChecker } from '@app/auth/authCheck';
import appConfig from '@app/config';
import compression from 'compression';
import http from 'http';
import logger from 'morgan';
import path from 'path';
import { createExpressServer } from 'routing-controllers';

const controllersPath = path.join(__dirname, '..', 'controllers', '*Controller.{js,ts}');

const app = createExpressServer({
    controllers: [controllersPath],
    currentUserChecker,
    cors: true,
    authorizationChecker,
    validation: false,
    classTransformer: true,
    plainToClassTransformOptions: {
        excludeExtraneousValues: true,
    },
});

app.use(compression());
app.use(logger('combined'));

export const serverStart = () => {
    return new Promise((resolve, reject) => {
        const server = http.createServer(app);
        server.listen(appConfig.server.port, () => {
            resolve(`Server is listening on ${appConfig.server.baseUrl}`);
        });

        server.on('error', error => {
            reject(new Error(`Failed to start server: ${error}`));
        });
    });
};
