import { ApiProperty } from "@nestjs/swagger";
import { IsNotEmpty, IsNumber, IsBoolean } from "class-validator";
import { Transform } from "class-transformer";
import { Type } from "class-transformer";

export class RouteBetweenPointsQuery {
  @IsNotEmpty()
  @IsNumber()
  @Type(() => Number)
  @ApiProperty({
    description: "시작 노드 위도",
    type: Number,
  })
  startLatitude!: number;

  @IsNotEmpty()
  @IsNumber()
  @Type(() => Number)
  @ApiProperty({
    description: "시작 노드 경도",
    type: Number,
  })
  startLongitude!: number;

  @IsNotEmpty()
  @IsNumber()
  @Type(() => Number)
  @ApiProperty({
    description: "도착 노드 위도",
    type: Number,
  })
  endLatitude!: number;

  @IsNotEmpty()
  @IsNumber()
  @Type(() => Number)
  @ApiProperty({
    description: "도착 노드 경도",
    type: Number,
  })
  endLongitude!: number;

  @IsBoolean()
  @Transform(({ value }) => value === "true")
  @ApiProperty({
    description: "비맞지 않는 경로 여부",
    type: Boolean,
  })
  wantFreeOfRain!: boolean;

  @IsBoolean()
  @Transform(({ value }) => value === "true")
  @ApiProperty({
    description: "빔 타는지 여부",
    type: Boolean,
  })
  wantBeam!: boolean;

  @ApiProperty({
    description: "성별",
    enum: Gender,
  })
  gender!: Gender;
}

export class RouteBetweenBuildingsQuery {
  @IsNotEmpty()
  @IsNumber()
  @Type(() => Number)
  @ApiProperty({
    description: "시작 건물 아이디",
    type: Number,
  })
  startBuildingId!: number;

  @IsNotEmpty()
  @IsNumber()
  @Type(() => Number)
  @ApiProperty({
    description: "도착 건물 아이디",
    type: Number,
  })
  endBuildingId!: number;

  @IsBoolean()
  @Transform(({ value }) => value === "true")
  @ApiProperty({
    description: "비맞지 않는 경로 여부",
    type: Boolean,
  })
  wantFreeOfRain!: boolean;

  @IsBoolean()
  @Transform(({ value }) => value === "true")
  @ApiProperty({
    description: "빔 타는지 여부",
    type: Boolean,
  })
  wantBeam!: boolean;

  @ApiProperty({
    description: "성별",
    enum: Gender,
  })
  gender!: Gender;
}

export class RoutePointToBuildingQuery {
  @IsNotEmpty()
  @IsNumber()
  @Type(() => Number)
  @ApiProperty({
    description: "시작 노드 위도",
    type: Number,
  })
  startLatitude!: number;

  @IsNotEmpty()
  @IsNumber()
  @Type(() => Number)
  @ApiProperty({
    description: "시작 노드 경도",
    type: Number,
  })
  startLongitude!: number;

  @IsNotEmpty()
  @IsNumber()
  @Type(() => Number)
  @ApiProperty({
    description: "도착 건물 아이디",
    type: Number,
  })
  endBuildingId!: number;

  @IsBoolean()
  @Transform(({ value }) => value === "true")
  @ApiProperty({
    description: "비맞지 않는 경로 여부",
    type: Boolean,
  })
  wantFreeOfRain!: boolean;

  @IsBoolean()
  @Transform(({ value }) => value === "true")
  @ApiProperty({
    description: "빔 타는지 여부",
    type: Boolean,
  })
  wantBeam!: boolean;

  @ApiProperty({
    description: "성별",
    enum: Gender,
  })
  gender!: Gender;
}

export class RouteBuildingToPointQuery {
  @IsNotEmpty()
  @IsNumber()
  @Type(() => Number)
  @ApiProperty({
    description: "시작 건물 아이디",
    type: Number,
  })
  startBuildingId!: number;

  @IsNotEmpty()
  @IsNumber()
  @Type(() => Number)
  @ApiProperty({
    description: "도착 노드 위도",
    type: Number,
  })
  endLatitude!: number;

  @IsNotEmpty()
  @IsNumber()
  @Type(() => Number)
  @ApiProperty({
    description: "도착 노드 경도",
    type: Number,
  })
  endLongitude!: number;

  @IsBoolean()
  @Transform(({ value }) => value === "true")
  @ApiProperty({
    description: "비맞지 않는 경로 여부",
    type: Boolean,
  })
  wantFreeOfRain!: boolean;

  @IsBoolean()
  @Transform(({ value }) => value === "true")
  @ApiProperty({
    description: "빔 타는지 여부",
    type: Boolean,
  })
  wantBeam!: boolean;

  @ApiProperty({
    description: "성별",
    enum: Gender,
  })
  gender!: Gender;
}
