import { Module } from "@nestjs/common";
import { EdgeService } from "./node.service";
import { EdgeController } from "./node.controller";
import { EdgeRepository } from "./node.repository";

@Module({
  providers: [EdgeService, EdgeRepository],
  controllers: [EdgeController],
})
export class EdgeModule {}
