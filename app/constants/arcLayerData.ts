import * as faker from "@faker-js/faker";

// function to generate random number global lat long coordinates
const getRandomCoordinates = (): [number, number] => {
  return [
    Math.random() * (37.819 - 37.7945) + 37.7945,
    Math.random() * (-122.41356 - -122.47864) + -122.47864,
  ];
};

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

// function to generate arch layer data

const generateArcLayerData = (num: number): ArchLayerArch[] => {
  const data = [];

  for (let i = 0; i < num; i++) {
    data.push({
      inbound: faker.faker.datatype.number({ min: 10000, max: 80000 }),
      outbound: faker.faker.datatype.number({ min: 10000, max: 80000 }),
      from: {
        name: faker.faker.lorem.sentence(),
        coordinates: getRandomCoordinates(),
      },
      to: {
        name: faker.faker.lorem.sentence(),
        coordinates: getRandomCoordinates(),
      },
    });
  }

  return data;
};

export const arcLayerData = generateArcLayerData(5);
