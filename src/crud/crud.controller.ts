import { Controller, Get, Post, Body, Patch, Param, Delete, UseGuards, Req, Put, Query } from '@nestjs/common';
import { CrudService } from './crud.service';
import { Request } from 'express';
import { AuthGuard } from '@nestjs/passport';
import { CreateDto } from './dto/create.dto';
import { DeleteOneDto } from './dto/deleteone.dto';
import { ReadOneDto } from './dto/readone.dto';
import { UpdateDto } from './dto/update.dto';

@Controller('crud')
export class CrudController {
  constructor(private readonly crudService: CrudService) { }

  @UseGuards(AuthGuard('login_required'))
  @Post('create')
  async create(@Body() createCrudDto: CreateDto, @Req() req: Request) {
    return this.crudService.create(createCrudDto, req);
  }

  @UseGuards(AuthGuard('login_required'))
  @Get('findall')
  async findAll(@Req() req: Request) {
    return this.crudService.findAll(req);
  }

  @UseGuards(AuthGuard('login_required'))
  @Get('findone')
  async findOne(@Query() readOneDto: ReadOneDto, @Req() req: Request) {
    return this.crudService.findOne(readOneDto, req);
  }

  @UseGuards(AuthGuard('login_required'))
  @Patch('update')
  async update(@Body() updateDto: UpdateDto, @Req() req: Request) {
    return this.crudService.update(updateDto, req);
  }

  @UseGuards(AuthGuard('login_required'))
  @Delete('removeone')
  removeone(@Body() deleteOneDto: DeleteOneDto, @Req() req: Request) {
    return this.crudService.removeone(deleteOneDto, req);
  }
}
