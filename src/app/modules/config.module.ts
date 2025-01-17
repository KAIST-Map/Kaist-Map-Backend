import { ConfigModule } from "@nestjs/config";
import * as Joi from "joi";
export const configModule = ConfigModule.forRoot({
  isGlobal: true,
  envFilePath: `.env`,
  validationSchema: Joi.object({
    NODE_ENV: Joi.string().valid("dev"),
  }),
});
