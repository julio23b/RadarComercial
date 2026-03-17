import React from 'react';
import { Text, StyleSheet, Image, View, ScrollView, TouchableOpacity, Linking } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import ImageCarousel from '../components/ImageCarousel';
import MapView, { Marker } from 'react-native-maps';
import { trackEvent } from '../../mobile-app/services/analytics';

const STORE_LOCATION = {
  latitude: -30.5896101,
  longitude: -58.4622843,
};

const getDistanceKm = (from, to) => {
  const toRad = (value) => (value * Math.PI) / 180;
  const earthRadiusKm = 6371;

  const dLat = toRad(to.latitude - from.latitude);
  const dLon = toRad(to.longitude - from.longitude);
  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos(toRad(from.latitude)) *
      Math.cos(toRad(to.latitude)) *
      Math.sin(dLon / 2) *
      Math.sin(dLon / 2);

  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return Number((earthRadiusKm * c).toFixed(2));
};

const AboutScreen = () => {
  const nosotros = [
    require('../../assets/carrusel/nosotros/nosotros7.webp'),
    require('../../assets/carrusel/nosotros/nosotros8.webp'),
    require('../../assets/carrusel/nosotros/telar1.webp'),
    require('../../assets/carrusel/nosotros/telar2.webp'),
    require('../../assets/carrusel/nosotros/telar3.webp'),
    require('../../assets/carrusel/nosotros/telar4.webp'),
    require('../../assets/carrusel/nosotros/telar5.webp'),
    require('../../assets/carrusel/nosotros/telar6.webp'),
  ];

  const handleMapInteraction = (region, interactionType) => {
    trackEvent('map_interaction', {
      source_screen: 'AboutScreen',
      interaction_type: interactionType,
      distance_km: getDistanceKm(STORE_LOCATION, {
        latitude: region.latitude,
        longitude: region.longitude,
      }),
    });
  };

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: '#fff' }} edges={['top', 'left', 'right']}>
      <ScrollView contentContainerStyle={styles.scrollContainer}>
        <View style={styles.header}>
          <Text style={styles.title}>Nosotros</Text>
          <Text style={styles.subtitle}>
            Alfombras y más, todo 100% algodón. Hecho para tu hogar.
          </Text>
        </View>

        <ImageCarousel images={nosotros} title="" />

        <Text style={styles.sectionTitle}>Diseñamos para ti</Text>

        <View style={styles.infoContainer}>
          <Text style={styles.infoText}>Ignacio Figueroa 185, Los Conquistadores, Entre Ríos, Argentina.</Text>

          <View style={{ height: 180, width: '90%', marginBottom: 20, marginLeft: 20, marginRight: 20 }}>
            <MapView
              style={{ flex: 1 }}
              initialRegion={{
                ...STORE_LOCATION,
                latitudeDelta: 0.015,
                longitudeDelta: 0.015,
              }}
              onRegionChangeComplete={(region) => handleMapInteraction(region, 'move')}
            >
              <Marker
                coordinate={STORE_LOCATION}
                title="La Conquista"
                description="Ignacio Figueroa 185, Los Conquistadores"
                onPress={({ nativeEvent }) =>
                  handleMapInteraction(nativeEvent.coordinate || STORE_LOCATION, 'marker_press')
                }
              />
            </MapView>
          </View>


          <Text style={styles.infoText}>Contáctanos a través de nuestras redes:</Text>

          <View style={styles.redesContainer}>
            <TouchableOpacity onPress={() => Linking.openURL('https://www.facebook.com/profile.php?id=100069448742603')}>
              <Image style={styles.logoRedes} source={require('../../assets/redesSociales/facebook.png')} />
            </TouchableOpacity>

            <TouchableOpacity onPress={() => Linking.openURL('mailto:laconquista265@gmail.com')}>
              <Image style={styles.logoRedes} source={require('../../assets/redesSociales/gmail.png')} />
            </TouchableOpacity>

            <TouchableOpacity onPress={() => Linking.openURL('https://www.instagram.com/grupo_asociativo_la_conquista?igsh=cWVyY3k1bW55eXh1')}>
              <Image style={styles.logoRedes} source={require('../../assets/redesSociales/instagram.png')} />
            </TouchableOpacity>

            <TouchableOpacity onPress={() => Linking.openURL('https://wa.me/3458430884')}>
              <Image style={styles.logoRedes} source={require('../../assets/redesSociales/whatsapp.png')} />
            </TouchableOpacity>
          </View>

        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

export default AboutScreen;

const styles = StyleSheet.create({
  header: {
    paddingHorizontal: 20,
  },
  scrollContainer: {
    alignItems: "center",
    justifyContent: "center",
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#000',

  },
  subtitle: {
    fontSize: 16,
    color: '#8a9597',
    marginTop: 4,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: '600',
    color: '#175560',
    marginTop: 30,
    marginBottom: 20,
  },
  infoContainer: {
    width: '100%',
  },
  infoText: {
    fontSize: 16,
    color: '#black',
    marginBottom: 15,
    textAlign: "center",
    justifyContent: "center",
  },
  redesContainer: {
    flexDirection: 'row',
    marginTop: 12,
    marginLeft: 20,
    marginRight: 20,
    justifyContent: 'space-between',
  },
  logoRedes: {
    width: 50,
    height: 50,
    resizeMode: 'contain',
  },
});
