import "leaflet/dist/leaflet.css";
import { useEffect, useRef } from "react";
import { MapContainer, TileLayer, useMap } from "react-leaflet";

/**
 * OneMap tiles (no key needed for base map).
 * Attribution per OneMap terms.
 * Docs: https://www.onemap.gov.sg/docs/
 */
const ONEMAP_TILE_URL = "https://maps-{s}.onemap.sg/v3/Default/{z}/{x}/{y}.png";
const ONEMAP_ATTR =
  '&copy; <a href="https://www.onemap.gov.sg" target="_blank" rel="noreferrer">OneMap Singapore</a>';

/**
 * Ensure Leaflet map re-measures when the grid tile size changes.
 * We observe the container size and call map.invalidateSize().
 */
function InvalidateOnResize({ observeRef }) {
  const map = useMap();
  useEffect(() => {
    if (!observeRef?.current) return;
    const ro = new ResizeObserver(() => {
      // small throttle via rAF
      requestAnimationFrame(() => map.invalidateSize(false));
    });
    ro.observe(observeRef.current);
    return () => ro.disconnect();
  }, [map, observeRef]);
  return null;
}

export default function OneMapWidget() {
  const wrapperRef = useRef(null);

  // Singapore center
  const center = [1.3521, 103.8198];

  return (
    <div ref={wrapperRef} style={{ height: "100%", width: "100%" }}>
      <MapContainer
        center={center}
        zoom={12}
        style={{ height: "100%", width: "100%", borderRadius: 12 }}
        scrollWheelZoom={true}
      >
        <InvalidateOnResize observeRef={wrapperRef} />
        <TileLayer url={ONEMAP_TILE_URL} attribution={ONEMAP_ATTR} />
      </MapContainer>
    </div>
  );
}
