import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication, ValidationPipe } from '@nestjs/common';
import request from 'supertest';
import { AppTestModule } from 'test/test.module';

describe('AuthController (e2e) - Real Service', () => {
  let app: INestApplication;

  beforeAll(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
        imports: [AppTestModule]
    }).compile();
  
    app = moduleFixture.createNestApplication();
    app.useGlobalPipes(new ValidationPipe());
    await app.init();
  });

  afterAll(async () => {
    await app.close();
  });

  describe('/auth/signup (POST)', () => {
    it('should successfully create a new user', async () => {
      const signUpDto = { 
        firstName: 'real', 
        lastName: 'test', 
        role: 'CUSTOMER', 
        email: 'real@test.com', 
        password: 'StrongPassword123' 
      };
      
      const response = await request(app.getHttpServer())
        .post('/auth/signup')
        .send(signUpDto)
        .expect(201);
      
      expect(response.body).toHaveProperty('id');
      expect(response.body.email).toBe(signUpDto.email);
    });

    it('should fail if email is already taken (Real Logic)', async () => {
      const signUpDto = { 
        firstName: 'dup',
        lastName: 'test',
        role: 'CUSTOMER',
        email: 'duplicate@test.com', 
        password: 'password123' 
      };
      
      await request(app.getHttpServer())
        .post('/auth/signup')
        .send(signUpDto);
      
      return request(app.getHttpServer())
        .post('/auth/signup')
        .send(signUpDto)
        .expect(409);
    });
  });

  describe('/auth/login (POST)', () => {
    it('should return real JWT tokens for valid credentials', async () => {
      const user = { 
        email: 'real@test.com', 
        password: 'StrongPassword123' 
      };
      
      await request(app.getHttpServer())
        .post('/auth/signup')
        .send(user);
      
      const response = await request(app.getHttpServer())
        .post('/auth/login')
        .send({ email: user.email, password: user.password })
        .expect(201);
      
      expect(response.body.authToken).toBeDefined();
      expect(typeof response.body.authToken).toBe('string');
    });
  });
});