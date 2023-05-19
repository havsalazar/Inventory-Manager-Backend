import { User } from "src/users/entities/user.entity";

export class CreateClientDto { 
    // id: string 
    fullName:string; 
    plate:string; 
    identification_type:number  
    identification_number:string 
    email:string 
    phone:string   
    userId:User
}
