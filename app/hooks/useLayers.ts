import { useMemo } from "react";
import { faker } from "@faker-js/faker";
import type { RGBAColor } from "@deck.gl/core";
import { FlyToInterpolator } from "@deck.gl/core";
import { GeoJsonLayer, ArcLayer } from "@deck.gl/layers";

import { worldMapFeatures } from "~/constants/worldMapFeatures";
import { findCentroid } from "~/utils/findCentroid";
import {
  staticArcLayerData,
  getRandomArcLayerData,
} from "~/constants/arcLayerData";

export const useLayers = ({
  setHoverInfo,
  jurisdictions,
  setViewState,
  setIsShowPopover,
  isShowPopover,
}: any) => {
  // momoized arc layer data
  const memoizedArchLayerData = useMemo(() => {
    return [...staticArcLayerData, ...getRandomArcLayerData(6)];
  }, []);

  const layers: any = [
    new GeoJsonLayer({
      id: "geojson",
      filled: true,
      stroked: true,
      pickable: true,
      data: worldMapFeatures,
      lineWidthMinPixels: 1,
      parameters: {
        depthTest: false,
      },
      onHover: (info: any) => {
        // console.log("\n", `info = `, info, "\n");
        const shouldFill = jurisdictions.find((jurisdiction: any) =>
          jurisdiction.regionCodes.includes(info?.object?.id)
        );
        shouldFill && setHoverInfo(info);
        !shouldFill && setHoverInfo(null);
      },
      getFillColor: (polygon: any) => {
        const shouldFill = jurisdictions.find((jurisdiction: any) =>
          jurisdiction.regionCodes.includes(polygon.id)
        );
        // if (shouldFill) {
        // console.log("\n", `GET_FILL_COLOR polygon = `, polygon, "\n");
        // console.log("\n", `polygon = `, polygon, "\n");
        // console.log("\n", `jurisdictions = `, jurisdictions, "\n");
        // console.log("\n", `shouldFill = `, shouldFill, "\n");
        // }
        return shouldFill ? (shouldFill.color as RGBAColor) : [152, 11, 238, 0];
      },
      onClick: (info: any) => {
        // TODO:BAC - determine if clicked area is a jurisdiction, if so, zoom and show drawer, otherwise do nothing
        const centroid = findCentroid(info?.object?.geometry);
        setViewState({
          // longitude: info.coordinate?.[0] as number,
          longitude:
            (centroid?.[0] as number) + 10 || (info.coordinate?.[0] as number),
          // latitude: info.coordinate?.[1] as number,
          latitude: centroid?.[1] || (info.coordinate?.[1] as number),
          zoom: 3.25,
          transitionDuration: 750,
          transitionInterpolator: new FlyToInterpolator(),
        });
        setIsShowPopover(true);
      },
    }),
    new ArcLayer({
      visible: !isShowPopover,
      id: "arc-layer",
      data: memoizedArchLayerData,
      pickable: true,
      getWidth: 2,
      lineWidthMinPixels: 1,
      getTilt: -35,
      getHeight: 0.75,
      getSourcePosition: (d: any) => d?.from.coordinates,
      getTargetPosition: (d: any) => d?.to.coordinates,
      getSourceColor: (d: any) => [
        faker.datatype.number({ min: 0, max: 255 }),
        faker.datatype.number({ min: 0, max: 255 }),
        faker.datatype.number({ min: 0, max: 255 }),
      ],
      // getSourceColor: (d: any) => [Math.sqrt(d.inbound), 140, 0],
      getTargetColor: (d: any) => [
        faker.datatype.number({ min: 0, max: 255 }),
        faker.datatype.number({ min: 0, max: 255 }),
        faker.datatype.number({ min: 0, max: 255 }),
      ],
      // getTargetColor: (d: any) => [Math.sqrt(d.outbound), 140, 0],
    }),
    // new GeoJsonLayer({
    //   id: "geo-json-road-layer",
    //   data: roadsJson,
    //   stroked: true,
    //   getLineColor: [176, 224, 230],
    //   lineWidthMinPixels: 2,
    // }),
  ];

  return layers;
};
