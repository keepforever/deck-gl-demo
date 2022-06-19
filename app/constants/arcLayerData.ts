import { faker } from "@faker-js/faker";

export type ArchLayerArch = {
  inbound: number;
  outbound: number;
  from: {
    name: string;
    coordinates: [number, number];
  };
  to: {
    name: string;
    coordinates: [number, number];
  };
};

export const staticArcLayerData = [
  {
    inbound: 22633, // TODO:BAC - could be any property from the jurisdictions payload
    from: {
      name: "19th St. Oakland (19TH)",
      coordinates: [-102.269029, 40.80787],
    },
    to: {
      name: "12th St. Oakland City Center (12TH)",
      coordinates: [-122.271604, 37.803664],
    },
  },
  {
    inbound: 22633,
    from: {
      name: "Sudan",
      coordinates: [32, 15],
    },
    to: {
      name: "CA",
      coordinates: [-120, 36],
    },
  },
  {
    inbound: 22633,
    from: {
      name: "Sudan",
      coordinates: [102, 65],
    },
    to: {
      name: "CA",
      coordinates: [-120, 36],
    },
  },
];

export const getRandomArcLayerData = (num: number): any => {
  const data = [];

  for (let i = 0; i < num; i++) {
    data.push({
      inbound: 22633,
      from: {
        name: "19th St. Oakland (19TH)",
        coordinates: [
          faker.datatype.number({ min: 30, max: 100 }),
          faker.datatype.number({ min: 15, max: 56 }),
        ],
      },
      to: {
        name: "12th St. Oakland City Center (12TH)",
        coordinates: [
          faker.datatype.number({ min: -121, max: -120 }),
          faker.datatype.number({ min: 36, max: 36.75 }),
        ],
      },
    });
  }
  return data;
};
