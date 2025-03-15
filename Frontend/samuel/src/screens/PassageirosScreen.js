import React, { useState } from 'react';
import { View, Text, StyleSheet, TextInput, TouchableOpacity, ScrollView, Image } from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';

const passageiros = [
  { id: 1, name: 'Hugo de Melo Carvalho', avatar: null },
  { id: 2, name: 'Iago Carro Guimarães', avatar: null },
  { id: 3, name: 'Lucas Barcelos Gomes', avatar: null },
  { id: 4, name: 'Paulo Henrique Reis', avatar: null },
  { id: 5, name: 'Rafael Galinari', avatar: null },
  { id: 6, name: 'Samuel Andrade', avatar: null },
];

export default function PassageirosScreen() {
  const [search, setSearch] = useState('');

  const filteredPassageiros = passageiros.filter(passageiro => 
    passageiro.name.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Passageiros</Text>
      </View>

      <View style={styles.searchContainer}>
        <MaterialIcons name="search" size={24} color="gray" style={styles.searchIcon} />
        <TextInput
          style={styles.searchInput}
          placeholder="Procurar passageiro"
          value={search}
          onChangeText={setSearch}
        />
      </View>

      <ScrollView style={styles.listContainer}>
        {filteredPassageiros.map(passageiro => (
          <TouchableOpacity key={passageiro.id} style={styles.passengerItem}>
            <View style={styles.avatarContainer}>
              <MaterialIcons name="person" size={24} color="black" />
            </View>
            <Text style={styles.passengerName}>{passageiro.name}</Text>
          </TouchableOpacity>
        ))}
      </ScrollView>

      <TouchableOpacity style={styles.addButton}>
        <Text style={styles.addButtonText}>Adicionar passageiro</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  header: {
    backgroundColor: '#ffffff',
    padding: 15,
    alignItems: 'center',
    borderBottomWidth: 1,
    borderBottomColor: '#e0e0e0',
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: 'bold',
  },
  searchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'white',
    borderRadius: 10,
    margin: 10,
    paddingHorizontal: 10,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  searchIcon: {
    marginRight: 10,
  },
  searchInput: {
    flex: 1,
    height: 50,
  },
  listContainer: {
    flex: 1,
  },
  passengerItem: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'white',
    padding: 15,
    borderBottomWidth: 1,
    borderBottomColor: '#e0e0e0',
  },
  avatarContainer: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#e0e0e0',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 15,
  },
  passengerName: {
    fontSize: 16,
  },
  addButton: {
    backgroundColor: '#3f51b5',
    padding: 15,
    alignItems: 'center',
  },
  addButtonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: 'bold',
  },
});