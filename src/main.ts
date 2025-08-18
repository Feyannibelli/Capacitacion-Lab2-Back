import { ValidationPipe } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import { DocumentBuilder, SwaggerModule} from "@nestjs/swagger";
import { AppModule } from './app.module';
import { PrismaClientExceptionFilter } from './prisma/prisma-exception.filter';
import { HttpErrorFilter } from './shared/http-error.filter';

async function bootstrap() {
    const app = await NestFactory.create(AppModule);

    //asegurar que todas las request cumplan los DTOs
    app.useGlobalPipes(new ValidationPipe({
        whitelist: true,
        forbidNonWhitelisted: true,
        transform: true,
        transformOptions: { enableImplicitConversion: true },
    }));

    //filtros globales para la consistencia de los erroers
    app.useGlobalFilters(
        new PrismaClientExceptionFilter(),
        new HttpErrorFilter(),
    );

    //configuracion de Swagger
    const config = new DocumentBuilder()
    .setTitle('Pokémon API')
    .setDescription('CRUD, paginacion, filtros y habilidades')
    .setVersion('1.0.0')
    .addApiKey(
        { type: 'apiKey', name: 'x-api-key', in: 'header' },
        'api-key',
    )
    .build();

    const document = SwaggerModule.createDocument(app, config);
    SwaggerModule.setup('/docs', app, document);

    await app.listen(process.env.PORT || 3000);
}
bootstrap();