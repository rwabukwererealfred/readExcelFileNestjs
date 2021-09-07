import { Controller, Post, UseInterceptors, UploadedFile, UsePipes, Get, Body, UseGuards } from '@nestjs/common';
import { UserService } from './user.service';
import { diskStorage } from 'multer';
import { FileInterceptor } from "@nestjs/platform-express";
import { ValidationPipe } from 'src/configuration/validation.pipe';
import * as jwt from 'jsonwebtoken';
import { AuthGuard } from 'src/configuration/auth.gaurd';

@Controller('user/')
export class UserController {

  constructor(private readonly userService: UserService) { }

  @Post('readFile')
  @UseGuards(new AuthGuard())
  @UseInterceptors(FileInterceptor('file',
    {
      storage: diskStorage({

        filename: (req, file, cb) => {
          const randomName = Array(32).fill(null).map(() => (Math.round(Math.random() * 16)).toString(16)).join('');
          const key = randomName.substring(0, 8);
          return cb(null, key + "_" + file.originalname)
        }
      })
    }
  )
  )
  @UsePipes(new ValidationPipe())
  async uploadFile(@UploadedFile() file) {
    console.log(file.path);
    const today = new Date().getFullYear();
    console.log(today);
    const res = this.userService.uploadFile(file.path);
    return {
      message: 'well uploaded',
      res

    };
  }

  @Get('uploadedList')
  @UseGuards(new AuthGuard())
  retrieveUserList() {
    const res = this.userService.getUserOnList();
    return res;
  }

  @Post('register')
  @UsePipes(new ValidationPipe())
  @UseGuards(new AuthGuard())
  commitIntoDB() {
    return this.userService.saveInDB();
  }


  @Post('token')
  createToken(@Body() username: string) {

    return "Bearer " + jwt.sign({ username }, 'ThisIsASecretKey', { expiresIn: '7d' })
  }



}
