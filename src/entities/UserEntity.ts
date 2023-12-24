import { AppEntity } from '@app/database/core/AppEntity';
import JwtService from '@app/services/JwtService';
import { DbLogger } from '@app/utils/loggers';
import { Column, Entity } from 'typeorm';

@Entity('users')
export class UserEntity extends AppEntity {
    @Column({ nullable: false, type: 'varchar', unique: true })
    username!: string;

    @Column({ nullable: true, type: 'tinytext' })
    avatar_url_prefix!: string;

    @Column({ type: 'varchar', unique: true, nullable: true })
    email!: string | null;

    @Column({ type: 'boolean', nullable: false, default: false })
    verified!: boolean;

    static async fromJwtToken(token: string): Promise<UserEntity | boolean> {
        try {
            const user = await JwtService.toUser(token);
            if (!user) {
                return false;
            }
            return user;
        } catch (e) {
            DbLogger.error(`Token Error: ${(e as Error).message}`);
            return false;
        }
    }
}
