import { User } from "src/users/entities/user.entity";
import { ApiProperty } from '@nestjs/swagger';

export class CreateClientDto { 
    // id: string 
    @ApiProperty()
    fullName:string;
    @ApiProperty() 
    plate:string;
    @ApiProperty() 
    identification_type:number
    @ApiProperty()  
    identification_number:string
    @ApiProperty() 
    email:string
    @ApiProperty() 
    phone:string  
    @ApiProperty() 
    user:User
}
