import React from 'react';
import { SafeAreaView } from 'react-native-safe-area-context';
import { FlashList } from '@shopify/flash-list';
import { StyleSheet, Text, View } from 'react-native';
import ProductCard from '../components/ProductCard';
import { useFavoritesContext } from '../context/FavoritesContext';
import { useFavorites } from '../hooks/useFavorites';

const FavoritesScreen = () => {
  const { favoriteIds, toggleFavorite } = useFavoritesContext();
  const { data: favorites = [], isLoading } = useFavorites(favoriteIds);

  return (
    <SafeAreaView style={styles.container} edges={['top', 'left', 'right']}>
      <View style={styles.header}>
        <Text style={styles.title}>Favoritos</Text>
        <Text style={styles.subtitle}>Tus productos guardados.</Text>
      </View>
      <FlashList
        data={favorites}
        numColumns={2}
        estimatedItemSize={220}
        keyExtractor={(item) => `${item.id}`}
        contentContainerStyle={styles.listContainer}
        renderItem={({ item }) => (
          <ProductCard product={item} isFavorite onToggleFavorite={toggleFavorite} />
        )}
        ListEmptyComponent={
          !isLoading && <Text style={styles.empty}>Todavía no agregaste productos a favoritos.</Text>
        }
      />
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#fff' },
  header: { paddingHorizontal: 20 },
  title: { fontSize: 24, fontWeight: 'bold', color: '#000' },
  subtitle: { fontSize: 16, color: '#8a9597', marginTop: 4 },
  listContainer: { paddingHorizontal: 20, paddingTop: 20 },
  empty: { textAlign: 'center', marginTop: 28, color: '#8a9597' },
});

export default FavoritesScreen;
