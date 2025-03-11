import React, { useState } from 'react';
import { View, StyleSheet, ScrollView } from 'react-native';

// Import components
import Header from '../components/common/Header';
import SearchBar from '../components/common/SearchBar';
import PassengerItem from '../components/passengers/PassengerItem';
import AddPassengerButton from '../components/passengers/AddPassengerButton';

const passageiros = [
  { id: 1, name: 'Hugo de Melo Carvalho', avatar: null },
  { id: 2, name: 'Iago Carro Guimarães', avatar: null },
  { id: 3, name: 'Lucas Barcelos Gomes', avatar: null },
  { id: 4, name: 'Paulo Henrique Reis', avatar: null },
  { id: 5, name: 'Rafael Galinari', avatar: null },
  { id: 6, name: 'Samuel Andrade', avatar: null },
];

export default function PassengersScreen({ navigation }) {
  const [search, setSearch] = useState('');

  const filteredPassageiros = passageiros.filter(passageiro => 
    passageiro.name.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <View style={styles.container}>
      <Header 
        title="Passageiros" 
        onMenuPress={() => navigation.openDrawer()} 
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
        onPress={() => {/* Handle add passenger */}}
      />
    </View>
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