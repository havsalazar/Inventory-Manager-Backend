import { ObjectType, Field, Int } from '@nestjs/graphql';
import { Supplier } from 'src/supplier/entities/supplier.entity';
import { Column, Entity, PrimaryGeneratedColumn,OneToMany } from 'typeorm';

@Entity()
@ObjectType()
export class User {
    @PrimaryGeneratedColumn('uuid')
    @Field(() => String, { description: 'id of the user' })
    id: string;
 
    @Column({ nullable: true })
    @Field(() => String, { description: 'fullName of the user', nullable: true })
    fullName: string; 

    @Column({ nullable: true })
    @Field(() => String, { description: 'email of the user', nullable: true })
    email: string;

    @Column({ nullable: true })
    @Field(() => String, { description: 'role of the user', nullable: true })
    role: string;

    @Column({ nullable: false })
    @Field(() => String, { description: 'shapassword', nullable: false })
    password: string;

    @Column({ nullable: true })
    @Field(() => String, { description: 'refreshed token', nullable: true })
    refreshToken: string;
    @OneToMany(()=>Supplier,(supplier)=>supplier.user)
    suppliers:Supplier[]
}