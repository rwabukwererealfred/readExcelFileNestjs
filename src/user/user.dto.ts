import {
    IsNotEmpty, IsEmail, Matches,
  } from 'class-validator';

export class UserDTO{

    @IsNotEmpty({message:'National ID can not be empty'})
    @Matches(/^[1-3](19|20)\\d{2}[7-8]\\d{7}[0-9]\\d{2}$/,{message:'Wrong National ID'})
    NID:string;
    @IsNotEmpty({message:'name can not be empty'})
    names:string;
    @IsNotEmpty({message:'gender can not be empty'})
    gender:string;
    @IsNotEmpty({message:'email can not be empty'})
    email:string;
    @IsNotEmpty({message:'phone number must not be empty'})
    phoneNumber:string;
    error:string;
    
}