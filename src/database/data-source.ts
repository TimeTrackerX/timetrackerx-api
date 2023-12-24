import appConfig from '@app/config';
import { DataSource } from 'typeorm';

export const AppDataSource = new DataSource(appConfig.database);
