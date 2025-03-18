import { Column, CreateDateColumn, Entity, PrimaryGeneratedColumn } from "typeorm";


@Entity()
export class ChatEntity{
    @PrimaryGeneratedColumn('uuid') //primaryKey
    id: string;

    @Column()
    question: string;

    @Column()
    answer: string;

    @CreateDateColumn({ type: 'timestamptz' }) //timestamptz perche fa anche le conversione in caso di fuso orario
    date: Date = new Date();
}