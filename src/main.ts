import { ValidationPipe } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import { DocumentBuilder, SwaggerModule} from "@nestjs/swagger";
import { AppModule } from './app.module';
import { PrismaClientExceptionFilter } from './prisma/prisma-exception.filter';
import { HttpErrorFilter } from './shared/http-error.filter';

async function bootstrap() {
    const app = await NestFactory.create(AppModule);

    app.enableCors({
        origin: [
            'http://localhost:3000',
            'http://localhost:5173',
            'http://localhost:4173',

        ],
        methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],
        allowedHeaders: [
            'Content-Type',
            'Authorization',
            'x-api-key',
            'Accept',
            'Origin',
            'X-Requested-With'
        ],
        credentials: true,
    });

    app.useGlobalPipes(new ValidationPipe({
        whitelist: true,
        forbidNonWhitelisted: true,
        transform: true,
        transformOptions: { enableImplicitConversion: true },
    }));

    app.useGlobalFilters(
        new PrismaClientExceptionFilter(),
        new HttpErrorFilter(),
    );

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

    const port = process.env.PORT || 3000;
    await app.listen(port);

    console.log(`🚀 Server is running on: http://localhost:${port}`);
    console.log(`📚 API Documentation: http://localhost:${port}/docs`);
}

bootstrap();