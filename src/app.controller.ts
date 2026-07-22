import { Body, Controller, Post, Res } from '@nestjs/common';
import { AppService } from './app.service';
import { GetEncryptDataRequestBodyDTO } from './dto/get-encrypt-data/request.dto';
import type { Response } from 'express';
import { BaseResponseDTO } from './dto/base.dto';
import { GetEncryptDataResponseDataDTO } from './dto/get-encrypt-data/response.dto';
import { GetDecryptDataResponseDataDTO } from './dto/get-decrypt-data/response.dto';
import { GetDecryptDataRequestBodyDTO } from './dto/get-decrypt-data/request.dto';
import { ApiBadRequestResponse, ApiInternalServerErrorResponse, ApiOkResponse, ApiTags } from '@nestjs/swagger';

@Controller()
@ApiTags("Encrypt and decrypt")
export class AppController
{
    constructor(private readonly appService: AppService) {}

    @Post("/get-encrypt-data")
    @ApiOkResponse({ description: "Everything is good." })
    @ApiBadRequestResponse({ description: "Your request have something wrong." })
    @ApiInternalServerErrorResponse({ description: "Something can't process or incorrect." })
    async getEncryptData
    (
        @Body() b: GetEncryptDataRequestBodyDTO,
        @Res() res: Response,
    )
    {
        const response = new BaseResponseDTO<GetEncryptDataResponseDataDTO>()
        response.data = await this.appService.getEncrypt(b.payload)
        return res.status(200).json(response)
    }

    @Post("/get-decrypt-data")
    async getDecryptData
    (
        @Body() b: GetDecryptDataRequestBodyDTO,
        @Res() res: Response,
    )
    {
        const response = new BaseResponseDTO<GetDecryptDataResponseDataDTO>()
        response.data = await this.appService.getDecrypt(b.data1, b.data2)
        return res.status(200).json(response)
    }
}
