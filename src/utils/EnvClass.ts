import 'reflect-metadata';
import 'dotenv/config';
import get from 'lodash/get';

type ProcessEnv = NodeJS.ProcessEnv;
export default class EnvClass {
    data: ProcessEnv;

    constructor(data: ProcessEnv) {
        this.data = data;
    }

    asString(path: string, fallback = ''): string {
        return String(get(this.data, path, fallback));
    }

    asArrayOfStrings(path: string, fallback = ''): string[] {
        const raw = this.asString(path, '');
        return raw.split(',');
    }

    asBoolean(path: string, fallback = false): boolean {
        const raw = get(this.data, path);
        if (raw === undefined || raw === null) return fallback;

        return ['true', '1'].includes(String(raw).toLowerCase());
    }

    asNumber(path: string, fallback = 0): number {
        const result = Number(get(this.data, path));
        return isNaN(result) ? fallback : result;
    }

    isDev() {
        return this.data.NODE_ENV === 'development';
    }
}
