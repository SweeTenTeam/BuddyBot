import { Column, CreateDateColumn, Entity, PrimaryGeneratedColumn } from "typeorm";


@Entity()
export class ChatEntity {
    @PrimaryGeneratedColumn('uuid') //primaryKey
    id: string;

    @Column()
    question: string;

    @Column({ type: 'timestamptz' })
    questionDate: Date;

    @Column()
    answer: string;

    @CreateDateColumn({ type: 'timestamptz', default: () => 'CURRENT_TIMESTAMP' })
    answerDate: Date = new Date();

    @Column({ nullable: true }) //da togliere nullable, usato solo in fase di sviluppo
    lastFetch: string;
}