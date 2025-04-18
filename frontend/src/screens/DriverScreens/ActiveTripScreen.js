import React, { useEffect, useRef, useState } from 'react';
import { View, StyleSheet, ActivityIndicator, Text } from 'react-native';
import { WebView } from 'react-native-webview';
import socket from '../../utils/socket';
import useDriverLocation from '../../utils/DriverLocation';
import { GOOGLE_MAPS_API_KEY } from '@env';

const ActiveTripScreen = () => {
  const [location, setLocation] = useState(null);
  const webviewRef = useRef(null);

  // Conecta ao socket
  useEffect(() => {
    socket.connect();
    socket.emit('registerDriver');

    return () => socket.disconnect();
  }, []);

  // Atualiza a cada nova posição
  const { errorMsg } = useDriverLocation((coords) => {
    setLocation(coords);
    socket.emit('driverLocation', coords);

    // Atualiza posição no mapa
    const jsCode = `
      if (window.updateDriverMarker) {
        window.updateDriverMarker(${coords.lat}, ${coords.lng});
      }
    `;
    webviewRef.current?.injectJavaScript(jsCode);
  });

  const mapHtml = `
    <!DOCTYPE html>
    <html>
    <head>
      <meta name="viewport" content="initial-scale=1.0, user-scalable=no" />
      <meta charset="utf-8" />
      <style>
        html, body, #map { height: 100%; margin: 0; padding: 0; }
      </style>
      <script src="https://maps.googleapis.com/maps/api/js?key=${GOOGLE_MAPS_API_KEY}"></script>
      <script>
        let map, marker;

        function initMap() {
          map = new google.maps.Map(document.getElementById('map'), {
            zoom: 15,
            center: { lat: -3.745, lng: -38.523 }, // inicial (será atualizada)
            disableDefaultUI: true,
          });
        }

        function updateDriverMarker(lat, lng) {
          const position = { lat, lng };
          if (marker) {
            marker.setPosition(position);
            map.setCenter(position);
          } else {
            marker = new google.maps.Marker({
              position,
              map,
              title: "Localização do motorista",
            });
            map.setCenter(position);
          }
        }
      </script>
    </head>
    <body onload="initMap()">
      <div id="map"></div>
    </body>
    </html>
  `;

  if (errorMsg) {
    return (
      <View style={styles.centered}>
        <Text style={styles.errorText}>{errorMsg}</Text>
      </View>
    );
  }

  if (!location) {
    return (
      <View style={styles.centered}>
        <ActivityIndicator size="large" color="#000" />
        <Text>Carregando localização...</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <WebView
        ref={webviewRef}
        originWhitelist={['*']}
        source={{ html: mapHtml }}
        javaScriptEnabled
        domStorageEnabled
        style={styles.webview}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1 },
  webview: { flex: 1 },
  centered: { flex: 1, justifyContent: 'center', alignItems: 'center' },
  errorText: { color: 'red', textAlign: 'center' },
});

export default ActiveTripScreen;
