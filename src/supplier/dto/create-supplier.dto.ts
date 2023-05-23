import { User } from "src/users/entities/user.entity";

export class CreateSupplierDto { 
    code: string; 
    name: string;  
    phone: string; 
    address: string; 
    user: User 
}
