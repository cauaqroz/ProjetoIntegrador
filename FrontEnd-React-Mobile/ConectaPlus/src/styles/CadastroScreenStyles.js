import { StyleSheet, Dimensions } from 'react-native';

const { width } = Dimensions.get('window');

export default StyleSheet.create({
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
    marginVertical: 20,
  },
  inputRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: '80%',
    marginVertical: 10,
  },
  input: {
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 15,
    padding: 10,
    marginVertical: 5,
    width: '48%',
    backgroundColor: '#fff', // Fundo branco
    height: 50, // Altura uniforme
  },
  fullWidthInput: {
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 15,
    padding: 10,
    marginVertical: 5,
    width: '80%',
    backgroundColor: '#fff', // Fundo branco
    height: 50, // Altura uniforme
  },
  pickerContainer: {
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 15,
    width: '48%',
    backgroundColor: '#fff', // Fundo branco
    marginVertical: 5,
    height: 50, // Altura uniforme
    justifyContent: 'center', // Centraliza o conteúdo verticalmente
  },
  picker: {
    height: '100%', // Ocupa toda a altura do container
    width: '100%',
  },
  button: {
    backgroundColor: '#3F5CFF',
    padding: 15,
    borderRadius: 15,
    paddingVertical: 15,
    paddingHorizontal: 40,
    marginTop:40,
    marginBottom:-50,
  },
  buttonText: {
    color: '#fff',
    fontWeight: 'bold',
    textAlign: 'center',
    fontSize: 20,
  },
  separator: {
    height: 1,
    width: '80%',
    backgroundColor: '#ccc',
    marginBottom:1,
    marginTop:110,
  },
  
  socialIconsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    width: '60%',
    marginTop:20,
 
  },
  loginLink: {
    color: '#3F5CFF',
    fontWeight: 'bold',
    textAlign: 'center',
    fontSize: 19,
    marginTop: 50,
    zIndex: 2,
  },
});