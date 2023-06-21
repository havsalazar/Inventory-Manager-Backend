import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { urlencoded, json } from 'express';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.use(json({ limit: '50mb' }));
  app.use(urlencoded({ extended: true, limit: '50mb' }));

  // app.use((req, res, next) => {
  //   res.header('Access-Control-Allow-Origin', '*');
  //   res.header('Access-Control-Allow-Methods', 'GET,PUT,POST,DELETE,PATCH');
  //   res.header('Access-Control-Allow-Headers', 'Content-Type, Accept');
  //   next();
  // }); 


  const config = new DocumentBuilder()
  .setTitle('Workshop')
  .setDescription('The cats API description')
  .setVersion('1.0')
  .addBearerAuth({
    type:'http',
    scheme:'bearer',
    bearerFormat:'JWT',
    name:'access_token',
    description:'enter jwt token',
    in:'header'
  },'jwt-auth')
  // .addTag('cats')
  .build();
  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('documentation', app, document);






  await app.listen(3000);
}
bootstrap();
