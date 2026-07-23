import { ApiProperty } from "@nestjs/swagger";
import { IsDefined, IsString } from "class-validator";

export class GetDecryptDataRequestBodyDTO
{
    @IsDefined({ message: "`data1` is required" })
    @IsString({ message: "`data1` should be only string" })
    @ApiProperty()
    data1: string

    @IsDefined({ message: "`data2` is required" })
    @IsString({ message: "`data2` should be only string" })
    @ApiProperty()
    data2: string
}