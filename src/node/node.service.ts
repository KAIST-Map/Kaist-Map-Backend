import { Injectable } from "@nestjs/common";
import { NodeDto } from "./dto/node.dto";
import { NodeRepository } from "./node.repository";
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
}
