import { StyleSheet, Dimensions } from 'react-native';

const { width, height } = Dimensions.get('window');

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#f0f0f0',
  },
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#f0f0f0',
  },
  waveTop: {
    position: 'absolute',
    top: -50, // Ajuste para cobrir mais a borda superior
    width: width * 1.5, // Ajusta a largura da onda superior dinamicamente
  },
  waveBottom: {
    position: 'absolute',
    bottom: -50, // Ajuste para cobrir mais a borda inferior
    width: width * 1.5, // Ajusta a largura da onda inferior dinamicamente
  },
  title: {
    fontSize: 45,
    fontWeight: 'bold',
    color: '#333',
    textAlign: 'center',
    marginVertical: 20,
  },
  subtitle: {
    fontSize: 28,
    color: '#666',
    textAlign: 'center',
    marginBottom: 40,
  },
  button: {
    backgroundColor: '#3F5CFF',
    paddingVertical: 15,
    paddingHorizontal: 50,
    borderRadius: 15,
    marginTop:90,
  },
  buttonText: {
    color: '#fff',
    fontSize: 20,
    fontWeight: 'bold',
  },
});

export default styles;