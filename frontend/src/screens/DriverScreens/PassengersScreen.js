import React, { useState, useEffect } from 'react';
import { View, StyleSheet, ScrollView, Alert } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useIsFocused } from '@react-navigation/native';

// Import components
import Header from '../../components/common/Header';
import SearchBar from '../../components/common/SearchBar';
import PassengerItem from '../../components/passengers/PassengerItem';
import AddPassengerButton from '../../components/passengers/AddPassengerButton';

// Lista inicial de passageiros
const initialPassageiros = [
  { id: 1, name: 'Hugo de Melo Carvalho', avatar: null },
  { id: 2, name: 'Iago Carro Guimarães', avatar: null },
  { id: 3, name: 'Lucas Barcelos Gomes', avatar: null },
  { id: 4, name: 'Paulo Henrique Reis', avatar: null },
  { id: 5, name: 'Rafael Galinari', avatar: null },
  { id: 6, name: 'Samuel Andrade', avatar: null },
];

export default function PassengersScreen({ navigation, route }) {
  const [search, setSearch] = useState('');
  const [passageiros, setPassageiros] = useState(initialPassageiros);
  const isFocused = useIsFocused();
  
  // Escutar parâmetros da rota quando a tela recebe foco
  useEffect(() => {
    if (isFocused && route.params?.newPassenger) {
      const { firstName, lastName } = route.params.newPassenger;
      // Criar novo passageiro com ID único
      const newId = Math.max(...passageiros.map(p => p.id)) + 1;
      const newPassageiro = {
        id: newId,
        name: `${firstName} ${lastName}`,
        avatar: null
      };
      
      // Adicionar novo passageiro à lista
      setPassageiros(prev => [...prev, newPassageiro]);
      
      // Limpar parâmetros para evitar adições duplicadas
      navigation.setParams({ newPassenger: null });
      
      // Mostrar notificação de sucesso
      Alert.alert("Sucesso", "Passageiro adicionado com sucesso!");
    }
  }, [isFocused, route.params?.newPassenger]);

  const filteredPassageiros = passageiros.filter(passageiro => 
    passageiro.name.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
    <View style={styles.container}>
      <Header 
        title="Passageiros" 
      />

      <SearchBar 
        placeholder="Procurar passageiro"
        value={search}
        onChangeText={setSearch}
      />

      <ScrollView style={styles.listContainer}>
        {filteredPassageiros.map(passageiro => (
          <PassengerItem 
            key={passageiro.id}
            name={passageiro.name}
            avatar={passageiro.avatar}
            onPress={() => {/* Handle passenger selection */}}
          />
        ))}
      </ScrollView>

      <AddPassengerButton 
        onPress={() => navigation.navigate('AddPassenger')}
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
  listContainer: {
    flex: 1,
  },
});