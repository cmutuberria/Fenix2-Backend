import { Injectable, CanActivate, ExecutionContext } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { JwtService } from '@nestjs/jwt';

@Injectable()
export class RolesGuard implements CanActivate {
    constructor(private readonly reflector: Reflector, 
        private readonly jwtService: JwtService) { }

    canActivate(context: ExecutionContext,): boolean | Promise<boolean>  {
       
        const roles = this.reflector.get<string[]>('roles', context.getHandler());
        if (!roles) {
            return true;
        }
        const request = context.switchToHttp().getRequest();
        const payload = <any> this.jwtService.decode(request.headers.authorization);        
        
        const hasRole = () =>  roles.includes(payload.rol);
        return payload &&  hasRole();
    }
}
