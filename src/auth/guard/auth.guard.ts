import { CanActivate, ExecutionContext, Injectable, UnauthorizedException } from "@nestjs/common";
import { JwtService } from "@nestjs/jwt";
import { WsException } from "@nestjs/websockets";
import { Request } from "express";
import { Socket } from "socket.io";

@Injectable()
export class AuthGuard implements CanActivate {
    constructor(private readonly jwtService: JwtService) {}

    async canActivate(context: ExecutionContext){
        if (context.getType() === 'ws') return this.validateWs(context);
        return this.validateHttp(context);
    }

    private async validateHttp(context: ExecutionContext){
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

    private async validateWs(context: ExecutionContext){
        const client: Socket = context.switchToWs().getClient();
        const authHeader = client.handshake.auth?.token || client.handshake.headers?.authorization;
        if(!authHeader) throw new UnauthorizedException('Authorization Header is missing!');
        const [type, token] = authHeader.split(' ');
        if (type !== 'Bearer' || !token) throw new UnauthorizedException();
        try {
          const payload = await this.jwtService.verifyAsync(token);
          client['payload'] = payload; 
          return true;
        } catch {
           throw new WsException('Invalid WebSocket token');
        }
    }
}