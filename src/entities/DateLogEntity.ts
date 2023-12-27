import { AppEntity } from '@app/database/core/AppEntity';
import { MoneyColumn } from '@app/database/core/MoneyColumn';
import { ClientEntity } from '@app/entities/ClientEntity';
import { TaskEntity } from '@app/entities/TaskEntity';
import { TimeLogEntity } from '@app/entities/TimeLogEntity';
import { UserEntity } from '@app/entities/UserEntity';
import { Column, Entity, JoinColumn, ManyToOne, OneToMany, Relation } from 'typeorm';

@Entity('date_logs')
export class DateLogEntity extends AppEntity {
    @Column({ nullable: false, type: 'date' })
    date_logged!: Date;

    @Column({ nullable: false, type: 'tinyint', default: 0, unsigned: true })
    total_hours!: number;

    @MoneyColumn()
    total_billable!: number;

    @ManyToOne(() => UserEntity, {
        nullable: false,
        eager: false,
        createForeignKeyConstraints: false,
    })
    @JoinColumn({ name: 'user_id' })
    user!: Relation<UserEntity>;

    @Column({ type: 'int', unsigned: true, nullable: false })
    user_id!: number;

    @ManyToOne(() => ClientEntity, client => client.logs, {
        nullable: false,
        eager: false,
        createForeignKeyConstraints: false,
    })
    @JoinColumn({ name: 'client_id' })
    client!: Relation<ClientEntity>;

    @Column({ type: 'int', unsigned: true, nullable: false })
    client_id!: number;

    @OneToMany(() => TimeLogEntity, time_log => time_log.date_log)
    time_logs!: Relation<TimeLogEntity[]>;

    @OneToMany(() => TaskEntity, task => task.date_log)
    tasks!: Relation<TaskEntity[]>;
}
