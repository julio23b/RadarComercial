import React from 'react';
import { useNavigation } from '@react-navigation/native';
import { View, Text, Image, StyleSheet, TouchableOpacity } from 'react-native';

const ProductCard = ({ product }) => {
  const navigation = useNavigation();
  return (
    <TouchableOpacity style={styles.card} onPress={() => navigation.navigate('ProductDetail', { product })} >
      <Image source={product.image} style={styles.image} resizeMode="cover" />
      <View style={styles.info}>
        <Text style={styles.name}>{product.name}</Text>
        <View style={styles.bottomRow}>
          <Text style={styles.price}>${product.price}</Text>
        </View>
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
    alignItems: 'center',
  },
  name: {
    fontSize: 14,
    fontWeight: '500',
    marginBottom: 6,
  },
  price: {
    fontSize: 14,
    fontWeight: 'bold',
  },
  bottomRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  
});
