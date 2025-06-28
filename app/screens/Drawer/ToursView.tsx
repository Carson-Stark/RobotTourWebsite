import React, { useRef, useState, useEffect } from 'react';
import { ScrollView, Image, StyleSheet, TextInput, Text, View, TouchableOpacity, Touchable, Button, Pressable } from 'react-native';
import DropDownPicker from 'react-native-dropdown-picker';
import styles from './styles';

const ToursView = ({ landmarks, tours, update_tour, delete_tour }) => {

  const [currentTour, setCurrentTour] = useState(null);

  const [open, setOpen] = useState(false);
  const [value, setValue] = useState(null);
  
  const [tourName, setTourName] = useState('');

  const [createTour, setCreateTour] = useState(false);

  const createNewTour = () => {
    const newTour = { name: "New Tour", id: Date.now(), landmarks: [] };
    update_tour([...tours, newTour]);
    setCurrentTour(newTour);
    setCreateTour(true);
  }

  const editTour = () => {
    setCurrentTour(value);
    setTourName(value.name);
    setCreateTour(true);
  }

  const saveTour = () => {
    if (tourName) {
      const newTour = { name: tourName, id: currentTour.id, landmarks: currentTour.landmarks };
      
      update_tour(newTour);

      setCreateTour(false);
    }
  }

  const deleteTour = () => {
    delete_tour(value);
    setCreateTour(false);
    setCurrentTour(null);
  }

  const addLandmark = () => {
    const nextLandmark = landmarks.filter(landmark => landmark.id === value);
    if (nextLandmark.length === 0) {
      return;
    }
    setCurrentTour({ ...currentTour, landmarks: [...currentTour.landmarks, nextLandmark[0]] });
  }

  const landmarkListing = (sequence_num) => {
    return (
      <Text style={styles.text} key={sequence_num} > {sequence_num}. {currentTour.landmarks[sequence_num - 1].name} </Text>
    );
  }

  const landmarkList = () => {

    if (currentTour.landmarks.length === 0) {
      return (
        <Text style={styles.text} > No destinations added yet </Text>
      );
    }

    return (
      <View>
        {currentTour.landmarks.map((landmark, index) => landmarkListing(index + 1))}
      </View>
    );
  }

  if (createTour) {
    
    return (
      <View style={{ flex: 1, padding: 16 }}>
        <Text style={styles.header}>Tour Name:</Text>
        <TextInput
          placeholder="New Tour" style={styles.text_input}
          value={tourName}
          onChangeText={setTourName}
        />
        <Text style={styles.header}>Landmarks:</Text>
        {landmarkList()}
        <Text style={styles.secondaryHeader} >Next Landmark:</Text>
        <DropDownPicker
          open={open}
          value={value}
          items={landmarks.map(landmark => ({ label: landmark.name, value: landmark.id }))}
          setOpen={setOpen}
          setValue={setValue}
          style={styles.picker}
        />
        <TouchableOpacity style={[styles.button, styles.secondaryButton]} onPress={addLandmark} >
            <Text style={styles.secondaryButtonText}>Add Next Landmark</Text>
        </TouchableOpacity>
        <TouchableOpacity style={[styles.button, styles.primaryButton]} onPress={saveTour} >
            <Text style={styles.primaryButtonText}>Save Tour</Text>
        </TouchableOpacity>
        <TouchableOpacity style={[styles.button, styles.secondaryButton]} onPress={deleteTour} >
          <Text style={styles.secondaryButtonText}>Delete Tour</Text>
        </TouchableOpacity>
      </View>
    )

  }
  else {

    return (
      <View style={{ flex: 1, padding: 16 }}>
        <Text style={styles.header}>Tours</Text>
        <DropDownPicker
          open={open}
          value={value}
          items={tours.map(tour => ({ label: tour.name, value: tour }))}
          setOpen={setOpen}
          setValue={setValue}
          style={styles.picker}
        />
        <TouchableOpacity onPress={editTour} style={[styles.button, styles.secondaryButton]}>
          <Text style={styles.secondaryButtonText}>Edit Tour</Text>
        </TouchableOpacity>
        <TouchableOpacity style={[styles.button, styles.primaryButton]} onPress={createNewTour} >
          <Text style={styles.primaryButtonText}>New Tour</Text>
        </TouchableOpacity>
      </View>
    );
  }
}

export default ToursView;