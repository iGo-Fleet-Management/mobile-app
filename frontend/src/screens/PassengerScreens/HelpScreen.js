import React from 'react';
import { View, StyleSheet } from 'react-native';
import Header from '../../components/common/Header';
import HelpItem from '../../components/help/HelpItem';
import ContactSection from '../../components/help/ContactSection';
import { SafeAreaView } from 'react-native-safe-area-context';

const HelpScreen = ({ navigation }) => {
  return (
    <SafeAreaView style={styles.helpContainer} edges={['top']}>
    <View style={styles.helpContainer}>
      <Header 
        title="Central de Ajuda" 
        onArrowBackPress={() => navigation.goBack()} 
      />
      
      <View style={styles.helpCard}>
        <HelpItem 
          icon="directions-car"
          title="Acompanhamento em tempo real"
          description="Acompanhe a localização do seu motorista em tempo real no mapa."
        />
        
        <HelpItem 
          icon="toggle-on"
          title="Status 'Liberado'"
          description="Ative esta opção quando estiver pronto para o embarque."
        />
        
        <ContactSection 
          onContactPress={() => {/* Implement contact support logic */}}
        />
      </View>
    </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  helpContainer: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  helpCard: {
    backgroundColor: '#ffffff',
    borderRadius: 8,
    padding: 20,
    margin: 15,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
});

export default HelpScreen;