import { Module } from "@nestjs/common";
import { AuthController } from "./auth.controller";
import { PrismaService } from "prisma/prisma.service";
import { AuthService } from "./auth.service";
import { JwtService } from "@nestjs/jwt";

@Module({
  controllers: [AuthController],
  providers: [JwtService,PrismaService, AuthService]
})
export class AuthModule {}