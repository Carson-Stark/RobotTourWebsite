import { StyleSheet } from 'react-native';

const styles = StyleSheet.create({
  header: {
    fontSize: 24,
    fontWeight: 'bold',
    marginVertical: 10,
  },
  secondaryHeader: {
    fontSize: 20,
    fontWeight: 'bold',
    marginVertical: 5,
  },
  text: {
    fontSize: 16,
    marginBottom: 5,
  },
  button: {
    paddingVertical: 12,
    paddingHorizontal: 20,
    borderRadius: 5,
    marginVertical: 10,
    minWidth: 100,
    alignItems: 'center',
    justifyContent: 'center',
  },
  primaryButton: {
    backgroundColor: '#e66000', // Orange color
  },
  secondaryButton: {
    borderColor: '#e66000',
    borderWidth: 2,
  },
  primaryButtonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: 'bold',
  },
  secondaryButtonText: {
    color: '#e66000',
    fontSize: 16,
    fontWeight: 'bold',
  },
  container: {
    flex: 1,
    padding: 16,
  },
  horizontal_container: {
    flex: 1,
    flexDirection: 'row',
    padding: 16,
  },
  picker: {
    marginVertical: 5,
    width: '100%',
  },
  text_input: {
    height: 40,
    borderColor: 'gray',
    borderWidth: 1,
    padding: 5,
    borderRadius: 5,
    fontSize: 16,
  },
});

export default styles;