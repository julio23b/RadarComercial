import React, { useState } from 'react';
import { Alert, SafeAreaView, StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native';
import { useAuth } from '../context/AuthContext';

const AuthScreen = () => {
  const { signInWithPassword, signUpWithPassword, signInWithProvider } = useAuth();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isLogin, setIsLogin] = useState(true);
  const [submitting, setSubmitting] = useState(false);

  const handleSubmit = async () => {
    try {
      setSubmitting(true);
      const action = isLogin ? signInWithPassword : signUpWithPassword;
      const { error } = await action(email.trim(), password);
      if (error) throw error;
      if (!isLogin) {
        Alert.alert('Revisá tu email', 'Te enviamos un enlace de confirmación para activar tu cuenta.');
      }
    } catch (error) {
      Alert.alert('Error de autenticación', error.message ?? 'No se pudo completar el acceso.');
    } finally {
      setSubmitting(false);
    }
  };

  const handleSocialLogin = async (provider) => {
    try {
      const { error } = await signInWithProvider(provider);
      if (error) throw error;
    } catch (error) {
      Alert.alert('Error de OAuth', error.message ?? 'No se pudo iniciar sesión con el proveedor.');
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <Text style={styles.title}>{isLogin ? 'Ingresar' : 'Crear cuenta'}</Text>
      <TextInput style={styles.input} autoCapitalize="none" placeholder="Email" value={email} onChangeText={setEmail} />
      <TextInput
        style={styles.input}
        autoCapitalize="none"
        placeholder="Contraseña"
        secureTextEntry
        value={password}
        onChangeText={setPassword}
      />

      <TouchableOpacity style={styles.primaryButton} onPress={handleSubmit} disabled={submitting}>
        <Text style={styles.primaryButtonText}>{submitting ? 'Procesando...' : isLogin ? 'Ingresar' : 'Registrarme'}</Text>
      </TouchableOpacity>

      <TouchableOpacity onPress={() => setIsLogin((prev) => !prev)}>
        <Text style={styles.switchText}>
          {isLogin ? '¿No tenés cuenta? Crear cuenta' : '¿Ya tenés cuenta? Iniciar sesión'}
        </Text>
      </TouchableOpacity>

      <View style={styles.socialRow}>
        <TouchableOpacity style={styles.socialButton} onPress={() => handleSocialLogin('google')}>
          <Text style={styles.socialText}>Google</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.socialButton} onPress={() => handleSocialLogin('github')}>
          <Text style={styles.socialText}>GitHub</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, justifyContent: 'center', padding: 24, backgroundColor: '#fff' },
  title: { fontSize: 28, fontWeight: '700', color: '#175560', marginBottom: 20, textAlign: 'center' },
  input: {
    borderWidth: 1,
    borderColor: '#d9d9d9',
    borderRadius: 10,
    paddingHorizontal: 14,
    paddingVertical: 12,
    marginBottom: 12,
  },
  primaryButton: { backgroundColor: '#175560', borderRadius: 10, paddingVertical: 14, alignItems: 'center', marginBottom: 16 },
  primaryButtonText: { color: '#fff', fontWeight: '700' },
  switchText: { textAlign: 'center', color: '#175560', marginBottom: 18 },
  socialRow: { flexDirection: 'row', gap: 12, justifyContent: 'center' },
  socialButton: { borderWidth: 1, borderColor: '#175560', borderRadius: 8, paddingHorizontal: 16, paddingVertical: 10 },
  socialText: { color: '#175560', fontWeight: '600' },
});

export default AuthScreen;
