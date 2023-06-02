import { Stock } from './../../stock/entities/stock.entity';
import { User } from "src/users/entities/user.entity"

export class CreateProductDto {
    code:string
    name:string
    reference:string
    price:number
    vatValue:number
    vat:boolean
    stockeable:boolean
    isService:boolean
    picture?:string
    user:User
    stock?:Stock
}
