import React, { useEffect, useRef, useState } from 'react';
import { View, StyleSheet } from 'react-native';
import { WebView } from 'react-native-webview';
import socket from '../../utils/socket';
import useDriverLocation from '../../utils/DriverLocation';

const DriverMapContainer = () => {
  const webViewRef = useRef(null);
  const [mapLoaded, setMapLoaded] = useState(false);

  useEffect(() => {
    socket.connect();
    socket.emit('registerDriver');

    return () => {
      socket.disconnect();
    };
  }, []);

  const { errorMsg } = useDriverLocation((coords) => {
    socket.emit('driverLocation', coords);

    if (mapLoaded && webViewRef.current) {
      const jsCode = `
        if (window.updateDriverMarker) {
          window.updateDriverMarker(${coords.lat}, ${coords.lng});
        }
        true;
      `;
      webViewRef.current.injectJavaScript(jsCode);
    }
  });

  const mapSource = require('../../../assets/driverMap.html');

  return (
    <View style={styles.container}>
      <WebView
        ref={webViewRef}
        originWhitelist={['*']}
        source={mapSource}
        javaScriptEnabled
        domStorageEnabled
        allowFileAccess
        onLoadEnd={() => setMapLoaded(true)}
        style={styles.webview}
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

export default DriverMapContainer;
