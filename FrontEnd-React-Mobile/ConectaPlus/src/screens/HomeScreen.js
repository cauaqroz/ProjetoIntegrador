import React from 'react';
import { SafeAreaView, View, Text, TouchableOpacity, Dimensions } from 'react-native';
import Svg, { Path } from 'react-native-svg';
import styles from '../styles/HomeScreenStyles';

const { width } = Dimensions.get('window');

export default function HomeScreen({ navigation }) {
  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.container}>
        <Svg height="250" width={width * 1.5} viewBox="0 0 1440 320" style={styles.waveTop}>
          <Path fill="#FF9914" d="M0,64L48,85.3C96,107,192,149,288,176C384,203,480,213,576,213.3C672,213,768,203,864,186.7C960,171,1056,149,1152,138.7C1248,128,1344,128,1392,128L1440,128L1440,0L1392,0C1344,0,1248,0,1152,0C1056,0,960,0,864,0C768,0,672,0,576,0C480,0,384,0,288,0C192,0,96,0,48,0L0,0Z" />
        </Svg>
        <Text style={styles.title}>Conecta-Plus</Text>
        <Text style={styles.subtitle}>Conecte-se a projetos incríveis</Text>
        <TouchableOpacity style={styles.button} onPress={() => navigation.navigate('Cadastro')}>
          <Text style={styles.buttonText}>Começar</Text>
        </TouchableOpacity>
        <Svg height="250" width="100%" viewBox="0 0 1440 320" style={styles.waveBottom}>
          <Path fill="#FF9914" d="M 0 224 L 48 213.3 C 96 203 192 181 288 160 C 384 139 480 117 576 122.7 C 672 128 768 160 864 176 C 960 192 1056 192 1152 186.7 C 1248 181 1344 171 1392 165.3 L 1440 160 L 1440 450 L 1392 450 C 1344 450 1248 450 1152 450 C 1056 450 960 450 864 450 C 768 450 672 450 576 450 C 480 450 384 450 288 450 C 192 450 96 450 48 450 L 0 450 Z" />
        </Svg>
      </View>
    </SafeAreaView>
  );
}