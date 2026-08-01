/**
 * Stylized service-radius map (PRD §7.2): dark panel, pins placed from
 * real coordinates via a simple equirectangular projection, and the
 * 2-hour radius ring centered on Hattiesburg. Illustrative, not
 * navigational: links live in the city list beside it.
 */

interface MapCity {
  name: string;
  lat: number;
  lon: number;
  hub?: boolean;
}

const CITIES: MapCity[] = [
  { name: "Hattiesburg", lat: 31.33, lon: -89.29, hub: true },
  { name: "Petal", lat: 31.35, lon: -89.22, hub: true },
  { name: "Laurel", lat: 31.69, lon: -89.13, hub: true },
  { name: "Gulfport", lat: 30.37, lon: -89.09, hub: true },
  { name: "Biloxi", lat: 30.4, lon: -88.89, hub: true },
  { name: "Picayune", lat: 30.53, lon: -89.68, hub: true },
  { name: "Brookhaven", lat: 31.58, lon: -90.44, hub: true },
  { name: "McComb", lat: 31.24, lon: -90.45, hub: true },
  { name: "Jackson", lat: 32.3, lon: -90.18, hub: true },
  { name: "Meridian", lat: 32.36, lon: -88.7, hub: true },
  { name: "Purvis", lat: 31.14, lon: -89.41 },
  { name: "Sumrall", lat: 31.42, lon: -89.54 },
  { name: "Seminary", lat: 31.56, lon: -89.5 },
  { name: "Collins", lat: 31.65, lon: -89.56 },
  { name: "Ellisville", lat: 31.6, lon: -89.2 },
  { name: "Richton", lat: 31.35, lon: -88.94 },
  { name: "Columbia", lat: 31.25, lon: -89.84 },
  { name: "Poplarville", lat: 30.84, lon: -89.53 },
  { name: "Wiggins", lat: 30.86, lon: -89.14 },
  { name: "Lucedale", lat: 30.92, lon: -88.59 },
  { name: "Kiln", lat: 30.41, lon: -89.44 },
  { name: "McHenry", lat: 30.71, lon: -89.14 },
  { name: "Saucier", lat: 30.63, lon: -89.13 },
  { name: "Diamondhead", lat: 30.39, lon: -89.36 },
  { name: "Bay St. Louis", lat: 30.31, lon: -89.33 },
  { name: "Pass Christian", lat: 30.32, lon: -89.25 },
  { name: "Long Beach", lat: 30.35, lon: -89.15 },
  { name: "D'Iberville", lat: 30.43, lon: -88.89 },
  { name: "Ocean Springs", lat: 30.41, lon: -88.83 },
  { name: "Moss Point", lat: 30.41, lon: -88.53 },
  { name: "Pascagoula", lat: 30.37, lon: -88.56 },
];

const HOME = CITIES[0];
const LON_MIN = -90.8;
const LON_MAX = -88.2;
const LAT_MIN = 30.05;
const LAT_MAX = 32.6;
const W = 640;
const H = 560;

function project(lat: number, lon: number): [number, number] {
  const x = ((lon - LON_MIN) / (LON_MAX - LON_MIN)) * W;
  const y = ((LAT_MAX - lat) / (LAT_MAX - LAT_MIN)) * H;
  return [Math.round(x * 10) / 10, Math.round(y * 10) / 10];
}

export function ServiceAreaMap() {
  const [hx, hy] = project(HOME.lat, HOME.lon);
  // ~2-hour radius ≈ 1.35° of latitude on this projection
  const radius = (1.35 / (LAT_MAX - LAT_MIN)) * H;

  return (
    <div className="shadow-premium overflow-hidden rounded-3xl border border-white/10 bg-navy-950 p-4 sm:p-6">
      <svg
        viewBox={`0 0 ${W} ${H}`}
        role="img"
        aria-label="Map of the Southeast Roofing service area: a two-hour radius around Hattiesburg covering the Pine Belt, the Gulf Coast, Jackson, and Meridian"
        className="w-full"
      >
        {/* Subtle grid */}
        <defs>
          <pattern
            id="map-grid"
            width="40"
            height="40"
            patternUnits="userSpaceOnUse"
          >
            <path
              d="M 40 0 L 0 0 0 40"
              fill="none"
              stroke="#8faecb"
              strokeOpacity="0.08"
              strokeWidth="1"
            />
          </pattern>
          <radialGradient id="ring-fill" cx="50%" cy="50%" r="50%">
            <stop offset="0%" stopColor="#4f7ea8" stopOpacity="0.16" />
            <stop offset="100%" stopColor="#4f7ea8" stopOpacity="0.03" />
          </radialGradient>
        </defs>
        <rect width={W} height={H} fill="url(#map-grid)" />

        {/* 2-hour radius ring */}
        <circle cx={hx} cy={hy} r={radius} fill="url(#ring-fill)" />
        <circle
          cx={hx}
          cy={hy}
          r={radius}
          fill="none"
          stroke="#8faecb"
          strokeOpacity="0.5"
          strokeWidth="1.5"
          strokeDasharray="6 6"
        />
        <text
          x={hx}
          y={hy - radius - 8}
          textAnchor="middle"
          fontSize="12"
          fill="#8faecb"
          fontWeight="600"
        >
          ~2-hour service radius
        </text>

        {/* Community pins */}
        {CITIES.filter((c) => !c.hub).map((city) => {
          const [x, y] = project(city.lat, city.lon);
          return (
            <circle
              key={city.name}
              cx={x}
              cy={y}
              r="3.5"
              fill="#8faecb"
              fillOpacity="0.7"
            >
              <title>{city.name}</title>
            </circle>
          );
        })}

        {/* Hub pins with labels */}
        {CITIES.filter((c) => c.hub).map((city) => {
          const [x, y] = project(city.lat, city.lon);
          const home = city.name === "Hattiesburg";
          // Nudge labels that would collide
          const labelDy =
            city.name === "Petal" || city.name === "Biloxi" ? 20 : -12;
          const anchor =
            city.name === "Petal" || city.name === "Meridian"
              ? "start"
              : city.name === "Brookhaven" || city.name === "Picayune"
                ? "end"
                : "middle";
          const labelDx = anchor === "start" ? 8 : anchor === "end" ? -8 : 0;
          return (
            <g key={city.name}>
              {home && (
                <circle
                  cx={x}
                  cy={y}
                  r="12"
                  fill="#ffffff"
                  fillOpacity="0.15"
                />
              )}
              <circle
                cx={x}
                cy={y}
                r={home ? 7 : 5}
                fill={home ? "#ffffff" : "#c9d8e6"}
                stroke="#0a2036"
                strokeWidth="1.5"
              />
              <text
                x={x + labelDx}
                y={y + labelDy}
                textAnchor={anchor}
                fontSize={home ? 15 : 12.5}
                fontWeight={home ? 800 : 600}
                fill="#ffffff"
              >
                {city.name}
              </text>
            </g>
          );
        })}
      </svg>
    </div>
  );
}
