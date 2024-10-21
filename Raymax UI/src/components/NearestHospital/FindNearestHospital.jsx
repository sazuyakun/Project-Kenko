import React, { useEffect, useState } from "react";
import { MapPin, Navigation, Phone } from 'lucide-react'; // Import Phone icon
import { motion } from 'framer-motion';
import "./FindNearestHospital.css";

const HospitalCard = ({ name, address, distance, phoneNumber }) => {

  const handlePhoneClick = () => {
    window.location.href = `tel:${phoneNumber}`;
  };

  return (
    <motion.div 
      className=" h-44"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      whileHover={{ scale: 1.05 }}

    >
      <h3 className="mb-2">{name}</h3>
      <p className="mb-2"><strong>Address:</strong> {address}</p>
      <p><strong>Distance:</strong> {distance.toFixed(2)} km</p>
      <p>
        <motion.button
          className="call-button mt-2"
          onClick={handlePhoneClick}
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.95 }}
        >
          <Phone size={24} className="phone-icon" /> Call {/* Adding text for clarity */}
        </motion.button>
      </p>
    </motion.div>
  );
};


const FindNearestHospital = () => {
  const [hospitalList, setHospitalList] = useState([]);

  useEffect(() => {
    let map;
    let currentPosition;
    let watchId;

    const loadScript = (src) => {
      return new Promise((resolve, reject) => {
        const script = document.createElement("script");
        script.src = src;
        script.async = true;
        script.onload = resolve;
        script.onerror = reject;
        document.body.appendChild(script);
      });
    };

    const loadMapScripts = async () => {
      try {
        await loadScript("https://js.api.here.com/v3/3.1/mapsjs-core.js");
        await loadScript("https://js.api.here.com/v3/3.1/mapsjs-service.js");
        await loadScript("https://js.api.here.com/v3/3.1/mapsjs-ui.js");
        await loadScript("https://js.api.here.com/v3/3.1/mapsjs-mapevents.js");
        initMap();
      } catch (error) {
        console.error("Error loading HERE Maps scripts:", error);
      }
    };

    const initMap = () => {
      const platform = new window.H.service.Platform({
        apikey: "dj9cwnY6ifjxwJozM4XYZ7rJ99ABe7wbrv7A-bMwzvo",
      });
      const defaultLayers = platform.createDefaultLayers();

      if (!map) {
        map = new window.H.Map(
          document.getElementById("map"),
          defaultLayers.vector.normal.map,
          {
            center: { lat: 37.376, lng: -122.034 },
            zoom: 12,
            pixelRatio: window.devicePixelRatio || 1,
          }
        );

        const behavior = new window.H.mapevents.Behavior(
          new window.H.mapevents.MapEvents(map)
        );

        map.addLayer(defaultLayers.vector.traffic.map);
        const ui = window.H.ui.UI.createDefault(map, defaultLayers);

        window.addEventListener("resize", () => map.getViewPort().resize());

        watchId = navigator.geolocation.watchPosition(
          (position) => {
            const { latitude, longitude } = position.coords;
            const newCoordinates = { lat: latitude, lng: longitude };

            if (
              !currentPosition ||
              calculateDistance(currentPosition, newCoordinates) > 0.01
            ) {
              currentPosition = newCoordinates;
              map.setCenter(currentPosition);
              searchNearbyHospital(platform, currentPosition, map, ui);
            }
          },
          (error) => {
            console.error("Error getting geolocation:", error);
          },
          { enableHighAccuracy: true, maximumAge: 0, timeout: 1000 }
        );
      }
    };

    const searchNearbyHospital = (platform, coordinates, map, ui) => {
      const geocoder = platform.getSearchService();
      const searchParameters = {
        q: "hospital",
        at: `${coordinates.lat},${coordinates.lng}`,
        limit: 3,
      };

      geocoder.discover(
        searchParameters,
        (result) => {
          const locations = result.items;
          if (locations.length > 0) {
            addLocationsToMap(locations, map, ui);
            setHospitalList(locations.map((location) => ({
              name: location.title,
              address: location.address.label,
              position: location.position,
              distance: calculateDistance(coordinates, location.position),
              phoneNumber: location.contacts?.[0]?.phone?.[0]?.value || "N/A" // Add phone number if available
            })));
            calculateRouteToHospital(platform, coordinates, locations[0].position);
          } else {
            alert("No hospitals found nearby.");
          }
        },
        (error) => {
          console.error("Error with geocoder discover:", error);
          alert("Can't reach the remote server");
        }
      );
    };

    const addLocationsToMap = (locations, map, ui) => {
      map.removeObjects(map.getObjects());

      const group = new window.H.map.Group();
      locations.forEach((location) => {
        const marker = new window.H.map.Marker(location.position);
        marker.label = location.title;
        marker.description = location.address.label;
        group.addObject(marker);
      });

      group.addEventListener(
        "tap",
        (evt) => {
          const position = evt.target.getGeometry();
          openBubble(position);
        },
        false
      );

      map.addObject(group);
      map.getViewModel().setLookAtData({
        bounds: group.getBoundingBox(),
      });
      map.setZoom(Math.min(map.getZoom(), 16));
    };

    const openBubble = (position) => {
      map.setCenter(position);
      map.setZoom(18);
    };

    const calculateRouteToHospital = (platform, start, end) => {
      const router = platform.getRoutingService(null, 8);
      const routeRequestParams = {
        routingMode: "fast",
        transportMode: "car",
        origin: `${start.lat},${start.lng}`,
        destination: `${end.lat},${end.lng}`,
        return: "polyline,turnByTurnActions,actions,instructions,travelSummary",
      };

      router.calculateRoute(
        routeRequestParams,
        (result) => {
          const route = result.routes[0];
          addRouteToMap(route);
        },
        (error) => {
          console.error("Routing error:", error);
          alert("Failed to calculate the route.");
        }
      );
    };

    const addRouteToMap = (route) => {
      route.sections.forEach((section) => {
        let linestring = window.H.geo.LineString.fromFlexiblePolyline(
          section.polyline
        );

        let polyline = new window.H.map.Polyline(linestring, {
          style: {
            lineWidth: 6,
            strokeColor: "rgb(25,140,255)",
          },
        });

        map.addObject(polyline);
        map.getViewModel().setLookAtData({
          bounds: polyline.getBoundingBox(),
        });
      });
    };

    const calculateDistance = (coord1, coord2) => {
      const toRad = (value) => (value * Math.PI) / 180;
      const R = 6371; // Radius of the Earth in km
      const dLat = toRad(coord2.lat - coord1.lat);
      const dLon = toRad(coord2.lng - coord1.lng);
      const lat1 = toRad(coord1.lat);
      const lat2 = toRad(coord2.lat);

      const a =
        Math.sin(dLat / 2) * Math.sin(dLat / 2) +
        Math.sin(dLon / 2) * Math.sin(dLon / 2) * Math.cos(lat1) * Math.cos(lat2);
      const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
      const distance = R * c;

      return distance;
    };

    loadMapScripts();

    return () => {
      if (map) {
        map.dispose();
      }
      if (watchId) {
        navigator.geolocation.clearWatch(watchId);
      }
    };
  }, []);

 return (
    <motion.div 
      className="find-hospital-container"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
    >
      <motion.div 
        className="page-header"
        whileHover={{ scale: 1.02 }}
        transition={{ type: "spring", stiffness: 300 }}
      >
        <h1><MapPin className="icon" /> Find Nearest Hospital</h1>
      </motion.div>
      <div className="content-wrapper">
        <motion.div 
          id="map" 
          className="map-container"
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.2, duration: 0.5 }}
        >
        </motion.div>
        <motion.div 
  className="panel" 
  id="panel"
  initial={{ opacity: 0, x: 20 }}
  animate={{ opacity: 1, x: 0 }}
  transition={{ duration: 0.5 }}
>
  <h2>
    <Navigation className="icon mb-5" /> Hospitals Nearby
  </h2>
  {hospitalList.map((hospital, index) => (
    <HospitalCard
      key={index}
      name={hospital.name}
      address={hospital.address}
      distance={hospital.distance}
      phoneNumber={hospital.phoneNumber} // Pass phone number as prop
    />
  ))}
</motion.div>

      </div>
    </motion.div>
  );
};

export default FindNearestHospital;
