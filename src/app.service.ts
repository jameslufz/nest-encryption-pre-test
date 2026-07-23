import { Injectable, InternalServerErrorException } from '@nestjs/common';
import { CryptoUtils } from './shared/utils/crypto.util';
import { GetEncryptDataResponseDataDTO } from './dto/get-encrypt-data/response.dto';
import { EncryptData } from './dto/base.dto';
import { GetDecryptDataResponseDataDTO } from './dto/get-decrypt-data/response.dto';

@Injectable()
export class AppService
{
    constructor
    (
        private cryptoUtils: CryptoUtils,
    )
    {}

    async getEncrypt(payload: string): Promise<GetEncryptDataResponseDataDTO>
    {
        const aesKeyBuffer = this.cryptoUtils.generateAesKey()

        const privateKey = await this.cryptoUtils.getRSAKey("private")
        const encryptedAesKey = this.cryptoUtils.encryptRSA(aesKeyBuffer, privateKey)

        const encryptedPayload = this.cryptoUtils.encryptAES(payload, aesKeyBuffer)
        const encryptedPayloadJson = JSON.stringify(encryptedPayload)

        const data = new GetEncryptDataResponseDataDTO()
        data.data1 = encryptedAesKey
        data.data2 = Buffer.from(encryptedPayloadJson, "utf8").toString("base64")

        return data
    }

    async getDecrypt(rawData1: string, rawData2: string): Promise<GetDecryptDataResponseDataDTO>
    {
        const data1 = Buffer.from(rawData1, "base64")
        const publicKey = await this.cryptoUtils.getRSAKey("public")
        const aesKey = this.cryptoUtils.decryptRSA(data1, publicKey)

        const encryptedPayloadJson = Buffer.from(rawData2, "base64").toString("utf8")
        const encryptedPayload = JSON.parse(encryptedPayloadJson) as EncryptData
        if(!encryptedPayload.iv || !encryptedPayload.authTag)
        {
            throw new InternalServerErrorException(`Not found IV or AuthTag in payload`)
        }

        const encrypted = Buffer.from(encryptedPayload.encrypted, "base64")
        const payload = this.cryptoUtils.decryptAES(encrypted, aesKey, encryptedPayload.iv, encryptedPayload.authTag)

        const data = new GetDecryptDataResponseDataDTO()
        data.payload = payload

        return data
    }
}
