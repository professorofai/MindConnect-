import { CRISIS_MESSAGE, CRISIS_RESOURCES } from "../lib/crisis";

export default function CrisisBanner() {
  return (
    <div
      style={{
        background: "#FDF2F2",
        border: "1px solid #F8B4B4",
        borderRadius: 12,
        padding: "1.25rem",
        marginBottom: "1.5rem",
        color: "#9B1C1C",
      }}
    >
      <div style={{ display: "flex", alignItems: "center", gap: "8px", marginBottom: "8px" }}>
        <span style={{ fontSize: "1.25rem" }}>🆘</span>
        <h3 style={{ fontSize: "16px", fontWeight: 600, margin: 0, color: "#9B1C1C" }}>
          Immediate Support Available
        </h3>
      </div>
      <p style={{ fontSize: "14px", lineHeight: "1.5", marginBottom: "1rem", color: "#771D1D" }}>
        {CRISIS_MESSAGE}
      </p>
      <div style={{ display: "flex", flexDirection: "column", gap: "8px" }}>
        {CRISIS_RESOURCES.map((res, index) => (
          <div
            key={index}
            style={{
              background: "#FFFFFF",
              border: "1px solid #FDE8E8",
              borderRadius: "8px",
              padding: "10px 12px",
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              flexWrap: "wrap",
              gap: "4px",
            }}
          >
            <div>
              <div style={{ fontWeight: 600, fontSize: "13px", color: "#1F2A37" }}>
                {res.name}
              </div>
              <div style={{ fontSize: "12px", color: "#6B7280" }}>
                {res.region} · {res.available}
              </div>
            </div>
            <div style={{ fontWeight: 600, fontSize: "13px", color: "#E02424" }}>
              {res.contact}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

