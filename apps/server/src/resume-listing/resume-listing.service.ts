import { Injectable } from "@nestjs/common";
import { Prisma } from "@prisma/client";
import { PrismaService } from "nestjs-prisma";

@Injectable()
export class ResumeListingService {
  constructor(private readonly prisma: PrismaService) {}

  findAllPublic(
    page: number,
    limit: number,
    featured: boolean,
    skills?: string,
    languages?: string,
  ) {
    const skillsArray = skills?.split(",").map((skill) => skill.trim());
    const languagesArray = languages?.split(",").map((language) => language.trim());
    const offset = (page - 1) * limit;
    const transformedSkills = skillsArray
      ?.map(
        (skill) =>
          `LOWER(REPLACE(REPLACE(REPLACE(TRIM(item->>'name'), ' ', ''), '.', ''), '_', '')) ILIKE LOWER(REPLACE(REPLACE(REPLACE(TRIM('${skill}'), ' ', ''), '.', ''), '_', ''))`,
      )
      .join(" OR ");

    const transformedLanguages = languagesArray
      ?.map(
        (language) =>
          `LOWER(REPLACE(REPLACE(REPLACE(TRIM(item->>'name'), ' ', ''), '.', ''), '_', '')) ILIKE LOWER(REPLACE(REPLACE(REPLACE(TRIM('${language}'), ' ', ''), '.', ''), '_', ''))`,
      )
      .join(" OR ");

    const arrayFilters = [
      transformedSkills?.length
        ? `EXISTS (
            SELECT 1
            FROM jsonb_array_elements(data->'sections'->'skills'->'items') AS item
            WHERE ${transformedSkills}
        )`
        : ``,
      transformedLanguages?.length
        ? `EXISTS (
            SELECT 1
            FROM jsonb_array_elements(data->'sections'->'languages'->'items') AS item
            WHERE ${transformedLanguages}
        )`
        : ``,
    ].filter((filter) => filter.length);

    const rawQuery = `
      SELECT *
      FROM "Resume"
      WHERE visibility = 'public' 
      AND featured = ${featured} 
      ${arrayFilters.length ? `AND ${arrayFilters.join(` OR `)}` : ``}
      LIMIT ${limit}
      OFFSET ${offset};
    `;
    console.log(rawQuery);
    return this.prisma.$queryRaw(Prisma.sql([rawQuery]));
  }
}
