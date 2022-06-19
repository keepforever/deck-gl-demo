import { faker } from "@faker-js/faker";
import { useMemo } from "react";

export const useJurisdictions = (jurisdictionsPayload: any) => {
  const jurisdictions = jurisdictionsPayload
    .filter((j: any) => j.code !== "default")
    .map((jurisdiction: any) => {
      return {
        ...jurisdiction,
        regionCodes: jurisdiction.regions.map((region: any) => region.code),
        color: [
          faker.datatype.number({ min: 0, max: 255 }),
          faker.datatype.number({ min: 0, max: 255 }),
          faker.datatype.number({ min: 0, max: 255 }),
          faker.datatype.number({ min: 25, max: 130 }),
        ],
      };
    });

  return useMemo(() => jurisdictions, []);
};
