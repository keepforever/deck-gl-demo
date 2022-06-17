import { useState } from "react";

export const Container: any = ({ children }: any) => {
  const [tempFlex, setTempFlex] = useState<number>(0.25);

  return (
    <div
      style={{
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        height: "100vh",
      }}
    >
      <div
        style={{
          display: "flex",
          flexDirection: "column",
          flex: tempFlex,
          outline: "1px solid black",
        }}
      >
        <button
          className="button"
          onClick={() => setTempFlex((t) => t + 0.25)}
          style={{ marginBottom: 15, color: "black" }}
        >
          INCREASE
        </button>
        <button
          className="button"
          onClick={() => setTempFlex((t) => t - 0.25)}
          style={{ color: "black" }}
        >
          DECREASE
        </button>
      </div>
      {children}
    </div>
  );
};
