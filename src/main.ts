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

  // CORS 설정 구체화
  app.enableCors({
    origin: "*",
    methods: "GET,HEAD,PUT,PATCH,POST,DELETE",
    credentials: true,
  });
  app.use(cookieParser());

  app.useGlobalPipes(
    new ValidationPipe({
      transform: true,
      whitelist: true,
      forbidNonWhitelisted: true,
      stopAtFirstError: true,
    })
  );

  app.useGlobalFilters(new HttpExceptionFilter());

  app.useStaticAssets(join(__dirname, "..", "uploads"), {
    prefix: "/uploads/",
  });

  const config = new DocumentBuilder()
    .setTitle("Eventory Server")
    .setDescription("Eventory API description")
    .setVersion("1.0")
    .addTag("Eventory")
    .addBearerAuth()
    .build();

  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup("docs", app, document);

  const httpAdapter = app.getHttpAdapter().getInstance();
  httpAdapter.get("/", (req, res) => {
    res.redirect("/docs");
  });

  // Cloud Run을 위한 포트 설정

  const port = process.env.PORT || 3000;
  await app.listen(port, "0.0.0.0", () => {
    console.log(`Application is running on port ${port}`);
  });
}
bootstrap();
