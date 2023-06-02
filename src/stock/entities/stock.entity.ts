import { ObjectType, Field, Int } from '@nestjs/graphql';
import { Product } from 'src/product/entities/product.entity';
import { Column, Entity, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';

@Entity()
@ObjectType()
export class Stock {
    @PrimaryGeneratedColumn('uuid')
    @Field(() => String, { description: 'id of the user' })
    id: string;

    @ManyToOne(() => Product, (product) => product.id,{nullable:false})
    @Field(() => String, { description: 'Product id', nullable: false })
    product: Product 

    @Column({nullable: true,default:0})
    @Field(() => Int, { description: '' })
    quantity :Number

    @Column({nullable: true,default:''})
    @Field(() => String, { description: '' })
    label :string
    
}