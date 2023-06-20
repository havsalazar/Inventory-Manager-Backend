import { Controller, Get, Post, Body, Patch, Param, Delete, UploadedFile, ParseFilePipeBuilder, UseInterceptors, Logger, UploadedFiles } from '@nestjs/common';
import { ProductService } from './product.service';
import { CreateProductDto } from './dto/create-product.dto';
import { UpdateProductDto } from './dto/update-product.dto';
import { Express } from 'express';
import { FileInterceptor } from '@nestjs/platform-express';
import { diskStorage } from 'multer';
import { Public } from 'src/shared/ispublic.metadata';
@Controller('product')
export class ProductController {
  constructor(private readonly productService: ProductService) {}
  private readonly logger = new Logger("ProductController");

  @Post('upload')
  @UseInterceptors(FileInterceptor('file',{
    storage:diskStorage({
      destination:'./files/images',
      filename:(req,file,cb)=>{         
        const fileNameSplit=file.originalname.split('.');
        const fileExt=fileNameSplit[fileNameSplit.length-1];
        cb(null,`${Date.now()}.${fileExt}`);
      }
    })
  })) 
  uploadFile(@UploadedFile() file: Express.Multer.File) {     
    return file;
  }

  @Post()  
  create(@Body() createProductDto: CreateProductDto) {
    return this.productService.create(createProductDto);
  }
  @Get('full-text-search/:term')
  fullTextSearch(@Param('term') term: string){
    return this.productService.fullTextSearch(term);
  }
  @Get()
  findAll() {
    return this.productService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.productService.findOne(id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateProductDto: UpdateProductDto) {
    return this.productService.update(id, updateProductDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.productService.remove(id);
  }

  @Public()
  @Post('createMany')
  initialize(@Body() createProductDto:CreateProductDto[] ){
    return this.productService.createMany(createProductDto);
  }

}
