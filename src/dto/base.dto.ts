export class BaseResponseDTO<T = null>
{
    successful: boolean = true
    error_code: string = ""
    data: T
}

export class EncryptData
{
    encrypted: string
    authTag?: string
    iv?: string
}