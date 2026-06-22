import { ApiProperty } from "@nestjs/swagger";
import { Expose, Type } from "class-transformer";
import { PublicOrderWithItemsDto } from "./order.dto";

/** 보드 세션 DTO (full 주문 포함) */
export class BoardTableSessionDto {
  @ApiProperty({ description: "세션 고유 ID" })
  @Expose()
  publicId: string;

  @ApiProperty({ description: "세션 만료 시간" })
  @Expose()
  expiresAt: Date;

  @ApiProperty({
    description: "주문 목록",
    type: [PublicOrderWithItemsDto],
  })
  @Expose()
  @Type(() => PublicOrderWithItemsDto)
  orders: PublicOrderWithItemsDto[];
}
