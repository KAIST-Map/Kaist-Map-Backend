// node.repository.ts
import { Injectable } from "@nestjs/common";
import { NodeData } from "./type/node-data.type";
import { PrismaService } from "../common/services/prisma.service";
import { GraphService } from "../common/services/graph.service";
import { BuildingData } from "../building/type/building-data.type";
import { CreateNodeData } from "./type/create-node-data.type";
import { UpdateNodeData } from "./type/update-node-data.type";
import { kdTree } from "kd-tree-javascript";

@Injectable()
export class NodeRepository {
  private kdTree: kdTree<NodeData> | null = null;

  constructor(
    private readonly prisma: PrismaService,
    private readonly graphService: GraphService
  ) {}

  async onModuleInit() {
    await this.initializeKDTree();
  }

  private async ensureKDTree() {
    if (!this.kdTree) {
      await this.initializeKDTree();
    }
    return this.kdTree;
  }

  private async initializeKDTree() {
    try {
      const graphData = await this.graphService.initializeGraph();
      if (!graphData) {
        throw new Error("Graph data is null");
      }
      const nodes = graphData.nodes;

      const distanceFunction = (a: NodeData, b: NodeData) => {
        const dx = a.latitude - b.latitude;
        const dy = a.longitude - b.longitude;
        return Math.sqrt(dx * dx + dy * dy);
      };

      this.kdTree = new kdTree(nodes, distanceFunction, [
        "latitude",
        "longitude",
      ]);
    } catch (error: unknown) {
      throw new Error(
        `Failed to initialize KD-Tree: ${(error as Error).message}`
      );
    }
  }

  async findNearestNode(
    latitude: number,
    longitude: number
  ): Promise<NodeData> {
    const tree = await this.ensureKDTree();
    const searchPoint: NodeData = {
      id: 0,
      latitude: latitude,
      longitude: longitude,
      name: "",
      buildingId: null,
    };
    const nearest = this.kdTree!.nearest(searchPoint, 1);
    return nearest[0][0];
  }

  async createNode(nodeData: CreateNodeData): Promise<NodeData> {
    return await this.prisma.node.create({
      data: {
        name: nodeData.name,
        latitude: nodeData.latitude,
        longitude: nodeData.longitude,
        buildingId: nodeData.buildingId,
      },
      select: {
        id: true,
        name: true,
        latitude: true,
        longitude: true,
        buildingId: true,
      },
    });
  }

  async getNode(nodeId: number): Promise<NodeData | null> {
    return await this.prisma.node.findUnique({
      where: { id: nodeId },
      select: {
        id: true,
        name: true,
        latitude: true,
        longitude: true,
        buildingId: true,
      },
    });
  }

  async getNodes(): Promise<NodeData[]> {
    return await this.prisma.node.findMany({
      orderBy: { id: "asc" },
    });
  }

  async getBuildingNodes(buildingId: number): Promise<NodeData[]> {
    return await this.prisma.node.findMany({
      where: { buildingId: buildingId },
    });
  }

  async getNodesInPath(path: number[]): Promise<NodeData[]> {
    const nodes = await this.prisma.node.findMany({
      where: { id: { in: path } },
    });
    return path.map((id) => nodes.find((node) => node.id === id)!);
  }

  async getBuilding(buildingId: number): Promise<BuildingData | null> {
    return await this.prisma.building.findUnique({
      where: { id: buildingId },
      select: {
        id: true,
        name: true,
        latitude: true,
        longitude: true,
        imageUrls: true,
        importance: true,
        alias: true,
        buildingCategories: true,
      },
    });
  }

  async getLastNode(): Promise<number> {
    const node = await this.prisma.node.findFirst({
      orderBy: { id: "desc" },
    });
    return node?.id ?? 0;
  }

  async updateNode(nodeData: UpdateNodeData): Promise<NodeData> {
    return await this.prisma.node.update({
      where: { id: nodeData.id },
      data: {
        name: nodeData.name,
        latitude: nodeData.latitude,
        longitude: nodeData.longitude,
        buildingId: nodeData.buildingId,
      },
    });
  }
}
