import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { CartProvider } from './src/context/CartContext';
import { SafeAreaProvider} from 'react-native-safe-area-context';
import StackNavigator from './src/navigation/StackNavigator';

const App = () => {
  return (
    <CartProvider>
      <SafeAreaProvider>
          <NavigationContainer>
            <StackNavigator />
          </NavigationContainer>
      </SafeAreaProvider>
    </CartProvider>
  );
};

export default App;
