import { Injectable } from "@nestjs/common";
import { NodeDto } from "./dto/node.dto";
import { NodeRepository } from "./node.repository";
import { NodeListDto } from "./dto/node.dto";
import { RouteDto } from "./dto/route.dto";
@Injectable()
export class NodeService {
  constructor(private readonly nodeRepository: NodeRepository) {}

  async getNode(nodeId: number): Promise<NodeDto> {
    const node = await this.nodeRepository.getNode(nodeId);
    if (!node) {
      throw new Error("Node not found");
    }
    return NodeDto.from(node);
  }

  async getNodes(): Promise<NodeListDto> {
    const nodes = await this.nodeRepository.getNodes();
    return NodeListDto.from(nodes);
  }

  async getRoutesWithDistance(
    startNodeId: number,
    endNodeId: number
  ): Promise<RouteDto> {
    return this.nodeRepository.getRoutesWithDistance(startNodeId, endNodeId);
  }

  async getRoutesWithoutRain(
    startNodeId: number,
    endNodeId: number
  ): Promise<RouteDto> {
    return this.nodeRepository.getRoutesWithoutRain(startNodeId, endNodeId);
  }
}
