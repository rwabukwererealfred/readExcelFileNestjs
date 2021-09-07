import { Injectable, NotFoundException, HttpException, HttpStatus } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { UserEntity } from './user.entity';
import { Repository } from 'typeorm';
import { UserDTO } from './user.dto';

@Injectable()
export class UserService {

    private list: any = [];
    private check:boolean = false;

    constructor(@InjectRepository(UserEntity) private userRepo: Repository<UserEntity>) { }

    uploadFile(file) {
        this.check = false;
        this.list = [];
        const XLSX = require('xlsx');
        const workbook = XLSX.readFile(file);

        const sheet_name_list = workbook.SheetNames;
        const xlDatas = XLSX.utils.sheet_to_json(workbook.Sheets[sheet_name_list[0]]);
        let us : UserDTO = new UserDTO(); 
        const res = xlDatas.map(function (re) {
            us = new UserDTO();
            us.NID = re.NID;
            us.names = re.NAMES;
            us.gender = re.GENDER;
            us.email = re.EMAIL;
            us.phoneNumber =re.PHONE_NUMBER;
            
            return us;
        });
        
        for(let y of res){
            let er = '';
            if (this.nationalIdValidations(y.NID)) {
                er = 'NID is not valid,';
                y.error = er;
                this.check = true;
               
            }
            if(this.phoneNumberValidation(y.phoneNumber)){
                er =er+" Phone number is incorrect,";
                y.error = er;
                this.check = true;
            }
            if(!this.validateEmail(y.email)){
                er = er+" email is not valid";
                y.error = er;
                this.check = true;
            }
           
            
        }
        
        this.list.push(res);
        //console.log(this.list);
        return this.list;
    }
    getUserOnList(){
        return this.list;
    }

     async saveInDB(){
        if(!this.check){
            for(let us of this.list){
            const user = await this.userRepo.create(us);
            await this.userRepo.save(user);
            }
            return {
                message:"well successfull saved",
                status: HttpStatus.OK
            }
        }else{
            throw new HttpException('ERROR FOUND ON THE LIST', HttpStatus.BAD_REQUEST);
        }
    }

    
    
    
    private nationalIdValidations(nid:string):boolean{
       
        if(String(nid).startsWith('1')){
            if(String(nid).trim().replace(' ','').length=== 16){
                const check:any = String(nid).trim().replace(' ','').substring(1,5);
                const today:any = new Date().getFullYear();
                const year:any = today - check;
                if(year>=16){
                    return false;
                }
            }
        }
        return true;
    }

    private phoneNumberValidation(phoneNumber:string):boolean{
      
        if(String(phoneNumber).trim().replace(' ','').length ===12){
           
            if(String(phoneNumber).startsWith('25078')|| String(phoneNumber).startsWith('25073') || String(phoneNumber).startsWith('25072')||
            String(phoneNumber).startsWith('25075')){
                 return false;
             }
        }

        return true;
    }

    private validateEmail(email) {
        const re = /^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
        return re.test(email);
    }
}
