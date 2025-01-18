import { Injectable } from "@nestjs/common";
import { PrismaService } from "../common/services/prisma.service";
import { EdgeData } from "./type/edge-data.type";

@Injectable()
export class EdgeRepository {
  constructor(private readonly prisma: PrismaService) {}

  async getEdge(edgeId: number): Promise<EdgeData | null> {
    const edge = await this.prisma.edge.findUnique({
      where: { id: edgeId },
    });
    return edge;
  }
}
