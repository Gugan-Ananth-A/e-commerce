import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { GlobalExceptionFilter } from './common/global-exception-filter';
import { winstonConfig } from './loggers/winston.config';
import { LoggingInterceptor } from './common/interceptors/logging-interceptiors';

async function bootstrap() {
  const app = await NestFactory.create(AppModule, {logger: winstonConfig});
  app.useGlobalFilters(new GlobalExceptionFilter());
  app.useGlobalInterceptors(new LoggingInterceptor());
  await app.listen(process.env.PORT ?? 3000);
}
bootstrap();
