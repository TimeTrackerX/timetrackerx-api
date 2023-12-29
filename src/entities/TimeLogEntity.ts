import { UserOwnedEntity } from '@app/database/core/UserOwnedEntity';
import { ClientEntity } from '@app/entities/ClientEntity';
import { DateLogEntity } from '@app/entities/DateLogEntity';
import { UserEntity } from '@app/entities/UserEntity';
import { Column, Entity, JoinColumn, ManyToOne, Relation } from 'typeorm';

@Entity('time_logs')
export class TimeLogEntity extends UserOwnedEntity {
    @Column({ nullable: false, type: 'time' })
    clock_in!: Date;

    @Column({ nullable: true, type: 'time', default: null })
    clock_out!: Date | null;

    @ManyToOne(() => UserEntity, {
        nullable: false,
        eager: false,
        createForeignKeyConstraints: false,
    })
    @JoinColumn({ name: 'user_id' })
    user!: Relation<UserEntity>;

    @ManyToOne(() => DateLogEntity, log => log.time_logs, {
        nullable: false,
        eager: false,
        createForeignKeyConstraints: false,
    })
    @JoinColumn({ name: 'date_log_id' })
    date_log!: Relation<ClientEntity>;

    @Column({ type: 'int', unsigned: true, nullable: false })
    date_log_id!: number;
}
