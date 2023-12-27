import { AppEntity } from '@app/database/core/AppEntity';
import { MoneyColumn } from '@app/database/core/MoneyColumn';
import { DateLogEntity } from '@app/entities/DateLogEntity';
import { UserEntity } from '@app/entities/UserEntity';
import { Column, Entity, JoinColumn, ManyToOne, OneToMany, Relation } from 'typeorm';

@Entity('clients')
export class ClientEntity extends AppEntity {
    @Column({ nullable: false, type: 'varchar' })
    name!: string;

    @Column({ nullable: false, type: 'text', default: '' })
    description!: string;

    @Column({ nullable: true, type: 'tinytext', default: null })
    logo_url!: string;

    @MoneyColumn()
    hourly_rate!: number;

    @Column({ nullable: true, type: 'tinyint', default: null, unsigned: true })
    monthly_cap!: string;

    @ManyToOne(() => UserEntity, user => user.clients, {
        nullable: false,
        eager: false,
        createForeignKeyConstraints: false,
    })
    @JoinColumn({ name: 'user_id' })
    user!: Relation<UserEntity>;

    @Column({ type: 'int', unsigned: true, nullable: false })
    user_id!: number;

    @OneToMany(() => DateLogEntity, log => log.client)
    logs!: Relation<DateLogEntity[]>;
}
