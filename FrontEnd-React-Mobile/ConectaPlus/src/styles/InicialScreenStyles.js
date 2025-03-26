import { StyleSheet, Dimensions } from 'react-native';

const { width } = Dimensions.get('window');

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#fff',
  },
  waveTop: {
    position: 'absolute',
    top: -50,
    width: width * 1.5,
  },
  topBar: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    marginTop: 60,
  },
  sidebar: {
    position: 'absolute',
    top: 0,
    left: 0,
    width: 200,
    height: '100%',
    backgroundColor: '#FF9914',
    padding: 20,
    zIndex: 10,
  },
  sidebarText: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#fff',
    marginBottom: 20,
  },
  sidebarLink: {
    fontSize: 16,
    color: '#fff',
    marginBottom: 10,
  },
  projectList: {
    paddingTop: 150,
    paddingHorizontal: 20,
  },
  card: {
    backgroundColor: '#f9f9f9',
    borderRadius: 10,
    padding: 15,
    marginBottom: 15,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 5,
    elevation: 3,
  },
  cardImage: {
    width: '100%',
    height: 150,
    borderRadius: 10,
    marginBottom: 10,
  },
  cardTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 5,
  },
  cardDescription: {
    fontSize: 14,
    color: '#666',
    marginBottom: 10,
  },
  cardButton: {
    backgroundColor: '#3F5CFF',
    paddingVertical: 10,
    borderRadius: 5,
    alignItems: 'center',
  },
  cardButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
  loadingText: {
    textAlign: 'center',
    marginTop: 20,
    fontSize: 16,
    color: '#666',
  },
  errorText: {
    textAlign: 'center',
    marginTop: 20,
    fontSize: 16,
    color: 'red',
  },projectList: {
    paddingTop: 200, // Garante que os projetos fiquem abaixo da wave-top
    paddingHorizontal: 20,
    zIndex: -1, // Faz com que os projetos fiquem atrás da wave-top ao rolar
  },
  card: {
    backgroundColor: '#f9f9f9',
    borderRadius: 10,
    padding: 15,
    marginBottom: 15,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 5,
    elevation: 3,
  },
  cardImage: {
    width: '100%',
    height: 150,
    borderRadius: 10,
    marginBottom: 10,
  },
  cardTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 5,
  },
  cardDescription: {
    fontSize: 14,
    color: '#666',
    marginBottom: 10,
  },
  cardButton: {
    backgroundColor: '#3F5CFF',
    paddingVertical: 10,
    borderRadius: 5,
    alignItems: 'center',
  },
  cardButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
  loadingIndicator: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  errorText: {
    textAlign: 'center',
    marginTop: 20,
    fontSize: 16,
    color: 'red',
  },
});

export default styles;