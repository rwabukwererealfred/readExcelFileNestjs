import { Entity, Column, PrimaryGeneratedColumn, BeforeInsert, CreateDateColumn, Long } from 'typeorm';
import * as bcrypt from 'bcryptjs';
import * as jwt from 'jsonwebtoken';

@Entity()
export class UserEntity{

    @PrimaryGeneratedColumn("uuid")
    id:string;
    @Column({unique:true})
    NID:string;
    @Column()
    names:string;
    @Column({length:6})
    gender:string;
    @Column({unique:true})
    email:string;
    @Column()
    phoneNumber:string;

   
}