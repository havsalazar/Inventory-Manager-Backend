import { ObjectType, Field, Int } from '@nestjs/graphql';
import { Column, Entity, PrimaryGeneratedColumn ,ManyToOne} from 'typeorm';
import { User } from 'src/users/entities/user.entity';
import { ApiPropertyOptional } from '@nestjs/swagger';

@Entity()
@ObjectType()
export class Client {
    @PrimaryGeneratedColumn('uuid')
    @Field(() => String, { description: 'id of the Client' })
    id: string

    @Column({ nullable: false })
    @Field(() => String, { description: '', nullable: false })
    fullName:string;

    @ApiPropertyOptional()
    @Column({ nullable: true })
    @Field(() => String, { description: '', nullable: true })
    plate:string;

    @Column({ nullable: true })
    @Field(() => Int, { description: '', nullable: true })
    identification_type:number
    
    @Column({ nullable: true })
    @Field(() => Int, { description: '', nullable: true })
    identification_number:string
    
    @Column({ nullable: true })
    @Field(() => Int, { description: '', nullable: true })
    email:string
    
    @Column({ nullable: true })
    @Field(() => Int, { description: '', nullable: true })
    phone:string

    @Column({ type: "datetime", default: () => "CURRENT_TIMESTAMP"})
    createdAt:Date

    @ManyToOne(()=>User,(user)=>user.id)
    @Field(() => String, { description: 'User who creates the client', nullable: true })
    user:User


}
