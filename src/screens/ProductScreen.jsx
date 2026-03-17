import React, { useMemo, useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { FlashList } from '@shopify/flash-list';
import SearchBar from '../components/SearchBar';
import ProductCard from '../components/ProductCard';
import ProductCardSkeleton from '../components/ProductCardSkeleton';
import { useDebouncedValue } from '../hooks/useDebouncedValue';
import { useCommerces } from '../hooks/useCommerces';
import { useFavoritesContext } from '../context/FavoritesContext';

const ProductScreen = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [categoriaSeleccionada, setCategoriaSeleccionada] = useState(null);
  const [mostrarFiltros, setMostrarFiltros] = useState(true);
  const debouncedSearchQuery = useDebouncedValue(searchQuery, 350);
  const { favoriteIds, toggleFavorite } = useFavoritesContext();

  const categories = ['Alfombras', 'Caminos de mesa', 'Trapos/Rejillas'];
  const onFilterPress = () => setMostrarFiltros(!mostrarFiltros);

  const { data: productosFiltrados = [], isLoading, isFetching } = useCommerces({
    searchQuery: debouncedSearchQuery,
    category: categoriaSeleccionada,
  });

  const skeletonData = useMemo(() => Array.from({ length: 6 }, (_, idx) => idx), []);

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: '#fff' }} edges={['top', 'left', 'right']}>
      <View style={styles.header}>
        <Text style={styles.titulo}>Nuestros Productos</Text>
        <Text style={styles.subtitulo}>Explora nuestras categorías.</Text>
      </View>

      <SearchBar value={searchQuery} onChangeText={setSearchQuery} onFilterPress={onFilterPress} />

      <View style={[styles.buttonGroup, { opacity: mostrarFiltros ? 0 : 1 }]}> 
        {categories.map((cat) => (
          <TouchableOpacity
            key={cat}
            style={[styles.categoryButton, categoriaSeleccionada === cat && styles.activeCategoryButton]}
            onPress={() => setCategoriaSeleccionada(categoriaSeleccionada === cat ? null : cat)}
          >
            <Text
              style={[
                styles.categoryButtonText,
                categoriaSeleccionada === cat && styles.activeCategoryButtonText,
              ]}
            >
              {cat}
            </Text>
          </TouchableOpacity>
        ))}
      </View>

      {isFetching && !isLoading && <Text style={styles.updating}>Actualizando resultados...</Text>}

      <FlashList
        data={isLoading ? skeletonData : productosFiltrados}
        numColumns={2}
        estimatedItemSize={220}
        keyExtractor={(item, index) => `${item.id ?? index}`}
        contentContainerStyle={styles.listContainer}
        renderItem={({ item }) =>
          isLoading ? (
            <ProductCardSkeleton />
          ) : (
            <ProductCard
              product={item}
              isFavorite={favoriteIds.includes(item.id)}
              onToggleFavorite={toggleFavorite}
            />
          )
        }
        ListEmptyComponent={<Text style={styles.empty}>No hay productos para esa búsqueda.</Text>}
      />
    </SafeAreaView>
  );
};

export default ProductScreen;

const styles = StyleSheet.create({
  header: {
    paddingHorizontal: 20,
  },
  titulo: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#000',
  },
  subtitulo: {
    fontSize: 16,
    color: '#8a9597',
    marginTop: 4,
  },
  listContainer: {
    paddingHorizontal: 20,
    paddingTop: 20,
  },
  buttonGroup: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    paddingHorizontal: 20,
  },
  categoryButton: {
    paddingVertical: 8,
    paddingHorizontal: 12,
    borderRadius: 20,
    backgroundColor: '#d3e6e4',
  },
  activeCategoryButton: {
    backgroundColor: '#175560',
  },
  categoryButtonText: {
    color: '#175560',
    fontWeight: '500',
  },
  activeCategoryButtonText: {
    color: '#fff',
  },
  empty: {
    textAlign: 'center',
    marginTop: 20,
    color: '#8a9597',
  },
  updating: {
    color: '#8a9597',
    paddingHorizontal: 20,
  },
});
