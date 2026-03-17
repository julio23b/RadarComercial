import React from 'react';
import { View, Text, FlatList, StyleSheet, Image, TouchableOpacity } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { commerces } from '../data/commerces';

export default function CartScreen() {
  const favorites = commerces.filter((commerce) => commerce.rating >= 4.5);

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: '#fff' }} edges={['top', 'left', 'right']}>
      <FlatList
        data={favorites}
        keyExtractor={(item) => `${item.id}`}
        contentContainerStyle={styles.scrollContainer}
        ListHeaderComponent={<Text style={styles.title}>Favoritos</Text>}
        ListEmptyComponent={<Text style={styles.empty}>Todavía no guardaste comercios favoritos.</Text>}
        renderItem={({ item }) => (
          <View style={styles.itemContainer}>
            <Image source={item.image} style={styles.image} />
            <View style={{ flex: 1, marginLeft: 12 }}>
              <Text style={styles.name}>{item.name}</Text>
              <Text style={styles.text}>{item.category}</Text>
              <Text style={styles.text}>{item.address}</Text>
              <Text style={styles.text}>⭐ {item.rating}</Text>
              <TouchableOpacity style={styles.button}>
                <Text style={styles.buttonText}>Ver detalle</Text>
              </TouchableOpacity>
            </View>
          </View>
        )}
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  scrollContainer: { paddingHorizontal: 20, paddingTop: 10, paddingBottom: 40 },
  title: { fontSize: 24, fontWeight: 'bold', marginBottom: 16 },
  empty: { fontSize: 16, color: '#8a9597', textAlign: 'center', marginTop: 40 },
  itemContainer: {
    flexDirection: 'row',
    backgroundColor: '#f2f2f2',
    borderRadius: 12,
    padding: 12,
    marginBottom: 16,
    alignItems: 'center',
  },
  image: { width: 80, height: 80, borderRadius: 10, resizeMode: 'cover' },
  name: { fontSize: 16, fontWeight: '600', color: '#000' },
  text: { fontSize: 13, color: '#333', marginTop: 2 },
  button: { marginTop: 8, backgroundColor: '#175560', paddingVertical: 8, borderRadius: 8 },
  buttonText: { color: '#fff', textAlign: 'center', fontWeight: '600' },
});
