import { ApolloDriver } from '@nestjs/apollo';
import { MiddlewareConsumer, Module, RequestMethod } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UsersModule } from './users/users.module';
import { GraphQLModule } from '@nestjs/graphql';
import { APP_FILTER, APP_GUARD } from "@nestjs/core";
import { HttpErrorFilter } from "./shared/http-error.filter";
import { AuthModule } from './auth/auth.module';
import * as cors from 'cors';
import { ConfigModule } from '@nestjs/config';
import { ProductModule } from './product/product.module';
import { StockModule } from './stock/stock.module';
import { SupplierModule } from './supplier/supplier.module';
import { ProductOrderModule } from './product_order/product_order.module';
import { OrderModule } from './order/order.module';
import { ClientModule } from './client/client.module';
import { SupplyingModule } from './supplying/supplying.module';
import { CustomDatabaseLog } from './custom-database-log/custom-database-log';
import { AuthGuard } from './auth/auth.guard';
import { JwtModule } from '@nestjs/jwt';
@Module({
  imports: [
    TypeOrmModule.forRoot({
      type: "better-sqlite3",
      database: "workshop.db",
      entities: [__dirname + "/**/*.entity{.ts,.js}"],
      synchronize: true,
      // logger:new CustomDatabaseLog()
    }),
    GraphQLModule.forRoot({
      driver: ApolloDriver,
      playground: true,
      autoSchemaFile: "schema.gql",
      context: ({ req }) => ({ headers: req.headers }),
    }),
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: 'config.env',
    }),JwtModule.register({}),
    AuthModule,
    ProductModule,
    StockModule,
    SupplyingModule,
    SupplierModule,
    ProductOrderModule,
    OrderModule,
    ClientModule,
    UsersModule,
  ],
  controllers: [AppController],
  providers: [
    AppService,
    {
      provide: APP_FILTER,
      useClass: HttpErrorFilter,
    },
    {
      provide: APP_GUARD,
      useClass: AuthGuard,
      
    }
  ],
})
export class AppModule {

  configure(consumer: MiddlewareConsumer) {
    consumer
      .apply(cors({
        origin: (requestOrigin: string, callback: (err: Error, origin?: boolean) => void) => {
          callback(null, true);
        }
      }))
      .exclude({ path: '/api/health', method: RequestMethod.GET })
      .forRoutes('*'); // use .forRoutes('(.*)') if fastify
  }
}