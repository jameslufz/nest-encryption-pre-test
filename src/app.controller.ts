import { Body, Controller, Post } from '@nestjs/common';
import { AppService } from './app.service';
import { GetEncryptDataRequestBodyDTO } from './dto/get-encrypt-data/request.dto';
import { BaseErrorResponseDTO, BaseResponseDTO } from './dto/base.dto';
import { GetEncryptDataResponseDataDTO, GetEncryptDataResponseDTO } from './dto/get-encrypt-data/response.dto';
import { GetDecryptDataResponseDataDTO, GetDecryptDataResponseDTO } from './dto/get-decrypt-data/response.dto';
import { GetDecryptDataRequestBodyDTO } from './dto/get-decrypt-data/request.dto';
import { ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';

@Controller()
@ApiTags("Encrypt and decrypt")
export class AppController
{
    constructor(private readonly appService: AppService) {}

    @Post("/get-encrypt-data")
    @ApiOperation({ description: "Encrypt your secret data on memory." })
    @ApiResponse({ status: "2XX", type: GetEncryptDataResponseDTO, description: "Everything is good." })
    @ApiResponse({ status: "4XX", type: BaseErrorResponseDTO, description: "Your request have something wrong." })
    @ApiResponse({ status: "5XX", type: BaseErrorResponseDTO, description: "Something can't process or incorrect." })
    async getEncryptData
    (
        @Body() b: GetEncryptDataRequestBodyDTO,
    )
    : Promise<BaseResponseDTO<GetEncryptDataResponseDataDTO>>
    {
        const response = new BaseResponseDTO<GetEncryptDataResponseDataDTO>()
        response.data = await this.appService.getEncrypt(b.payload)
        return response
    }

    @Post("/get-decrypt-data")
    @ApiOperation({ description: "Decrypt your encrypted data." })
    @ApiResponse({ status: "2XX", type: GetDecryptDataResponseDTO, description: "Everything is good." })
    @ApiResponse({ status: "4XX", type: BaseErrorResponseDTO, description: "Your request have something wrong." })
    @ApiResponse({ status: "5XX", type: BaseErrorResponseDTO, description: "Something can't process or incorrect." })
    async getDecryptData
    (
        @Body() b: GetDecryptDataRequestBodyDTO,
    )
    : Promise<BaseResponseDTO<GetDecryptDataResponseDataDTO>>
    {
        const response = new BaseResponseDTO<GetDecryptDataResponseDataDTO>()
        response.data = await this.appService.getDecrypt(b.data1, b.data2)
        return response
    }
}
