import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { ConfigModule } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { SiswaModule } from './siswa/siswa.module';
import { AuthModule } from './app/auth/auth.module';


@Module({
  imports: [ConfigModule.forRoot({
    isGlobal : true
  }), 
  TypeOrmModule.forRootAsync({
    useFactory: async () => {
      const { typeOrm } = await import('./config/typeorm.config');
      return typeOrm;
    },
  }), SiswaModule, AuthModule, 
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
