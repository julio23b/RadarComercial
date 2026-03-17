import React from 'react';
import { View, Text, Image, TouchableOpacity, StyleSheet } from 'react-native';
import { useRoute, useNavigation } from '@react-navigation/native';

export default function ProductDetailScreen() {
  const route = useRoute();
  const navigation = useNavigation();
  const { commerce } = route.params || {};

  if (!commerce) {
    return (
      <View style={styles.centered}>
        <Text>No se encontró el comercio.</Text>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Text style={{ color: '#175560', marginTop: 10 }}>Volver</Text>
        </TouchableOpacity>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <View style={styles.card}>
        <Image source={commerce.image} style={styles.image} />
        <Text style={styles.name}>{commerce.name}</Text>
        <Text style={styles.category}>{commerce.category}</Text>
        <Text style={styles.description}>{commerce.description}</Text>

        <Text style={styles.label}>Dirección</Text>
        <Text style={styles.text}>{commerce.address}</Text>

        <Text style={styles.label}>Horario</Text>
        <Text style={styles.text}>{commerce.hours}</Text>

        <Text style={styles.label}>Calificación</Text>
        <Text style={styles.text}>⭐ {commerce.rating}</Text>

        <Text style={styles.label}>Etiquetas</Text>
        <Text style={styles.text}>{commerce.tags.join(' · ')}</Text>

        <TouchableOpacity style={styles.actionButton}>
          <Text style={styles.actionText}>Ver cómo llegar</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#fff' },
  centered: { flex: 1, justifyContent: 'center', alignItems: 'center' },
  image: { width: '100%', height: 220, resizeMode: 'cover', borderRadius: 12 },
  card: {
    backgroundColor: '#fff',
    padding: 16,
    margin: 16,
    borderRadius: 12,
    elevation: 3,
  },
  name: { fontSize: 22, fontWeight: '700', marginTop: 10 },
  category: { fontSize: 14, color: '#175560', marginTop: 2 },
  description: { marginTop: 10, color: '#444' },
  label: { fontWeight: '700', marginTop: 14, marginBottom: 2 },
  text: { color: '#333' },
  actionButton: {
    marginTop: 16,
    backgroundColor: '#175560',
    paddingVertical: 12,
    borderRadius: 12,
  },
  actionText: { color: '#fff', textAlign: 'center', fontWeight: '700' },
});
