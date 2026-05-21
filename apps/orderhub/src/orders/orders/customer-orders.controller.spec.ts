import { Test, TestingModule } from "@nestjs/testing";
import { CustomerOrdersController } from "./customer-orders.controller";
import { OrdersService } from "./orders.service";

describe("CustomerOrderController", () => {
  let controller: CustomerOrdersController;
  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [CustomerOrdersController],
      providers: [OrdersService],
    }).compile();

    controller = module.get<CustomerOrdersController>(CustomerOrdersController);
  });

  it("should be defined", () => {
    expect(controller).toBeDefined();
  });
});
