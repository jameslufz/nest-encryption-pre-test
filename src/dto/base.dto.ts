import { ApiProperty } from "@nestjs/swagger"

export class BaseResponseDTO<T = null>
{
    @ApiProperty()
    successful: boolean = true

    @ApiProperty()
    error_code: string = ""

    data: T
}

export class BaseErrorResponseDTO extends BaseResponseDTO<null>
{
    @ApiProperty({ example: false })
    successful: boolean

    @ApiProperty()
    error_code: string

    @ApiProperty({ example: null })
    data: BaseResponseDTO["data"] = null
}

export class EncryptData
{
    encrypted: string
    authTag?: string
    iv?: string
}