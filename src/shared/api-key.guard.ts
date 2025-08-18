import { CanActivate, ExecutionContext, Injectable, UnauthorizedException } from '@nestjs/common';

@Injectable()
export class ApiKeyGuard implements CanActivate {
    canActivate(context: ExecutionContext): boolean {
       const req = context.switchToHttp().getRequest();
       const headerKey = req.headers['x-api-key'];
       if (!process.env.API_KEY || headerKey !== process.env.API_KEY) {
           throw new UnauthorizedException('invalid or missing API key');
       }
       return true;
    }
}