import { INestApplication, ValidationPipe } from '@nestjs/common';
import { Test } from '@nestjs/testing';
import request from 'supertest';
import { execSync } from 'child_process';
import { AppModule } from '../../src/app.module';
import { HttpErrorFilter } from '../../src/shared/http-error.filter';
import { PrismaClientExceptionFilter } from '../../src/prisma/prisma-exception.filter';

describe('App E2E', () => {
    let app: INestApplication;
    const apiKey = process.env.API_KEY || 'testing-key';

    beforeAll(async () => {
        execSync(`dotenv -e .env.test -- npx prisma migrate reset --force --skip-seed`, { stdio: 'inherit' });
        execSync(`dotenv -e .env.test -- npx prisma migrate deploy`, { stdio: 'inherit' });
        execSync(`dotenv -e .env.test -- npx prisma db seed`, { stdio: 'inherit' });

        const moduleRef = await Test.createTestingModule({ imports: [AppModule] }).compile();
        app = moduleRef.createNestApplication();

        app.useGlobalPipes(new ValidationPipe({
            whitelist: true, forbidNonWhitelisted: true, transform: true,
            transformOptions: { enableImplicitConversion: true },
        }));
        app.useGlobalFilters(new PrismaClientExceptionFilter(), new HttpErrorFilter());

        await app.init();
    });

    afterAll(async () => {
        await app.close();
    });

    it('GET /pokemons → envelope', async () => {
        const res = await request(app.getHttpServer())
            .get('/pokemons?page=1&limit=5')
            .expect(200);
        expect(res.body).toHaveProperty('items');
        expect(res.body).toHaveProperty('total');
        expect(res.body).toHaveProperty('page', 1);
        expect(res.body).toHaveProperty('limit', 5);
        expect(res.body).toHaveProperty('totalPages');
    });

    it('GET /abilities → lista (para ver IDs)', async () => {
        const res = await request(app.getHttpServer()).get('/abilities').expect(200);
        expect(Array.isArray(res.body)).toBe(true);
        expect(res.body[0]).toHaveProperty('id');
    });

    it('GET /pokemons/abilities/:id → filtra por habilidad', async () => {
        // asumiendo que tu seed crea Overgrow/Blaze/Torrent
        const abilities = await request(app.getHttpServer()).get('/abilities').expect(200);
        const someId = abilities.body[0].id;
        await request(app.getHttpServer()).get(`/pokemons/abilities/${someId}`).expect(200);
    });

    it('POST /pokemons (x-api-key) → crea', async () => {
        await request(app.getHttpServer())
            .post('/pokemons')
            .set('x-api-key', apiKey)
            .send({
                name: 'Pikachu',
                type: 'ELECTRIC',
                height: 0.4,
                weight: 6,
                imageUrl: 'https://example.com/pika.jpg',
                abilities: ['Static']
            })
            .expect(201);
    });

    it('PATCH + DELETE flow', async () => {
        const created = await request(app.getHttpServer())
            .post('/pokemons')
            .set('x-api-key', apiKey)
            .send({ name: 'TempMon', type: 'FIRE', height: 1, weight: 2 })
            .expect(201);

        const id = created.body.id;

        await request(app.getHttpServer())
            .patch(`/pokemons/${id}`)
            .set('x-api-key', apiKey)
            .send({ weight: 3 })
            .expect(200);

        await request(app.getHttpServer())
            .delete(`/pokemons/${id}`)
            .set('x-api-key', apiKey)
            .expect(200);
    });
});
