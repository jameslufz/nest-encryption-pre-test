import { ApiProperty } from "@nestjs/swagger";
import { IsDefined, IsString, MaxLength } from "class-validator";

export class GetEncryptDataRequestBodyDTO
{
    @IsDefined({ message: "Please input your payload" })
    @IsString({ message: "Payload should be only string" })
    @MaxLength(2000, { message: "Max length of payload is 2000 characters" })
    @ApiProperty({
        required: true,
        maxLength: 2000,
    })
    payload: string
}