import React from 'react';
import { Text, StyleSheet, Image, View, ScrollView, TouchableOpacity, Linking } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

const AboutScreen = () => {
  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: '#fff' }} edges={['top', 'left', 'right']}>
      <ScrollView contentContainerStyle={styles.scrollContainer}>
        <Image style={styles.avatar} source={require('../../assets/logo/logoLaConquista.png')} />
        <Text style={styles.title}>Perfil</Text>
        <Text style={styles.subtitle}>Comunidad Radar Comercial Once</Text>

        <View style={styles.card}>
          <Text style={styles.label}>Zona favorita</Text>
          <Text style={styles.value}>Once - Balvanera</Text>

          <Text style={styles.label}>Notificaciones</Text>
          <Text style={styles.value}>Promociones y novedades activadas</Text>

          <Text style={styles.label}>Soporte</Text>
          <TouchableOpacity onPress={() => Linking.openURL('mailto:radarcomercialonce@gmail.com')}>
            <Text style={styles.link}>radarcomercialonce@gmail.com</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

export default AboutScreen;

const styles = StyleSheet.create({
  scrollContainer: { padding: 20, alignItems: 'center' },
  avatar: { width: 140, height: 140, resizeMode: 'contain', marginTop: 10 },
  title: { fontSize: 24, fontWeight: 'bold', marginTop: 10 },
  subtitle: { color: '#8a9597', marginTop: 4 },
  card: {
    marginTop: 20,
    width: '100%',
    backgroundColor: '#f5f5f5',
    borderRadius: 12,
    padding: 16,
  },
  label: { fontSize: 14, fontWeight: '700', marginTop: 10 },
  value: { color: '#333', marginTop: 2 },
  link: { color: '#175560', marginTop: 2, fontWeight: '600' },
});
