import { Injectable, InternalServerErrorException, UnprocessableEntityException } from '@nestjs/common';
import { InjectRedis } from '@nestjs-modules/ioredis';
import Redis from 'ioredis';
import { CryptoUtils } from './shared/utils/crypto.util';
import { GetEncryptDataResponseDataDTO } from './dto/get-encrypt-data/response.dto';
import { EncryptData } from './dto/base.dto';
import { GetDecryptDataResponseDataDTO } from './dto/get-decrypt-data/response.dto';

@Injectable()
export class AppService
{
    constructor
    (
        @InjectRedis()
        private redis: Redis,

        private cryptoUtils: CryptoUtils,
    )
    {}

    async getEncrypt(payload: string): Promise<GetEncryptDataResponseDataDTO>
    {
        const aesKeyBuffer = this.cryptoUtils.generateAesKey()

        const privateKey = await this.cryptoUtils.getRSAKey("private")
        const encryptedAesKey = this.cryptoUtils.encryptRSA(aesKeyBuffer, privateKey)

        const encryptedPayload = this.cryptoUtils.encryptAES(payload, aesKeyBuffer)

        const data = new GetEncryptDataResponseDataDTO()
        data.data1 = encryptedAesKey
        data.data2 = encryptedPayload.encrypted

        await this.redis.set(`encryptedPayload:${encryptedAesKey}`, JSON.stringify(encryptedPayload))

        return data
    }

    async getDecrypt(rawData1: string, rawData2: string): Promise<GetDecryptDataResponseDataDTO>
    {
        const data1 = Buffer.from(rawData1, "base64")
        const publicKey = await this.cryptoUtils.getRSAKey("public")
        const aesKey = this.cryptoUtils.decryptRSA(data1, publicKey)

        const rawEncryptedPayload = await this.redis.get(`encryptedPayload:${rawData1}`)
        if(!rawEncryptedPayload)
        {
            throw new UnprocessableEntityException(`Not found encrypted payload`)
        }

        const encryptedPayload = JSON.parse(rawEncryptedPayload) as EncryptData
        if(!encryptedPayload.iv || !encryptedPayload.authTag)
        {
            throw new InternalServerErrorException(`Not found IV or AuthTag in payload`)
        }

        const data2 = Buffer.from(rawData2, "base64")
        const payload = this.cryptoUtils.decryptAES(data2, aesKey, encryptedPayload.iv, encryptedPayload.authTag)

        const data = new GetDecryptDataResponseDataDTO()
        data.payload = payload

        return data
    }
}
