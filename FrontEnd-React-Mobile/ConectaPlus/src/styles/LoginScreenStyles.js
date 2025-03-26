import { StyleSheet, Dimensions } from 'react-native';

const { width } = Dimensions.get('window');

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#fff',
  },
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
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
  fullWidthInput: {
    width: '80%',
    height: 50,
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 15,
    paddingHorizontal: 15,
    marginVertical: 10,
    backgroundColor: '#fff',
  },
  button: {
    backgroundColor: '#3F5CFF',
    paddingVertical: 15,
    paddingHorizontal: 40,
    borderRadius: 15,
    marginTop: 20,
  },
  buttonText: {
    color: '#fff',
    fontSize: 20,
    fontWeight: 'bold',
    textAlign: 'center',
  },
  separator: {
    width: '80%',
    height: 1,
    backgroundColor: '#ccc',
    marginVertical: 20,
  },
  socialIconsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    width: '60%',
    marginVertical: 20,
  },
  registerLink: {
    color: '#3F5CFF',
    fontWeight: 'bold',
    textAlign: 'center',
    fontSize: 19,
    marginTop: 20,
  },
});

export default styles;