import { ApiProperty } from "@nestjs/swagger"
import { BaseResponseDTO } from "../base.dto"

export class GetEncryptDataResponseDataDTO
{
    @ApiProperty()
    data1: string

    @ApiProperty()
    data2: string
}

export class GetEncryptDataResponseDTO extends BaseResponseDTO<GetEncryptDataResponseDataDTO>
{
    @ApiProperty()
    data: GetEncryptDataResponseDataDTO
}