import { Test, TestingModule } from '@nestjs/testing';
import { AppService } from './app.service';
import { CryptoUtils } from './shared/utils/crypto.util';
import { GetEncryptDataResponseDataDTO } from './dto/get-encrypt-data/response.dto';
import { EncryptData } from './dto/base.dto';
import { GetDecryptDataResponseDataDTO } from './dto/get-decrypt-data/response.dto';

describe('AppService', () =>
{
    let service: AppService
    let cryptoUtils: jest.Mocked<Pick<CryptoUtils, keyof CryptoUtils>>

    beforeEach(async () =>
    { 
        cryptoUtils = {
            getRSAKey: jest.fn(),
            encryptAES: jest.fn(),
            encryptRSA: jest.fn(),
            decryptAES: jest.fn(),
            decryptRSA: jest.fn(),
            generateAesKey: jest.fn(),
        }

        const module: TestingModule = await Test.createTestingModule({
            providers: [
                AppService,
                {
                    provide: CryptoUtils,
                    useValue: cryptoUtils,
                },
            ],
        }).compile()

        service = module.get<AppService>(AppService)
    })

    afterEach(() =>
    {
        jest.resetAllMocks()
    })

    describe('getEncrypt', () => {
        it('Encryption flow should be pass', async () =>
        {
            const payload = "test"
            const aesKeyBuffer = Buffer.from("aes_key")
            const privateKey = Buffer.from("pativate_key")
            const encryptedAesKey = "base64"
            const encryptedPayload: EncryptData = {
                iv: "iv_base64",
                authTag: "authTag_base64",
                encrypted: "encrypted_base64",
            }

            cryptoUtils.generateAesKey.mockReturnValue(aesKeyBuffer)
            cryptoUtils.getRSAKey.mockResolvedValue(privateKey)
            cryptoUtils.encryptRSA.mockReturnValue(encryptedAesKey)
            cryptoUtils.encryptAES.mockReturnValue(encryptedPayload)

            const result = await service.getEncrypt(payload)

            expect(cryptoUtils.generateAesKey).toHaveBeenCalledTimes(1)

            expect(cryptoUtils.getRSAKey).toHaveBeenCalledTimes(1)
            expect(cryptoUtils.getRSAKey).toHaveBeenCalledWith("private")

            expect(cryptoUtils.encryptRSA).toHaveBeenCalledTimes(1)
            expect(cryptoUtils.encryptRSA).toHaveBeenCalledWith(aesKeyBuffer, privateKey)
            
            expect(cryptoUtils.encryptAES).toHaveBeenCalledTimes(1)
            expect(cryptoUtils.encryptAES).toHaveBeenCalledWith(payload, aesKeyBuffer)

            /**
             * 
             * Get order of blocking run.
             */
            const genAesKeyOrder = cryptoUtils.generateAesKey.mock.invocationCallOrder[0]
            const getPrivateKeyOrder = cryptoUtils.getRSAKey.mock.invocationCallOrder[0]
            const encryptRSAOrder = cryptoUtils.encryptRSA.mock.invocationCallOrder[0]
            const encryptedPayloadOrder = cryptoUtils.encryptAES.mock.invocationCallOrder[0]

            /**
             * 
             * Check blocking run.
             */
            expect(genAesKeyOrder).toBeLessThan(getPrivateKeyOrder)
            expect(getPrivateKeyOrder).toBeLessThan(encryptRSAOrder)
            expect(encryptRSAOrder).toBeLessThan(encryptedPayloadOrder)
            expect(encryptedPayloadOrder).toBeGreaterThan(genAesKeyOrder)

            expect(result).toBeInstanceOf(GetEncryptDataResponseDataDTO)
            expect(result.data1.length).toBeGreaterThan(0)
            expect(result.data2.length).toBeGreaterThan(0)
            expect(typeof result.data1).toBe("string")
            expect(typeof result.data2).toBe("string")
        })
    })

    describe("getDecrypt", () =>
    {
        it("Descript flow should be pass.", async () =>
        {
            const encryptedPayload: EncryptData = {
                encrypted: Buffer.from("payload").toString("base64"),
                authTag: Buffer.from("auth-tag").toString("base64"),
                iv: Buffer.from("iv").toString("base64"),
            }

            const rawData1 = Buffer.from("aes-key").toString("base64")
            const rawData2 = Buffer.from(JSON.stringify(encryptedPayload)).toString("base64")

            const data1 = Buffer.from(rawData1, "base64")
            
            const publicKey = Buffer.from("public key from get RSA key")
            const aesKey = Buffer.from("aes key from descrypt RSA")
            const encrypted = Buffer.from(encryptedPayload.encrypted, "base64")
            const payload = "test"

            cryptoUtils.getRSAKey.mockResolvedValue(publicKey)
            cryptoUtils.decryptRSA.mockReturnValue(aesKey)
            cryptoUtils.decryptAES.mockReturnValue(payload)

            const result = await service.getDecrypt(rawData1, rawData2)

            expect(cryptoUtils.getRSAKey).toHaveBeenCalledTimes(1)
            expect(cryptoUtils.getRSAKey).toHaveBeenCalledWith("public")

            expect(cryptoUtils.decryptRSA).toHaveBeenCalledTimes(1)
            expect(cryptoUtils.decryptRSA).toHaveBeenCalledWith(data1, publicKey)

            expect(cryptoUtils.decryptAES).toHaveBeenCalledTimes(1)
            expect(cryptoUtils.decryptAES).toHaveBeenCalledWith(encrypted, aesKey, encryptedPayload.iv, encryptedPayload.authTag)

            expect(result).toBeInstanceOf(GetDecryptDataResponseDataDTO)
            expect(typeof result.payload).toBe("string")
        })
    })
})