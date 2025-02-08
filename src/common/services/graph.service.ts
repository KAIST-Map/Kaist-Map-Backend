import { Injectable, OnModuleInit } from "@nestjs/common";
import { PrismaService } from "./prisma.service";
import { EdgeData } from "src/edge/type/edge-data.type";
import { NodeData } from "src/node/type/node-data.type";

@Injectable()
export class GraphService implements OnModuleInit {
  private graphData: {
    edges: EdgeData[];
    nodes: NodeData[];
  } | null = null;

  constructor(private readonly prisma: PrismaService) {}

  async onModuleInit() {
    await this.initializeGraph();
  }

  async initializeGraph() {
    try {
      const [edges, nodes] = await Promise.all([
        this.prisma.edge.findMany({
          select: {
            id: true,
            nodeId1: true,
            nodeId2: true,
            distance: true,
            isFreeOfRain: true,
            beamWeight: true,
            inDormitory: true,
          },
        }),
        this.prisma.node.findMany(),
      ]);

      this.graphData = { edges, nodes };
      return this.graphData;
    } catch (error: unknown) {
      if (error instanceof Error) {
        throw new Error(`Failed to initialize graph data: ${error.message}`);
      }
      throw new Error("Failed to initialize graph data: Unknown error");
    }
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
