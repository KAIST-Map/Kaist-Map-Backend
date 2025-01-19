import { Module } from "@nestjs/common";
import { BuildingRepository } from "./building.repository";
import { CommonModule } from "src/common/common.module";
import { BuildingService } from "./building.service";
import { BuildingController } from "./building.controller";
@Module({
  imports: [CommonModule],
  providers: [BuildingRepository, BuildingService],
  controllers: [BuildingController],
})
export class BuildingModule {}
