import { useState } from "react";
import DeckGL from "@deck.gl/react";
import type { RGBAColor } from "@deck.gl/core";
import { FlyToInterpolator } from "@deck.gl/core";
import { GeoJsonLayer, ArcLayer } from "@deck.gl/layers";

import globalStyles from "~/styles/global.css";
import { worldMapFeatures } from "~/constants/worldMapFeatures";
import { Container } from "~/components/MapContainer";
import { jurisdictionsPayload } from "~/constants/jurisdictionsPayload";
import { findCentroid } from "~/utils/findCentroid";
import { faker } from "@faker-js/faker";

import Drawer from "react-modern-drawer";
import drawerStyles from "react-modern-drawer/dist/index.css";

export function links() {
  return [
    { rel: "stylesheet", href: globalStyles },
    { rel: "stylesheet", href: drawerStyles },
  ];
}

type Props = {};

const initialViewState = {
  latitude: 45.164,
  longitude: 14.621,
  zoom: 1.022,
  bearing: 0,
};

const HomePage: React.FC<Props> = (props) => {
  const [isShowPopover, setIsShowPopover] = useState(false);
  const [viewState, setViewState] = useState<any>(() => ({
    ...initialViewState,
  }));
  // console.log("\n", `viewState = `, viewState, "\n");

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
        // if (shouldFill) {
        //   console.log("\n", `args = `, args, "\n");
        //   console.log("\n", `jurisdictions = `, jurisdictions, "\n");
        //   console.log("\n", `shouldFill = `, shouldFill, "\n");
        // }
        return shouldFill ? (shouldFill.color as RGBAColor) : [152, 11, 238, 0];
      },
      onClick: (info: any) => {
        // TODO:BAC - determine if clicked area is a jurisdiction, if so, zoom and show drawer, otherwise do nothing
        console.log(`onClick info = `, info, "\n");
        const centroid = findCentroid(info?.object?.geometry);
        setViewState({
          // longitude: info.coordinate?.[0] as number,
          longitude:
            (centroid?.[0] as number) + 25 || (info.coordinate?.[0] as number),
          // latitude: info.coordinate?.[1] as number,
          latitude: centroid?.[1] || (info.coordinate?.[1] as number),
          zoom: 3,
          transitionDuration: 750,
          transitionInterpolator: new FlyToInterpolator(),
        });
        setIsShowPopover(true);
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
      <Drawer
        open={isShowPopover}
        enableOverlay={false}
        size={700}
        onClose={() => {
          setViewState({
            latitude: 15.623,
            longitude: -11.306,
            zoom: 5,
            pitch: 0,
            bearing: 0,
          });

          setIsShowPopover(false);
        }}
        direction="right"
        className="drawer"
      >
        <div style={{ color: "black" }}>
          <h1>{`${viewState.latitude} ${viewState.longitude}`}</h1>
          <button
            onClick={() => {
              setViewState({
                ...initialViewState,
                transitionDuration: 750,
                transitionInterpolator: new FlyToInterpolator(),
              });
              setIsShowPopover(false);
            }}
          >
            hide
          </button>
        </div>
      </Drawer>

      <DeckGL
        viewState={viewState}
        onViewStateChange={(e: any) => {
          setViewState({
            ...e.viewState,
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
