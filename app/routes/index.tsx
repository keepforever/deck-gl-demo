import { useState } from "react";
import DeckGL from "@deck.gl/react";
import type { RGBAColor } from "@deck.gl/core";
import { FlyToInterpolator } from "@deck.gl/core";
import { GeoJsonLayer, ArcLayer } from "@deck.gl/layers";

import globalStyles from "~/styles/global.css";
import { worldMapFeatures } from "~/constants/worldMapFeatures";
import roadsJson from "~/constants/roads.json";
import { Container } from "~/components/MapContainer";
import { jurisdictionsPayload } from "~/constants/jurisdictionsPayload";
import { transformedWorldMapFeatures } from "~/constants/transformedWorldMapFeatures";
import { faker } from "@faker-js/faker";

export function links() {
  return [{ rel: "stylesheet", href: globalStyles }];
}

type Props = {};

const HomePage: React.FC<Props> = (props) => {
  const [viewState, setViewState] = useState<any>(() => ({
    latitude: 15.623,
    longitude: -11.306,
    zoom: 1.25,
    bearing: 0,
    // transitionDuration: 8000,
    // transitionInterpolator: new FlyToInterpolator(),
  }));

  const jurisdictions = jurisdictionsPayload
    .filter((j) => j.code !== "default")
    .map((jurisdiction) => {
      return {
        ...jurisdiction,
        regionCodes: jurisdiction.regions.map((region) => region.code),
        color: [
          faker.datatype.number({ min: 0, max: 255 }),
          faker.datatype.number({ min: 0, max: 255 }),
          faker.datatype.number({ min: 0, max: 255 }),
          100,
        ],
      };
    });

  const layers: any = [
    new GeoJsonLayer({
      id: "geojson",
      data: worldMapFeatures,
      stroked: true,
      filled: true,
      lineWidthMinPixels: 1,
      pickable: true,
      parameters: {
        depthTest: false,
      },
      getFillColor: (args: any) => {
        const shouldFill = jurisdictions.find((jurisdiction) =>
          jurisdiction.regionCodes.includes(args.id)
        );

        if (shouldFill) {
          console.log("\n", `args = `, args, "\n");
          console.log("\n", `jurisdictions = `, jurisdictions, "\n");
          console.log("\n", `shouldFill = `, shouldFill, "\n");
        }

        return shouldFill ? (shouldFill.color as RGBAColor) : [152, 11, 238, 0];
      },
      onClick: (info: any) => {
        console.log(`onClick info = `, info, "\n");
        const centroid = findCentroid(info?.object?.geometry?.coordinates);
        console.log(`centroid = `, centroid, "\n");
        setViewState({
          longitude: info.coordinate?.[0] as number,
          latitude: info.coordinate?.[1] as number,
          zoom: 3,
          transitionDuration: 750,
          transitionInterpolator: new FlyToInterpolator(),
        });
      },
    }),
    // new GeoJsonLayer({
    //   id: "geo-json-road-layer",
    //   data: roadsJson,
    //   stroked: true,
    //   getLineColor: [176, 224, 230],
    //   lineWidthMinPixels: 2,
    // }),
    new ArcLayer({
      id: "arc-layer",
      data: [
        {
          inbound: 22633,
          outbound: 74735,
          from: {
            name: "19th St. Oakland (19TH)",
            coordinates: [-102.269029, 40.80787],
          },
          to: {
            name: "12th St. Oakland City Center (12TH)",
            coordinates: [-122.271604, 37.803664],
          },
        },
      ],
      pickable: true,
      getWidth: 2,
      lineWidthMinPixels: 1,
      getTilt: -35,
      getHeight: 1,
      getSourcePosition: (d: any) => d?.from.coordinates,
      getTargetPosition: (d: any) => d?.to.coordinates,
      getSourceColor: (d: any) => [237, 40, 40],
      // getSourceColor: (d: any) => [Math.sqrt(d.inbound), 140, 0],
      getTargetColor: (d: any) => [237, 40, 40],
      // getTargetColor: (d: any) => [Math.sqrt(d.outbound), 140, 0],
    }),
  ];
  return (
    <Container>
      <DeckGL
        initialViewState={{
          latitude: 15.623,
          longitude: -11.306,
          zoom: 5,
          pitch: 0,
          bearing: 0,
        }}
        viewState={viewState}
        onViewStateChange={(e: any) => {
          // console.log("\n", `e.viewState = `, e.viewState, "\n");
          setViewState({
            ...e.viewState,
            // transitionDuration: 750,
            // transitionInterpolator: new FlyToInterpolator(),
          });
        }}
        controller={true}
        layers={layers}
        style={{
          flex: 1,
          position: "relative",
          height: "100%",
          width: "100%",
          border: "5px solid red",
          // backgroundColor: "powderblue",
        }}
      />
    </Container>
  );
};

export default HomePage;
const findCentroid = (arr: any) => {
  let x = arr.map((xy: any) => xy[0]);
  let y = arr.map((xy: any) => xy[1]);
  let cx = (Math.min(...x) + Math.max(...x)) / 2;
  let cy = (Math.min(...y) + Math.max(...y)) / 2;
  return [cx, cy];
};
