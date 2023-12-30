import { MoneyColumn } from '@app/database/core/MoneyColumn';
import { UserOwnedEntity } from '@app/database/core/UserOwnedEntity';
import { DateLogEntity } from '@app/entities/DateLogEntity';
import { UserEntity } from '@app/entities/UserEntity';
import { Column, Entity, JoinColumn, ManyToOne, OneToMany, Relation } from 'typeorm';

@Entity('clients')
export class ClientEntity extends UserOwnedEntity {
    @Column({ nullable: false, type: 'varchar' })
    name!: string;

    @Column({ nullable: true, type: 'text', default: null })
    description!: string | null;

    @Column({ nullable: true, type: 'tinytext', default: null })
    logo_url!: string | null;

    @MoneyColumn({ default: null, nullable: true })
    hourly_rate!: number | null;

    @Column({ nullable: true, type: 'tinyint', default: null, unsigned: true })
    monthly_cap!: string | null;

    @ManyToOne(() => UserEntity, user => user.clients, {
        nullable: false,
        eager: false,
        createForeignKeyConstraints: false,
    })
    @JoinColumn({ name: 'user_id' })
    user!: Relation<UserEntity>;

    @OneToMany(() => DateLogEntity, log => log.client)
    logs!: Relation<DateLogEntity[]>;
}
