import React from 'react';
import { View, Dimensions, Image, StyleSheet, Text } from 'react-native';
import Carousel from 'react-native-reanimated-carousel';

const { width } = Dimensions.get('window');

const ImageCarousel = ({ images, title = '' }) => {
  return (
    <View style={styles.carouselContainer}>
      <Text style={styles.sectionTitle}>{title}</Text>
      <Carousel
        width={width * 0.9}
        height={180}
        data={images}
        loop
        autoPlay
        scrollAnimationDuration={1500}
        renderItem={({ item }) => (
          <View style={styles.imageWrapper}>
            <Image source={item} style={styles.image} />
          </View>
        )}
      />
    </View>
  );
};

export default ImageCarousel;

const styles = StyleSheet.create({
  carouselContainer: {
    marginTop: 20,
    alignItems: 'center',
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    alignSelf: 'flex-start',
    marginLeft: 20,
    marginBottom: 10,
    color: '#000',
  },
  imageWrapper: {
    overflow: 'hidden',
  },
  image: {
    width: '100%',
    height: 200,
  },
});
