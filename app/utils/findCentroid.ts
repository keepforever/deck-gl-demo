export const findCentroid = (geometry: any) => {
  let coords: any[] = [];
  const isMultiPolygon = geometry.type === "MultiPolygon";
  const isPolygon = geometry.type === "Polygon";
  // if (geometry.type === "MultiPolygon") {
  if (isMultiPolygon) {
    geometry.coordinates.forEach((polygon: any) => {
      polygon.forEach((coordinate: any) => {
        coordinate.forEach((c: any) => {
          // console.log("\n", `c = `, c, "\n");
          coords.push(c);
        });
      });
    });
  }
  if (isPolygon) {
    geometry.coordinates.forEach((coordinate: any) => {
      coordinate.forEach((c: any) => {
        coords.push(c);
      });
    });
  }

  if (!isMultiPolygon && !isPolygon) {
    console.log("\n", `unhandled geometry `, geometry.type, "\n");
    return [undefined, undefined];
  }

  // console.log("\n", `coords = `, coords, "\n");
  let x = coords.map((xy: any) => xy[0]);
  let y = coords.map((xy: any) => xy[1]);
  let cx = (Math.min(...x) + Math.max(...x)) / 2;
  let cy = (Math.min(...y) + Math.max(...y)) / 2;
  const payload = [cx, cy];
  // console.log("\n", `payload = `, payload, "\n");
  return payload;
};
