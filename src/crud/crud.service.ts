import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Crud } from './model/crud.interface';
import { CreateDto } from './dto/create.dto';
import { Request } from 'express';
import { DeleteOneDto } from './dto/deleteone.dto';
import { ReadOneDto } from './dto/readone.dto';
import { UpdateDto } from './dto/update.dto';

@Injectable()
export class CrudService {
  constructor(@InjectModel('Crud') private crudModel: Model<Crud>
    ) { }

    async create(createCrudDto: CreateDto, req: Request): Promise<Crud> {
      const user = req.user;
      const { title, description } = createCrudDto

      const newCrud = new this.crudModel({
        title: title,
        description: description,
        user: user["id"],
      }); 
      return newCrud.save();
    }

  async findAll(req: Request): Promise<Crud[]> {
    const user = req.user
    return this.crudModel.find({ user: user["id"] }).exec();
  }

  async findOne(readOneDto: ReadOneDto, req: Request): Promise<Crud> {
    const user= req.user
    const { id } = readOneDto
    const crudRecord = await this.crudModel.findOne({ _id: id, user: user["id"] }).exec();
    if (!crudRecord) {
      throw new NotFoundException('CRUD record not found');
    }
    return crudRecord;
  }

  async update(updateDto: UpdateDto, req: Request): Promise<Crud> {
    const user= req.user
    const { id, title, description } = updateDto

    const crudRecord = await this.crudModel.findOne({ _id: id, user: user["id"] }).exec();

    if (!crudRecord) {
      throw new NotFoundException('Record not found');
  }
    crudRecord.title=title
    crudRecord.description=description
    await crudRecord.save()

    return crudRecord;
  }

  async removeone(deleteOneDto: DeleteOneDto, req: Request): Promise<{ message: string }> {
    const user= req.user
    const { id } = deleteOneDto
    const result = await this.crudModel.deleteOne({ _id: id, user: user["id"] }).exec();

    if (result.deletedCount === 0) {
        throw new NotFoundException('CRUD record not found or user not authorized to delete');
    }

    return { message: 'Record deleted successfully' };
  }
}
