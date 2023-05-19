import { ObjectType, Field, } from '@nestjs/graphql';
import { Client } from 'src/client/entities/client.entity';
import { Column, Entity, PrimaryGeneratedColumn ,ManyToOne} from 'typeorm';


@Entity()
@ObjectType()
export class Order {
    @PrimaryGeneratedColumn('uuid')
    @Field(() => String, { description: 'id of the user' })
    id: string;

    @ManyToOne(()=>Client,(client)=>client.id)
    @Field(() => String, { description: 'Id of the client who creates this order' })
    client:Client

    @Column({ type: "datetime", default: () => "CURRENT_TIMESTAMP"})
    orderedAt:Date
    
}
