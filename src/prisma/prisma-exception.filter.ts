import { ArgumentsHost, Catch, ExceptionFilter } from '@nestjs/common';
import { PrismaClientKnownRequestError } from '@prisma/client/runtime/library';

@Catch(PrismaClientKnownRequestError)
export class PrismaClientExceptionFilter implements ExceptionFilter {
    catch(exception: PrismaClientKnownRequestError, host: ArgumentsHost) {
        const ctx = host.switchToHttp();
        const res = ctx.getResponse();

        if (exception.code === 'P2002') {
            return res.status(409).json({ statusCode: 409, message: 'Unique constraint failed', error: 'Conflict' });
        }
        if (exception.code === 'P2025') {
            return res.status(404).json({ statusCode: 404, message: 'Record not found', error: 'Not Found' });
        }

        return res.status(400).json({ statusCode: 400, message: exception.message, error: 'Bad Request' });
    }
}