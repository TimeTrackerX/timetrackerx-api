import { AppEntity } from '@app/database/core/AppEntity';
import { UserEntity } from '@app/entities/UserEntity';
import { Exclude } from 'class-transformer';
import { Column, Entity, Index, JoinColumn, ManyToOne, Relation } from 'typeorm';

export interface SocialProfileLookUp {
    provider: string;
    provider_uid: string;
    name: string;
    email: string;
    email_verified: boolean;
    profile_img_url?: string;
    tokens: Record<string, unknown>;
}

@Entity('social_profiles')
@Index('provider-uid', ['provider', 'provider_uid'], { unique: true })
@Index('provider-email', ['provider', 'email'], { unique: true })
export class SocialProfileEntity extends AppEntity {
    @Column({ nullable: false, type: 'varchar' })
    @Index('provider', { unique: false })
    provider!: string;

    @Column({ nullable: false, type: 'varchar' })
    provider_uid!: string;

    @Column({ nullable: true, type: 'tinytext' })
    profile_img_url!: string;

    @Column({ type: 'varchar', nullable: false })
    @Index('email', { unique: false })
    email!: string;

    @Column({ type: 'boolean', nullable: false })
    email_verified!: boolean;

    @Exclude()
    @Column('simple-json', {
        nullable: false,
    })
    tokens!: Record<string, unknown>;

    @ManyToOne(() => UserEntity, user => user.social_profiles, {
        nullable: false,
        eager: true,
        createForeignKeyConstraints: false,
    })
    @JoinColumn({ name: 'user_id' })
    user!: Relation<UserEntity>;

    @Column({ type: 'int', unsigned: false, nullable: false })
    user_id!: number;

    static async getUserFromPartial(lookup: SocialProfileLookUp): Promise<UserEntity> {
        let socialProfile = this.create(lookup);
        const found = await this.findOneBy({
            provider: lookup.provider,
            provider_uid: lookup.provider_uid,
        });

        if (found) {
            socialProfile = this.merge(socialProfile, found, lookup);
        } else if (!found && lookup.email_verified) {
            const user =
                (await UserEntity.findOneBy({
                    email: lookup.email,
                })) ||
                UserEntity.create({
                    email: lookup.email,
                    name: lookup.name,
                    profile_img_url: lookup.profile_img_url,
                });

            await user.save();
            socialProfile.user = user;
        } else {
            throw new Error(`Unable to find user for unverified ${lookup.provider} email`);
        }

        await socialProfile.save();
        return socialProfile.user;
    }
}
