import React, { memo, useEffect, useRef, useState } from 'react'
import mapboxgl from 'mapbox-gl'
import axios from 'axios'

import MapboxGeocoder from '@mapbox/mapbox-gl-geocoder'
const MapboxExample = ({children, setDestination, mapContainerRef}) => {  
  const [isLayerVisible, setIsLayerVisible] = useState(true)
  const mapRef = useRef()
  const markerRef = useRef()
// Tọa độ trung tâm của Cần Thơ
  useEffect(() => {  
    mapboxgl.accessToken = 'pk.eyJ1IjoibXlob2FuZzEyMyIsImEiOiJjbTFlZzF2d2cydWR0MmtvajFwYnB5OW42In0.-CeNZom6cnNBEsAWVumPuQ'
    mapRef.current = new mapboxgl.Map({  
      container: mapContainerRef.current,  
      style: 'mapbox://styles/mapbox/standard',  
      center: [105.7719, 10.0200], // starting position  
      zoom: 12.5, // starting zoom
      antialias: true,
      pitch: 15,  
      // bounds: [  
      //   [-128.99107, 22.62724],  
      //   [-63.35107, 50.26125]  
      // ]  
    });  
    // mapRef.current.on('load',(even) => {
    //   const searchBox = new MapboxSearchBox();
    // })
    mapRef.current.addControl(
      new MapboxGeocoder({
        accessToken: mapboxgl.accessToken,
        mapboxgl: mapboxgl,
        marker: false,  
        countries: 'VN',
        proximity: {
          longitude: 105.7852, // Kinh độ của Cần Thơ
          latitude: 10.0307     // Vĩ độ của Cần Thơ
      },
      bbox: [105.5, 9.9, 106.0, 10.2],
      })
    )
    // mapRef.current.addControl(new mapboxgl.NavigationControl());

     // Thêm sự kiện click để ghim định vị
     mapRef.current.on('click', (event) => {
      const coordinates = event.lngLat;
      if(markerRef.current) {
        markerRef.current.remove()
      }
      // // Tạo marker mới
      const newMarker = new mapboxgl.Marker()
      newMarker.setLngLat(coordinates)
      newMarker.addTo(mapRef.current)
      markerRef.current = newMarker
      const newDes = `${coordinates.lat},${coordinates.lng}`
      setDestination(newDes)
      addAddress()
  });
  mapRef.current.on('style.load', () => {
    // set the light preset to be in dusk mode.
    mapRef.current.setConfigProperty('basemap', 'lightPreset', 'dusk');

    // add a geojson source with a polygon to be used in the clip layer.
    mapRef.current.addSource('eraser', {
      type: 'geojson',
      data: {
        type: 'FeatureCollection',
        features: [
          {
            type: 'Feature',
            properties: {},
            geometry: {
              coordinates: [
                [
                  [-0.12573, 51.53222],
                  [-0.12458, 51.53219],
                  [-0.12358, 51.53492],
                  [-0.12701, 51.53391],
                  [-0.12573, 51.53222]
                ]
              ],
              type: 'Polygon'
            }
          }
        ]
      }
    });

    // add a geojson source which specifies the custom model to be used by the model layer.
    mapRef.current.addSource('model', {
      type: 'geojson',
      data: {
        type: 'Feature',
        properties: {
          'model-uri': 'https://docs.mapbox.com/mapbox-gl-js/assets/tower.glb'
        },
        geometry: {
          coordinates: [-0.12501974, 51.5332374],
          type: 'Point'
        }
      }
    });

    // add the clip layer and configure it to also remove symbols and trees.
    // `clip-layer-scope` layout property is used to specify that only models from the Mapbox Standard Style should be clipped.
    // this will prevent the newly added model from getting clipped.
    mapRef.current.addLayer({
      id: 'eraser',
      type: 'clip',
      source: 'eraser',
      layout: {
        // specify the layer types to be removed by this clip layer
        'clip-layer-types': ['symbol', 'model'],
        'clip-layer-scope': ['basemap']
      }
    });

    // add the model layer and specify the appropriate `slot` to ensure the symbols are rendered correctly.
    mapRef.current.addLayer({
      id: 'tower',
      type: 'model',
      slot: 'middle',
      source: 'model',
      minzoom: 15,
      layout: {
        'model-id': ['get', 'model-uri']
      },
      paint: {
        'model-opacity': 1,
        'model-rotation': [0.0, 0.0, 35.0],
        'model-scale': [0.8, 0.8, 1.2],
        'model-color-mix-intensity': 0,
        'model-cast-shadows': true,
        'model-emissive-strength': 0.8
      }
    });
  });
async function addAddress() {
  try {
   const response = await axios.get(`https://api.mapbox.com/search/geocode/v6/reverse?longitude=${markerRef.current._lngLat.lng}&latitude=${markerRef.current._lngLat.lat}&access_token=pk.eyJ1IjoibXlob2FuZzEyMyIsImEiOiJjbTFlZzF2d2cydWR0MmtvajFwYnB5OW42In0.-CeNZom6cnNBEsAWVumPuQ`);
   children(response.data.features[0].properties.full_address)
  } catch (error) {
    console.error('Lỗi khi thêm sản phẩm:', error);
    // Xử lý lỗi tại đây.
  }
}
    return () => {
          if (markerRef.current) {
            markerRef.current.remove(); // Xóa marker khi component unmount
        }
        mapRef.current.remove();
    }
  }, [])

  return (
     <div id="map" className='mapUpdateAddress' onClick={(e) => e.stopPropagation()} ref={mapContainerRef} style={{ width: '27vw', height: '36.5vw' }} />
  );  
};  
  
export default memo(MapboxExample);