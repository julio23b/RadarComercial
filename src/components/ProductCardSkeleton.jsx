import React from 'react';
import { StyleSheet, View } from 'react-native';

const ProductCardSkeleton = () => (
  <View style={styles.card}>
    <View style={styles.image} />
    <View style={styles.textLine} />
    <View style={[styles.textLine, styles.short]} />
  </View>
);

const styles = StyleSheet.create({
  card: {
    width: '48%',
    backgroundColor: '#f2f2f2',
    borderRadius: 12,
    padding: 10,
    marginBottom: 16,
  },
  image: {
    height: 120,
    borderRadius: 10,
    backgroundColor: '#dfe5e5',
    marginBottom: 10,
  },
  textLine: {
    height: 12,
    borderRadius: 6,
    backgroundColor: '#dfe5e5',
    marginBottom: 8,
  },
  short: {
    width: '60%',
  },
});

export default ProductCardSkeleton;
