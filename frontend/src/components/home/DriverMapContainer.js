import React, { useEffect, useRef, useState, useCallback } from 'react';
import { View, StyleSheet, Alert, TouchableOpacity, Text } from 'react-native';
import { WebView } from 'react-native-webview';
import socket from '../../utils/socket';
import useDriverLocation from '../../utils/DriverLocation';
import { authHeader } from '../../auth/AuthService';
import { API_IGO, GOOGLE_MAPS_API_KEY } from '@env';

const DriverMapContainer = () => {
  const webViewRef = useRef(null);
  const [mapLoaded, setMapLoaded] = useState(false);
  const [routeRequested, setRouteRequested] = useState(false);
  const [routeData, setRouteData] = useState(null);

  useEffect(() => {
    const fetchRouteData = async () => {
      const headers = await authHeader();
      
      try {
        const date = "2025-04-19";
        const tripType = "ida";
        
        const response = await fetch(`${API_IGO}trips/get-trip-data?date=${date}&tripType=${tripType}`, {
          method: 'GET',
          headers
        });
        const data = await response.json();
        const rawData = data.resume[0];
        const processedData = await processRouteData(rawData.stops);

      setRouteData(processedData);
      } catch (error) {
        console.error('Erro ao buscar dados:', error);
      }
    };
  
    fetchRouteData();
  }, []);

  const processRouteData = async (stops) => {
    if (!stops || stops.length < 2) return null;
  
    const coordinates = await Promise.all(
      stops.map(stop => geocodeAddress(stop.address))
    );
    const validCoordinates = coordinates.filter(c => c !== null);
  
    return {
      origin: validCoordinates[0],
      destination: {lat: -19.514336, lng: -42.611769 },
      waypoints: validCoordinates.slice(1).map(location => ({ location }))
    };
  };

  const geocodeAddress = async (address) => {
    try {
      const apiKey = GOOGLE_MAPS_API_KEY;
      const response = await fetch(
        `https://maps.googleapis.com/maps/api/geocode/json?address=${encodeURIComponent(address)}&key=${apiKey}`
      );
      const data = await response.json();
  
      if (data.status === 'OK') {
        const location = data.results[0].geometry.location;
        return {
          lat: location.lat,
          lng: location.lng,
        };
      } else {
        console.error('Erro da API do Google Geocoding:', data.status);
        return null;
      }
    } catch (error) {
      console.error('Erro ao geocodificar endereço:', error);
      return null;
    }
  };

  const fetchRoute = async () => {
    try {
      if (!mapLoaded || !webViewRef.current) {
        return;
      }
      
      const jsCode = `
        try {
          if (window.calculateAndDisplayRoute) {
            window.calculateAndDisplayRoute(${JSON.stringify(routeData)});
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
    if (mapLoaded && routeData) {
      const timeout = setTimeout(() => {
        fetchRoute();
      }, 2000); // Aumente para 2 segundos para garantir que tudo está inicializado
      
      return () => clearTimeout(timeout);
    }
  }, [mapLoaded, routeData]);

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
