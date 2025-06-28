import React, { useRef, useState, useEffect } from 'react';
import { ScrollView, Image, StyleSheet, TextInput, Text, View, TouchableOpacity, Touchable } from 'react-native';
import DropDownPicker from 'react-native-dropdown-picker';
import ToursView from './ToursView';
import styles from './styles';

const DrawerView = ({ landmarks, selectedLandmark, updateLandmark, deleteLandmark, tours, updateTour, deleteTour }) => {
  
  const [name, setName] = useState('');
  const [info, setInfo] = useState('');

  useEffect(() => {
        if (selectedLandmark) {
            setName(selectedLandmark.name);
            setInfo(selectedLandmark.info);
        }
    }, [selectedLandmark]);
  
  const handleSave = () => {
        if (selectedLandmark) {
            updateLandmark({
                ...selectedLandmark,
                name: name,
                info: info,
            });
        }
  };

  const handleDelete = () => {
    if (selectedLandmark) {
      deleteLandmark(selectedLandmark);
    }
  }
  
  if (!selectedLandmark) {
    return (
      <ToursView landmarks={landmarks} tours={tours} update_tour={updateTour} delete_tour={deleteTour}  />
    );
  }

  return (
    <View style={{ flex: 1, padding: 16 }}>
      <Text style={styles.header} >Landmark Name</Text>
      <TextInput
        placeholder="Landmark Name" style={styles.text_input}
        value={name}
        onChangeText={setName}
      />
      <Text style={styles.header}>Info</Text>
      <TextInput
        placeholder="Information for the tour" multiline={true} style={[styles.text_input, { height: 400 }]}
        value={info}
        onChangeText={setInfo}
      />
      <TouchableOpacity onPress={handleSave} style={[styles.button, styles.primaryButton]}>
        <Text style={styles.primaryButtonText}>Save</Text>
      </TouchableOpacity>
      <TouchableOpacity onPress={handleDelete} style={[styles.button, styles.secondaryButton]}>
        <Text style={styles.secondaryButtonText}>Delete</Text>
      </TouchableOpacity>
    </View>
  );

};

export default DrawerView;