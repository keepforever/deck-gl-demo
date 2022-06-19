import { useState } from "react";
import DeckGL from "@deck.gl/react";
import { FlyToInterpolator } from "@deck.gl/core";

import globalStyles from "~/styles/global.css";
import { useLayers } from "~/hooks/useLayers";
import { Container } from "~/components/MapContainer";
import { jurisdictionsPayload } from "~/constants/jurisdictionsPayload";

import Drawer from "react-modern-drawer";
import drawerStyles from "react-modern-drawer/dist/index.css";
import { useJurisdictions } from "~/hooks/useJurisdictions";

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
  const [hoverInfo, setHoverInfo] = useState<any>(null);
  const [isShowPopover, setIsShowPopover] = useState(false);
  const [viewState, setViewState] = useState<any>(() => ({
    ...initialViewState,
  }));

  const jurisdictions = useJurisdictions(jurisdictionsPayload);

  const layers = useLayers({
    setHoverInfo,
    jurisdictions,
    setViewState,
    setIsShowPopover,
    isShowPopover,
  });

  return (
    <Container>
      <Drawer
        open={isShowPopover}
        enableOverlay={false}
        size={600}
        direction="right"
        className="drawer"
      >
        <div style={{ color: "black", padding: 32 }}>
          <button
            style={{
              color: "white",
              backgroundColor: "black",
              padding: "8px 12px",
              fontSize: 20,
              marginRight: 40,
              border: "3px solid red",
            }}
            onClick={() => {
              setViewState({
                ...initialViewState,
                transitionDuration: 750,
                transitionInterpolator: new FlyToInterpolator(),
              });
              setIsShowPopover(false);
            }}
          >
            HIDE
          </button>
          <code style={{ fontSize: 40 }}>viewState</code>
          <pre style={{ fontSize: 20 }}>
            {JSON.stringify(viewState, null, 2) || "nothing to preview"}
          </pre>
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
        }}
      >
        {/* Tooltip */}
        {hoverInfo?.object && (
          <div
            style={{
              background: "blue",
              color: "white",
              padding: "0.25em 0.5em",
              borderRadius: 50,
              fontSize: "0.8em",
              position: "absolute",
              zIndex: 1,
              pointerEvents: "none",
              left: hoverInfo.x,
              top: hoverInfo.y,
            }}
          >
            {hoverInfo?.object?.properties?.name}
          </div>
        )}
      </DeckGL>
    </Container>
  );
};

export default HomePage;
