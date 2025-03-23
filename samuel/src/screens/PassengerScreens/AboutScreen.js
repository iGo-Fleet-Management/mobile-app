import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import Header from '../../components/common/Header';
import { FontAwesome5 } from '@expo/vector-icons';
import { SafeAreaView } from 'react-native-safe-area-context';

const AboutScreen = ({ navigation }) => {
  return (
    <SafeAreaView style={styles.aboutContainer} edges={['top']}>
    <View style={styles.aboutContainer}>
      <Header 
        title="Sobre o iGO" 
        onArrowBackPress={() => navigation.goBack()}  
      />
      
      <View style={styles.aboutCard}>
        <Text style={styles.aboutTitle}>iGO</Text>
        <Text style={styles.aboutVersion}>Versão 1.0.0</Text>
        
        <Text style={styles.aboutDescription}>
          O iGO é um aplicativo de transporte desenvolvido para facilitar seus deslocamentos diários com 
          segurança e praticidade.
        </Text>
        
        <View style={styles.featureItem}>
          <FontAwesome5 name="map-marked-alt" size={22} color="#4285F4" />
          <Text style={styles.featureText}>Acompanhamento em tempo real</Text>
        </View>
        
        <Text style={styles.aboutFooter}>
          Desenvolvido como projeto acadêmico
        </Text>
      </View>
    </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  aboutContainer: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  aboutCard: {
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
  aboutTitle: {
    fontSize: 22,
    fontWeight: 'bold',
    textAlign: 'center',
    color: '#3f51b5',
  },
  aboutVersion: {
    fontSize: 14,
    color: '#757575',
    textAlign: 'center',
    marginBottom: 20,
  },
  aboutDescription: {
    fontSize: 15,
    lineHeight: 22,
    marginBottom: 20,
    textAlign: 'center',
  },
  featureItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 15,
  },
  featureText: {
    marginLeft: 15,
    fontSize: 15,
  },
  aboutFooter: {
    marginTop: 30,
    textAlign: 'center',
    fontSize: 14,
    color: '#9e9e9e',
    fontStyle: 'italic',
  },
});

export default AboutScreen;