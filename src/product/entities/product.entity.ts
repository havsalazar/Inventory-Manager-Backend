import { ObjectType, Field, Int } from '@nestjs/graphql';
import { Stock } from 'src/stock/entities/stock.entity';
import { User } from 'src/users/entities/user.entity';
import { Column, Entity, ManyToOne, OneToMany, PrimaryGeneratedColumn } from 'typeorm';
import { ProductSupplier } from './product-supplier.entity';

@Entity()
@ObjectType()
export class Product {
    @PrimaryGeneratedColumn('uuid')
    @Field(() => String, { description: 'id of the user' })
    id: string

    @Column({ nullable: true })
    @Field(() => String, { description: '', nullable: true })
    code: string

    @Column({ nullable: false, length: 5000 })
    @Field(() => String, { description: '', nullable: false })
    name: string

    @Column({ nullable: true })
    @Field(() => String, { description: '', nullable: true })
    reference: string

    @Column({ nullable: false, default: 0 })
    @Field(() => String, { description: '', nullable: true })
    price: number

    @Column({ nullable: true })
    @Field(() => String, { description: 'IVA Applies', nullable: true })
    vat: boolean

    @Column({ nullable: true,default:true})
    @Field(() => Boolean, { description: 'IVA Applies', nullable: true })
    stockeable: boolean

    @Column({ nullable: true ,default: false })
    @Field(() => Boolean, { description: 'IVA Applies', nullable: true })
    isService: boolean
    
    @Column({ type: "datetime", default: () => "CURRENT_TIMESTAMP"})
    createdAt:Date

    @Column({type:String,length:5000})
    picture:string

    @ManyToOne(() => User, (user) => user.id)
    @Field(() => String, { description: 'User id', nullable: true })
    user: User

    @OneToMany(()=>Stock,(stock)=>stock.product)
    stocks:Stock[]
    
    @OneToMany(()=>ProductSupplier,(productSupplier)=>productSupplier.product)
    productSuppliers:ProductSupplier[]
}