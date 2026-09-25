import { ImageResponse } from "next/og";

export const alt = "ClearCut Studio — Free In-Browser AI Background Remover";
export const size = {
  width: 1200,
  height: 630,
};
export const contentType = "image/png";

export default function Image() {
  return new ImageResponse(
    (
      <div
        style={{
          height: "100%",
          width: "100%",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          backgroundColor: "#09090b",
          backgroundImage:
            "radial-gradient(circle at 50% 20%, rgba(37, 99, 235, 0.28) 0%, rgba(9, 9, 11, 1) 75%)",
          fontFamily: "system-ui, -apple-system, sans-serif",
          padding: "60px 80px",
          position: "relative",
        }}
      >
        {/* Top Eyebrow Tag */}
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: "10px",
            padding: "8px 22px",
            borderRadius: "9999px",
            border: "1px solid rgba(59, 130, 246, 0.4)",
            backgroundColor: "rgba(37, 99, 235, 0.15)",
            color: "#60a5fa",
            fontSize: 15,
            fontWeight: 600,
            marginBottom: 32,
            letterSpacing: "0.06em",
            textTransform: "uppercase",
          }}
        >
          <svg
            width="16"
            height="16"
            viewBox="0 0 24 24"
            fill="#60a5fa"
          >
            <path d="M12 2l2.4 7.2L21.6 12l-7.2 2.8L12 22l-2.4-7.2L2.4 12l7.2-2.8L12 2z" />
          </svg>
          <span>100% Client-Side Machine Learning</span>
        </div>

        {/* Brand Logo & Name */}
        <div
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            marginBottom: 20,
          }}
        >
          <div
            style={{
              width: 58,
              height: 58,
              borderRadius: 18,
              background: "linear-gradient(135deg, #2563eb 0%, #06b6d4 100%)",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              marginRight: 20,
              boxShadow: "0 10px 25px rgba(37, 99, 235, 0.45)",
            }}
          >
            <svg
              width="32"
              height="32"
              viewBox="0 0 24 24"
              fill="none"
              stroke="#ffffff"
              strokeWidth="2.2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <circle cx="9" cy="12" r="5" strokeDasharray="3 2" opacity="0.8" />
              <circle cx="15" cy="12" r="5" />
              <line x1="16" y1="8" x2="8" y2="16" stroke="#bae6fd" />
            </svg>
          </div>

          <h1
            style={{
              fontSize: 68,
              fontWeight: 800,
              color: "#ffffff",
              margin: 0,
              letterSpacing: "-0.03em",
              display: "flex",
              alignItems: "baseline",
            }}
          >
            Clear<span style={{ color: "#3b82f6" }}>Cut</span>
            <span
              style={{
                fontSize: 22,
                color: "#94a3b8",
                fontWeight: 600,
                marginLeft: 16,
                letterSpacing: "0.15em",
                textTransform: "uppercase",
              }}
            >
              Studio
            </span>
          </h1>
        </div>

        {/* Catchphrase */}
        <p
          style={{
            fontSize: 28,
            fontWeight: 500,
            color: "#cbd5e1",
            maxWidth: 880,
            textAlign: "center",
            lineHeight: 1.4,
            margin: "0 0 44px 0",
          }}
        >
          Remove backgrounds instantly in your browser with zero server uploads.
          Full-resolution exports, 100% private & free.
        </p>

        {/* Feature Badges with clean SVGs */}
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: "18px",
          }}
        >
          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: "10px",
              padding: "12px 20px",
              borderRadius: "14px",
              backgroundColor: "rgba(255, 255, 255, 0.05)",
              border: "1px solid rgba(255, 255, 255, 0.12)",
              color: "#e2e8f0",
              fontSize: 16,
              fontWeight: 500,
            }}
          >
            <svg
              width="18"
              height="18"
              viewBox="0 0 24 24"
              fill="none"
              stroke="#10b981"
              strokeWidth="2.5"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <polyline points="20 6 9 17 4 12" />
            </svg>
            <span>Zero Remote Uploads</span>
          </div>

          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: "10px",
              padding: "12px 20px",
              borderRadius: "14px",
              backgroundColor: "rgba(255, 255, 255, 0.05)",
              border: "1px solid rgba(255, 255, 255, 0.12)",
              color: "#e2e8f0",
              fontSize: 16,
              fontWeight: 500,
            }}
          >
            <svg
              width="18"
              height="18"
              viewBox="0 0 24 24"
              fill="none"
              stroke="#38bdf8"
              strokeWidth="2.5"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2" />
            </svg>
            <span>ONNX & WASM Powered</span>
          </div>

          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: "10px",
              padding: "12px 20px",
              borderRadius: "14px",
              backgroundColor: "rgba(255, 255, 255, 0.05)",
              border: "1px solid rgba(255, 255, 255, 0.12)",
              color: "#e2e8f0",
              fontSize: 16,
              fontWeight: 500,
            }}
          >
            <svg
              width="18"
              height="18"
              viewBox="0 0 24 24"
              fill="none"
              stroke="#fbbf24"
              strokeWidth="2.2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" />
            </svg>
            <span>Unlimited Free Exports</span>
          </div>
        </div>
      </div>
    ),
    {
      ...size,
    }
  );
}
