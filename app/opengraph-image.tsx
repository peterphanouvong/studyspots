import { ImageResponse } from "next/og";

export const alt = "Study Spots — find a cafe to actually study in";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

const TEAL = "#0A695B";
const INK = "#101828";
const SLATE = "#717171";

export default function OpengraphImage() {
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          background: "#FFFFFF",
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
          padding: "80px",
          fontFamily: "sans-serif",
        }}
      >
        {/* Mark */}
        <div style={{ display: "flex", alignItems: "center" }}>
          <div
            style={{
              width: 72,
              height: 72,
              borderRadius: 18,
              background: TEAL,
              color: "#FFFFFF",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              fontSize: 46,
              fontWeight: 700,
            }}
          >
            S
          </div>
        </div>

        {/* Wordmark + tagline */}
        <div style={{ display: "flex", flexDirection: "column" }}>
          <div style={{ display: "flex", alignItems: "flex-end" }}>
            <span
              style={{
                fontSize: 104,
                fontWeight: 700,
                color: INK,
                letterSpacing: "-0.03em",
                lineHeight: 1,
              }}
            >
              Study Spots
            </span>
            <span
              style={{
                width: 26,
                height: 26,
                borderRadius: "50%",
                background: TEAL,
                marginLeft: 14,
                marginBottom: 10,
              }}
            />
          </div>
          <span
            style={{
              fontSize: 40,
              color: SLATE,
              marginTop: 28,
              maxWidth: 900,
              lineHeight: 1.3,
            }}
          >
            Find a cafe to actually study in — outlets, WiFi, quiet, and the
            house rules, before you go.
          </span>
        </div>

        {/* Footer */}
        <span style={{ fontSize: 30, fontWeight: 600, color: TEAL }}>
          Cabramatta · Canley Heights · SW Sydney
        </span>
      </div>
    ),
    { ...size },
  );
}
