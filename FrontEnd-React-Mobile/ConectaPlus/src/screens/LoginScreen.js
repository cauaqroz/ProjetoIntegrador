import React, { useState } from 'react';
import { SafeAreaView, View, Text, TextInput, TouchableOpacity, Dimensions, ScrollView, Keyboard, TouchableWithoutFeedback } from 'react-native';
import Svg, { Path } from 'react-native-svg';
import { FontAwesome } from '@expo/vector-icons'; // Certifique-se de ter o pacote @expo/vector-icons instalado
import styles from '../styles/LoginScreenStyles';

const { width } = Dimensions.get('window');

export default function LoginScreen({ navigation }) {
  const [formData, setFormData] = useState({
    email: '',
    password: '',
  });

  const handleChange = (name, value) => {
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      {/* Permite tocar fora do teclado para fechá-lo */}
      <TouchableWithoutFeedback onPress={Keyboard.dismiss} accessible={false}>
        <ScrollView
          contentContainerStyle={styles.container}
          keyboardShouldPersistTaps="handled"
        >
          {/* Onda superior */}
          <Svg height="250" width={width * 1.5} viewBox="0 0 1440 320" style={styles.waveTop}>
            <Path fill="#FF9914" d="M0,64L48,85.3C96,107,192,149,288,176C384,203,480,213,576,213.3C672,213,768,203,864,186.7C960,171,1056,149,1152,138.7C1248,128,1344,128,1392,128L1440,128L1440,0L1392,0C1344,0,1248,0,1152,0C1056,0,960,0,864,0C768,0,672,0,576,0C480,0,384,0,288,0C192,0,96,0,48,0L0,0Z" />
          </Svg>

          <Text style={styles.title}>Login</Text>

          {/* Campos de entrada */}
          <TextInput
            style={styles.fullWidthInput}
            placeholder="Email"
            value={formData.email}
            onChangeText={(value) => handleChange('email', value)}
          />
          <TextInput
            style={styles.fullWidthInput}
            placeholder="Senha"
            secureTextEntry
            value={formData.password}
            onChangeText={(value) => handleChange('password', value)}
          />

          {/* Botão */}
          <TouchableOpacity style={styles.button} onPress={() => navigation.navigate('Inicial')} >
  <Text style={styles.buttonText}>Entrar</Text>
</TouchableOpacity>

          {/* Linha de separação */}
          <View style={styles.separator} />

          {/* Ícones de login social */}
          <View style={styles.socialIconsContainer}>
            <FontAwesome name="google" size={40} color="#DB4437" />
            <FontAwesome name="facebook" size={40} color="#3b5998" />
          </View>

          {/* Link para cadastro */}
          <TouchableOpacity onPress={() => navigation.navigate('Cadastro')}>
            <Text style={styles.registerLink}>Não possui conta? Cadastre-se</Text>
          </TouchableOpacity>

          {/* Onda inferior */}
          <Svg height="250" width="100%" viewBox="0 0 1440 320" style={styles.waveBottom}>
            <Path fill="#FF9914" d="M 0 224 L 48 213.3 C 96 203 192 181 288 160 C 384 139 480 117 576 122.7 C 672 128 768 160 864 176 C 960 192 1056 192 1152 186.7 C 1248 181 1344 171 1392 165.3 L 1440 160 L 1440 450 L 1392 450 C 1344 450 1248 450 1152 450 C 1056 450 960 450 864 450 C 768 450 672 450 576 450 C 480 450 384 450 288 450 C 192 450 96 450 48 450 L 0 450 Z" />
          </Svg>
        </ScrollView>
      </TouchableWithoutFeedback>
    </SafeAreaView>
  );
}