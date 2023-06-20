import { In, Repository } from 'typeorm';
import { CreateProductDto } from './dto/create-product.dto';
import { UpdateProductDto } from './dto/update-product.dto';
import { Product } from './entities/product.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { Injectable } from '@nestjs/common';
import { Stock } from 'src/stock/entities/stock.entity';
import { ProductSupplier } from './entities/product-supplier.entity';
import { RESPONSE_STATUS } from 'src/shared/statuses';
import { chunkArray } from 'src/shared/common.functions';
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

  async update(id: string, updateProductDto: UpdateProductDto) {
    const { stock, ...productData } = updateProductDto
    const product = await this.productRepository.preload({
      id,
      ...productData
    })
    if (!product) return { status: RESPONSE_STATUS.PRODUCT_DOESNT_EXIST }
    await this.productRepository.save(product)
    if (stock && productData.stockeable) {
      await this.updateStock(id, stock)
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

  async updateStock(productId, stocks) {
    const ids = []
    for (let index = 0; index < stocks.length; index++) {
      const stock = stocks[index];
      if (stock.id) {
        const stockModel = await this.stockRepository.findOne({ select: ['id', 'quantity'], where: { id: stock.id } })
        ids.push(stockModel.id);
        await this.stockRepository.update({ id: stockModel.id }, { quantity: stock.quantity, label: stock.label })
      } else {
        const returndIds = await this.createStock(productId, [{ ...stock }]);
        ids.push(returndIds[0]);
      }
    }
    //delete stocks that dont appear in product request
    const stocksINDB = await this.stockRepository.find({ select: ['id'], where: { product: { id: productId } } })
    let stocksToDelete = stocksINDB.filter(o1 => !ids.some(o2 => o1.id === o2));
    await this.stockRepository.delete({ id: In(stocksToDelete.map((stok) => { return stok.id })) });
  }

  async createStock(productId, stockData) {
    const ids = []
    for (let index = 0; index < stockData.length; index++) {
      const element = stockData[index];
      const { id, ...data } = element;
      const stock = await this.stockRepository.create(
        {
          quantity: data.quantity,
          label: data.label,
          product: { id: productId }
        })
      const savedStock = await this.stockRepository.save(stock)
      ids.push(savedStock.id)
    }
    return ids
  }
  fullTextSearch(term: string): Promise<Product[]> {
    return this.productRepository
      .createQueryBuilder('products')
      .select()
      .innerJoinAndSelect(
        "products.stocks",
        "stocks", 
      )
      .where(`UPPER(code) like '%' || UPPER(:searchTerm) ||'%' `, { searchTerm: term })
      .orWhere(`UPPER(name) like '%' ||UPPER(:searchTerm) ||'%' `, { searchTerm: term })
      .orWhere(`UPPER(reference) like '%' ||UPPER(:searchTerm) ||'%' `, { searchTerm: term })
      .getMany();
  }
  async createMany(createProductDto: CreateProductDto[]){
    // await this.clientRepository.createQueryBuilder().insert().values(createClientsDto).execute()

    const chunkedProducts=chunkArray(createProductDto,100)

    chunkedProducts.forEach(async clients=>{
      await this.productRepository.createQueryBuilder().insert().values(clients).execute()
    }) 

    return { status: RESPONSE_STATUS.GOOD_RESPONSE }
  }
}
