import { Injectable } from "@nestjs/common";
import { PrismaService } from "../common/services/prisma.service";
import { EdgeData } from "./type/edge-data.type";
import { RouteData } from "./type/edge-data.type";

@Injectable()
export class EdgeRepository {
  constructor(private readonly prisma: PrismaService) {}

  async getEdge(edgeId: number): Promise<EdgeData | null> {
    const edge = await this.prisma.edge.findUnique({
      where: { id: edgeId },
    });
    return edge;
  }

  async getRoutesWithDistance(
    startNodeId: number,
    endNodeId: number
  ): Promise<RouteData> {
    const edges = await this.prisma.edge.findMany({
      include: {
        node1: true,
        node2: true,
      },
    }); //   모든 엣지 정보

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
      path: await this.getEdgesInPath(path),
      totalDistance,
    };
  }

  private async getEdgesInPath(path: number[]): Promise<EdgeData[]> {
    // path의 연속된 두 노드 쌍들의 OR 조건을 한 번에 생성
    const edgePairs = path.slice(0, -1).map((currentNode, index) => ({
      OR: [
        {
          nodeId1: currentNode,
          nodeId2: path[index + 1],
        },
        {
          nodeId1: path[index + 1],
          nodeId2: currentNode,
        },
      ],
    }));

    // 한 번의 쿼리로 모든 엣지를 가져옴
    const edges = await this.prisma.edge.findMany({
      where: {
        OR: edgePairs,
      },
      include: {
        node1: true,
        node2: true,
      },
      orderBy: {
        id: "asc",
      },
    });

    return edges.sort((a, b) => {
      const aIndex = path.findIndex(
        (nodeId) => nodeId === a.nodeId1 || nodeId === a.nodeId2
      );
      const bIndex = path.findIndex(
        (nodeId) => nodeId === b.nodeId1 || nodeId === b.nodeId2
      );
      return aIndex - bIndex;
    });
  }
}
