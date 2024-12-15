import React, { useEffect, useRef, useState } from 'react';
import mapboxgl from 'mapbox-gl';
// Cấu hình Mapbox
mapboxgl.accessToken = 'pk.eyJ1IjoibXlob2FuZzEyMyIsImEiOiJjbTFlZzF2d2cydWR0MmtvajFwYnB5OW42In0.-CeNZom6cnNBEsAWVumPuQ'
const MapComponent = ( {Destination} ) => {
    const mapContainer = useRef(null)
    const start = [105.780017, 10.045260]
    let mapRef = useRef()
    let markerRef = useRef()
    let timeout = useRef()
    let imgRef = useRef()
// Hàm để di chuyển marker
function calculateDirection(latA, lonA, latB, lonB) {
    const deltaY = latB - latA;
    const deltaX = lonB - lonA;
    if (deltaY > 0 && deltaX === 0) {
        imgRef.current.style.transform = 'scale(1,-1) rotate(45deg)'
    } else if (deltaY < 0 && deltaX === 0) {
        imgRef.current.style.transform = 'scale(1,1) rotate(45deg)'
    } else if (deltaX > 0 && deltaY === 0) {
        imgRef.current.style.transform = 'scale(1,1) rotate(320deg)'
    } else if (deltaX < 0 && deltaY === 0) {
        imgRef.current.style.transform = 'scale(1,-1) rotate(170deg)'
    } else if (deltaY > 0 && deltaX > 0) {
        imgRef.current.style.transform = 'scale(-1,-1) rotate(95deg)'
    } else if (deltaY > 0 && deltaX < 0) {
        imgRef.current.style.transform = 'scale(1,-1) rotate(120deg)'
    } else if (deltaY < 0 && deltaX > 0) {
        imgRef.current.style.transform = ''
    } else if (deltaY < 0 && deltaX < 0) {
        imgRef.current.style.transform = 'scale(1,-1) rotate(180deg)'
    } else {
        return 'Không xác định';
    }
}
const moveMarker = (startLng, startLat, endLng, endLat, duration) => {
    const startTime = performance.now();
    const animateMarker = (timestamp) => {
        const elapsed = timestamp - startTime;
        const progress = Math.min(elapsed / duration, 1); // Tính toán tiến độ
        // Tính toán vị trí mới
        const lng = startLng + (endLng - startLng) * progress;
        const lat = startLat + (endLat - startLat) * progress;
        calculateDirection(startLat, startLng, endLat, endLng)
        markerRef.current.setLngLat([lng, lat]);
        // Nếu chưa hoàn thành, tiếp tục
        if (progress < 1) {
            requestAnimationFrame(animateMarker);
        }
    };

    requestAnimationFrame(animateMarker); // Bắt đầu hoạt ảnh
};
  
async function getRoute(end) {
  const query = await fetch(
    `https://api.mapbox.com/directions/v5/mapbox/walking/${start[0]},${start[1]};${end[1]},${end[0]}?steps=true&geometries=geojson&access_token=${mapboxgl.accessToken}`,
    { method: 'GET' }
  );
  const json = await query.json();
  const data = json.routes[0];
  const route = data.geometry.coordinates;
  let step = 0
 timeout.current = setInterval(() => {
    if(step === route.length - 1) {
      clearInterval(timeout.current)
    }
    else
    {
      moveMarker(route[step][0], route[step][1], route[step + 1][0], route[step + 1][1], 2000)
      step += 1
    }
  },5000)
  const geojson = {
    type: 'Feature',
    properties: {},
    geometry: {
      type: 'LineString',
      coordinates: route
    }
  };
  if (mapRef.current.getSource('route')) {
      mapRef.current.getSource('route').setData(geojson);
  }
  else {
      mapRef.current.addLayer({
      id: 'route',
      type: 'line',
      source: {
        type: 'geojson',
        data: geojson
      },
      layout: {
        'line-join': 'round',
        'line-cap': 'round'
      },
      paint: {
        'line-color': '#52e5e7',
        'line-width': 5,
        'line-opacity': 1
      }
    });
    
  }
}
    useEffect(() => {
        // Khởi tạo bản đồ
        const initializeMap = () => {
            const mapInstance = new mapboxgl.Map({
                container: mapContainer.current,
                style: 'mapbox://styles/mapbox/streets-v11',
                center: [105.7852, 10.0307], // Kinh độ, Vĩ độ
                zoom: 12,
            });
            mapRef.current = mapInstance
  mapInstance.on('load', () => {
     // const coords = Object.keys(event.lngLat).map((key) => event.lngLat[key]);
     const end = {
       type: 'FeatureCollection',
       features: [
         {
           type: 'Feature',
           properties: {},
           geometry: {
             type: 'Point',
             coordinates: Destination
           }
         }
       ]
     };
     if (mapInstance.getLayer('end')) {
         mapInstance.getSource('end').setData(end);
     } else {
         mapInstance.addLayer({
         id: 'end',
         type: 'circle',
         source: {
           type: 'geojson',
           data: {
             type: 'FeatureCollection',
             features: [
               {
                 type: 'Feature',
                 properties: {},
                 geometry: {
                   type: 'Point',
                   coordinates: Destination
                 }
               }
             ]
           }
         },
         paint: {
           'circle-radius': 7,
           'circle-color': '#990000'
         }
       });
     }
     getRoute(Destination);
       // Tạo phần tử DOM cho marker
       const markerElement = document.createElement('div')
       markerElement.style.width = '40px'
       markerElement.style.height = '40px'
       markerElement.style.position = 'relative'// Để có thể thêm vị trí cho hình ảnh
       // Tạo phần tử img
        imgRef.current = document.createElement('img')
        imgRef.current.src = 'https://severgogi.onrender.com/api/v12/header/reparto-removebg-preview.png'
        imgRef.current.style.width = '100%'
        imgRef.current.style.height = '100%'
        imgRef.current.style.transform = ''
        imgRef.current.style.transition = 'transform .5s ease-in-out'
       markerElement.appendChild( imgRef.current) // Thêm hình ảnh vào marker
        //   // Tạo marker với phần tử DOM
        markerRef.current =  new mapboxgl.Marker(markerElement)
          .setLngLat([105.780017, 10.045260])
          .addTo(mapInstance)
  });
    }
        initializeMap()

        return () =>{
            clearInterval(timeout.current)
            mapRef.current && mapRef.current.remove()
        } 
    }, []);
    return <div ref={mapContainer} style={{ width: '100%', height: '100%' }} />;
};

export default MapComponent;