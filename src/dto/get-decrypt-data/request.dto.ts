import { IsDefined, IsString } from "class-validator";

export class GetDecryptDataRequestBodyDTO
{
    @IsDefined({ message: "`data1` is required" })
    @IsString({ message: "`data1` should be only string" })
    data1: string

    @IsDefined({ message: "`data2` is required" })
    @IsString({ message: "`data2` should be only string" })
    data2: string
}