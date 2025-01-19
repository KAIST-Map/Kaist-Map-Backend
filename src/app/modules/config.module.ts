import { ConfigModule } from "@nestjs/config";
import * as Joi from "joi";
export const configModule = ConfigModule.forRoot({
  isGlobal: true,
  envFilePath: `.dev.env`,
  ignoreEnvVars: true, // process.env 값을 무시
  validationSchema: Joi.object({
    NODE_ENV: Joi.string().valid("dev"),
  }),
});
