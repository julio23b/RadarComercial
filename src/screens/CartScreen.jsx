import React, { useState } from 'react';
import {View,Text,FlatList,StyleSheet,TouchableOpacity,Image,Alert,Linking} from 'react-native';
import { useCart } from '../context/CartContext';
import { SafeAreaView } from 'react-native-safe-area-context';

export default function CartScreen() {
  const { cartItems, removeFromCart, addToCart, clearCart } = useCart();

  const totalGeneral = cartItems
    .reduce((total, item) => total + item.product.price * item.quantity, 0)
    .toFixed(0);

  const handleRemove = (productId, size, colorValue) => {
    const cartItem = cartItems.find(
      (item) =>
        item.product.id === productId &&
        item.size === size &&
        item.color?.value === colorValue
    );
    if (!cartItem) return;

    if (cartItem.quantity <= 1) {
      removeFromCart(productId, size, colorValue);
    } else {
      addToCart(cartItem.product, -1, size, cartItem.color);
    }
  };


  const handleOrder = () => {
    if (cartItems.length === 0) {
      Alert.alert('Carrito vacío', 'Agrega productos antes de realizar el pedido.');
      return;
    }

    let message = 'Hola, quiero hacer un pedido:\n\n';
    cartItems.forEach(item => {
      message += `- ${item.product.name} | Medida: ${item.size} | Color: ${item.color?.name} | Cantidad: ${item.quantity}\n`;
    });
    message += `\nGracias!`;

    const url = `https://wa.me/+543458430884?text=${encodeURIComponent(message)}`;
    Linking.openURL(url)
      .then(() => {
        Alert.alert('Gracias', 'Tu pedido ha sido enviado correctamente.');
        clearCart();
      })
      .catch(() => {
        Alert.alert('Error', 'No se pudo abrir WhatsApp.');
      });
  };

  const renderItem = ({ item }) => (
    <View style={styles.itemContainer}>
      <Image source={item.color?.image || item.product.image} style={styles.image} />
      <View style={{ flex: 1, marginLeft: 12 }}>
        <Text style={styles.name}>{item.product.name}</Text>
        <Text style={styles.text}>Medida: {item.size}</Text>
        <Text style={styles.text}>Color: {item.color?.name}</Text>
        <Text style={styles.text}>Precio unitario: ${item.product.price}</Text>
        <Text style={styles.text}>Cantidad: {item.quantity}</Text>
        <Text style={styles.text}>Total: ${(item.product.price * item.quantity).toFixed(0)}</Text>

        <TouchableOpacity
          style={styles.deleteButton}
          onPress={() => handleRemove(item.product.id, item.size, item.color?.value)}
        >
          <Text style={styles.deleteText}>Eliminar</Text>
        </TouchableOpacity>
      </View>
    </View>
  );

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: '#fff' }} edges={['top', 'left', 'right']}>
      <FlatList
        data={cartItems}
        keyExtractor={(item, index) => `${item.product?.id}-${item.size}-${index}`}
        renderItem={renderItem}
        contentContainerStyle={styles.scrollContainer}
        ListHeaderComponent={<Text style={styles.title}>Carrito</Text>}
        ListEmptyComponent={<Text style={styles.empty}>Tu carrito está vacío.</Text>}
        ListFooterComponent={
          cartItems.length > 0 && (
            <>
              <Text style={styles.total}>Total general: ${totalGeneral}</Text>
              <TouchableOpacity style={styles.orderButton} onPress={handleOrder}>
                <Text style={styles.orderButtonText}>Realizar pedido</Text>
              </TouchableOpacity>
            </>
          )
        }
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  scrollContainer: {
    paddingHorizontal: 20,
    paddingTop: 10,
    paddingBottom: 40,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 16,
  },
  empty: {
    fontSize: 16,
    color: '#8a9597',
    textAlign: 'center',
    marginTop: 40,
  },
  itemContainer: {
    flexDirection: 'row',
    backgroundColor: '#f2f2f2',
    borderRadius: 12,
    padding: 12,
    marginBottom: 16,
    alignItems: 'center',
  },
  image: {
    width: 80,
    height: 80,
    borderRadius: 10,
    resizeMode: 'cover',
  },
  name: {
    fontSize: 18,
    fontWeight: '600',
    color: '#000',
  },
  text: {
    fontSize: 14,
    color: '#333',
    marginTop: 2,
  },
  deleteButton: {
    marginTop: 10,
    backgroundColor: '#d9534f',
    paddingVertical: 8,
    paddingHorizontal: 14,
    borderRadius: 8,
    alignSelf: 'flex-start',
  },
  deleteText: {
    color: '#fff',
    fontWeight: 'bold',
  },
  total: {
    fontSize: 20,
    fontWeight: 'bold',
    textAlign: 'center',
    marginTop: 20,
    color: '#175560',
  },
  orderButton: {
    marginTop: 20,
    backgroundColor: '#175560',
    paddingVertical: 14,
    borderRadius: 12,
  },
  orderButtonText: {
    color: '#fff',
    fontWeight: 'bold',
    textAlign: 'center',
    fontSize: 16,
  },
});
