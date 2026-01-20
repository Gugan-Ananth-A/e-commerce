import { ConflictException, Injectable, NotFoundException, UnauthorizedException } from '@nestjs/common';
import { LoginDto } from './dto/login.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from 'src/users/entity/user.entity';
import { Repository } from 'typeorm';
import { RefreshToken } from './entity/refresh_token.entity';
import * as bcrypt from 'bcrypt';
import { JwtService } from '@nestjs/jwt';
import { randomUUID } from 'crypto';
import { SignUpDto } from './dto/signup.dto';
import { RefreshTokenDto } from './dto/refresh-token.dto';

@Injectable()
export class AuthService {

    constructor(
        @InjectRepository(User) private readonly userRepository: Repository<User>,
        @InjectRepository(RefreshToken) private readonly refreshRepository: Repository<RefreshToken>,
        private jwtService: JwtService
    ){}

    async login(loginDto: LoginDto){
        const user = await this.userRepository.findOne({
            where: { email: loginDto.email }
        });
        if(!user) throw new NotFoundException('Email not found');
        const isMatch = await bcrypt.compare(loginDto.password, user.hash);
        if(!isMatch) throw new UnauthorizedException('Invalid Credentials');

        const tokenPayload = {sub: user.id, tokenVersion: user.tokenVersion};
        const accessToken = await this.jwtService.signAsync(tokenPayload);
        const refreshTokenEntity = await this.refreshRepository.findOne({
            where: { user: user }
        });
        let refreshTokenValue;
        if(!refreshTokenEntity || refreshTokenEntity.expiresAt < new Date()) {
            const refreshTokenValue = randomUUID();
            const expiresAt = new Date();
            expiresAt.setMonth(expiresAt.getMonth() + 1);
            await this.refreshRepository.save({
                token: refreshTokenValue,
                user,
                expiresAt,
                updatedAt: new Date()
            });
        }else{
            refreshTokenValue = refreshTokenEntity.token;
        }

        return {
            id: user.id,
            firstName: user.firstName,
            lastName: user.lastName,
            email: user.email,
            role: user.role,
            refreshToken: refreshTokenValue,
            authToken: accessToken,
        }
    }

    async refreshToken(refreshTokenDto: RefreshTokenDto){
        const storedToken = await this.refreshRepository.findOne({
            where: {token: refreshTokenDto.refreshToken},
            relations: ['user']
        });
        if (!storedToken || storedToken.expiresAt < new Date()) {
           throw new UnauthorizedException();
        }

        storedToken.token = randomUUID();
        const expiresAt = new Date();
        expiresAt.setMonth(expiresAt.getMonth() + 1);
        storedToken.expiresAt = expiresAt;
        await this.refreshRepository.save(storedToken);

        const tokenPayload = {sub: storedToken.user.id, tokenVersion: storedToken.user.tokenVersion};
        const accessToken = await this.jwtService.signAsync(tokenPayload);

        return {
            accessToken,
            refreshToken: storedToken.token
        }
    }   

    async logout(userID: string){
        await this.userRepository.increment({ id: +userID }, 'tokenVersion', 1);
        const result = await this.refreshRepository.delete({ user: {id: +userID} });
        if(result.affected){
            return {'message': 'Logout Success!'};
        }else{
            throw new NotFoundException('User ID not found!');
        }
    }

    async signup(signupDto: SignUpDto){
        const oldUser = await this.userRepository.findOne({
            where: { email: signupDto.email }
        });
        if(oldUser) throw new ConflictException('Email already used');
        const passwordHash = await bcrypt.hash(signupDto.password, 10);
        const user = await this.userRepository.create({
            firstName: signupDto.firstName,
            lastName: signupDto.lastName,
            email: signupDto.email,
            hash: passwordHash,
            role: signupDto.role,
            createdAt: new Date(),
            updatedAt: new Date(),
        });

        await this.userRepository.save(user);
        const tokenPayload = {sub: user.id, tokenVersion: user.tokenVersion};
        const accessToken = await this.jwtService.signAsync(tokenPayload);
        const refreshTokenEntity = await this.refreshRepository.findOne({
            where: { user: user }
        });
        let refreshTokenValue;
        if(!refreshTokenEntity || refreshTokenEntity.expiresAt < new Date()) {
            const refreshTokenValue = randomUUID();
            const expiresAt = new Date();
            expiresAt.setMonth(expiresAt.getMonth() + 1);
            const refreshToken = await this.refreshRepository.create({
                token: refreshTokenValue,
                user,
                expiresAt,
                updatedAt: new Date()
            });
            await this.refreshRepository.save(refreshToken);
        }else{
            refreshTokenValue = refreshTokenEntity.token;
        }

        return {
            id: user.id,
            firstName: user.firstName,
            lastName: user.lastName,
            email: user.email,
            role: user.role,
            refreshToken: user.refreshToken,
            authToken: accessToken,
        }
    }
}
