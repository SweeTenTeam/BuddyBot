import { Column, CreateDateColumn, Entity, PrimaryGeneratedColumn } from "typeorm";


@Entity()
export class ChatEntity {
    @PrimaryGeneratedColumn('uuid') //primaryKey
    id: string;

    @Column()
    question: string;

    @CreateDateColumn({ type: 'timestamptz' })
    questionDate: Date;

    @Column()
    answer: string;

    @CreateDateColumn({ type: 'timestamptz', default: () => 'CURRENT_TIMESTAMP' })
    answerDate: Date = new Date();
}