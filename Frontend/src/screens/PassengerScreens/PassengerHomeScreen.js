import React, { useState } from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

// Components
import Header from '../../components/common/Header';
import UserIcon from '../../components/common/UserIcon';
import TravelModeSelector from '../../components/home/TravelModeSelector';
import StatusSwitch from '../../components/home/StatusSwitch';
import AlertBox from '../../components/home/AlertBox';
import MapContainer from '../../components/home/MapContainer';
import BottomUserBar from '../../components/home/BottomUserBar';

// Assets
import MapImage from '../../../assets/images/google-map-example-blog.png';

const PassengerHomeScreen = ({ navigation }) => {
  const [travelMode, setTravelMode] = useState('roundTrip');
  const [isLiberado, setIsLiberado] = useState(false);

  const handleUserIconPress = () => {
    navigation.navigate('Profile');
  };

  return (
    <SafeAreaView style={styles.container} edges={['top']} testID="passenger-home-screen">
      <View style={styles.container} testID="passenger-home-container">
        {/* Header Section */}
        <View style={styles.headerContainer} testID="header-container">
          <Header 
            title="iGO" 
            testID="app-header"
          />
          <View style={styles.userIconWrapper}>
            <UserIcon 
              onPress={handleUserIconPress} 
              userName="John" 
              testID="user-icon"
            />
          </View>
        </View>

        {/* Date and Travel Mode Section */}
        <View style={styles.dateCard} testID="date-card">
          <Text style={styles.dayOfWeek} testID="day-text">Segunda-Feira</Text>
          <Text style={styles.date} testID="date-text">27 de Novembro de 2023</Text>
          
          <TravelModeSelector 
            selectedMode={travelMode}
            onSelectMode={setTravelMode}
            testID="travel-mode-selector"
          />
        </View>

        {/* Status Switch */}
        <StatusSwitch 
          value={isLiberado}
          onValueChange={setIsLiberado}
          onHelpPress={() => navigation.navigate('Ajuda')}
          testID="status-switch"
        />

        {/* Alert Box */}
        <AlertBox 
          message="Seu motorista já iniciou o trajeto. Fique atento!"
          onEditPress={() => {}}
          testID="alert-box"
        />

        {/* Map Container */}
        <MapContainer 
          source={MapImage}
          testID="map-container"
        />

        {/* Bottom User Bar */}
        <BottomUserBar 
          userName="John Doe"
          testID="bottom-user-bar"
        />
      </View>
    </SafeAreaView>
  );
};
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  headerContainer: {
    position: 'relative',
  },
  userIconWrapper: {
    position: 'absolute',
    right: 15,
    top: 0,
    height: 60,
    justifyContent: 'center',
  },
  dateCard: {
    backgroundColor: '#ffffff',
    borderRadius: 8,
    padding: 15,
    margin: 10,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  dayOfWeek: {
    fontSize: 18,
    fontWeight: 'bold',
    textAlign: 'center',
  },
  date: {
    fontSize: 14,
    color: '#757575',
    textAlign: 'center',
    marginBottom: 15,
  },
});

export default PassengerHomeScreen;