import { Injectable } from "@nestjs/common";
import { NodeData } from "./type/node-data.type";
import { PrismaService } from "../common/services/prisma.service";
import { RouteData } from "./type/route-data-type";
import { GraphService } from "../common/services/graph.service";

@Injectable()
export class NodeRepository {
  constructor(
    private readonly prisma: PrismaService,
    private readonly graphService: GraphService
  ) {}

  async getNode(nodeId: number): Promise<NodeData | null> {
    const node = await this.prisma.node.findUnique({
      where: { id: nodeId },
      select: {
        id: true,
        name: true,
        latitude: true,
        longitude: true,
        buildingId: true,
      },
    });

    return node;
  }

  async getNodes(): Promise<NodeData[]> {
    const nodes = await this.prisma.node.findMany();
    return nodes;
  }

  async getRoutesWithDistance(
    startNodeId: number,
    endNodeId: number
  ): Promise<RouteData> {
    const edges = this.graphService.getGraphData().edges;

    // 그래프 만들기 위한 adjacent 리스트
    const graph = new Map<
      number,
      Array<{ nodeId: number; distance: number }>
    >();

    edges.forEach((edge) => {
      if (!graph.has(edge.nodeId1)) {
        graph.set(edge.nodeId1, []);
      }
      if (!graph.has(edge.nodeId2)) {
        graph.set(edge.nodeId2, []);
      }

      // 양방향 그래프
      graph.get(edge.nodeId1)!.push({
        nodeId: edge.nodeId2,
        distance: edge.distance,
      });
      graph.get(edge.nodeId2)!.push({
        nodeId: edge.nodeId1,
        distance: edge.distance,
      });
    });

    // 3. 다익스트라 알고리즘
    const distances = new Map<number, number>();
    const previous = new Map<number, number>();
    const unvisited = new Set<number>();

    // 초기화
    graph.forEach((_, nodeId) => {
      distances.set(nodeId, nodeId === startNodeId ? 0 : Infinity);
      unvisited.add(nodeId);
    });

    while (unvisited.size > 0) {
      // 현재 가장 가까운 노드 찾기
      let currentNodeId = Array.from(unvisited).reduce((a, b) =>
        distances.get(a)! < distances.get(b)! ? a : b
      );

      if (currentNodeId === endNodeId) break;

      unvisited.delete(currentNodeId);

      // 인접 노드들의 거리 업데이트
      const neighbors = graph.get(currentNodeId) || [];
      for (const neighbor of neighbors) {
        if (!unvisited.has(neighbor.nodeId)) continue;

        const distance = distances.get(currentNodeId)! + neighbor.distance;
        if (distance < distances.get(neighbor.nodeId)!) {
          distances.set(neighbor.nodeId, distance);
          previous.set(neighbor.nodeId, currentNodeId);
        }
      }
    }

    // 4. 경로 재구성
    const path: number[] = [];
    let currentNodeId = endNodeId;

    while (currentNodeId !== startNodeId) {
      path.unshift(currentNodeId);
      currentNodeId = previous.get(currentNodeId)!;
    }
    path.unshift(startNodeId);

    let totalDistance = 0;
    for (let i = 0; i < path.length - 1; i++) {
      const edge = edges.find(
        (e) =>
          (e.nodeId1 === path[i] && e.nodeId2 === path[i + 1]) ||
          (e.nodeId2 === path[i] && e.nodeId1 === path[i + 1])
      );
      totalDistance += edge!.distance;
    }

    return {
      path: await this.getNodesInPath(path),
      totalDistance,
    };
  }

  private async getNodesInPath(path: number[]): Promise<NodeData[]> {
    // 한 번의 쿼리로 모든 노드 가져오기
    const nodes = await this.prisma.node.findMany({
      where: {
        id: {
          in: path,
        },
      },
    });

    // path 순서대로 노드 정렬
    return path.map((id) => nodes.find((node) => node.id === id)!);
  }

  async getRoutesWithoutRain(
    startNodeId: number,
    endNodeId: number
  ): Promise<RouteData> {
    return {
      path: [],
      totalDistance: 0,
    };
  }
}
