import { Module } from "@nestjs/common";

import { AuthModule } from "@/server/auth/auth.module";
import { PrinterModule } from "@/server/printer/printer.module";

import { StorageModule } from "../storage/storage.module";
import { ResumeListingController } from "./resume-listing.controller";
import { ResumeListingService } from "./resume-listing.service";

@Module({
  imports: [AuthModule, PrinterModule, StorageModule],
  controllers: [ResumeListingController],
  providers: [ResumeListingService],
  exports: [ResumeListingService],
})
export class ResumeListingModule {}
