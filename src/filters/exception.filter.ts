import { ExceptionFilter, Catch, ArgumentsHost, HttpException, HttpExceptionBody } from '@nestjs/common';
import { Response } from 'express';
import { BaseResponseDTO } from '../dto/base.dto';

@Catch( Error, HttpException )
export class BaseExceptionFilter implements ExceptionFilter
{
    catch(exception: Error, host: ArgumentsHost)
    {
        const ctx = host.switchToHttp()
        const res = ctx.getResponse<Response>()

        const response = new BaseResponseDTO()
        response.successful = false
        response.error_code = "UNEXPECT_ERROR"
        response.data = null

        if( exception instanceof HttpException )
        {
            const status = exception.getStatus()

            if(status === 404) return res.status(404).send()

            const errorResponse = exception.getResponse() as HttpExceptionBody
            if(typeof errorResponse.message === "string")
            {
                response.error_code = errorResponse.message.replaceAll(" ", "_").toUpperCase()
            }
            else if(Array.isArray(errorResponse.message))
            {
                const [message] = errorResponse.message
                response.error_code = message.replaceAll(" ", "_").toUpperCase()
            }
            else
            {
                response.error_code = "UNKNOWN_ERROR"
            }
            
            return res.status(status).json(response)
        }

        console.log(exception)

        return res.status(500).json(response)
    }
}