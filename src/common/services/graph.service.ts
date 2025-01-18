import { Injectable } from "@nestjs/common";
import { PrismaService } from "./prisma.service";
import { EdgeData } from "src/edge/type/edge-data.type";
import { NodeData } from "src/node/type/node-data.type";

@Injectable()
export class GraphService {
  private graphData: {
    edges: EdgeData[];
    nodes: NodeData[];
  } | null = null;

  constructor(private readonly prisma: PrismaService) {}

  async initializeGraph() {
    if (!this.graphData) {
      const [edges, nodes] = await Promise.all([
        this.prisma.edge.findMany({
          select: {
            nodeId1: true,
            nodeId2: true,
            distance: true,
            isFreeOfRain: true,
            beamWeight: true,
          },
        }),
        this.prisma.node.findMany(),
      ]);

      this.graphData = { edges, nodes };
    }
    return this.graphData;
  }

  getGraphData() {
    if (!this.graphData) {
      throw new Error("Graph not initialized");
    }
    return this.graphData;
  }

  async updateGraphData() {
    await this.initializeGraph();
  }
}
