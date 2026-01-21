import { CanActivate, ExecutionContext, Injectable, UnauthorizedException } from "@nestjs/common";
import { JwtService } from "@nestjs/jwt";
import { Request } from "express";
import { Observable } from "rxjs";

@Injectable()
export class AuthGuard implements CanActivate {
    constructor(private readonly jwtService: JwtService) {}

    async canActivate(context: ExecutionContext){
        const request = context.switchToHttp().getRequest<Request>();
        const authHeader = request.headers.authorization;
        if(!authHeader) throw new UnauthorizedException('Authorization Header is missing!');
        const [type, token] = authHeader.split(' ');
        if (type !== 'Bearer' || !token) throw new UnauthorizedException();
        try{    
            const payload = await this.jwtService.verifyAsync(`${token}`);
            request['payload'] = payload;
            return true;
        }catch (error){
            throw new UnauthorizedException(error);
        }
    }
}