import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { CrudModule } from './crud/crud.module';
import { AuthenticationModule } from './authentication/authentication.module';
import { MongooseModule } from '@nestjs/mongoose';

@Module({
  imports: [CrudModule, AuthenticationModule, MongooseModule.forRoot('mongodb+srv://uzafir:a1ab2bc3cd4d@cluster0.lpk7pcx.mongodb.net/')],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
