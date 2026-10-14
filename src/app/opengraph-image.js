import { ImageResponse } from "next/og";
export const alt =
  "Abdullah Al Tamim — Order from complexity. Data automation and operational intelligence.";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";
export default function OpenGraphImage() {
  return new ImageResponse(
    <div
      style={{
        width: "100%",
        height: "100%",
        display: "flex",
        flexDirection: "column",
        background: "#f0f1ed",
        color: "#202522",
        padding: "55px 65px",
        fontFamily: "sans-serif",
      }}
    >
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          fontSize: 17,
          letterSpacing: 2,
        }}
      >
        <span>ABDULLAH AL TAMIM</span>
        <span>DATA AUTOMATION / SYSTEMS</span>
      </div>
      <div
        style={{
          display: "flex",
          flexDirection: "column",
          fontSize: 110,
          lineHeight: 1.03,
          letterSpacing: -6,
          marginTop: 80,
        }}
      >
        <span>Order from</span>
        <span style={{ marginLeft: 170 }}>complexity.</span>
      </div>
      <div
        style={{
          display: "flex",
          marginTop: 45,
          borderTop: "1px solid #aab2a6",
          paddingTop: 28,
          alignItems: "center",
          justifyContent: "space-between",
        }}
      >
        <span style={{ fontSize: 20 }}>
          Engineering that moves work forward.
        </span>
        <div style={{ display: "flex", gap: 8 }}>
          {Array.from({ length: 14 }, (_, i) => (
            <div
              key={i}
              style={{
                height: 8,
                width: 20,
                background: i % 4 === 0 ? "#c63920" : "#202522",
                transform: `translateY(${i < 7 ? ((i % 3) - 1) * 13 : 0}px)`,
              }}
            />
          ))}
        </div>
      </div>
    </div>,
    size,
  );
}
