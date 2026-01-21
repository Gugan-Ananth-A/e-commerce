import { S3Client } from "@aws-sdk/client-s3";
import { Injectable } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";

@Injectable()
export class S3Service {
  readonly client: S3Client;

  constructor(private readonly configService: ConfigService) {
    const region = this.configService.getOrThrow('AWS_S3_REGION');
    this.client = new S3Client({
      region,
      credentials: {
        accessKeyId: configService.getOrThrow('AWS_ACCESS_KEY_ID'),
        secretAccessKey: configService.getOrThrow('AWS_SECRET_ACCESS_KEY'),
      },
    });
  }
}