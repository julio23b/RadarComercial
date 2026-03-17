import React, { useState } from 'react';
import { View, Text, Image, TouchableOpacity, StyleSheet } from 'react-native';
import { useRoute, useNavigation } from '@react-navigation/native';
import { useCart } from '../context/CartContext';

export default function ProductDetailScreen() {
  const {addToCart} = useCart();
  const route = useRoute();
  const navigation = useNavigation();
  const { product } = route.params || {};
  if (!product) {
    return (
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
        <Text>No se encontró el producto.</Text>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Text style={{ color: '#175560', marginTop: 10 }}>Volver</Text>
        </TouchableOpacity>
      </View>
    );
  }

  const [quantity, setQuantity] = useState(1);
  const [selectedSize, setSelectedSize] = useState(product.sizes[0]);
  const [selectedColor, setSelectedColor] = useState(product.colors[0]);
  const [displayImage, setDisplayImage] = useState(product.colors[0].image);


  return (
    <View style={styles.container}>
      <View style={styles.card}>
        <Image source={displayImage} style={styles.image} />
        <Text style={styles.name}>{product.name}</Text>
        <Text style={styles.price}>${product.price}</Text>

        <Text style={styles.label}>Medidas:</Text>
        <View style={styles.sizeContainer}>
          {product.sizes.map((size) => (
            <TouchableOpacity
              key={size}
              onPress={() => setSelectedSize(size)}
              style={[
                styles.sizeButton,
                selectedSize === size && styles.sizeButtonSelected,
              ]}
            >
              <Text
                style={[
                  styles.sizeText,
                  selectedSize === size && styles.sizeTextSelected,
                ]}
              >
                {size}
              </Text>
            </TouchableOpacity>
          ))}
        </View>

        <Text style={styles.label}>Colores:</Text>
        <View style={styles.colorContainer}>
          {product.colors.map((color, index) => (
            <TouchableOpacity
              key={index}
              onPress={() => {
                setSelectedColor(color);
                setDisplayImage(color.image);
              }}
              style={[
                styles.colorCircle,
                {
                  backgroundColor: color.value,
                  borderWidth: selectedColor.value === color.value ? 2 : 1,
                  borderColor: selectedColor.value === color.value ? '#175560' : '#ccc',
                },
              ]}
            />
          ))}
        </View>

        <Text style={styles.label}>Materiales:</Text>
        <Text>{product.material}</Text>

        <Text style={styles.label}>Cantidad:</Text>
        <View style={styles.quantityContainer}>
          <TouchableOpacity
            style={styles.qtyButton}
            onPress={() => setQuantity((q) => Math.max(1, q - 1))}
          >
            <Text style={styles.qtyButtonText}>-</Text>
          </TouchableOpacity>
          <Text style={styles.quantityText}>{quantity}</Text>
          <TouchableOpacity
            style={styles.qtyButton}
            onPress={() => setQuantity((q) => q + 1)}
          >
            <Text style={styles.qtyButtonText}>+</Text>
          </TouchableOpacity>
        </View>

        <TouchableOpacity style={styles.cartButton} onPress={()=>{addToCart(product,quantity,selectedSize,selectedColor);}}>
          <Text style={styles.cartButtonText}>Agregar al carrito</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  image: {
    width: '100%',
    height: 250,
    resizeMode: 'cover',
  },
  card: {
    marginTop: '50',
    backgroundColor: '#fff',
    padding: 16,
    margin: 16,
    borderRadius: 12,
    elevation: 5,
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowOffset: { width: 0, height: 2 },
    shadowRadius: 6,
  },
  name: {
    fontSize: 20,
    fontWeight: '600',
    marginBottom: 4,
  },
  price: {
    fontSize: 18,
    fontWeight: '500',
    marginBottom: 12,
  },
  label: {
    fontWeight: '500',
    marginTop: 12,
    marginBottom: 4,
  },
  sizeContainer: {
    flexDirection: 'row',
    gap: 8,
  },
  sizeButton: {
    backgroundColor: '#eee',
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 8,
  },
  sizeButtonSelected: {
    backgroundColor: '#222',
  },
  sizeText: {
    color: '#222',
  },
  sizeTextSelected: {
    color: '#fff',
  },
  colorContainer: {
    flexDirection: 'row',
    marginVertical: 8,
    gap: 10,
  },
  colorCircle: {
    width: 24,
    height: 24,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#ccc',
  },
  quantityContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginVertical: 8,
  },
  qtyButton: {
    backgroundColor: '#d7f0e3',
    padding: 8,
    borderRadius: 8,
  },
  qtyButtonText: {
    fontSize: 16,
    color: '#175560',
  },
  quantityText: {
    marginHorizontal: 16,
    fontSize: 16,
  },
  cartButton: {
    backgroundColor: '#175560',
    padding: 12,
    borderRadius: 12,
    marginTop: 12,
  },
  cartButtonText: {
    color: '#fff',
    textAlign: 'center',
    fontWeight: 'bold',
  },
});
