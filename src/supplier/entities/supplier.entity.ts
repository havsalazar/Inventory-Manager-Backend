import { ObjectType, Field, Int } from '@nestjs/graphql';
import { User } from 'src/users/entities/user.entity';
import { Column, Entity, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';

@Entity()
@ObjectType()
export class Supplier {
    @PrimaryGeneratedColumn('uuid')
    @Field(() => String, { description: 'id of the user' })
    id: string;

    @Column({ nullable: true })
    @Field(() => String, { description: '', nullable: true })
    code: string;

    @Column({ nullable: false })
    @Field(() => String, { description: '', nullable: false })
    name: string;

    @Column({ nullable: true })
    @Field(() => String, { description: '', nullable: true })
    phone: string;
    
    @Column({ nullable: true })
    @Field(() => String, { description: '', nullable: true })
    address: string;

    @ManyToOne(() => User, (user) => user.id)
    @Field(() => String, { description: 'User id', nullable: true })
    user: User

}
