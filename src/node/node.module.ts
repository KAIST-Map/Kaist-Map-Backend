import { Module } from "@nestjs/common";
import { NodeService } from "./node.service";
import { NodeController } from "./node.controller";
import { NodeRepository } from "./node.repository";
import { CommonModule } from "../common/common.module";
import { RoutingService } from "./routind.service";
@Module({
  imports: [CommonModule],
  providers: [NodeService, NodeRepository, RoutingService],
  controllers: [NodeController],
})
export class NodeModule {}
