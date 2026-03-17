import React from 'react';
import { useNavigation } from '@react-navigation/native';
import { View, Text, Image, StyleSheet, TouchableOpacity } from 'react-native';

const ProductCard = ({ commerce }) => {
  const navigation = useNavigation();

  return (
    <TouchableOpacity
      style={styles.card}
      onPress={() => navigation.navigate('CommerceDetail', { commerce })}
    >
      <Image source={commerce.image} style={styles.image} resizeMode="cover" />
      <View style={styles.info}>
        <Text style={styles.name}>{commerce.name}</Text>
        <Text style={styles.category}>{commerce.category}</Text>
        <Text style={styles.rating}>⭐ {commerce.rating}</Text>
      </View>
    </TouchableOpacity>
  );
};

export default ProductCard;

const styles = StyleSheet.create({
  card: {
    backgroundColor: '#F2F2F2',
    borderRadius: 12,
    overflow: 'hidden',
    width: '48%',
    marginBottom: 16,
    elevation: 2,
  },
  image: {
    width: '100%',
    height: 120,
  },
  info: {
    padding: 10,
  },
  name: {
    fontSize: 14,
    fontWeight: '600',
    marginBottom: 4,
  },
  category: {
    fontSize: 12,
    color: '#175560',
  },
  rating: {
    marginTop: 6,
    fontSize: 12,
    fontWeight: '600',
  },
});
