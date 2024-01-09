import { Injectable } from "@nestjs/common";

@Injectable()
export class DemoService {
  async upload(file: string): Promise<void>{
    console.log(file," filesssss........")
  }
}