import React, { useEffect, useRef } from 'react';
import { View, StyleSheet, Platform } from 'react-native';
import { WebView } from 'react-native-webview';
import socket from '../../utils/socket';

const MapContainer = () => {
  const webViewRef = useRef(null);

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

  const mapSource = require('../../../assets/passengerMap.html');

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
