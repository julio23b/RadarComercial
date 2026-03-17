import React from 'react';
import { SafeAreaView, Text, Image, StyleSheet, TouchableOpacity } from 'react-native';
import { useAuth } from '../context/AuthContext';

const SplashScreen = () => {
  const { loading } = useAuth();

  return (
    <SafeAreaView style={styles.container}>
      <Image style={styles.logo} source={require('../../assets/logo/logoLaConquista.png')} />
      <TouchableOpacity style={styles.button} disabled>
        <Text style={styles.buttonText}>{loading ? 'Cargando sesión...' : 'Redirigiendo...'}</Text>
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
    width: 365,
    height: 365,
    marginBottom: 60,
  },
  button: {
    backgroundColor: '#175560',
    paddingVertical: 14,
    paddingHorizontal: 40,
    borderRadius: 10,
    opacity: 0.8,
  },

  buttonText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: 'bold',
  },
});
