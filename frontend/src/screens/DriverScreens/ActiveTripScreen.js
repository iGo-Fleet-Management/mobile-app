import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, SafeAreaView, Dimensions } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { MaterialIcons, Ionicons } from '@expo/vector-icons';
import MapView, { Polyline, Marker } from 'react-native-maps';

const { width, height } = Dimensions.get('window');

const ActiveTripScreen = () => {
  const navigation = useNavigation();
  const [darkMode, setDarkMode] = useState(true);
  const [showRouteInfo, setShowRouteInfo] = useState(true);
  
  // Mock data for route
  const routeInfo = {
    duration: '13 min',
    distance: '7,2 km',
    route: 'Por Av. Pedro Linhares Gomes Ipatinga; Av. Pr...',
    status: 'Melhor rota, trânsito normal',
    alternativeTime: '18 min',
    bestTime: '13 min',
    locationName: 'Mata da Usipa'
  };
  
  // Mock data for route coordinates
  const routeCoordinates = [
    { latitude: -19.4652, longitude: -42.5472 }, // Starting point
    { latitude: -19.4730, longitude: -42.5485 },
    { latitude: -19.4780, longitude: -42.5510 },
    { latitude: -19.4830, longitude: -42.5400 },
    { latitude: -19.4900, longitude: -42.5350 },
    { latitude: -19.4950, longitude: -42.5300 }, // Ending point
  ];

  const markers = {
    origin: { latitude: -19.4950, longitude: -42.5300, title: 'Origem' },
    destination: { latitude: -19.4652, longitude: -42.5472, title: 'Destino' }
  };

  const initialRegion = {
    latitude: -19.4800,
    longitude: -42.5400,
    latitudeDelta: 0.0922,
    longitudeDelta: 0.0421,
  };

  const handleBackPress = () => {
    navigation.goBack();
  };

  const handleFinishTrip = () => {
    // Logic to handle finishing the trip
    navigation.goBack();
  };

  const handleStartNow = () => {
    setShowRouteInfo(false);
  };

  const handleStartLater = () => {
    navigation.goBack();
  };

  const toggleDarkMode = () => {
    setDarkMode(!darkMode);
  };

  const mapStyle = darkMode ? [
    {
      "elementType": "geometry",
      "stylers": [
        {
          "color": "#212121"
        }
      ]
    },
    {
      "elementType": "labels.icon",
      "stylers": [
        {
          "visibility": "off"
        }
      ]
    },
    {
      "elementType": "labels.text.fill",
      "stylers": [
        {
          "color": "#757575"
        }
      ]
    },
    {
      "elementType": "labels.text.stroke",
      "stylers": [
        {
          "color": "#212121"
        }
      ]
    },
    {
      "featureType": "administrative",
      "elementType": "geometry",
      "stylers": [
        {
          "color": "#757575"
        }
      ]
    },
    {
      "featureType": "administrative.country",
      "elementType": "labels.text.fill",
      "stylers": [
        {
          "color": "#9e9e9e"
        }
      ]
    },
    {
      "featureType": "administrative.land_parcel",
      "stylers": [
        {
          "visibility": "off"
        }
      ]
    },
    {
      "featureType": "administrative.locality",
      "elementType": "labels.text.fill",
      "stylers": [
        {
          "color": "#bdbdbd"
        }
      ]
    },
    {
      "featureType": "poi",
      "elementType": "labels.text.fill",
      "stylers": [
        {
          "color": "#757575"
        }
      ]
    },
    {
      "featureType": "poi.park",
      "elementType": "geometry",
      "stylers": [
        {
          "color": "#181818"
        }
      ]
    },
    {
      "featureType": "poi.park",
      "elementType": "labels.text.fill",
      "stylers": [
        {
          "color": "#616161"
        }
      ]
    },
    {
      "featureType": "poi.park",
      "elementType": "labels.text.stroke",
      "stylers": [
        {
          "color": "#1b1b1b"
        }
      ]
    },
    {
      "featureType": "road",
      "elementType": "geometry.fill",
      "stylers": [
        {
          "color": "#2c2c2c"
        }
      ]
    },
    {
      "featureType": "road",
      "elementType": "labels.text.fill",
      "stylers": [
        {
          "color": "#8a8a8a"
        }
      ]
    },
    {
      "featureType": "road.arterial",
      "elementType": "geometry",
      "stylers": [
        {
          "color": "#373737"
        }
      ]
    },
    {
      "featureType": "road.highway",
      "elementType": "geometry",
      "stylers": [
        {
          "color": "#3c3c3c"
        }
      ]
    },
    {
      "featureType": "road.highway.controlled_access",
      "elementType": "geometry",
      "stylers": [
        {
          "color": "#4e4e4e"
        }
      ]
    },
    {
      "featureType": "road.local",
      "elementType": "labels.text.fill",
      "stylers": [
        {
          "color": "#616161"
        }
      ]
    },
    {
      "featureType": "transit",
      "elementType": "labels.text.fill",
      "stylers": [
        {
          "color": "#757575"
        }
      ]
    },
    {
      "featureType": "water",
      "elementType": "geometry",
      "stylers": [
        {
          "color": "#000000"
        }
      ]
    },
    {
      "featureType": "water",
      "elementType": "labels.text.fill",
      "stylers": [
        {
          "color": "#3d3d3d"
        }
      ]
    }
  ] : [];

  return (
    <SafeAreaView style={styles.container}>
      <MapView 
        style={styles.map} 
        initialRegion={initialRegion}
        customMapStyle={mapStyle}
      >
        <Polyline
          coordinates={routeCoordinates}
          strokeColor={darkMode ? "#00AAFF" : "#4285F4"}
          strokeWidth={5}
        />
        <Marker 
          coordinate={markers.origin}
          title={markers.origin.title}
        >
          <View style={styles.markerOrigin}>
            <MaterialIcons name="flag" size={24} color="#FFF" />
          </View>
        </Marker>
        <Marker 
          coordinate={markers.destination}
          title={markers.destination.title}
        >
          <View style={styles.markerDestination}>
            <MaterialIcons name="location-on" size={24} color="#FFF" />
          </View>
        </Marker>
      </MapView>

      {/* Top Navigation */}
      <View style={styles.topNavigation}>
        <TouchableOpacity onPress={handleBackPress} style={styles.backButton}>
          <MaterialIcons name="arrow-back" size={24} color="#000" />
        </TouchableOpacity>
        
        {darkMode && (
          <View style={styles.avoidContainer}>
            <Text style={styles.avoidText}>Evitar</Text>
            <MaterialIcons name="keyboard-arrow-down" size={24} color="#00AAFF" />
          </View>
        )}
      </View>

      {/* Route Time Indicator */}
      {darkMode && (
        <View style={styles.routeTimeIndicator}>
          <Text style={styles.routeTimeText}>{routeInfo.bestTime}</Text>
          <Text style={styles.routeIndicatorLabel}>Melhor</Text>
        </View>
      )}

      {/* Alternative Time Indicator */}
      {darkMode && (
        <View style={styles.alternativeTimeIndicator}>
          <Text style={styles.alternativeTimeText}>{routeInfo.alternativeTime}</Text>
        </View>
      )}

      {/* Location Indicator */}
      {darkMode && (
        <View style={styles.locationIndicator}>
          <Text style={styles.locationName}>{routeInfo.locationName}</Text>
        </View>
      )}

      {/* Bottom Sheet with Route Information */}
      <View style={styles.bottomSheet}>
        {showRouteInfo ? (
          <>
            <View style={styles.routeInfoContainer}>
              <Text style={styles.routeTime}>{routeInfo.duration}</Text>
              <Text style={styles.routeDistance}>{routeInfo.distance}</Text>
            </View>
            <Text style={styles.routePath}>{routeInfo.route}</Text>
            <Text style={styles.routeStatus}>{routeInfo.status}</Text>
            
            <View style={styles.buttonsContainer}>
              <TouchableOpacity style={styles.laterButton} onPress={handleStartLater}>
                <Text style={styles.laterButtonText}>Sair depois</Text>
              </TouchableOpacity>
              <TouchableOpacity style={styles.startButton} onPress={handleStartNow}>
                <Text style={styles.startButtonText}>Ir agora</Text>
              </TouchableOpacity>
            </View>
          </>
        ) : (
          <TouchableOpacity style={styles.finishButton} onPress={handleFinishTrip}>
            <Text style={styles.finishButtonText}>Finalizar Trajeto</Text>
          </TouchableOpacity>
        )}
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  map: {
    width: width,
    height: height,
  },
  topNavigation: {
    position: 'absolute',
    top: 40,
    left: 0,
    right: 0,
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
  },
  backButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#fff',
    justifyContent: 'center',
    alignItems: 'center',
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 2,
  },
  avoidContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.7)',
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
  },
  avoidText: {
    color: '#00AAFF',
    fontWeight: 'bold',
    marginRight: 4,
  },
  routeTimeIndicator: {
    position: 'absolute',
    top: '30%',
    left: '50%',
    backgroundColor: 'rgba(0, 170, 255, 0.8)',
    padding: 8,
    borderRadius: 8,
    elevation: 3,
    transform: [{ translateX: -40 }],
  },
  routeTimeText: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 18,
    textAlign: 'center',
  },
  routeIndicatorLabel: {
    color: '#fff',
    fontSize: 14,
    textAlign: 'center',
  },
  alternativeTimeIndicator: {
    position: 'absolute',
    bottom: '50%',
    left: '50%',
    backgroundColor: 'rgba(0, 0, 0, 0.7)',
    padding: 8,
    borderRadius: 8,
    elevation: 3,
    transform: [{ translateX: -30 }],
  },
  alternativeTimeText: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 16,
  },
  locationIndicator: {
    position: 'absolute',
    top: '25%',
    right: '30%',
    maxWidth: 120,
  },
  locationName: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 16,
    textShadowColor: 'rgba(0, 0, 0, 0.75)',
    textShadowOffset: { width: -1, height: 1 },
    textShadowRadius: 10,
  },
  bottomSheet: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: '#fff',
    borderTopLeftRadius: 16,
    borderTopRightRadius: 16,
    paddingVertical: 16,
    paddingHorizontal: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: -2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 4,
  },
  routeInfoContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  routeTime: {
    fontSize: 24,
    fontWeight: 'bold',
  },
  routeDistance: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#555',
  },
  routePath: {
    fontSize: 16,
    color: '#333',
    marginTop: 8,
  },
  routeStatus: {
    fontSize: 14,
    color: '#666',
    marginTop: 4,
    marginBottom: 16,
  },
  buttonsContainer: {
    flexDirection: 'row',
    marginTop: 16,
  },
  laterButton: {
    flex: 1,
    backgroundColor: '#eee',
    paddingVertical: 16,
    borderRadius: 24,
    marginRight: 8,
    alignItems: 'center',
  },
  laterButtonText: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#007AFF',
  },
  startButton: {
    flex: 1,
    backgroundColor: '#007AFF',
    paddingVertical: 16,
    borderRadius: 24,
    marginLeft: 8,
    alignItems: 'center',
  },
  startButtonText: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#fff',
  },
  finishButton: {
    backgroundColor: '#4285F4',
    paddingVertical: 16,
    borderRadius: 12,
    alignItems: 'center',
  },
  finishButtonText: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#fff',
  },
  markerOrigin: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: '#4285F4',
    justifyContent: 'center',
    alignItems: 'center',
  },
  markerDestination: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: '#D23939',
    justifyContent: 'center',
    alignItems: 'center',
  },
});

export default ActiveTripScreen; 