import { Repository } from 'typeorm';
import { CreateProductDto } from './dto/create-product.dto';
import { UpdateProductDto } from './dto/update-product.dto';
import { Product } from './entities/product.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { Injectable } from '@nestjs/common';
import { Stock } from 'src/stock/entities/stock.entity';
import { ProductSupplier } from './entities/product-supplier.entity';
import { RESPONSE_STATUS } from 'src/shared/statuses';
@Injectable()
export class ProductService {

  constructor(
    @InjectRepository(Product) private productRepository: Repository<Product>,
    @InjectRepository(Stock) private stockRepository: Repository<Stock>,
    @InjectRepository(ProductSupplier) private productSupplierRepository: Repository<ProductSupplier>


  ) { }

  async create(createProductDto: CreateProductDto) {
    const product = await this.productRepository.create(createProductDto)
    const productSaved = await this.productRepository.save(product)
    if (product.stockeable && createProductDto.stock) {
      await this.createStock(productSaved.id, createProductDto.stock)
    }
    return productSaved
  }

  findAll() {
    return this.productRepository.find({ relations: { stocks: true, productSuppliers: { supplier: true } } })
  }

  async findOne(id: string) {
    return this.productRepository.findOne({ where: { id }, relations: { stocks: true, productSuppliers: { supplier: true } } })
  }
  //Update the product and its stock 
  async update(id: string, updateProductDto: UpdateProductDto) {
    const { stock, ...productData } = updateProductDto
    const product = await this.productRepository.preload({
      id,
      ...productData
    })
    if (!product) return { status: RESPONSE_STATUS.PRODUCT_DOESNT_EXIST }

    await this.productRepository.save(product)

    if (stock && productData.stockeable) {
      const stockModel = await this.stockRepository.findOne({ select: ['id', 'quantity'], where: { product: { id } } })

      if (stockModel) {
        await this.stockRepository.update({ id: stockModel.id }, { quantity: stock.quantity })
      } else {
        await this.createStock(id, stock)
      }
    }
    return { status: RESPONSE_STATUS.GOOD_RESPONSE }

  }

  async remove(id: string) {
    const product = await this.productRepository.preload({ id })
    if (!product) return { status: RESPONSE_STATUS.PRODUCT_DOESNT_EXIST }
    await this.stockRepository.delete({ product: { id: product.id } })
    await this.productRepository.delete(product.id)
    return { status: RESPONSE_STATUS.GOOD_RESPONSE }
  }

  async findSuppliersByProductId(productId: string) {
    return this.productSupplierRepository.find({ where: { product: { id: productId } }, relations: { supplier: true } });
  }

  async removeSupplier(supplierId: string) {
    return await this.productSupplierRepository.delete({ supplier: { id: supplierId } });
  }

  async createStock(productId, stockData) {
    const stock = await this.stockRepository.create(
      {
        ...stockData,
        product: { id: productId }
      })
    await this.stockRepository.save(stock)
  }
}
