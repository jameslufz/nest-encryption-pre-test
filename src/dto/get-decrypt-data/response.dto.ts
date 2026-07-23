import { ApiProperty } from "@nestjs/swagger";
import { BaseResponseDTO } from "../base.dto";

export class GetDecryptDataResponseDataDTO
{
    @ApiProperty()
    payload: string
}

export class GetDecryptDataResponseDTO extends BaseResponseDTO<GetDecryptDataResponseDataDTO>
{
    @ApiProperty()
    data: GetDecryptDataResponseDataDTO
}