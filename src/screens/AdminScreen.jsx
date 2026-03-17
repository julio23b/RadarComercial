import React from 'react';
import { SafeAreaView } from 'react-native-safe-area-context';
import { View, Text, StyleSheet } from 'react-native';

const AdminScreen = () => {
  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.card}>
        <Text style={styles.title}>Panel Admin</Text>
        <Text style={styles.text}>Gestioná comercios, destacados y contenido de Radar Comercial Once.</Text>
        <Text style={styles.text}>Próximamente: alta/edición de comercios conectada a Supabase.</Text>
      </View>
    </SafeAreaView>
  );
};

export default AdminScreen;

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#fff', padding: 20 },
  card: { backgroundColor: '#f1f6f7', borderRadius: 12, padding: 16 },
  title: { fontSize: 22, fontWeight: '700', marginBottom: 10, color: '#175560' },
  text: { color: '#333', marginBottom: 8 },
});
