import React, { useCallback, useMemo, useRef, useState } from 'react';
import {
  Alert,
  Dimensions,
  FlatList,
  Linking,
  PermissionsAndroid,
  Platform,
  Pressable,
  StyleSheet,
  Text,
  TextInput,
  View,
} from 'react-native';
import ClusteredMapView from 'react-native-map-clustering';
import MapView, { Marker, PROVIDER_GOOGLE, Region } from 'react-native-maps';
import * as Location from 'expo-location';

type Commerce = {
  id: string;
  name: string;
  category: string;
  address: string;
  latitude: number;
  longitude: number;
};

const DEFAULT_REGION: Region = {
  latitude: -34.603722,
  longitude: -58.381592,
  latitudeDelta: 0.18,
  longitudeDelta: 0.12,
};

const COMMERCES: Commerce[] = [
  {
    id: '1',
    name: 'Mercado Centro',
    category: 'Alimentos',
    address: 'Av. Corrientes 1234, CABA',
    latitude: -34.6031,
    longitude: -58.3812,
  },
  {
    id: '2',
    name: 'Farmacia Belgrano',
    category: 'Salud',
    address: 'Av. Belgrano 450, CABA',
    latitude: -34.6101,
    longitude: -58.3778,
  },
  {
    id: '3',
    name: 'Librería Norte',
    category: 'Libros',
    address: 'Paraguay 890, CABA',
    latitude: -34.5965,
    longitude: -58.3857,
  },
  {
    id: '4',
    name: 'Panadería San Martín',
    category: 'Panificados',
    address: 'San Martín 780, CABA',
    latitude: -34.5993,
    longitude: -58.3728,
  },
];

const { width } = Dimensions.get('window');
const CARD_WIDTH = width * 0.85;

function degreesToRadians(deg: number): number {
  return (deg * Math.PI) / 180;
}

function distanceInKm(
  origin: { latitude: number; longitude: number },
  target: { latitude: number; longitude: number },
): number {
  const EARTH_RADIUS_KM = 6371;
  const dLat = degreesToRadians(target.latitude - origin.latitude);
  const dLon = degreesToRadians(target.longitude - origin.longitude);

  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos(degreesToRadians(origin.latitude)) *
      Math.cos(degreesToRadians(target.latitude)) *
      Math.sin(dLon / 2) *
      Math.sin(dLon / 2);

  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return EARTH_RADIUS_KM * c;
}

async function ensureLocationPermissions(): Promise<boolean> {
  if (Platform.OS === 'android') {
    const hasFineLocation = await PermissionsAndroid.request(
      PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION,
    );

    return hasFineLocation === PermissionsAndroid.RESULTS.GRANTED;
  }

  const { status } = await Location.requestForegroundPermissionsAsync();
  return status === 'granted';
}

export default function MapScreen(): React.JSX.Element {
  const mapRef = useRef<MapView>(null);
  const cardsRef = useRef<FlatList<Commerce>>(null);

  const [region, setRegion] = useState<Region>(DEFAULT_REGION);
  const [query, setQuery] = useState('');
  const [selectedCommerceId, setSelectedCommerceId] = useState<string | null>(null);
  const [userLocation, setUserLocation] = useState<{ latitude: number; longitude: number } | null>(
    null,
  );
  const [activeRadiusKm, setActiveRadiusKm] = useState<number | null>(null);

  const viewportFilteredCommerces = useMemo(() => {
    return COMMERCES.filter((commerce) => {
      const latitudeMin = region.latitude - region.latitudeDelta / 2;
      const latitudeMax = region.latitude + region.latitudeDelta / 2;
      const longitudeMin = region.longitude - region.longitudeDelta / 2;
      const longitudeMax = region.longitude + region.longitudeDelta / 2;

      return (
        commerce.latitude >= latitudeMin &&
        commerce.latitude <= latitudeMax &&
        commerce.longitude >= longitudeMin &&
        commerce.longitude <= longitudeMax
      );
    });
  }, [region]);

  const filteredCommerces = useMemo(() => {
    const bySearch = viewportFilteredCommerces.filter((commerce) => {
      const searchable = `${commerce.name} ${commerce.category} ${commerce.address}`.toLowerCase();
      return searchable.includes(query.trim().toLowerCase());
    });

    if (!activeRadiusKm || !userLocation) {
      return bySearch;
    }

    return bySearch.filter((commerce) => {
      return (
        distanceInKm(userLocation, {
          latitude: commerce.latitude,
          longitude: commerce.longitude,
        }) <= activeRadiusKm
      );
    });
  }, [activeRadiusKm, query, userLocation, viewportFilteredCommerces]);

  const selectedCommerce = useMemo(
    () => filteredCommerces.find((commerce) => commerce.id === selectedCommerceId) ?? null,
    [filteredCommerces, selectedCommerceId],
  );

  const animateToCommerce = useCallback((commerce: Commerce) => {
    mapRef.current?.animateToRegion(
      {
        latitude: commerce.latitude,
        longitude: commerce.longitude,
        latitudeDelta: 0.04,
        longitudeDelta: 0.04,
      },
      350,
    );
  }, []);

  const handleMarkerPress = useCallback(
    (commerce: Commerce, index: number) => {
      setSelectedCommerceId(commerce.id);
      animateToCommerce(commerce);
      cardsRef.current?.scrollToIndex({ index, animated: true });
    },
    [animateToCommerce],
  );

  const handleLocateMe = useCallback(async () => {
    const hasPermissions = await ensureLocationPermissions();

    if (!hasPermissions) {
      Alert.alert('Permiso requerido', 'Necesitamos acceso a tu ubicación para mostrar comercios cercanos.');
      return;
    }

    const current = await Location.getCurrentPositionAsync({ accuracy: Location.Accuracy.Balanced });

    const nextRegion: Region = {
      latitude: current.coords.latitude,
      longitude: current.coords.longitude,
      latitudeDelta: 0.07,
      longitudeDelta: 0.07,
    };

    setUserLocation({ latitude: current.coords.latitude, longitude: current.coords.longitude });
    setRegion(nextRegion);
    setActiveRadiusKm((currentRadius) => currentRadius ?? 5);
    mapRef.current?.animateToRegion(nextRegion, 400);
  }, []);

  const handleDirectionsPress = useCallback(async (commerce: Commerce) => {
    const googleUrl = `https://www.google.com/maps/dir/?api=1&destination=${commerce.latitude},${commerce.longitude}`;
    const wazeUrl = `https://waze.com/ul?ll=${commerce.latitude},${commerce.longitude}&navigate=yes`;

    if (await Linking.canOpenURL(googleUrl)) {
      await Linking.openURL(googleUrl);
      return;
    }

    if (await Linking.canOpenURL(wazeUrl)) {
      await Linking.openURL(wazeUrl);
      return;
    }

    Alert.alert('Sin apps compatibles', 'No encontramos Google Maps ni Waze para abrir la navegación.');
  }, []);

  return (
    <View style={styles.container}>
      <ClusteredMapView
        ref={mapRef}
        style={styles.map}
        initialRegion={DEFAULT_REGION}
        provider={PROVIDER_GOOGLE}
        animationEnabled
        onRegionChangeComplete={setRegion}
        showsUserLocation
        radius={45}
      >
        {filteredCommerces.map((commerce, index) => (
          <Marker
            key={commerce.id}
            coordinate={{ latitude: commerce.latitude, longitude: commerce.longitude }}
            pinColor={selectedCommerceId === commerce.id ? '#f15a24' : '#2563eb'}
            onPress={() => handleMarkerPress(commerce, index)}
          />
        ))}
      </ClusteredMapView>

      <View style={styles.searchContainer}>
        <TextInput
          placeholder="Buscar comercios por nombre, rubro o dirección"
          value={query}
          onChangeText={setQuery}
          style={styles.searchInput}
        />
        <Pressable onPress={handleLocateMe} style={styles.nearMeButton}>
          <Text style={styles.nearMeLabel}>Ver cerca mío</Text>
        </Pressable>
      </View>

      <View style={styles.radiusContainer}>
        {[2, 5, 10].map((km) => (
          <Pressable
            key={km}
            onPress={() => setActiveRadiusKm((current) => (current === km ? null : km))}
            style={[styles.radiusChip, activeRadiusKm === km && styles.radiusChipActive]}
          >
            <Text style={[styles.radiusChipText, activeRadiusKm === km && styles.radiusChipTextActive]}>
              {km} km
            </Text>
          </Pressable>
        ))}
      </View>

      <FlatList
        ref={cardsRef}
        horizontal
        data={filteredCommerces}
        keyExtractor={(item) => item.id}
        contentContainerStyle={styles.cardsContainer}
        showsHorizontalScrollIndicator={false}
        onMomentumScrollEnd={(event) => {
          const index = Math.round(event.nativeEvent.contentOffset.x / CARD_WIDTH);
          const commerce = filteredCommerces[index];
          if (commerce) {
            setSelectedCommerceId(commerce.id);
            animateToCommerce(commerce);
          }
        }}
        renderItem={({ item }) => (
          <View style={[styles.card, selectedCommerce?.id === item.id && styles.cardSelected]}>
            <Text style={styles.cardTitle}>{item.name}</Text>
            <Text style={styles.cardSubtitle}>{item.category}</Text>
            <Text style={styles.cardAddress}>{item.address}</Text>

            <Pressable onPress={() => handleDirectionsPress(item)} style={styles.ctaButton}>
              <Text style={styles.ctaLabel}>Cómo llegar</Text>
            </Pressable>
          </View>
        )}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  map: { flex: 1 },
  searchContainer: {
    position: 'absolute',
    top: 52,
    left: 16,
    right: 16,
    gap: 10,
  },
  searchInput: {
    backgroundColor: '#ffffff',
    borderRadius: 10,
    paddingHorizontal: 14,
    paddingVertical: 12,
    borderWidth: 1,
    borderColor: '#d4d4d8',
  },
  nearMeButton: {
    alignSelf: 'flex-start',
    backgroundColor: '#111827',
    borderRadius: 999,
    paddingHorizontal: 16,
    paddingVertical: 10,
  },
  nearMeLabel: {
    color: '#ffffff',
    fontWeight: '700',
  },
  radiusContainer: {
    position: 'absolute',
    top: 146,
    left: 16,
    flexDirection: 'row',
    gap: 8,
  },
  radiusChip: {
    backgroundColor: '#ffffff',
    borderRadius: 999,
    borderWidth: 1,
    borderColor: '#d4d4d8',
    paddingHorizontal: 10,
    paddingVertical: 6,
  },
  radiusChipActive: {
    backgroundColor: '#2563eb',
    borderColor: '#2563eb',
  },
  radiusChipText: {
    color: '#111827',
    fontWeight: '600',
  },
  radiusChipTextActive: {
    color: '#ffffff',
  },
  cardsContainer: {
    position: 'absolute',
    bottom: 26,
    paddingHorizontal: 14,
    gap: 10,
  },
  card: {
    width: CARD_WIDTH,
    backgroundColor: '#ffffff',
    borderRadius: 12,
    padding: 14,
    borderWidth: 1,
    borderColor: '#e4e4e7',
  },
  cardSelected: {
    borderColor: '#2563eb',
  },
  cardTitle: {
    fontWeight: '700',
    fontSize: 16,
    color: '#111827',
  },
  cardSubtitle: {
    color: '#4b5563',
    marginTop: 4,
  },
  cardAddress: {
    marginTop: 4,
    color: '#6b7280',
  },
  ctaButton: {
    marginTop: 12,
    backgroundColor: '#f15a24',
    borderRadius: 8,
    paddingVertical: 10,
    alignItems: 'center',
  },
  ctaLabel: {
    color: '#ffffff',
    fontWeight: '700',
  },
});
