import { Text } from '@/components/Themed';
import { useAuth } from '@/contexts/AuthContext';
import { auth } from '@/services/firebase';
import { Feather } from '@expo/vector-icons';
import {
  GoogleSignin,
  GoogleSigninButton,
  isErrorWithCode,
  isSuccessResponse,
  statusCodes,
} from '@react-native-google-signin/google-signin';
import * as AppleAuthentication from 'expo-apple-authentication';
import { useRouter } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import * as WebBrowser from 'expo-web-browser';
import { GoogleAuthProvider, OAuthProvider, signInWithCredential, signInWithPopup } from 'firebase/auth';
import React, { useEffect, useState } from 'react';
import { ActivityIndicator, Alert, Image, Platform, StyleSheet, TouchableOpacity, View } from 'react-native';

// Completa a autenticação no navegador
WebBrowser.maybeCompleteAuthSession();

// Configura o Google Sign-In
const configureGoogleSignIn = () => {
  const webClientId = process.env.EXPO_PUBLIC_GOOGLE_CLIENT_ID;

  if (!webClientId) {
    console.warn('Google Client ID não configurado. Verifique a variável EXPO_PUBLIC_GOOGLE_CLIENT_ID.');
    return;
  }

  GoogleSignin.configure({
    webClientId: webClientId, // Obrigatório para autenticação com Firebase
    offlineAccess: true, // Permite acesso offline
    forceCodeForRefreshToken: true, // Força código para refresh token
  });
};

// Configura na inicialização
configureGoogleSignIn();


export default function LoginScreen() {
  const router = useRouter();
  const { user } = useAuth();
  const [loading, setLoading] = useState(false);

  // Redireciona se já estiver autenticado
  useEffect(() => {
    if (user) {
      router.replace('/(tabs)');
    }
  }, [user]);

  const handleGoogleSignIn = async () => {
    try {
      setLoading(true);

      // Para web, usa popup do Firebase
      if (Platform.OS === 'web') {
        const provider = new GoogleAuthProvider();
        const result = await signInWithPopup(auth, provider);
        if (result.user) {
          router.replace('/(tabs)');
        }
        return;
      }

      // Para mobile, usa Google Sign-In nativo
      // Verifica se o Google Play Services está disponível (Android)
      if (Platform.OS === 'android') {
        await GoogleSignin.hasPlayServices({ showPlayServicesUpdateDialog: true });
      }

      // Realiza o sign-in
      const response = await GoogleSignin.signIn();

      if (isSuccessResponse(response)) {
        // Obtém o ID token do Google
        const { idToken } = response.data;

        if (idToken) {
          // Cria uma credencial do Firebase com o ID token do Google
          const googleCredential = GoogleAuthProvider.credential(idToken);

          // Autentica no Firebase
          await signInWithCredential(auth, googleCredential);

          // O redirecionamento será feito automaticamente pelo useEffect quando o user mudar
        } else {
          throw new Error('ID token não recebido do Google');
        }
      } else {
        // Usuário cancelou o login
        return;
      }
    } catch (error: any) {
      if (isErrorWithCode(error)) {
        switch (error.code) {
          case statusCodes.SIGN_IN_CANCELLED:
            // Usuário cancelou o login - não é um erro
            return;
          case statusCodes.IN_PROGRESS:
            // Operação já em progresso
            Alert.alert('Aviso', 'Login já está em andamento. Aguarde...');
            return;
          case statusCodes.PLAY_SERVICES_NOT_AVAILABLE:
            // Android: Google Play Services não disponível
            Alert.alert(
              'Erro',
              'Google Play Services não está disponível. Por favor, atualize o Google Play Services.'
            );
            break;
          default:
            console.error('Erro no Google Sign-In:', error);
            Alert.alert('Erro', 'Não foi possível fazer login com Google. Tente novamente.');
        }
      } else {
        console.error('Erro desconhecido no login:', error);
        Alert.alert('Erro', error?.message || 'Não foi possível fazer login com Google. Tente novamente.');
      }
    } finally {
      setLoading(false);
    }
  };


  const handleAppleLogin = async () => {
    try {
      setLoading(true);

      if (Platform.OS === 'ios') {
        const credential = await AppleAuthentication.signInAsync({
          requestedScopes: [
            AppleAuthentication.AppleAuthenticationScope.FULL_NAME,
            AppleAuthentication.AppleAuthenticationScope.EMAIL,
          ],
        });

        const { identityToken, authorizationCode } = credential;

        if (identityToken) {
          const provider = new OAuthProvider('apple.com');
          const credential_firebase = provider.credential({
            idToken: identityToken,
            rawNonce: authorizationCode || undefined,
          });

          await signInWithCredential(auth, credential_firebase);
          // O redirecionamento será feito automaticamente pelo useEffect quando o user mudar
        } else {
          throw new Error('Token de identidade não recebido da Apple');
        }
      } else {
        Alert.alert('Aviso', 'Login com Apple está disponível apenas no iOS.');
      }
    } catch (error: any) {
      if (error.code === 'ERR_REQUEST_CANCELED') {
        // Usuário cancelou o login
        return;
      }
      console.error('Erro no login da Apple:', error);
      Alert.alert('Erro', 'Não foi possível fazer login com Apple. Tente novamente.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <View style={styles.container}>
      <StatusBar style="light" />

      {/* Logo e título */}
      <View style={styles.header}>
        <View style={styles.logoContainer}>
          <Image
            source={require('../assets/images/adaptive-icon.png')}
            style={styles.logo}
          />
        </View>
        <Text style={styles.title}>Comprar</Text>
        <Text style={styles.subtitle}>Gerencie suas compras de forma simples</Text>
      </View>

      {/* Botões de login */}
      <View style={styles.buttonsContainer}>
        {/* Botão Google */}
        {Platform.OS === 'web' ? (
          <TouchableOpacity
            style={[styles.googleButton, loading && styles.buttonDisabled]}
            onPress={handleGoogleSignIn}
            activeOpacity={0.8}
            disabled={loading}
          >
            <View style={styles.buttonContent}>
              <View style={styles.googleIconContainer}>
                <View style={styles.googleIcon}>
                  <Text style={styles.googleIconText}>G</Text>
                </View>
              </View>
              <Text style={styles.googleButtonText}>Continuar com Google</Text>
            </View>
          </TouchableOpacity>
        ) : (
          <GoogleSigninButton
            style={styles.googleButton}
            size={GoogleSigninButton.Size.Wide}
            color={GoogleSigninButton.Color.Light}
            onPress={handleGoogleSignIn}
            disabled={loading}
          />
        )}
        {/* Botão Apple */}
        {Platform.OS === 'ios' && (
          <TouchableOpacity
            style={[styles.appleButton, loading && styles.buttonDisabled]}
            onPress={handleAppleLogin}
            activeOpacity={0.8}
            disabled={loading}
          >
            <View style={styles.buttonContent}>
              <Feather name="airplay" size={20} color="#FFFFFF" />
              <Text style={styles.appleButtonText}>Continuar com Apple</Text>
            </View>
          </TouchableOpacity>
        )}

        {loading && (
          <View style={styles.loadingContainer}>
            <ActivityIndicator size="large" color="#2646B1" />
          </View>
        )}
      </View>

      {/* Footer */}
      <View style={styles.footer}>
        <Text style={styles.footerText}>
          Ao continuar, você concorda com nossos{'\n'}
          <Text style={styles.footerLink}>Termos de Serviço</Text> e{' '}
          <Text style={styles.footerLink}>Política de Privacidade</Text>
        </Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#0A0E1A',
    paddingHorizontal: 24,
    paddingTop: 80,
    paddingBottom: 40,
    justifyContent: 'space-between',
  },
  header: {
    alignItems: 'center',
    marginTop: 40,
  },
  logoContainer: {
    width: 100,
    height: 100,
    borderRadius: 24,
    backgroundColor: '#FFFFFF',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 24,
    shadowColor: '#2646B1',
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 8,
  },
  logo: {
    width: 80,
    height: 80,
    borderRadius: 16,
  },
  title: {
    fontSize: 32,
    fontWeight: 'bold',
    color: '#FFFFFF',
    marginBottom: 8,
    letterSpacing: 0.5,
  },
  subtitle: {
    fontSize: 16,
    color: '#9CA3AF',
    textAlign: 'center',
    lineHeight: 24,
  },
  buttonsContainer: {
    width: '100%',
    gap: 16,
  },
  buttonContent: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 12,
  },
  googleButton: {
    backgroundColor: '#FFFFFF',
    height: 56,
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#E5E7EB',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  googleIconContainer: {
    width: 24,
    height: 24,
    justifyContent: 'center',
    alignItems: 'center',
  },
  googleIcon: {
    width: 24,
    height: 24,
    borderRadius: 12,
    backgroundColor: '#FFFFFF',
    borderWidth: 2,
    borderColor: '#4285F4',
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 1,
    },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
  },
  googleIconText: {
    color: '#4285F4',
    fontSize: 14,
    fontWeight: 'bold',
    fontFamily: 'Roboto',
  },
  googleButtonText: {
    color: '#1F2937',
    fontSize: 16,
    fontWeight: '600',
  },
  appleButton: {
    backgroundColor: '#000000',
    height: 56,
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 3,
  },
  appleButtonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '600',
  },
  footer: {
    alignItems: 'center',
    paddingTop: 24,
  },
  footerText: {
    fontSize: 12,
    color: '#6B7280',
    textAlign: 'center',
    lineHeight: 18,
  },
  footerLink: {
    color: '#2646B1',
    textDecorationLine: 'underline',
  },
  buttonDisabled: {
    opacity: 0.6,
  },
  loadingContainer: {
    marginTop: 16,
    alignItems: 'center',
  },
});

