import { CreateDateColumn, UpdateDateColumn } from 'typeorm';

export class TimeStampableEntity {
  @CreateDateColumn({
    type: 'datetime',
    default: () => 'CURRENT_TIMESTAMP(6)',
  })
  public createdAt: Date;

  @UpdateDateColumn({
    type: 'datetime',
    default: () => 'CURRENT_TIMESTAMP(6)',
  })
  public updatedAt: Date;
}
