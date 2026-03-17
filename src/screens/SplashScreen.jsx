import React from 'react';
import { SafeAreaView, Text, Image, StyleSheet, TouchableOpacity } from 'react-native';

const SplashScreen = ({ navigation }) => {
  const handleEnter = () => {
    navigation.replace('MainTabs');
  };

  return (
    <SafeAreaView style={styles.container}>
      <Image
        style={styles.logo}
        source={require('../../assets/logo/logoLaConquista.png')}
      />
      <Text style={styles.title}>Radar Comercial Once</Text>
      <Text style={styles.subtitle}>Tu guía para descubrir comercios, promociones y novedades del barrio.</Text>
      <TouchableOpacity style={styles.button} onPress={handleEnter}>
        <Text style={styles.buttonText}>Explorar</Text>
      </TouchableOpacity>
    </SafeAreaView>
  );
};

export default SplashScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 20,
  },
  logo: {
    width: 260,
    height: 260,
    marginBottom: 20,
  },
  title: { fontSize: 28, fontWeight: '700', color: '#175560', textAlign: 'center' },
  subtitle: { fontSize: 16, textAlign: 'center', color: '#8a9597', marginTop: 10, marginBottom: 30 },
  button: {
    backgroundColor: '#175560',
    paddingVertical: 14,
    paddingHorizontal: 40,
    borderRadius: 10,
  },
  buttonText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: 'bold',
  },
});
