import {Entity, PrimaryGeneratedColumn, Column} from "typeorm";
import Link from "../vocabulary/Link";

@Entity()
export class MessageLogEntry {

  @PrimaryGeneratedColumn()
  id: number;

  @Column("text")
  messageString: string;

  @Column("simple-json")
  messageLinks: Link[];

  @Column("text")
  triggerMessage: string;

  @Column('timestamp', {
    default: () => 'CURRENT_TIMESTAMP',
  })
  timeStamp: Date;
}
