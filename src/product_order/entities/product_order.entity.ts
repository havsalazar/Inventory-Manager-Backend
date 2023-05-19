import { ObjectType, Field, Int } from '@nestjs/graphql';
import { Order } from 'src/order/entities/order.entity';
import { Product } from 'src/product/entities/product.entity';
import { Column, Entity, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';

@Entity()
@ObjectType()
export class ProductOrder {
    @PrimaryGeneratedColumn('uuid')
    @Field(() => String, { description: 'id of the user' })
    id: string;
    @ManyToOne(() => Product, (product) => product.id)
    @Field(() => String, { description: 'Product id', nullable: true })
    product:Product

    @ManyToOne(() => Order, (order) => order.id)
    @Field(() => String, { description: 'Order id', nullable: true })
    order:Order

    @Column({nullable:false,default:0})
    @Field(() => Int, { description: '', nullable: false })
    quantity:number

    @Column({nullable:false,default:0})
    @Field(() => Int, { description: '', nullable: false })
    price:number

    @Column({nullable:true,default:0})
    @Field(() => Int, { description: '', nullable: false })
    vat:number 

}
