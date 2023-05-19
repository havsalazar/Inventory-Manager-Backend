import { ObjectType, Field, Int } from '@nestjs/graphql';
import { Product } from 'src/product/entities/product.entity';
import { Supplier } from 'src/supplier/entities/supplier.entity';
import { Column, Entity, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';

@Entity()
@ObjectType()
export class Supplying {
    @PrimaryGeneratedColumn('uuid')
    @Field(() => String, { description: 'id of the user' })
    id: string;
    
    @ManyToOne(() => Supplier, (supplier) => supplier.id)
    @Field(() => String, { description: 'Supplier id', nullable: true })
    supplier:Supplier

    @ManyToOne(() => Product, (product) => product.id)
    @Field(() => String, { description: 'Product id', nullable: true })
    product:Product

    @Column({nullable:false,default:0})
    @Field(() => Int, { description: '', nullable: false })
    quantity:number
    
    @Column({nullable:true, type: "datetime", default: () => "CURRENT_TIMESTAMP"})
    orderedAt:Date
    
    @Column({nullable:true, type: "datetime", default: () => "CURRENT_TIMESTAMP"})
    arrivedAt:Date

    @Column({nullable:true})
    @Field(() => String, { description: '', nullable: false })
    arrived:boolean
    
}
