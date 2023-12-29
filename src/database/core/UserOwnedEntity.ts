import { AppEntity } from '@app/database/core/AppEntity';
import { Column, Index } from 'typeorm';

export abstract class UserOwnedEntity extends AppEntity {
    @Column({ type: 'int', unsigned: true, nullable: false })
    @Index('user_id')
    user_id!: number;
}
