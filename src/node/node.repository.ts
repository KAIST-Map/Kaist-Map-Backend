import { Injectable } from "@nestjs/common";
import { NodeData } from "./type/node-data.type";
import { PrismaService } from "../common/services/prisma.service";
import { RouteData } from "./type/route-data-type";
import { GraphService } from "../common/services/graph.service";
import { RouteBetweenPointsQuery } from "./query/route.query";
import { RouteBetweenBuildingsQuery } from "./query/route.query";
import { EdgeData } from "../edge/type/edge-data.type";
import { kdTree } from "kd-tree-javascript"; // 실제로는 직접 구현하거나 다른 라이브러리를 사용할 수 있습니다
import { MinPriorityQueue } from "@datastructures-js/priority-queue";
import { RoutePointToBuildingQuery } from "./query/route.query";
import { RouteBuildingToPointQuery } from "./query/route.query";
import { CreateNodePayload } from "./payload/create-node.payload";
import { CreateNodeData } from "./type/create-node-data.type";
import { BuildingData } from "../building/type/building-data.type";
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

  async createNode(nodeData: CreateNodeData): Promise<NodeData> {
    const node = await this.prisma.node.create({
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
    return node;
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

  async getRoutesBetweenPoints(
    routePayload: RouteBetweenPointsQuery
  ): Promise<RouteData> {
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

  async getRoutesBetweenBuildings(
    routePayload: RouteBetweenBuildingsQuery
  ): Promise<RouteData> {
    const edges = await this.getWeightedDistance(
      routePayload.wantBeam,
      routePayload.wantFreeOfRain
    );
    const startBuildingNodes = await this.getBuildingNodes(
      routePayload.startBuildingId
    );
    const endBuildingNodes = await this.getBuildingNodes(
      routePayload.endBuildingId
    );

    // 시작, 도착 건물 노드들을 둘다 집합으로 받아 멀티 타겟 다익스트라
    const startNodeIds = new Set(startBuildingNodes.map((node) => node.id));
    const endNodeIds = new Set(endBuildingNodes.map((node) => node.id));

    //그에 맞게 point to point 와 비슷하게 구성
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

    // 모든 시작점의 거리를 0으로 초기화
    graph.forEach((_, nodeId) => {
      distances.set(nodeId, startNodeIds.has(nodeId) ? 0 : Infinity);
    });

    const pq = new MinPriorityQueue<{ nodeId: number; distance: number }>(
      (a) => a.distance
    );

    // 모든 시작점을 우선순위 큐에 추가
    startBuildingNodes.forEach((node) => {
      pq.enqueue({ nodeId: node.id, distance: 0 });
    });

    let foundEndNode: number | null = null;
    let minDistance = Infinity;

    while (!pq.isEmpty()) {
      const current = pq.dequeue();
      if (!current) continue;
      const currentNodeId = current.nodeId;

      if (visited.has(currentNodeId)) continue;
      visited.add(currentNodeId);

      // 현재 노드가 도착점 중 하나이고 지금까지 찾은 것보다 더 가까우면 업데이트
      if (endNodeIds.has(currentNodeId) && current.distance < minDistance) {
        foundEndNode = currentNodeId;
        minDistance = current.distance;
        // 여기서 break하지 않고 계속 진행하여 더 나은 경로가 있는지 확인
      }

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

    if (!foundEndNode) {
      throw new Error("No path exists between the buildings");
    }

    // 경로 재구성
    const path: number[] = [];
    let currentNodeId = foundEndNode;

    while (!startNodeIds.has(currentNodeId)) {
      path.unshift(currentNodeId);
      const previousNodeId = previous.get(currentNodeId);
      if (!previousNodeId) {
        throw new Error("Path reconstruction failed");
      }
      currentNodeId = previousNodeId;
    }
    path.unshift(currentNodeId);

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

  async getRoutesPointToBuilding(
    routePayload: RoutePointToBuildingQuery
  ): Promise<RouteData> {
    const edges = await this.getWeightedDistance(
      routePayload.wantBeam,
      routePayload.wantFreeOfRain
    );
    const startNode = await this.findNearestNode(
      routePayload.startLatitude,
      routePayload.startLongitude
    );
    const endBuildingNodes = await this.getBuildingNodes(
      routePayload.endBuildingId
    );

    const endNodeIds = new Set(endBuildingNodes.map((node) => node.id));

    //그에 맞게 point to point 와 비슷하게 구성
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

    // 모든 시작점의 거리를 0으로 초기화
    graph.forEach((_, nodeId) => {
      distances.set(nodeId, nodeId === startNode.id ? 0 : Infinity);
    });

    const pq = new MinPriorityQueue<{ nodeId: number; distance: number }>(
      (a) => a.distance
    );

    // 모든 시작점을 우선순위 큐에 추가
    pq.enqueue({ nodeId: startNode.id, distance: 0 });

    let foundEndNode: number | null = null;
    let minDistance = Infinity;

    while (!pq.isEmpty()) {
      const current = pq.dequeue();
      if (!current) continue;
      const currentNodeId = current.nodeId;

      if (visited.has(currentNodeId)) continue;
      visited.add(currentNodeId);

      // 현재 노드가 도착점 중 하나이고 지금까지 찾은 것보다 더 가까우면 업데이트
      if (endNodeIds.has(currentNodeId) && current.distance < minDistance) {
        foundEndNode = currentNodeId;
        minDistance = current.distance;
        // 여기서 break하지 않고 계속 진행하여 더 나은 경로가 있는지 확인
      }

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

    if (!foundEndNode) {
      throw new Error("No path exists between the buildings");
    }

    // 경로 재구성
    const path: number[] = [];
    let currentNodeId = foundEndNode;

    while (currentNodeId !== startNode.id) {
      path.unshift(currentNodeId);
      const previousNodeId = previous.get(currentNodeId);
      if (!previousNodeId) {
        throw new Error("Path reconstruction failed");
      }
      currentNodeId = previousNodeId;
    }
    path.unshift(currentNodeId);

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

  async getRoutesBuildingToPoint(
    routePayload: RouteBuildingToPointQuery
  ): Promise<RouteData> {
    const edges = await this.getWeightedDistance(
      routePayload.wantBeam,
      routePayload.wantFreeOfRain
    );
    const startBuildingNodes = await this.getBuildingNodes(
      routePayload.startBuildingId
    );
    const endNode = await this.findNearestNode(
      routePayload.endLatitude,
      routePayload.endLongitude
    );

    const startNodeIds = new Set(startBuildingNodes.map((node) => node.id));

    //그에 맞게 point to point 와 비슷하게 구성
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

    // 모든 시작점의 거리를 0으로 초기화
    graph.forEach((_, nodeId) => {
      distances.set(nodeId, startNodeIds.has(nodeId) ? 0 : Infinity);
    });

    const pq = new MinPriorityQueue<{ nodeId: number; distance: number }>(
      (a) => a.distance
    );

    // 모든 시작점을 우선순위 큐에 추가
    startBuildingNodes.forEach((node) => {
      pq.enqueue({ nodeId: node.id, distance: 0 });
    });

    while (!pq.isEmpty()) {
      const current = pq.dequeue();
      if (!current) continue;
      const currentNodeId = current.nodeId;

      if (visited.has(currentNodeId)) continue;
      visited.add(currentNodeId);

      if (currentNodeId === endNode.id) break;

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

    while (!startNodeIds.has(currentNodeId)) {
      path.unshift(currentNodeId);
      const previousNodeId = previous.get(currentNodeId);
      if (!previousNodeId) {
        throw new Error("Path reconstruction failed");
      }
      currentNodeId = previousNodeId;
    }
    path.unshift(currentNodeId);

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

  private async getBuildingNodes(buildingId: number): Promise<NodeData[]> {
    const nodes = await this.prisma.node.findMany({
      where: {
        buildingId: buildingId,
      },
    });
    return nodes;
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
  async getBuilding(buildingId: number): Promise<BuildingData | null> {
    const building = await this.prisma.building.findUnique({
      where: {
        id: buildingId,
      },
      select: {
        id: true,
        name: true,
        latitude: true,
        longitude: true,
        imageUrl: true,
        importance: true,
        alias: true,
        buildingCategories: true,
      },
    });
    return building;
  }
}
