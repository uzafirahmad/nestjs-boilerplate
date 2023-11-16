import { Module } from '@nestjs/common';
import { CrudService } from './crud.service';
import { CrudController } from './crud.controller';
import { MongooseModule } from '@nestjs/mongoose';
import { CrudSchema } from './model/crud.schema';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: 'Crud', schema: CrudSchema }])
  ],
  controllers: [CrudController],
  providers: [CrudService],
})
export class CrudModule {}
