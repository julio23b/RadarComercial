import React from 'react';
import { View, TextInput, StyleSheet, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

const SearchBar = ({ value, onChangeText, onFilterPress }) => {
  return (
    <View style={styles.container}>
      <TextInput
        style={styles.input}
        placeholder="Busca"
        value={value}
        onChangeText={onChangeText}
      />
      <TouchableOpacity style={styles.iconButton} onPress={onFilterPress}>
        <Ionicons name="options-outline" size={24} color="white" />
      </TouchableOpacity>
    </View>
  );
};

export default SearchBar;


const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    marginVertical: 16,
    marginHorizontal: 20,
    alignItems: 'center',
  },
  input: {
    flex: 1,
    height: 48,
    backgroundColor: '#f0f0f0',
    borderRadius: 12,
    paddingHorizontal: 16,
    fontSize: 16,
  },
  iconButton: {
    marginLeft: 8,
    backgroundColor: '#175560',
    padding: 12,
    borderRadius: 12,
  },
});
