// County → brand color for the ServiceMap SVG + the Service Area legend.
// Plain module (no "use client") so both the client map and the server page
// can import it without crossing the RSC boundary.
export const coverageCounties = [
  { name: "Harris County", color: "#5a8bb8" }, // care-blue — Katy/west Houston
  { name: "Fort Bend County", color: "#0f2b47" }, // navy
] as const;
