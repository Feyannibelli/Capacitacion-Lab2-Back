import { ArgumentsHost, Catch, ExceptionFilter, HttpException } from '@nestjs/common';

// Captura excepciones HTTP lanzadas en controladores/servicios
@Catch(HttpException)
export class HttpErrorFilter implements ExceptionFilter {
    catch(exception: HttpException, host: ArgumentsHost) {
        const ctx = host.switchToHttp();
        const res = ctx.getResponse();
        const status = exception.getStatus();
        const response: any = exception.getResponse();
        const message = typeof response === 'object' && response.message ? response.message : exception.message;

        res.status(status).json({
            statusCode: status,                        //codigo http
            message,
            error: response.error || exception.name,
        });
    }
}
