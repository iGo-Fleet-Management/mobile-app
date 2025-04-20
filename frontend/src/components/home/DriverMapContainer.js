import React, { useEffect, useRef, useState, useCallback } from 'react';
import { View, StyleSheet, Alert, TouchableOpacity, Text } from 'react-native';
import { WebView } from 'react-native-webview';
import socket from '../../utils/socket';
import useDriverLocation from '../../utils/DriverLocation';

const DriverMapContainer = () => {
  const webViewRef = useRef(null);
  const [mapLoaded, setMapLoaded] = useState(false);
  const [routeRequested, setRouteRequested] = useState(false);
  
  const fetchRoute = async () => {
    try {
      if (!mapLoaded || !webViewRef.current) {
        return;
      }
      
      // Dados da rota com waypoints
      const mockRoute = {
        origin: { lat: -19.436412036491546, lng: -42.555229890750056 },
        destination: { lat: -19.449008883154548, lng: -42.55561725522495 },
        waypoints: [
          { location: { lat: -19.441234, lng: -42.556789 } },
          { location: { lat: -19.444567, lng: -42.558901 } }
        ]
      };
      
      const jsCode = `
        try {
          if (window.calculateAndDisplayRoute) {
            window.calculateAndDisplayRoute(${JSON.stringify(mockRoute)});
          } else {
            console.error("Função calculateAndDisplayRoute não encontrada");
          }
        } catch(e) {
          console.error("Erro ao calcular rota:", e.message);
        }
        true;
      `;
      
      webViewRef.current.injectJavaScript(jsCode);
      setRouteRequested(true);
    } catch (error) {
      console.error("Erro ao solicitar rota:", error);
      Alert.alert('Erro', 'Não foi possível carregar a rota');
    }
  };

  useEffect(() => {
    socket.connect();
    socket.emit('registerDriver');
    
    return () => {
      socket.disconnect();
    };
  }, []);

  const handleLocationUpdate = useCallback((coords) => {
    socket.emit('driverLocation', coords);

    if (mapLoaded && webViewRef.current) {
      const jsCode = `
        try {
          if (window.updateDriverMarker) {
            window.updateDriverMarker(${coords.lat}, ${coords.lng});
          } else {
            console.error("Função updateDriverMarker não encontrada");
          }
        } catch(e) {
          console.error("Erro ao atualizar posição:", e.message);
        }
        true;
      `;
      webViewRef.current.injectJavaScript(jsCode);
    } else {
      console.log("Não foi possível atualizar o marcador: mapa carregado =", mapLoaded, 
                 "webViewRef =", !!webViewRef.current);
    }
  }, [mapLoaded]); // Adicionar mapLoaded como dependência

  const { errorMsg } = useDriverLocation(handleLocationUpdate);

  useEffect(() => {
    // Só tentar exibir a rota quando o mapa estiver carregado
    if (mapLoaded && !routeRequested) {
      const timeout = setTimeout(() => {
        fetchRoute();
      }, 2000); // Aumente para 2 segundos para garantir que tudo está inicializado
      
      return () => clearTimeout(timeout);
    }
  }, [mapLoaded, routeRequested]);

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
        onLoadEnd={() => {
          setMapLoaded(true);
        }}
        onContentProcessDidTerminate={() => {
          webViewRef.current?.reload();
          setRouteRequested(false);
        }}
        style={styles.webview}
        onMessage={(event) => {
          if (event.nativeEvent.data.includes('Erro')) {
            Alert.alert('Erro no Mapa', event.nativeEvent.data);
          }
        }}
        onError={(syntheticEvent) => {
          console.error('WebView error:', syntheticEvent.nativeEvent);
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
  }
});

export default DriverMapContainer;
