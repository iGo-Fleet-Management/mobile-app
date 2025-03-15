import React, { useState } from 'react';
import { View, Text, Image, StyleSheet } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import UserIcon from '../components/common/UserIcon';

// Components
import Header from '../components/common/Header';
import TravelModeSelector from '../components/home/TravelModeSelector';
import StatusSwitch from '../components/home/StatusSwitch';
import AlertBox from '../components/home/AlertBox';
import MapContainer from '../components/home/MapContainer';
import BottomUserBar from '../components/home/BottomUserBar';

// Assets
import MapImage from '../../assets/images/google-map-example-blog.png';


export default function HomeScreen({ navigation }) {
  const [travelMode, setTravelMode] = useState('roundTrip');
  const [isLiberado, setIsLiberado] = useState(false);

  const handleUserIconPress = () => {
    navigation.navigate('Profile');
  };

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      <View style={styles.container}>
        <View style={styles.headerContainer}>
          <Header 
            title="iGO" 
            onMenuPress={() => navigation.openDrawer()} 
          />
          <View style={styles.userIconWrapper}>
            <UserIcon onPress={handleUserIconPress} userName="John" />
          </View>
        </View>

        <View style={styles.dateCard}>
          <Text style={styles.dayOfWeek}>Segunda-Feira</Text>
          <Text style={styles.date}>27 de Novembro de 2023</Text>
          
          <TravelModeSelector 
            selectedMode={travelMode}
            onSelectMode={setTravelMode}
          />
        </View>

        <StatusSwitch 
          value={isLiberado}
          onValueChange={setIsLiberado}
          onHelpPress={() => navigation.navigate('Ajuda')}
        />

        <AlertBox 
          message="Seu motorista já iniciou o trajeto. Fique atento!"
          onEditPress={() => {/* Handle edit */}}
        />

        <MapContainer 
          source={MapImage}
        />

        <BottomUserBar 
          userName="John Doe"
        />
      </View>
    </SafeAreaView>
  );
}

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