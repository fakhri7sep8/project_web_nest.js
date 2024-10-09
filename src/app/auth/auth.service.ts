import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import BaseResponse from 'src/utils/response.utils';
import { User } from './auth.entity';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { LoginDto, RegisterDto } from './auth.dto';
import { ResponseSuccess } from 'src/interface';
import { compare, hash } from 'bcrypt';
import { JwtService } from '@nestjs/jwt';

@Injectable()
export class AuthService extends BaseResponse {
    constructor(@InjectRepository(User) private readonly authReporsitory : Repository<User>,private jwtService: JwtService,)
    {
      super()
    }

  generateJWT(payload: jwtPayload, expiresIn: string | number, token: string) {
      return this.jwtService.sign(payload, {
        secret: token,
        expiresIn: expiresIn,
      });
    } //membuat method untuk generate jwt

    async register(payload : RegisterDto ) : Promise<ResponseSuccess>{
        //cek dahulu email sudah ada apa belum
        const checkUserExits = await this.authReporsitory.findOne({
            where: {
                email : payload.email
            }
        })

        if(checkUserExits){
            throw new HttpException("email sudah digunakan" , HttpStatus.FOUND)
        }
        
        //hash password
        payload.password = await hash(payload.password,12)
        //hash password
        await this.authReporsitory.save(payload)
        return this._success("register berhasil")
    }

    async login(payload: LoginDto): Promise<ResponseSuccess> {
        const checkUserExists = await this.authReporsitory.findOne({
          where: {
            email: payload.email,
          },
          select: {
            id: true,
            nama: true,
            email: true,
            password: true,
            refresh_token: true,
          },
        });
    
        if (!checkUserExists) {
          throw new HttpException(
            'User tidak ditemukan',
            HttpStatus.UNPROCESSABLE_ENTITY,
          );
        }
    
        const checkPassword = await compare(
          payload.password,
          checkUserExists.password,
        ); // compare password yang dikirim dengan password yang ada di tabel
        if (checkPassword) {

          const jwtPayload : jwtPayload = {
            id : checkUserExists.id,
            nama : checkUserExists.nama,
            email : checkUserExists.email
          }

          const access_token = await this.generateJWT(jwtPayload , '1d' , process.env.ACCESS_TOKEN_SECRET);
          return this._success('Login Success', {...checkUserExists , access_token});
        } else {
          throw new HttpException(
            'email dan password tidak sama',
            HttpStatus.UNPROCESSABLE_ENTITY,
          );
        }
      }
}
