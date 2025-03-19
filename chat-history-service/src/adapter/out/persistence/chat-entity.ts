import { Column, CreateDateColumn, Entity, PrimaryGeneratedColumn } from "typeorm";


@Entity()
export class ChatEntity {
    @PrimaryGeneratedColumn('uuid') //primaryKey
    id: string;

    @Column()
    question: string;

    @Column()
    answer: string;

    @CreateDateColumn({ type: 'timestamptz' })
    date: Date = new Date();
}