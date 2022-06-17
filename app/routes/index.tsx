import { useState } from "react";
import DeckGL from "@deck.gl/react";
import { GeoJsonLayer, ArcLayer } from "@deck.gl/layers";
import globalStyles from "~/styles/global.css";
import { worldMapFeatures } from "~/constants/world";
import roadsJson from "~/constants/roads.json";
import { Container } from "~/components/MapContainer";
// import worldBeta from "~/constants/world-geo.json";
// import { arcLayerData } from "~/constants/arcLayerData";
import { FlyToInterpolator } from "@deck.gl/core";

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
  const layers = [
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
      getFillColor: (args) => {
        // console.log("\n", `args = `, args, "\n");
        return [152, 11, 238, 50];
      },
      onClick: (info) => {
        console.log(`onClick info = `, info, "\n");
        setViewState({
          longitude: info.coordinate?.[0] as number,
          latitude: info.coordinate?.[1] as number,
          zoom: 4,
          transitionDuration: 750,
          transitionInterpolator: new FlyToInterpolator(),
        });
      },
    }),
    new GeoJsonLayer({
      id: "geo-json-road-layer",
      data: roadsJson,
      stroked: true,
      getLineColor: [176, 224, 230],
      lineWidthMinPixels: 2,
    }),
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
          console.log("\n", `e.viewState = `, e.viewState, "\n");
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
          backgroundColor: "powderblue",
        }}
      />
    </Container>
  );
};

export default HomePage;
