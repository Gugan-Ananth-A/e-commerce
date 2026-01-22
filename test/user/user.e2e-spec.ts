import { INestApplication, ValidationPipe } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import request from 'supertest';
import { AppTestModule } from '../test.module';

describe('UsersController (e2e)', () => {
  let app: INestApplication;
  let authToken: string;
  let userId: string;

  beforeAll(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppTestModule],
    }).compile();

    app = moduleFixture.createNestApplication();
    app.useGlobalPipes(new ValidationPipe({ whitelist: true }));
    await app.init();

    const signUpResponse = await request(app.getHttpServer())
      .post('/auth/signup')
      .send({
        email: 'testuser@example.com',
        password: 'Test@1234',
        firstName: 'Test',
        lastName: 'User',
        role: 'CUSTOMER',
      })
      .expect(201);

    authToken = signUpResponse.body.authToken;
    userId = signUpResponse.body.id;
  });

  afterAll(async () => {
    await app.close();
  });

  describe('/users (GET)', () => {
    it('should return all users when authenticated', () => {
      return request(app.getHttpServer())
        .get('/users')
        .set('Authorization', `Bearer ${authToken}`)
        .expect(200)
        .expect((res) => {
          expect(Array.isArray(res.body)).toBe(true);
          expect(res.body.length).toBeGreaterThan(0);
          expect(res.body[0]).toHaveProperty('id');
          expect(res.body[0]).toHaveProperty('email');
          expect(res.body[0]).toHaveProperty('firstName');
          expect(res.body[0]).toHaveProperty('lastName');
          expect(res.body[0]).not.toHaveProperty('password');
        });
    });

    it('should return 401 when not authenticated', () => {
      return request(app.getHttpServer())
        .get('/users')
        .expect(401);
    });

    it('should return 401 with invalid token', () => {
      return request(app.getHttpServer())
        .get('/users')
        .set('Authorization', 'Bearer invalid-token')
        .expect(401);
    });
  });
});