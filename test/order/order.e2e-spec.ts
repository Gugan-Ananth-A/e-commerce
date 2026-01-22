import { INestApplication, ValidationPipe } from "@nestjs/common";
import { Test, TestingModule } from "@nestjs/testing";
import { AppTestModule } from "test/test.module";
import request from 'supertest';

describe ('Order Controller (e2e)', () => {
    let app: INestApplication;
    let authToken: string;
    let orderID: number;
    let categoryID: number;

    beforeAll(async () => {
        const moduleFixture: TestingModule = await Test.createTestingModule({
            imports: [AppTestModule]
        }).compile();

        app = moduleFixture.createNestApplication();
        app.useGlobalPipes(new ValidationPipe({transform: true}));
        await app.init();

        const signUpResponse = await request(app.getHttpServer())
        .post('/auth/signup')
        .send({
            email: 'gugan@gmail.com',
            firstName: 'Gugan',
            lastName: 'Test',
            role: 'ADMIN',
            password: 'Password123'
        })
        .expect(201)

        authToken = signUpResponse.body.authToken;
    });

    describe('/orders (GET)', () => {
        it('get list of all orders', () => {
          return request(app.getHttpServer())
            .get('/orders')
            .set('Authorization', `Bearer ${authToken}`)
            .expect(200)
        });
    });

    describe('/orders (POST)', () => {
        it('create a new order', () => {
          return request(app.getHttpServer())
            .post('/orders')
            .set('Authorization', `Bearer ${authToken}`)
            .expect(201)
            .expect((res) => {
                orderID= res.body.id;
            })
        });
    });

    describe('/products/create-category (POST)', () => {
        it('create a new order', () => {
          return request(app.getHttpServer())
            .post('/products/create-category')
            .set('Authorization', `Bearer ${authToken}`)
            .send({
                name: 'Electronic',
                description: 'Electronic Devices'
            })
            .expect(201)
            .expect((res) => {
                categoryID= res.body.id;
            })
        });
    });

    describe('/products (POST)', () => {
        it('create a new proudct', () => {
          return request(app.getHttpServer())
            .post('/products')
            .set('Authorization', `Bearer ${authToken}`)
            .send({
                name: 'Electronic',
                description: 'Electronic Devices',
                price: 10,
                stock: 10,
                categoryIDs: [categoryID]
            })
            .expect(201)
        });
    });


    describe('/products (GET)', () => {
        it('get all products', () => {
          return request(app.getHttpServer())
            .get('/products')
            .set('Authorization', `Bearer ${authToken}`)
            .expect(200)
        });
    });

    describe('/orders/item (POST)', () => {
        it('create a new order item', () => {
          return request(app.getHttpServer())
            .post('/orders/item')
            .set('Authorization', `Bearer ${authToken}`)
            .send({
                productId: 1,
                orderId: orderID,
                quantity: 1,
            })
            .expect(201)
        });
    });

    afterAll(async () => {
        await app.close();
    });
});
