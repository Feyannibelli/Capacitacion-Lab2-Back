import { ArgumentsHost, Catch, ConflictException, ExceptionFilter, NotFoundException } from '@nestjs/common';
import { Prisma } from '@prisma/client';

// Solo captura errores
@Catch(Prisma.PrismaClientKnownRequestError)
export class PrismaClientExceptionFilter implements ExceptionFilter {
    catch(exception: Prisma.PrismaClientKnownRequestError, host: ArgumentsHost) {
        const ctx = host.switchToHttp();
        const res = ctx.getResponse();

        if (exception.code === 'P2002') {
            const message = 'Unique constraint failed';
            return res.status(409).json({ statusCode: 409, message, error: 'Conflict' });
        }
        if (exception.code === 'P2025') {
            const message = 'Record not found';
            return res.status(404).json({ statusCode: 404, message, error: 'Not Found' });
        }

        return res.status(400).json({ statusCode: 400, message: exception.message, error: 'Bad Request' });
    }
}
