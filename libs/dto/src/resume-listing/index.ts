import { createZodDto } from "nestjs-zod/dto";
import { z } from "nestjs-zod/z";

export const resumeListingFilterSchema = z.object({
  skills: z.array(z.string()).default([]),
  languages: z.array(z.string()).default([]),
  featured: z.boolean().default(false),
  page: z.number().default(1),
  limit: z.number().default(12),
});

export class ResumeListingFilterDto extends createZodDto(resumeListingFilterSchema) {}
