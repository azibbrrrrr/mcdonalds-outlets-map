"use client";

import dynamic from "next/dynamic";

const MapComponent = dynamic(() => import("@/components/MapComponent"), {
  ssr: false,
});

export default function Home() {
  return (
    <div>
      <h1 className="text-center text-2xl font-bold my-4">
        McDonald's Outlets in Kuala Lumpur
      </h1>
      <MapComponent />
    </div>
  );
}
