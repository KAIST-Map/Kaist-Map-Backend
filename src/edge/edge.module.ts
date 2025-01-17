import { Module } from "@nestjs/common";
import { EdgeService } from "./edge.service";
import { EdgeController } from "./edge.controller";
import { EdgeRepository } from "./edge.repository";

@Module({
  providers: [EdgeService, EdgeRepository],
  controllers: [EdgeController],
})
export class EdgeModule {}
