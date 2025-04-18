import { GOOGLE_MAPS_API_KEY } from '@env';
import React, { useEffect, useRef, useState } from 'react';
import { View, StyleSheet, ActivityIndicator, Text } from 'react-native';
import { WebView } from 'react-native-webview';
import socket from '../../utils/socket';

const MapContainer = ({ location, title = "Você está aqui!" }) => {
  const webViewRef = useRef(null);
  const [currentLocation, setCurrentLocation] = useState(location || { lat: 0, lng: 0 });

  useEffect(() => {
    socket.connect();

    socket.on('driverLocation', (driverLoc) => {
      if (driverLoc && driverLoc.lat && driverLoc.lng) {
        setCurrentLocation(driverLoc);
        // Atualiza a posição do motorista sem recarregar o mapa
        if (webViewRef.current) {
          const updateDriverLocation = `
            const newPos = { lat: ${driverLoc.lat}, lng: ${driverLoc.lng} };
            if (driverMarker) {
              driverMarker.setPosition(newPos);
              map.panTo(newPos);
            }
          `;
          webViewRef.current.injectJavaScript(updateDriverLocation);
        }
      }
    });

    return () => {
      socket.off('driverLocation');
      socket.disconnect();
    };
  }, []);

  if (!currentLocation || !currentLocation.lat || !currentLocation.lng) {
    return (
      <View style={styles.centered}>
        <ActivityIndicator size="large" color="#000" />
        <Text>Carregando mapa...</Text>
      </View>
    );
  }

  const { lat, lng } = currentLocation;
  console.log('Current Location:', lat, lng);

  const mapHtml = `
    <!DOCTYPE html>
    <html>
      <head>
        <meta name="viewport" content="initial-scale=1.0, user-scalable=no" />
        <meta charset="utf-8" />
        <style>
          html, body { height: 100%; margin: 0; padding: 0; }
          #map { height: 100%; }
        </style>
        <script src="https://maps.googleapis.com/maps/api/js?key=${GOOGLE_MAPS_API_KEY}"></script>
        <script>
          let map;
          let driverMarker;

          function initMap() {
            const initialPosition = { lat: ${lat}, lng: ${lng} };
            map = new google.maps.Map(document.getElementById("map"), {
              zoom: 15,
              center: initialPosition,
              disableDefaultUI: true,
            });

            driverMarker = new google.maps.Marker({
              position: initialPosition,
              map: map,
              title: "${title}",
            });
          }

          window.onload = initMap;
        </script>
      </head>
      <body>
        <div id="map"></div>
      </body>
    </html>
  `;

  return (
    <View style={styles.container}>
      <WebView
        ref={webViewRef}
        originWhitelist={['*']}
        source={{ html: mapHtml }}
        style={styles.webview}
        javaScriptEnabled
        domStorageEnabled
        startInLoadingState
        renderLoading={() => <ActivityIndicator size="large" color="#000" style={{ flex: 1 }} />}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    borderRadius: 8,
    overflow: 'hidden',
  },
  webview: {
    flex: 1,
  },
  centered: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
});

export default MapContainer;
