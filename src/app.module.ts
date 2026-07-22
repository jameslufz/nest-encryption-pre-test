import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { BaseExceptionFilter } from './filters/exception.filter';
import { APP_FILTER } from '@nestjs/core';
import { RedisModule } from '@nestjs-modules/ioredis';
import { CryptoUtils } from './shared/utils/crypto.util';

@Module({
    imports: [
        RedisModule.forRoot({
            type: "single",
            url: "redis://localhost:6379"
        })
    ],
    controllers: [AppController],
    providers: [
        AppService,
        CryptoUtils,
        { 
            provide: APP_FILTER,
            useClass: BaseExceptionFilter
        },
    ],
})
export class AppModule {}
