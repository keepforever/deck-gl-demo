import { faker } from "@faker-js/faker";

export const useJurisdictions = (jurisdictionsPayload: any) => {
  return jurisdictionsPayload
    .filter((j: any) => j.code !== "default")
    .map((jurisdiction: any) => {
      return {
        ...jurisdiction,
        regionCodes: jurisdiction.regions.map((region: any) => region.code),
        color: [
          faker.datatype.number({ min: 0, max: 255 }),
          faker.datatype.number({ min: 0, max: 255 }),
          faker.datatype.number({ min: 0, max: 255 }),
          100,
        ],
      };
    });
};
