import { AppEntity } from '@app/database/core/AppEntity';
import { ClientEntity } from '@app/entities/ClientEntity';
import { DateLogEntity } from '@app/entities/DateLogEntity';
import { UserEntity } from '@app/entities/UserEntity';
import { Column, Entity, JoinColumn, ManyToOne, Relation } from 'typeorm';

@Entity('tasks')
export class TaskEntity extends AppEntity {
    @Column({ nullable: false, type: 'text', default: '' })
    description!: string;

    @ManyToOne(() => UserEntity, {
        nullable: false,
        eager: false,
        createForeignKeyConstraints: false,
    })
    @JoinColumn({ name: 'user_id' })
    user!: Relation<UserEntity>;

    @Column({ type: 'int', unsigned: true, nullable: false })
    user_id!: number;

    @ManyToOne(() => DateLogEntity, log => log.tasks, {
        nullable: false,
        eager: false,
        createForeignKeyConstraints: false,
    })
    @JoinColumn({ name: 'client_id' })
    date_log!: Relation<ClientEntity>;

    @Column({ type: 'int', unsigned: true, nullable: false })
    date_log_id!: number;
}
