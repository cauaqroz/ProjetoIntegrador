import React, { useEffect, useState } from 'react';
import { SafeAreaView, View, Text, Image, TouchableOpacity, ActivityIndicator, ScrollView, Dimensions } from 'react-native';
import Svg, { Path } from 'react-native-svg';
import { FontAwesome } from '@expo/vector-icons';
import axios from 'axios';
import styles from '../styles/InicialScreenStyles';
import defaultImage from '../image/baixados.png';

const { width } = Dimensions.get('window');

export default function InicialScreen({ navigation }) {
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchProjects = async () => {
      try {
        const response = await axios.get('http://10.67.226.68:2216/projetos'); // Substitua pela URL correta da sua API
        setProjects(response.data.reverse()); // Inverte a lista de projetos
      } catch (err) {
        setError(err);
      } finally {
        setLoading(false);
      }
    };

    fetchProjects();
  }, []);

  const renderProjectCard = (item) => {
    const imageSource = item.capaUrl && typeof item.capaUrl === 'string' ? { uri: item.capaUrl } : defaultImage;
  
    return (
      <View key={item.id} style={styles.card}>
        <Image
          source={imageSource}
          style={styles.cardImage}
          resizeMode="cover"
        />
        <Text style={styles.cardTitle}>{item.titulo}</Text>
        <Text style={styles.cardDescription}>{item.descricao}</Text>
        <TouchableOpacity
          style={styles.cardButton}
          onPress={() => navigation.navigate('DetalhesProjeto', { id: item.id })}
        >
          <Text style={styles.cardButtonText}>Ver Detalhes</Text>
        </TouchableOpacity>
      </View>
    );
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      {/* Onda superior */}
      <Svg height="250" width={width * 1.5} viewBox="0 0 1440 320" style={styles.waveTop}>
        <Path fill="#FF9914" d="M0,64L48,85.3C96,107,192,149,288,176C384,203,480,213,576,213.3C672,213,768,203,864,186.7C960,171,1056,149,1152,138.7C1248,128,1344,128,1392,128L1440,128L1440,0L1392,0C1344,0,1248,0,1152,0C1056,0,960,0,864,0C768,0,672,0,576,0C480,0,384,0,288,0C192,0,96,0,48,0L0,0Z" />
      </Svg>

      {/* Botões no topo */}
      <View style={styles.topBar}>
        <TouchableOpacity>
          <FontAwesome name="bars" size={30} color="#333" />
        </TouchableOpacity>
        <TouchableOpacity>
          <FontAwesome name="bell" size={30} color="#333" />
        </TouchableOpacity>
      </View>

      {/* Lista de projetos */}
      <ScrollView contentContainerStyle={styles.projectList}>
        {loading ? (
          <ActivityIndicator size="large" color="#FF9914" style={styles.loadingIndicator} />
        ) : error ? (
          <Text style={styles.errorText}>Erro ao carregar projetos: {error.message}</Text>
        ) : (
          projects.map((item) => renderProjectCard(item))
        )}
      </ScrollView>
    </SafeAreaView>
  );
}