import { Module } from "@nestjs/common";
import { NodeService } from "./node.service";
import { NodeController } from "./node.controller";
import { NodeRepository } from "./node.repository";

@Module({
  providers: [NodeService, NodeRepository],
  controllers: [NodeController],
})
export class NodeModule {}
