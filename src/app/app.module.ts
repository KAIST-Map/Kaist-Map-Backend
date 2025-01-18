import { MiddlewareConsumer, Module, NestModule } from "@nestjs/common";
import { AppController } from "./app.controller";
import { AppService } from "./app.service";
import { configModule } from "./modules/config.module";
import { LoggerMiddleware } from "../common/middlewares/logger.middleware";
import { CommonModule } from "../common/common.module";
import { NodeModule } from "../node/node.module";
import { EdgeModule } from "../edge/edge.module";
import { CategoryModule } from "../category/category.module";
import { BuildingModule } from "../building/building.module";
@Module({
  imports: [
    configModule,
    CommonModule,
    NodeModule,
    EdgeModule,
    CategoryModule,
    BuildingModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    consumer.apply(LoggerMiddleware).forRoutes("*");
  }
}
