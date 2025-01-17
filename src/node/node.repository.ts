import { Injectable } from "@nestjs/common";
import { NodeData } from "./type/node-data.type";
import { PrismaService } from "../common/services/prisma.service";
@Injectable()
export class NodeRepository {
  constructor(private readonly prisma: PrismaService) {}

  async getNode(nodeId: number): Promise<NodeData | null> {
    const node = await this.prisma.node.findUnique({
      where: { id: nodeId },
    });

    return node;
  }
}
