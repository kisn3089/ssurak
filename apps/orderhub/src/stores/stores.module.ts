import { Module } from "@nestjs/common";
import { PassportModule } from "@nestjs/passport";
import { JwtModule } from "@nestjs/jwt";
import { StoresController } from "./stores/stores.controller";
import { StoresService } from "./stores/stores.service";
import { MenuController } from "./menu/menu.controller";
import { MenuService } from "./menu/menu.service";
import { TableController } from "./table/table.controller";
import { TableService } from "./table/table.service";
import { SessionController } from "./session/session.controller";
import { SessionService } from "./session/session.service";
import { CustomerSessionController } from "./session/customer-session.controller";

@Module({
  imports: [PassportModule, JwtModule],
  controllers: [
    StoresController,
    MenuController,
    TableController,
    SessionController,
    CustomerSessionController,
  ],
  providers: [StoresService, MenuService, TableService, SessionService],
})
export class StoreModule {}
