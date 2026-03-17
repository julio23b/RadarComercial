import React from 'react';
import { useNavigation } from '@react-navigation/native';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import ProgressiveImage from './ProgressiveImage';

const ProductCard = ({ product, isFavorite = false, onToggleFavorite }) => {
  const navigation = useNavigation();

  return (
    <TouchableOpacity style={styles.card} onPress={() => navigation.navigate('ProductDetail', { product })}>
      <ProgressiveImage source={product.image} style={styles.image} />
      <TouchableOpacity style={styles.favoriteButton} onPress={() => onToggleFavorite?.(product.id)}>
        <Ionicons name={isFavorite ? 'heart' : 'heart-outline'} size={18} color={isFavorite ? '#d9534f' : '#175560'} />
      </TouchableOpacity>
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
  favoriteButton: {
    position: 'absolute',
    top: 8,
    right: 8,
    backgroundColor: '#ffffffd9',
    borderRadius: 16,
    padding: 4,
  },
  info: {
    padding: 10,
    alignItems: 'center',
  },
  name: {
    fontSize: 14,
    fontWeight: '500',
    marginBottom: 6,
    textAlign: 'center',
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
