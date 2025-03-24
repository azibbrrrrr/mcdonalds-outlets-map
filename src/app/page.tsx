"use client";

import React, { useState } from "react";
import dynamic from "next/dynamic";
import { MapPin, List, Search, ExternalLink } from "lucide-react";

// Import components with dynamic loading for the map
const MapComponent = dynamic(() => import("@/components/MapComponent"), {
  ssr: false,
});

// Import SearchComponent
import SearchComponent from "@/components/SearchComponent";

export default function Home() {
  const [activeTab, setActiveTab] = useState("map");
  const [outlets, setOutlets] = useState([]);

  // Handle outlets update from API
  const handleOutletsUpdate = (newOutlets) => {
    setOutlets(newOutlets);
  };

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      {/* Header with McDonald's branding */}
      <header className="bg-red-600 text-white p-4 shadow-md">
        <div className="container mx-auto flex items-center justify-between">
          <div className="flex items-center">
            <span className="text-yellow-400 text-4xl mr-2">M</span>
            <h1 className="text-2xl font-bold">McDonald's Finder</h1>
          </div>
          <div className="hidden md:flex items-center space-x-4">
            <span className="text-sm">
              Find McDonald's outlets in Kuala Lumpur
            </span>
          </div>
        </div>
      </header>

      <main className="container mx-auto p-4 flex-grow">
        {/* Tab Navigation */}
        <div className="flex justify-center mb-6">
          <div className="bg-white rounded-full shadow-md p-1 flex">
            <button
              className={`px-6 py-2 rounded-full flex items-center transition-all ${
                activeTab === "map"
                  ? "bg-red-600 text-white"
                  : "text-gray-700 hover:bg-gray-100"
              }`}
              onClick={() => setActiveTab("map")}
            >
              <MapPin size={18} className="mr-2" />
              Map View
            </button>
            <button
              className={`px-6 py-2 rounded-full flex items-center transition-all ${
                activeTab === "list"
                  ? "bg-red-600 text-white"
                  : "text-gray-700 hover:bg-gray-100"
              }`}
              onClick={() => setActiveTab("list")}
            >
              <List size={18} className="mr-2" />
              Search View
            </button>
          </div>
        </div>

        {/* Conditional Rendering of Sections */}
        {activeTab === "map" ? (
          <div className="mb-8">
            <div className="bg-white rounded-lg shadow-md overflow-hidden">
              <div className="h-96 relative">
                {/* MapComponent with 5KM radius functionality */}
                <MapComponent />
              </div>
              <div className="p-4 bg-gray-50 border-t border-gray-200">
                <h3 className="font-medium text-gray-700 mb-2">
                  About the Map
                </h3>
                <ul className="space-y-1 text-sm text-gray-600">
                  <li className="flex items-center">
                    <div className="w-3 h-3 rounded-full bg-red-500 mr-2"></div>
                    <span>Default McDonald's outlet</span>
                  </li>
                  <li className="flex items-center">
                    <div className="w-3 h-3 rounded-full bg-green-500 mr-2"></div>
                    <span>Outlet within 5KM of selected outlet</span>
                  </li>
                  <li className="flex items-center">
                    <div className="w-3 h-3 rounded-full bg-blue-500 mr-2"></div>
                    <span>Selected outlet</span>
                  </li>
                  <li className="flex items-center">
                    <div className="w-3 h-3 rounded-full bg-blue-200 mr-2 opacity-50"></div>
                    <span>5KM radius catchment area</span>
                  </li>
                </ul>
              </div>
            </div>
          </div>
        ) : (
          <div className="grid md:grid-cols-3 gap-6">
            <div className="md:col-span-1">
              <div className="bg-white rounded-lg shadow-md p-4 sticky top-4">
                <h2 className="text-xl font-semibold mb-4 text-gray-800">
                  Search Outlets
                </h2>
                <p className="text-sm text-gray-600 mb-4">
                  Ask natural language questions about McDonald's outlets in KL:
                </p>
                <div className="mb-2 text-sm text-gray-700">
                  <strong>Example queries:</strong>
                  <ul className="list-disc pl-5 mt-1 space-y-1">
                    <li>Which outlets in KL operate 24 hours?</li>
                    <li>Which outlet allows birthday parties?</li>
                    <li>Find McDonald's near KLCC</li>
                    <li>Outlets with Drive-Thru in Kuala Lumpur</li>
                  </ul>
                </div>
                <SearchComponent />
              </div>
            </div>

            <div className="md:col-span-2">
              <div className="bg-white rounded-lg shadow-md overflow-hidden">
                <h2 className="text-xl font-semibold p-4 border-b border-gray-100">
                  Outlet Results
                </h2>

                {outlets.length === 0 ? (
                  <div className="p-16 text-center text-gray-500">
                    <Search size={48} className="mx-auto mb-4 opacity-25" />
                    <p className="text-lg mb-2">No outlets found</p>
                    <p className="text-sm">
                      Try searching for McDonald's outlets using the search box
                    </p>
                  </div>
                ) : (
                  <ul className="divide-y divide-gray-100">
                    {outlets.map((outlet) => (
                      <li
                        key={outlet.id}
                        className="p-4 hover:bg-gray-50 transition-colors"
                      >
                        <div className="flex justify-between">
                          <div>
                            <h3 className="font-bold text-lg text-red-700">
                              {outlet.name}
                            </h3>
                            <p className="text-gray-600 mb-2">
                              {outlet.address}
                            </p>
                            <div className="flex flex-wrap gap-2 mt-2">
                              <span className="bg-yellow-100 text-yellow-800 px-2 py-1 rounded-full text-xs font-medium">
                                5KM Radius
                              </span>
                            </div>
                          </div>
                          <div>
                            <a
                              href={outlet.waze_link}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="bg-blue-500 text-white rounded-lg px-3 py-2 text-sm flex items-center"
                            >
                              <ExternalLink size={14} className="mr-1" />
                              Open in Waze
                            </a>
                          </div>
                        </div>
                      </li>
                    ))}
                  </ul>
                )}
              </div>
            </div>
          </div>
        )}
      </main>

      {/* Mobile bottom navigation */}
      <div className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 flex justify-around items-center p-3 md:hidden">
        <button
          className={`flex flex-col items-center ${
            activeTab === "map" ? "text-red-600" : "text-gray-600"
          }`}
          onClick={() => setActiveTab("map")}
        >
          <MapPin size={22} />
          <span className="text-xs mt-1">Map</span>
        </button>
        <button
          className={`flex flex-col items-center ${
            activeTab === "list" ? "text-red-600" : "text-gray-600"
          }`}
          onClick={() => setActiveTab("list")}
        >
          <Search size={22} />
          <span className="text-xs mt-1">Search</span>
        </button>
      </div>
    </div>
  );
}
