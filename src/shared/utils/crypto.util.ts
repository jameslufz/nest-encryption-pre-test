import * as crypto from "node:crypto"
import { EncryptData } from "../../dto/base.dto"
import { TKeys } from "../../types/app.type"
import path from "node:path"
import * as fs from "fs/promises"

export class CryptoUtils
{
    encryptAES(plainText: string, secretKey: Buffer): EncryptData
    {
        const iv = crypto.randomBytes(12)
        const cipher = crypto.createCipheriv("aes-256-gcm", secretKey, iv)
        const encrypted = Buffer.concat([
            cipher.update(plainText, "utf8"),
            cipher.final(),
        ])

        const authTag = cipher.getAuthTag()

        return {
            encrypted: encrypted.toString("base64"),
            authTag: authTag.toString("base64"),
            iv: iv.toString("base64"),
        }
    }

    encryptRSA(plainText: Buffer, key: Buffer): string
    {
        const encrypted = crypto.privateEncrypt(
            {
                key,
                padding: crypto.constants.RSA_PKCS1_PADDING,
            },
            plainText
        )

        return encrypted.toString("base64")
    }

    decryptAES(encrypted: Buffer, key: Buffer, iv: string, authTag: string): string
    {
        const decipher = crypto.createDecipheriv(
            "aes-256-gcm",
            key,
            Buffer.from(iv, "base64"),
        )

        decipher.setAuthTag(
            Buffer.from(authTag, "base64")
        )

        const plainTextBuffer = Buffer.concat([
            decipher.update(encrypted),
            decipher.final(),
        ]);

        return plainTextBuffer.toString("utf8")
    }

    decryptRSA(encrypted: Buffer, key: Buffer): Buffer
    {
        const plainTextBuffer = crypto.publicDecrypt(
            {
                key,
                padding: crypto.constants.RSA_PKCS1_PADDING,
            },
            encrypted,
        )

        return plainTextBuffer
    }

    async getRSAKey(type: TKeys): Promise<Buffer>
    {
        const filename = path.join(__dirname, "../../..", "keys/" + (type === "private" ? "private" : "key") + ".pem")
        const key = await fs.readFile(filename)
        return key
    }
    
    generateAesKey(): Buffer
    {
        return crypto.randomBytes(32)
    }
}