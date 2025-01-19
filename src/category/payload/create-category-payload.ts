import { ApiProperty } from "@nestjs/swagger";
import { IsString } from "class-validator";

export class CreateCategoryPayload {
  @IsString()
  @ApiProperty({
    description: "카테고리 이름",
    example: "카테고리 이름",
    type: String,
  })
  name!: string;
}
