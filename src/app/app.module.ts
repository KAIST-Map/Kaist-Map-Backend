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
import { AwsS3Module } from "src/aws/aws.module";
import { ReportModule } from "../report/report.module";
import { NotificationModule } from "../notification/notification.module";
@Module({
  imports: [
    configModule,
    CommonModule,
    NodeModule,
    EdgeModule,
    CategoryModule,
    BuildingModule,
    AwsS3Module,
    ReportModule,
    NotificationModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    consumer.apply(LoggerMiddleware).forRoutes("*");
  }
}
