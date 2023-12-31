import { MoneyColumn } from '@app/database/core/MoneyColumn';
import { UserOwnedEntity } from '@app/database/core/UserOwnedEntity';
import { ClientEntity } from '@app/entities/ClientEntity';
import { TaskEntity } from '@app/entities/TaskEntity';
import { TimeLogEntity } from '@app/entities/TimeLogEntity';
import { UserEntity } from '@app/entities/UserEntity';
import { Column, Entity, Index, JoinColumn, ManyToOne, OneToMany, Raw, Relation, Unique } from 'typeorm';

@Entity('date_logs')
@Unique('user-client-date', ['user_id', 'client_id', 'date_logged'])
export class DateLogEntity extends UserOwnedEntity {
    @Column({ nullable: false, type: 'date' })
    date_logged!: Date | string;

    @Column({ nullable: false, type: 'decimal', precision: 5, scale: 2, default: 0, unsigned: true })
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

    @ManyToOne(() => ClientEntity, client => client.logs, {
        nullable: false,
        eager: false,
        createForeignKeyConstraints: false,
    })
    @JoinColumn({ name: 'client_id' })
    client!: Relation<ClientEntity>;

    @Column({ type: 'int', unsigned: true, nullable: false })
    @Index('client_id')
    client_id!: number;

    @OneToMany(() => TimeLogEntity, time_log => time_log.date_log, {
        eager: false,
    })
    time_logs!: Relation<TimeLogEntity[]>;

    @OneToMany(() => TaskEntity, task => task.date_log)
    tasks!: Relation<TaskEntity[]>;

    static async findOrCreateByDate({
        client_id,
        user_id,
        date,
    }: {
        client_id: number;
        user_id: number;
        date: Date;
    }): Promise<DateLogEntity> {
        const dateOnly = date.toISOString().split('T')[0];

        const lookUp = {
            client_id,
            user_id,
            date_logged: Raw(alias => `${alias} = :date`, { date: dateOnly }),
        };
        const partial = {
            client_id,
            user_id,
            date_logged: dateOnly,
        };
        return await this.findOrCreate<DateLogEntity>(lookUp, partial, {
            relations: ['time_logs'],
        });
    }

    static async updateTotals(id: number) {
        const dateLog = await this.findOneOrFail({
            where: { id },
            relations: ['client', 'time_logs'],
        });
        let totalMinutes = 0;
        dateLog.time_logs.forEach(({ timeDiffMinutes }) => {
            if (timeDiffMinutes) {
                totalMinutes = totalMinutes + timeDiffMinutes;
            }
        });
        dateLog.total_hours = totalMinutes / 60;
        dateLog.total_billable = Number(dateLog.client.hourly_rate) * dateLog.total_hours;
        await dateLog.save();
    }
}
