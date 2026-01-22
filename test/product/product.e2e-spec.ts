import { INestApplication, ValidationPipe } from "@nestjs/common";
import { Test, TestingModule } from "@nestjs/testing";
import { Category } from "src/products/entity/category.entity";
import request from 'supertest';
import { AppTestModule } from "test/test.module";

describe ('ProductController (e2e)', () => {
    let app: INestApplication;
    let authToken: string;

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

    describe('/products/create-category (POST)', () => {
        it('create a new category', () => {
          return request(app.getHttpServer())
            .post('/products/create-category')
            .set('Authorization', `Bearer ${authToken}`)
            .send({
                name: 'Category A',
                description: 'Description A'
            })
            .expect(201)
        });
        it('return 409 conflict error ', () => {
            return request(app.getHttpServer())
              .post('/products/create-category')
              .set('Authorization', `Bearer ${authToken}`)
              .send({
                  name: 'Category A',
                  description: 'Some other description'
              })
              .expect(409)
          });
    });


    describe('/products (POST)', () => {
        it('create a new product', () => {
          return request(app.getHttpServer())
            .post('/products')
            .set('Authorization', `Bearer ${authToken}`)
            .send({
                name: 'Produt A',
                description: 'Description A',
                price: 1000,
                stock: 5,
                categoryIDs: [1, 2] 
            })
            .expect(201)
            .expect((res) => {        
                expect(res.body).toHaveProperty('id');
                expect(res.body).toHaveProperty('name');
                expect(res.body).toHaveProperty('description');
                expect(res.body).toHaveProperty('price');
            })
        });
    });

    afterAll(async () => {
        await app.close();
    });
});