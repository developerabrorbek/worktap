import { Module } from "@nestjs/common";
import { DemoController } from "./user.controller";
import { DemoService } from "./user.service";

@Module({
  controllers: [DemoController],
  providers: [DemoService]
})
export class DemoModule {}