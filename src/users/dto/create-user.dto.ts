import { InputType, Int, Field } from '@nestjs/graphql';

@InputType()
export class CreateUserDto { 
  @Field(() => String, { description: 'first name of the user',nullable:true })
  fullName: string; 
  @Field(() => String, { description: 'email of the user',nullable:true })
  email: string;
  @Field(() => String, { description: 'role of the user',nullable:true })
  role: string;
  @Field(() => String, { description: 'password of the user',nullable:false })
  password: string;
  @Field(() => String, { description: 'refreshToken of the user',nullable:false })
  refreshToken: string;
}