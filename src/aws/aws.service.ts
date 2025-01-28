import { Injectable } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import { S3 } from "aws-sdk";

@Injectable()
export class AwsService {
  constructor(private readonly configService: ConfigService) {}

  async getPresignedUrl(fileName: string) {
    const s3 = new S3({
      accessKeyId: this.configService.get<string>("AWS_ACCESS_KEY_ID"),
      secretAccessKey: this.configService.get<string>("AWS_SECRET_ACCESS_KEY"),
      region: this.configService.get<string>("AWS_REGION"),
      signatureVersion: "v4",
    });

    const bucketName = this.configService.get<string>("AWS_S3_BUCKET_NAME");

    const params = {
      Bucket: bucketName,
      Key: fileName,
      Expires: 60 * 5, // presigned URL 유효기간(초)
      ContentType: "image/jpeg", // 상황에 맞게 ContentType 설정
    };

    try {
      const preSignedUrl = await s3.getSignedUrlPromise("putObject", params);
      // 필요한 정보(예: 파일 이름, presigned url) 등을 반환
      return { preSignedUrl, fileName };
    } catch (error: unknown) {
      console.error(error);
      if (error instanceof Error) {
        throw new Error(`Failed to create presigned URL: ${error.message}`);
      }
      throw new Error("Failed to create presigned URL: Unknown error occurred");
    }
  }
}
