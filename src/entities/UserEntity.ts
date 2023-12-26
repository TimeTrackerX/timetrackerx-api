import { AppEntity } from '@app/database/core/AppEntity';
import { SocialProfileEntity } from '@app/entities/SocialProfileEntity';
import JwtService from '@app/services/JwtService';
import { DbLogger } from '@app/utils/loggers';
import { Column, Entity, OneToMany, Relation } from 'typeorm';

@Entity('users')
export class UserEntity extends AppEntity {
    @Column({ nullable: false, type: 'varchar', unique: false })
    name!: string;

    @Column({ nullable: true, type: 'tinytext' })
    profile_img_url!: string;

    @Column({ type: 'varchar', unique: true, nullable: true })
    email!: string | null;

    @OneToMany(() => SocialProfileEntity, profile => profile.user)
    social_profiles!: Relation<SocialProfileEntity[]>;

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

    toJwtResponse() {
        const token = JwtService.fromUser(this);

        return {
            token,
            user: {
                id: this.id,
                name: this.name,
                profile_img_url: this.profile_img_url,
            },
        };
    }
}
