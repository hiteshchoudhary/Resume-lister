import { Controller, Get, Query } from "@nestjs/common";
import { ApiQuery, ApiTags } from "@nestjs/swagger";

import { ResumeListingService } from "./resume-listing.service";

@ApiTags("ResumeListing")
@Controller("resume-listing")
export class ResumeListingController {
  constructor(private readonly resumeListingService: ResumeListingService) {}

  @Get()
  @ApiQuery({
    name: "skills",
    type: String,
    required: false,
  })
  @ApiQuery({
    name: "languages",
    type: String,
    required: false,
  })
  findAllPublic(
    @Query("page") page: string,
    @Query("limit") limit: string,
    @Query("featured") featured: boolean,
    @Query("skills") skills?: string,
    @Query("languages") languages?: string,
  ) {
    return this.resumeListingService.findAllPublic(
      parseInt(page),
      parseInt(limit),
      featured,
      skills,
      languages,
    );
  }
}
