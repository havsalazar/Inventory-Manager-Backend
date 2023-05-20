import { Stock } from './../../stock/entities/stock.entity';
import { User } from "src/users/entities/user.entity"

export class CreateProductDto {
    code:string
    name:string
    reference:string
    price:number
    vat:boolean
    stockeable:boolean
    isService:boolean
    user:User
    stock?:Stock
}
