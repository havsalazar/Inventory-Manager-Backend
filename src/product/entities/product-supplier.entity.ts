import { Supplier } from './../../supplier/entities/supplier.entity';
import { ObjectType,Field } from '@nestjs/graphql';
import { Entity, ManyToOne, OneToMany, PrimaryGeneratedColumn } from "typeorm";
import { Product } from './product.entity';

@Entity()
@ObjectType()
export class ProductSupplier {
    @PrimaryGeneratedColumn('uuid')
    @Field(() => String, { description: 'id of the user' })
    id: string
    
    @ManyToOne(()=>Product,(product)=>product.id)
    @Field(()=>String,{description:'Product Id'})
    product:Product
    
    @ManyToOne(()=>Supplier,(supplier)=>supplier.id)
    @Field(()=>String,{description:'Supplier Id'})
    supplier:Supplier


}