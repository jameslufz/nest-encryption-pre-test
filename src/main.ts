import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';

async function bootstrap() {
    const app = await NestFactory.create(AppModule);
    app.useGlobalPipes(new ValidationPipe());

    const config = new DocumentBuilder()
    .setTitle('Primo World Pre Test')
    .setDescription('A pre-test api document for Primo World')
    .setVersion('0.1')
    .build();

    const documentFactory = () => SwaggerModule.createDocument(app, config);
    SwaggerModule.setup('document', app, documentFactory);

    await app.listen(process.env.PORT ?? 3000);
}
bootstrap();
