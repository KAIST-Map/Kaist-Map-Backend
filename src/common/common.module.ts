import { Global, Module, OnModuleInit } from "@nestjs/common";
import { PrismaService } from "./services/prisma.service";
import { GraphService } from "./services/graph.service";

@Global()
@Module({
  providers: [PrismaService, GraphService],
  exports: [PrismaService, GraphService],
})
export class CommonModule implements OnModuleInit {
  constructor(private readonly graphService: GraphService) {}

  async onModuleInit() {
    await this.graphService.initializeGraph();
  }
}
