import { NestFactory } from "@nestjs/core";
import { AppModule } from "./app/app.module";
import { ValidationPipe } from "@nestjs/common";
import { DocumentBuilder, SwaggerModule } from "@nestjs/swagger";
import { HttpExceptionFilter } from "./common/filter/exception.filter";
import { NestExpressApplication } from "@nestjs/platform-express";
import { join } from "path";
import * as cookieParser from "cookie-parser";

async function bootstrap() {
  const app = await NestFactory.create<NestExpressApplication>(AppModule);

  // CORS 설정 - AWS ElasticBeanstalk/ECS 환경 고려
  app.enableCors({
    origin: [
      "http://localhost:8000",
      "http://jtkim-loadbalancer-827728116.ap-northeast-2.elb.amazonaws.com",
    ],
    methods: ["GET", "HEAD", "PUT", "PATCH", "POST", "DELETE", "OPTIONS"],
    credentials: true,
  });
  app.use(cookieParser());

  // Global Pipes
  app.useGlobalPipes(
    new ValidationPipe({
      transform: true,
      whitelist: true,
      forbidNonWhitelisted: true,
      stopAtFirstError: true,
    })
  );

  // Exception Filter
  app.useGlobalFilters(new HttpExceptionFilter());

  // Static Files - S3로 마이그레이션 고려
  app.useStaticAssets(join(__dirname, "..", "uploads"), {
    prefix: "/uploads/",
  });

  // Swagger 설정
  const config = new DocumentBuilder()
    .setTitle("Kaistmap Server")
    .setDescription("Kaistmap API description")
    .setVersion("1.0")
    .addTag("Kaistmap")
    .addBearerAuth()
    .build();

  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup("docs", app, document);

  // Root 경로 리다이렉트
  const httpAdapter = app.getHttpAdapter().getInstance();
  httpAdapter.get("/", (req, res) => {
    res.redirect("/docs");
  });

  // 헬스체크 엔드포인트 추가
  httpAdapter.get("/health", (req, res) => {
    res.send({ status: "ok" });
  });

  // AWS ECS/EKS를 위한 포트 설정
  const port = process.env.PORT || 3000;
  await app.listen(port, "0.0.0.0", () => {
    console.log(`Application is running on port ${port}`);
    console.log(`Swagger documentation available at /docs`);
  });
}
bootstrap();
