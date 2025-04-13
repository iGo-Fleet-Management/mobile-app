import React, { useEffect, useState, useRef } from 'react';
import { View, StyleSheet, Image, Text, Platform } from 'react-native';
import MapView from 'react-native-maps';
import * as Location from 'expo-location';

const MapContainer = () => {
  const [location, setLocation] = useState(null);
  const [errorMsg, setErrorMsg] = useState(null);
  const [showMap, setShowMap] = useState(true);  // Inicie como true para evitar flickering
  const mapRef = useRef(null);
  
  // Default region
  const [region, setRegion] = useState({
    latitude: -19.469,  // São Paulo (ou outra coordenada relevante para você)
    longitude: -42.5367,
    latitudeDelta: 0.07,
    longitudeDelta: 0.05,
  });

  // Controlador para prevenir múltiplas inicializações
  const hasInitialized = useRef(false);

  useEffect(() => {
    let locationSubscription = null;
    
    const setupLocation = async () => {
      if (hasInitialized.current) return;
      hasInitialized.current = true;
      
      try {
        let { status } = await Location.requestForegroundPermissionsAsync();
        if (status !== 'granted') {
          setErrorMsg('Permission to access location was denied');
          setShowMap(false);
          return;
        }

        // Obter localização inicial
        let userLocation = await Location.getCurrentPositionAsync({
          accuracy: Location.Accuracy.Balanced,
        });
        
        setLocation(userLocation);
        
        if (userLocation) {
          const newRegion = {
            latitude: userLocation.coords.latitude,
            longitude: userLocation.coords.longitude,
            latitudeDelta: 0.015,
            longitudeDelta: 0.0121,
          };
          
          setRegion(newRegion);
          
          // Adicione um pequeno atraso antes de animar para a região
          setTimeout(() => {
            if (mapRef.current) {
              mapRef.current.animateToRegion(newRegion, 500);
            }
          }, 100);
        }
        
        // Assine atualizações de localização
        locationSubscription = await Location.watchPositionAsync(
          {
            accuracy: Location.Accuracy.Balanced,
            timeInterval: 5000, // 10 segundos
            distanceInterval: 10, // 10 metros
          },
          (newLocation) => {
            setLocation(newLocation);
          }
        );
      } catch (error) {
        console.error("Error setting up location:", error);
        setErrorMsg("Não foi possível obter a localização");
        setShowMap(false);
      }
    };

    setupLocation();

    // Cleanup function
    return () => {
      if (locationSubscription) {
        locationSubscription.remove();
      }
    };
  }, []);

  // Lidar com errors no carregamento do mapa
  const handleMapError = () => {
    console.log("Erro ao carregar o mapa");
    setShowMap(false);
  };

  // Função para lidar com o sucesso do carregamento do mapa
  const handleMapReady = () => {
    // Se temos localização, anime até lá
    if (location && mapRef.current) {
      mapRef.current.animateToRegion({
        latitude: location.coords.latitude,
        longitude: location.coords.longitude,
        latitudeDelta: 0.015,
        longitudeDelta: 0.0121,
      }, 500);
    }
  };

  return (
    <View style={styles.mapContainer}>
      {showMap ? (
        <MapView
          ref={mapRef}
          style={styles.map}
          initialRegion={region}
          showsUserLocation={true}
          onMapReady={handleMapReady}
          onError={handleMapError}
          // Ajuste para melhorar a renderização e performance
          moveOnMarkerPress={false}
          rotateEnabled={false}
          loadingEnabled={true}
          loadingIndicatorColor="#666"
          loadingBackgroundColor="#eeeeee"
        />
      ) : (
        <View style={styles.fallbackContainer}>
          <Image
            source={require('../../../assets/images/google-map-example-blog.png')}
            style={styles.fallbackImage}
            resizeMode="cover"
          />
          {errorMsg && <Text style={styles.errorText}>{errorMsg}</Text>}
        </View>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  mapContainer: {
    flex: 1,
    width: '100%',
    height: '100%',
    overflow: 'hidden',
    borderRadius: 8,
  },
  map: {
    width: '100%',
    height: '100%',
  },
  fallbackContainer: {
    flex: 1,
    position: 'relative',
  },
  fallbackImage: {
    width: '100%',
    height: '100%',
    borderRadius: 8,
  },
  errorText: {
    position: 'absolute',
    bottom: 10,
    left: 10,
    backgroundColor: 'rgba(255,255,255,0.7)',
    padding: 5,
    borderRadius: 4,
    color: 'red',
  }
});

export default MapContainer;