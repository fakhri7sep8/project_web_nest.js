// src/siswa/siswa.service.ts
import { Injectable, HttpException, HttpStatus } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Siswa } from './siswa.entity';
import { SiswaDto } from './siswa.dto';
import BaseResponse from '../utils/response.utlis_pts'; 
import { ResponseSuccess, ResponsePagination } from '../interface/response.interface_pts';

@Injectable()
export class SiswaService extends BaseResponse {
  constructor(
    @InjectRepository(Siswa)
    private readonly siswaRepository: Repository<Siswa>,
  ) {
    super(); 
  }

  // Method untuk mengambil seluruh data siswa dengan pagination
  async findAll(page: number = 1, pageSize: number = 10): Promise<ResponsePagination> {
    try {
      const totalItems = await this.siswaRepository.count();
      console.log('Total Items:', totalItems);
  
      const items = await this.siswaRepository.find({
        skip: (page - 1) * pageSize,
        take: pageSize,
      });
      console.log('Items:', items);
  
      const paginationResult = this._pagination('OK', items, totalItems, page, pageSize);
      console.log('Pagination Result:', paginationResult); // Log hasil pagination
  
      return paginationResult;
    } catch (err) {
      throw new HttpException('Terjadi kesalahan saat mengambil data siswa', HttpStatus.BAD_REQUEST);
    }
  }
  
  
  
  async create(payload: SiswaDto): Promise<ResponseSuccess> {
    try {
      const existingSiswa = await this.siswaRepository.findOne({ where: { email: payload.email } });
      
      if (existingSiswa) {
        throw new HttpException(
          {
            statusCode: HttpStatus.BAD_REQUEST,
            error: 'Conflict',
            message: 'Email sudah terdaftar',
          },
          HttpStatus.BAD_REQUEST
        );
      }
  
      const newSiswa = this.siswaRepository.create(payload);
      await this.siswaRepository.save(newSiswa);
      return this._success('OK', newSiswa);
    } catch (err) {
      throw new HttpException('Email sudah digunakan', HttpStatus.UNPROCESSABLE_ENTITY);
    }
  }
  
  
  async update(id: number, payload: SiswaDto): Promise<ResponseSuccess> {
    const existingSiswa = await this.siswaRepository.findOne({ where: { id } });
  
    if (!existingSiswa) {
      throw new HttpException(
        {
          statusCode: HttpStatus.NOT_FOUND,
          error: 'Not Found',
          message: 'Siswa tidak ditemukan',
        },
        HttpStatus.NOT_FOUND
      );
    }
  
    if (payload.email && payload.email !== existingSiswa.email) {
      throw new HttpException(
        {
          statusCode: HttpStatus.UNPROCESSABLE_ENTITY,
          error: 'Unprocessable Entity',
          message: 'Email sudah digunakan siswa lain',
        },
        HttpStatus.UNPROCESSABLE_ENTITY
      );
    }
  
    try {
      await this.siswaRepository.update(id, payload);
      const updatedSiswa = await this.siswaRepository.findOne({ where: { id } });
      return this._success('Siswa berhasil diupdate', updatedSiswa);
    } catch (error) {
      throw new HttpException(
        'Terjadi kesalahan saat mengupdate siswa',
        HttpStatus.INTERNAL_SERVER_ERROR
      );
    }
  }
  

  async find(id: number): Promise<ResponseSuccess> {
    const siswa = await this.siswaRepository.findOne({ where: { id } });
    if (!siswa) {
      throw new HttpException({
        statusCode: HttpStatus.NOT_FOUND,
        error: 'Not Found',
        message: 'Siswa tidak ditemukan',
      }, HttpStatus.NOT_FOUND);
    }
    return this._success('OK', siswa);
  }
  
}
