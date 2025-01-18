import { Injectable } from "@nestjs/common";
import { NodeData } from "./type/node-data.type";
import { PrismaService } from "../common/services/prisma.service";
import { RouteData } from "./type/route-data-type";
import { GraphService } from "../common/services/graph.service";
import { RoutePayload } from "./payload/route.payload";
import { EdgeData } from "../edge/type/edge-data.type";
import { kdTree } from "kd-tree-javascript"; // 실제로는 직접 구현하거나 다른 라이브러리를 사용할 수 있습니다
import { MinPriorityQueue } from "@datastructures-js/priority-queue";

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

  private async findNearestNode(
    latitude: number,
    longitude: number
  ): Promise<NodeData> {
    const tree = await this.ensureKDTree();

    // 검색할 포인트 생성
    const searchPoint: NodeData = {
      id: 0, // 검색용 임시 ID
      latitude: latitude,
      longitude: longitude,
      name: "", // 필요한 다른 필드들도 포함
      buildingId: null,
    };

    // nearest 메서드는 [노드, 거리] 쌍의 배열을 반환
    const nearest = this.kdTree!.nearest(searchPoint, 1);
    return nearest[0][0]; // 가장 가까운 노드 반환
  }

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

  async getRoutesWithDistance(routePayload: RoutePayload): Promise<RouteData> {
    const edges = await this.getWeightedDistance(
      routePayload.wantBeam,
      routePayload.wantFreeOfRain
    );
    const startNode = await this.findNearestNode(
      routePayload.startLatitude,
      routePayload.startLongitude
    );
    const endNode = await this.findNearestNode(
      routePayload.endLatitude,
      routePayload.endLongitude
    );

    // 그래프 인접 리스트 구성
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

      graph.get(edge.nodeId1)!.push({
        nodeId: edge.nodeId2,
        distance: edge.distance,
      });
      graph.get(edge.nodeId2)!.push({
        nodeId: edge.nodeId1,
        distance: edge.distance,
      });
    });

    // 다익스트라 알고리즘 초기화
    const distances = new Map<number, number>();
    const previous = new Map<number, number>();
    const visited = new Set<number>();

    graph.forEach((_, nodeId) => {
      distances.set(nodeId, nodeId === startNode.id ? 0 : Infinity);
    });

    // MinPriorityQueue를 사용한 최적화된 다익스트라 알고리즘
    const pq = new MinPriorityQueue<{ nodeId: number; distance: number }>(
      (a) => {
        return a.distance;
      }
    );
    pq.enqueue({ nodeId: startNode.id, distance: 0 });

    while (!pq.isEmpty()) {
      const current = pq.dequeue();
      if (!current) continue;
      const currentNodeId = current.nodeId;

      if (currentNodeId === endNode.id) break;
      if (visited.has(currentNodeId)) continue;

      visited.add(currentNodeId);

      // 인접 노드 처리
      const neighbors = graph.get(currentNodeId) || [];
      for (const neighbor of neighbors) {
        if (visited.has(neighbor.nodeId)) continue;

        const distance = distances.get(currentNodeId)! + neighbor.distance;
        if (distance < distances.get(neighbor.nodeId)!) {
          distances.set(neighbor.nodeId, distance);
          previous.set(neighbor.nodeId, currentNodeId);
          pq.enqueue({ nodeId: neighbor.nodeId, distance });
        }
      }
    }

    // 경로 재구성
    const path: number[] = [];
    let currentNodeId = endNode.id;

    while (currentNodeId !== startNode.id) {
      path.unshift(currentNodeId);
      const previousNodeId = previous.get(currentNodeId);
      if (!previousNodeId) {
        throw new Error("No path exists between start and end nodes");
      }
      currentNodeId = previousNodeId;
    }
    path.unshift(startNode.id);

    // 총 거리 계산
    let totalDistance = 0;
    for (let i = 0; i < path.length - 1; i++) {
      const edge = edges.find(
        (e) =>
          (e.nodeId1 === path[i] && e.nodeId2 === path[i + 1]) ||
          (e.nodeId2 === path[i] && e.nodeId1 === path[i + 1])
      );
      if (!edge) {
        throw new Error(
          `No edge found between nodes ${path[i]} and ${path[i + 1]}`
        );
      }
      totalDistance += edge.distance;
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

  private getWeightedDistance(
    wantBeam: boolean,
    wantFreeOfRain: boolean
  ): EdgeData[] {
    // 원본 데이터 깊은 복사
    const edges = this.graphService.getGraphData().edges.map((edge) => ({
      ...edge,
      distance: edge.distance, // 원본 거리 보존
    }));

    if (wantBeam) {
      edges.forEach((edge) => {
        edge.distance = edge.distance * edge.beamWeight; // 빔 가중치가 작을수록 거리가 증가
      });
    }

    if (wantFreeOfRain) {
      edges.forEach((edge) => {
        if (!edge.isFreeOfRain) {
          edge.distance = edge.distance * 1.5;
        }
      });
    }

    return edges;
  }
}
