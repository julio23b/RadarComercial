import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import SearchBar from '../components/SearchBar';
import { commerces } from '../data/commerces';
import ProductCard from '../components/ProductCard';
import ImageCarousel from '../components/ImageCarousel';

const HomeScreen = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [showFilters, setShowFilters] = useState(false);

  const categories = [...new Set(commerces.map((commerce) => commerce.category))];

  const featuredCommerces = commerces.filter(
    (commerce) =>
      commerce.isFeatured &&
      commerce.name.toLowerCase().includes(searchQuery.toLowerCase()) &&
      (!selectedCategory || commerce.category === selectedCategory)
  );

  const destacados = commerces.slice(0, 5).map((commerce) => commerce.image);

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: '#fff' }} edges={['top', 'left', 'right']}>
      <ScrollView contentContainerStyle={styles.scrollContainer}>
        <View style={styles.header}>
          <Text style={styles.title}>Radar Comercial Once</Text>
          <Text style={styles.subtitle}>Descubrí locales recomendados del barrio en un solo lugar.</Text>
        </View>

        <SearchBar value={searchQuery} onChangeText={setSearchQuery} onFilterPress={() => setShowFilters(!showFilters)} />

        {showFilters && (
          <View style={styles.buttonGroup}>
            {categories.map((category) => (
              <TouchableOpacity
                key={category}
                style={[
                  styles.categoryButton,
                  selectedCategory === category && styles.activeCategoryButton,
                ]}
                onPress={() => setSelectedCategory(selectedCategory === category ? null : category)}
              >
                <Text
                  style={[
                    styles.categoryButtonText,
                    selectedCategory === category && styles.activeCategoryButtonText,
                  ]}
                >
                  {category}
                </Text>
              </TouchableOpacity>
            ))}
          </View>
        )}

        <ImageCarousel images={destacados} title="Comercios destacados" />

        <View style={styles.sectionContainer}>
          <Text style={styles.sectionTitle}>Recomendados para hoy</Text>
          <View style={styles.productGrid}>
            {featuredCommerces.map((commerce) => (
              <ProductCard key={commerce.id} commerce={commerce} />
            ))}
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

export default HomeScreen;

const styles = StyleSheet.create({
  scrollContainer: { paddingBottom: 24 },
  header: { paddingHorizontal: 20 },
  title: { fontSize: 24, fontWeight: 'bold', color: '#000' },
  subtitle: { fontSize: 16, color: '#8a9597', marginTop: 4 },
  sectionContainer: { paddingHorizontal: 20, marginTop: 20 },
  sectionTitle: { fontSize: 18, fontWeight: 'bold', marginBottom: 10, color: '#175560' },
  productGrid: { flexDirection: 'row', flexWrap: 'wrap', justifyContent: 'space-between' },
  buttonGroup: { flexDirection: 'row', flexWrap: 'wrap', gap: 8, paddingHorizontal: 20 },
  categoryButton: { paddingVertical: 8, paddingHorizontal: 12, borderRadius: 20, backgroundColor: '#d3e6e4' },
  activeCategoryButton: { backgroundColor: '#175560' },
  categoryButtonText: { color: '#175560', fontWeight: '500' },
  activeCategoryButtonText: { color: '#fff' },
});
