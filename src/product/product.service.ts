import { Repository } from 'typeorm';
import { CreateProductDto } from './dto/create-product.dto';
import { UpdateProductDto } from './dto/update-product.dto';
import { Product } from './entities/product.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { Injectable } from '@nestjs/common';
import { Stock } from 'src/stock/entities/stock.entity';

@Injectable()
export class ProductService {
  STATUSES = {
    GOOD_RESPONSE: 'OK',
    PRODUCT_DOESNT_EXIST: 'Product does not exist'
  }
  constructor(
    @InjectRepository(Product) private productRepository: Repository<Product>,
    @InjectRepository(Stock) private sotckRepository: Repository<Stock>

  ) { }

  async create(createProductDto: CreateProductDto) {
    const product = await this.productRepository.create(createProductDto)
    const productSaved = await this.productRepository.save(product)
    if (product.stockeable) {
      await this.createStock(productSaved.id, createProductDto.stock)
    }
    return productSaved
  }

  findAll() {
    return this.productRepository.find({ relations: { stocks: true } })
  }

  async findOne(id: string) {
    return this.productRepository.findOne({ where: { id }, relations: { stocks: true } })
  }
  //Update the product and its stock 
  async update(id: string, updateProductDto: UpdateProductDto) {
    const { stock, ...productData } = updateProductDto
    const product = await this.productRepository.preload({
      id,
      ...productData
    })
    if (!product) return { status: this.STATUSES.PRODUCT_DOESNT_EXIST }

    await this.productRepository.save(product)

    if (stock && productData.stockeable) {
      const stockModel = await this.sotckRepository.findOne({ select: ['id', 'quantity'], where: { product: { id } } })

      if (stockModel) {
        await this.sotckRepository.update({ id: stockModel.id }, { quantity: stock.quantity })
      } else {
        await this.createStock(id, stock)
      }
    }
    return { status: this.STATUSES.GOOD_RESPONSE }

  }

  async remove(id: string) {
    const product = await this.productRepository.preload({ id })
    if (!product) return { status: this.STATUSES.PRODUCT_DOESNT_EXIST }
    await this.sotckRepository.delete({ product: { id: product.id } })
    await this.productRepository.delete(product.id)
    return { status: this.STATUSES.GOOD_RESPONSE }
  }

  async createStock(productId, stockData) {
    const stock = await this.sotckRepository.create(
      {
        ...stockData,
        product: { id: productId }
      })
    await this.sotckRepository.save(stock)
  }
}
