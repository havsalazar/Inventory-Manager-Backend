import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { Stock } from './../../stock/entities/stock.entity';
import { User } from "src/users/entities/user.entity"

export class CreateProductDto {

    @ApiPropertyOptional()
    code: string
    
    @ApiProperty({maxLength:5000})
    name: string
    
    @ApiPropertyOptional()
    reference: string
    
    @ApiProperty({ default: 0 })
    price: number
    
    @ApiPropertyOptional({ default: 0 })
    vatValue: number
    
    @ApiPropertyOptional({ default: false })
    vat: boolean
    
    @ApiPropertyOptional({ default: true })
    stockeable: boolean
    
    @ApiPropertyOptional({ default: false })
    isService: boolean
    
    @ApiProperty({maxLength:5000})
    picture?: string
    
    @ApiPropertyOptional({ type: 'object', properties: { id: { type: 'string' } } })
    user: User

    @ApiPropertyOptional({ type: 'array', items: { type: 'object', properties: { quantity: { type: 'integer' }, label: { type: 'string' } } } })
    stock?: Stock
}
