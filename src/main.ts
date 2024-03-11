import { ValidationPipe, VersioningType } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { setupSwagger } from 'src/util/swagger';
import * as cookieParser from 'cookie-parser';
import { ConfigService } from './config/config.service';
import * as fs from 'fs';
import { winstonLogger } from './util/winston.util';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';

async function bootstrap() {
  await makeOrmConfig();
  const app = await NestFactory.create(AppModule, {
    logger: winstonLogger,
  });

  const front_url1: string = 'http://' + process.env.FRONT_SERVER_HOST + ':' + process.env.FRONT_SERVER_PORT;
  const front_url2: string = 'http://' + process.env.FRONT_SERVER_DOMAIN + ':' + process.env.FRONT_SERVER_PORT;
  const front_url3: string = 'http://' + process.env.FRONT_SERVER_DOMAIN;

  app.enableCors({
    origin: [front_url1, front_url2, front_url3],
    credentials: true,
  });

  app.enableVersioning({
    type: VersioningType.URI,
    prefix: 'v',
  });

  const config = new DocumentBuilder().setTitle('Api example').setDescription('The API description').setVersion('1.0').addTag('nestJS').build();
  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api-docs', app, document);

  // setupSwagger(app);
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      forbidNonWhitelisted: true,
      transform: true,
    }),
  );
  const port = process.env.SERVER_PORT;

  app.use(cookieParser());

  await app.listen(port);
}

async function makeOrmConfig() {
  const configService = new ConfigService(process.env);
  const typeormConfig = configService.getTypeOrmConfig();

  if (fs.existsSync('ormconfig.json')) {
    fs.unlinkSync('ormconfig.json');
  }

  fs.writeFileSync('ormconfig.json', JSON.stringify(typeormConfig, null, 2));
}
bootstrap();
