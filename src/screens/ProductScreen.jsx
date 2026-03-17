import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, ActivityIndicator } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import SearchBar from '../components/SearchBar';
import ProductCard from '../components/ProductCard';
import { useCommercesSearch } from '../hooks/useCommercesSearch';

const ProductScreen = () => {
  const onFilterPress = () => setMostrarFiltros(!mostrarFiltros);
  const [searchQuery, setSearchQuery] = useState('');
  const [categoriaSeleccionada, setCategoriaSeleccionada] = useState(null);
  const [mostrarFiltros, setMostrarFiltros] = useState(true);

  const categories = ['Alfombras', 'Caminos de mesa', 'Trapos/Rejillas'];

  const { data: commerces = [], isFetching } = useCommercesSearch({
    query: searchQuery,
    category: categoriaSeleccionada,
    aroundLatLng: '-27.7834,-64.2642',
    aroundRadius: 15000,
  });

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: '#fff' }} edges={['top', 'left', 'right']}>
      <ScrollView contentContainerStyle={styles.scrollContainer}>
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

        <View style={styles.sectionContainer}>
          {isFetching ? <ActivityIndicator size="small" color="#175560" style={styles.loader} /> : null}
          <View style={styles.productGrid}>
            {commerces.map((commerce) => (
              <ProductCard key={commerce.objectID ?? commerce.id} product={commerce} />
            ))}
          </View>
        </View>
      </ScrollView>
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
  sectionContainer: {
    paddingHorizontal: 20,
    marginTop: 20,
  },
  productGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
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
  loader: {
    marginBottom: 10,
  },
});
