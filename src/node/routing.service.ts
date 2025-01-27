// routing.service.ts
import { Injectable } from "@nestjs/common";
import { NodeRepository } from "./node.repository";
import { GraphService } from "../common/services/graph.service";
import { MinPriorityQueue } from "@datastructures-js/priority-queue";
import { EdgeData } from "../edge/type/edge-data.type";
import { RouteData } from "./type/route-data-type";
import { NodeData } from "./type/node-data.type";
import {
  RouteBetweenPointsQuery,
  RouteBetweenBuildingsQuery,
  RoutePointToBuildingQuery,
  RouteBuildingToPointQuery,
} from "./query/route.query";

@Injectable()
export class RoutingService {
  constructor(
    private readonly nodeRepository: NodeRepository,
    private readonly graphService: GraphService
  ) {}

  private createGraph(
    edges: EdgeData[]
  ): Map<number, Array<{ nodeId: number; distance: number }>> {
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

    return graph;
  }

  private async findPath(
    edges: EdgeData[],
    graph: Map<number, Array<{ nodeId: number; distance: number }>>,
    startNodes: Set<number>,
    endNodes: Set<number>
  ): Promise<{
    path: number[];
    weightedTotalDistance: number;
    originalTotalDistance: number;
  }> {
    const distances = new Map<number, number>();
    const previous = new Map<number, number>();
    const visited = new Set<number>();

    // 초기화
    graph.forEach((_, nodeId) => {
      distances.set(nodeId, startNodes.has(nodeId) ? 0 : Infinity);
    });

    const pq = new MinPriorityQueue<{ nodeId: number; distance: number }>(
      (a) => a.distance
    );

    startNodes.forEach((nodeId) => {
      pq.enqueue({ nodeId, distance: 0 });
    });

    let foundEndNode: number | null = null;
    let minDistance = Infinity;

    while (!pq.isEmpty()) {
      const current = pq.dequeue();
      if (!current) continue;
      const currentNodeId = current.nodeId;

      if (visited.has(currentNodeId)) continue;
      visited.add(currentNodeId);

      if (endNodes.has(currentNodeId) && current.distance < minDistance) {
        foundEndNode = currentNodeId;
        minDistance = current.distance;
      }

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
      throw new Error("No path exists between the points");
    }

    // 경로 재구성
    const path: number[] = [];
    let currentNodeId = foundEndNode;

    while (!startNodes.has(currentNodeId)) {
      path.unshift(currentNodeId);
      const previousNodeId = previous.get(currentNodeId);
      if (!previousNodeId) {
        throw new Error("Path reconstruction failed");
      }
      currentNodeId = previousNodeId;
    }
    path.unshift(currentNodeId);

    // weighted distance와 original distance 계산
    let weightedTotalDistance = 0;
    let originalTotalDistance = 0;

    const originalEdges = this.graphService.getGraphData().edges;

    for (let i = 0; i < path.length - 1; i++) {
      const weightedEdge = edges.find(
        (e) =>
          (e.nodeId1 === path[i] && e.nodeId2 === path[i + 1]) ||
          (e.nodeId2 === path[i] && e.nodeId1 === path[i + 1])
      );

      const originalEdge = originalEdges.find(
        (e) =>
          (e.nodeId1 === path[i] && e.nodeId2 === path[i + 1]) ||
          (e.nodeId2 === path[i] && e.nodeId1 === path[i + 1])
      );

      if (!weightedEdge || !originalEdge) {
        throw new Error(
          `No edge found between nodes ${path[i]} and ${path[i + 1]}`
        );
      }

      weightedTotalDistance += weightedEdge.distance;
      originalTotalDistance += originalEdge.distance;
    }

    return { path, originalTotalDistance, weightedTotalDistance };
  }

  private getWeightedDistance(
    wantBeam: boolean,
    wantFreeOfRain: boolean
  ): EdgeData[] {
    const edges = this.graphService.getGraphData().edges.map((edge) => ({
      ...edge,
      distance: edge.distance,
    }));

    if (wantBeam) {
      edges.forEach((edge) => {
        edge.distance = edge.distance * edge.beamWeight;
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

  //그냥 뭐 다 셋으로 취급해도 로직상 다를게 하나도 없음 그냥 프론트에서 구분해주는게 편하다고 해서..

  async getRoutesBetweenPoints(
    routeQuery: RouteBetweenPointsQuery
  ): Promise<RouteData> {
    const edges = this.getWeightedDistance(
      routeQuery.wantBeam,
      routeQuery.wantFreeOfRain
    );
    const startNode = await this.nodeRepository.findNearestNode(
      routeQuery.startLatitude,
      routeQuery.startLongitude
    );
    const endNode = await this.nodeRepository.findNearestNode(
      routeQuery.endLatitude,
      routeQuery.endLongitude
    );

    const graph = this.createGraph(edges);
    const { path, originalTotalDistance, weightedTotalDistance } =
      await this.findPath(
        edges,
        graph,
        new Set([startNode.id]),
        new Set([endNode.id])
      );

    return {
      path: await this.nodeRepository.getNodesInPath(path),
      totalDistance: originalTotalDistance,
      weightedTotalDistance: weightedTotalDistance,
    };
  }

  async getRoutesBetweenBuildings(
    routeQuery: RouteBetweenBuildingsQuery
  ): Promise<RouteData> {
    const edges = this.getWeightedDistance(
      routeQuery.wantBeam,
      routeQuery.wantFreeOfRain
    );
    const startBuildingNodes = await this.nodeRepository.getBuildingNodes(
      routeQuery.startBuildingId
    );
    const endBuildingNodes = await this.nodeRepository.getBuildingNodes(
      routeQuery.endBuildingId
    );

    const graph = this.createGraph(edges);
    const { path, originalTotalDistance, weightedTotalDistance } =
      await this.findPath(
        edges,
        graph,
        new Set(startBuildingNodes.map((node) => node.id)),
        new Set(endBuildingNodes.map((node) => node.id))
      );

    return {
      path: await this.nodeRepository.getNodesInPath(path),
      totalDistance: originalTotalDistance,
      weightedTotalDistance: weightedTotalDistance,
    };
  }

  async getRoutesPointToBuilding(
    routeQuery: RoutePointToBuildingQuery
  ): Promise<RouteData> {
    const edges = this.getWeightedDistance(
      routeQuery.wantBeam,
      routeQuery.wantFreeOfRain
    );
    const startNode = await this.nodeRepository.findNearestNode(
      routeQuery.startLatitude,
      routeQuery.startLongitude
    );
    const endBuildingNodes = await this.nodeRepository.getBuildingNodes(
      routeQuery.endBuildingId
    );

    const graph = this.createGraph(edges);
    const { path, weightedTotalDistance, originalTotalDistance } =
      await this.findPath(
        edges,
        graph,
        new Set([startNode.id]),
        new Set(endBuildingNodes.map((node) => node.id))
      );

    return {
      path: await this.nodeRepository.getNodesInPath(path),
      totalDistance: originalTotalDistance,
      weightedTotalDistance: weightedTotalDistance,
    };
  }

  async getRoutesBuildingToPoint(
    routeQuery: RouteBuildingToPointQuery
  ): Promise<RouteData> {
    const edges = this.getWeightedDistance(
      routeQuery.wantBeam,
      routeQuery.wantFreeOfRain
    );
    const startBuildingNodes = await this.nodeRepository.getBuildingNodes(
      routeQuery.startBuildingId
    );
    const endNode = await this.nodeRepository.findNearestNode(
      routeQuery.endLatitude,
      routeQuery.endLongitude
    );

    const graph = this.createGraph(edges);
    const { path, originalTotalDistance, weightedTotalDistance } =
      await this.findPath(
        edges,
        graph,
        new Set(startBuildingNodes.map((node) => node.id)),
        new Set([endNode.id])
      );

    return {
      path: await this.nodeRepository.getNodesInPath(path),
      totalDistance: originalTotalDistance,
      weightedTotalDistance: weightedTotalDistance,
    };
  }
}
