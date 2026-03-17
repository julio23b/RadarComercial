import React, { useMemo, useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import SearchBar from '../components/SearchBar';
import { commerces } from '../data/commerces';
import ProductCard from '../components/ProductCard';

const ProductScreen = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [showFilters, setShowFilters] = useState(false);

  const categories = useMemo(
    () => [...new Set(commerces.map((commerce) => commerce.category))],
    []
  );

  const filteredCommerces = commerces.filter(
    (commerce) =>
      commerce.name.toLowerCase().includes(searchQuery.toLowerCase()) &&
      (!selectedCategory || commerce.category === selectedCategory)
  );

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: '#fff' }} edges={['top', 'left', 'right']}>
      <ScrollView contentContainerStyle={styles.scrollContainer}>
        <View style={styles.header}>
          <Text style={styles.title}>Buscar comercios</Text>
          <Text style={styles.subtitle}>Filtrá por rubro y encontrá tu próxima parada en Once.</Text>
        </View>

        <SearchBar value={searchQuery} onChangeText={setSearchQuery} onFilterPress={() => setShowFilters(!showFilters)} />

        {showFilters && (
          <View style={styles.buttonGroup}>
            {categories.map((category) => (
              <TouchableOpacity
                key={category}
                style={[styles.categoryButton, selectedCategory === category && styles.activeCategoryButton]}
                onPress={() => setSelectedCategory(selectedCategory === category ? null : category)}
              >
                <Text style={[styles.categoryButtonText, selectedCategory === category && styles.activeCategoryButtonText]}>
                  {category}
                </Text>
              </TouchableOpacity>
            ))}
          </View>
        )}

        <View style={styles.sectionContainer}>
          <View style={styles.productGrid}>
            {filteredCommerces.map((commerce) => (
              <ProductCard key={commerce.id} commerce={commerce} />
            ))}
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

export default ProductScreen;

const styles = StyleSheet.create({
  scrollContainer: { paddingBottom: 24 },
  header: { paddingHorizontal: 20 },
  title: { fontSize: 24, fontWeight: 'bold', color: '#000' },
  subtitle: { fontSize: 16, color: '#8a9597', marginTop: 4 },
  sectionContainer: { paddingHorizontal: 20, marginTop: 20 },
  productGrid: { flexDirection: 'row', flexWrap: 'wrap', justifyContent: 'space-between' },
  buttonGroup: { flexDirection: 'row', flexWrap: 'wrap', gap: 8, paddingHorizontal: 20 },
  categoryButton: { paddingVertical: 8, paddingHorizontal: 12, borderRadius: 20, backgroundColor: '#d3e6e4' },
  activeCategoryButton: { backgroundColor: '#175560' },
  categoryButtonText: { color: '#175560', fontWeight: '500' },
  activeCategoryButtonText: { color: '#fff' },
});
