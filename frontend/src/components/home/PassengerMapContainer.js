import React, { useEffect, useRef } from 'react';
import { View, StyleSheet, Platform } from 'react-native';
import { WebView } from 'react-native-webview';
import socket from '../../utils/socket';

const MapContainer = ({ location }) => {
  const webViewRef = useRef(null);

  // Envia localização do passageiro quando disponível
  useEffect(() => {
    if (location && webViewRef.current) {
      const message = JSON.stringify({
        type: 'updatePassenger',
        location: {
          lat: location.latitude,
          lng: location.longitude,
        }
      });
      webViewRef.current.postMessage(message);
    }
  }, [location]);

  useEffect(() => {
    socket.connect();

    socket.on('driverLocation', (driverLoc) => {
      if (driverLoc?.lat && driverLoc?.lng) {
        const message = JSON.stringify({
          type: 'updateDriver',
          location: driverLoc,
        });
        webViewRef.current?.postMessage(message);
      }
    });

    return () => {
      socket.off('driverLocation');
      socket.disconnect();
    };
  }, []);

  const mapSource = { uri: 'https://backend-igo.onrender.com/passengerMap.html' };


  return (
    <View style={styles.container}>
      <WebView
        ref={webViewRef}
        originWhitelist={['*']}
        source={mapSource}
        style={styles.webview}
        javaScriptEnabled
        domStorageEnabled
        allowFileAccess
        onLoad={() => { // Envia novamente quando o WebView recarrega
          if (location) {
            const message = JSON.stringify({
              type: 'updatePassenger',
              location: {
                lat: location.latitude,
                lng: location.longitude,
              }
            });
            webViewRef.current.postMessage(message);
          }
        }}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  webview: {
    flex: 1,
  },
});

export default MapContainer;
