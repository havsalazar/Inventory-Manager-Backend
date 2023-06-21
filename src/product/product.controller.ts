import { Controller, Get, Post, Body, Patch, Param, Delete, UploadedFile, ParseFilePipeBuilder, UseInterceptors, Logger, UploadedFiles } from '@nestjs/common';
import { ProductService } from './product.service';
import { CreateProductDto } from './dto/create-product.dto';
import { UpdateProductDto } from './dto/update-product.dto';
import { Express } from 'express';
import { FileInterceptor } from '@nestjs/platform-express';
import { diskStorage } from 'multer';
import { Public } from 'src/shared/ispublic.metadata';
import { ApiBearerAuth, ApiBody, ApiOkResponse, ApiParam, ApiResponse, ApiTags } from '@nestjs/swagger';
import {FSProducts, FSbody} from './DocSchemas/product.schema'
@ApiTags('Product')

@Controller('product')
export class ProductController {
  constructor(private readonly productService: ProductService) { }
  private readonly logger = new Logger("ProductController");

  @Post('upload')
  @UseInterceptors(FileInterceptor('file', {
    storage: diskStorage({
      destination: './files/images',
      filename: (req, file, cb) => {
        const fileNameSplit = file.originalname.split('.');
        const fileExt = fileNameSplit[fileNameSplit.length - 1];
        cb(null, `${Date.now()}.${fileExt}`);
      }
    })
  }))
  uploadFile(@UploadedFile() file: Express.Multer.File) {
    return file;
  }

  @ApiBearerAuth('jwt-auth')
  @Post()
  create(@Body() createProductDto: CreateProductDto) {
    return this.productService.create(createProductDto);
  }

  @ApiBearerAuth('jwt-auth')
  @Get('full-text-search/:term')
  @ApiOkResponse(FSProducts)
  @ApiParam(FSbody)
  fullTextSearch(@Param('term') term: string) {
    return this.productService.fullTextSearch(term);
  }
  @ApiBearerAuth('jwt-auth')
  @Get()
  findAll() {
    return this.productService.findAll();
  }
  @ApiBearerAuth('jwt-auth')
  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.productService.findOne(id);
  }
  @ApiBearerAuth('jwt-auth')
  @Patch(':id')
  update(@Param('id') id: string, @Body() updateProductDto: UpdateProductDto) {
    return this.productService.update(id, updateProductDto);
  }
  @ApiBearerAuth('jwt-auth')
  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.productService.remove(id);
  }

  @Public()
  @Post('createMany')
  initialize(@Body() createProductDto: CreateProductDto[]) {
    return this.productService.createMany(createProductDto);
  }

}
