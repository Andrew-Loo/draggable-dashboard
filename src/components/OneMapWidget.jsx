import "leaflet/dist/leaflet.css";
import { useEffect, useRef } from "react";
import { MapContainer, TileLayer, useMap } from "react-leaflet";

const ONEMAP_TILE_URL =
  "https://www.onemap.gov.sg/maps/tiles/Original/{z}/{x}/{y}.png";

// ✅ Official attribution per OneMap requirement
const ONEMAP_ATTR = `
  <img src="https://www.onemap.gov.sg/web-assets/images/logo/om_logo.png"
       style="height:20px;width:20px;vertical-align:middle;margin-right:4px;"/>
  <a href="https://www.onemap.gov.sg/" target="_blank" rel="noopener noreferrer">OneMap</a>
  &nbsp;&copy;&nbsp;contributors&nbsp;&#124;&nbsp;
  <a href="https://www.sla.gov.sg/" target="_blank" rel="noopener noreferrer">
    Singapore Land Authority
  </a>
`;

function InvalidateOnResize({ observeRef }) {
  const map = useMap();
  useEffect(() => {
    if (!observeRef?.current) return;
    const ro = new ResizeObserver(() => {
      requestAnimationFrame(() => map.invalidateSize(false));
    });
    ro.observe(observeRef.current);
    return () => ro.disconnect();
  }, [map, observeRef]);
  return null;
}

export default function OneMapWidget() {
  const wrapperRef = useRef(null);
  const center = [1.3521, 103.8198]; // Singapore

  return (
    <div ref={wrapperRef} style={{ height: "100%", width: "100%" }}>
      <MapContainer
        center={center}
        zoom={12}
        style={{ height: "100%", width: "100%", borderRadius: 12 }}
        scrollWheelZoom
      >
        <InvalidateOnResize observeRef={wrapperRef} />
        <TileLayer
          url={ONEMAP_TILE_URL}
          attribution={ONEMAP_ATTR}
          maxZoom={19}
        />
      </MapContainer>
    </div>
  );
}
