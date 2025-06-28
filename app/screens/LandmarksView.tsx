import { createDrawerNavigator } from '@react-navigation/drawer';
import React, { useEffect, useState } from 'react';
import DrawerView from './Drawer/DrawerView';
import MapView from './MapView';
import { useNavigation } from '@react-navigation/native';

import { FIREBASE_DB } from '../../FirebaseConfig';
import { collection, addDoc, setDoc, doc, getDocs, deleteDoc } from "firebase/firestore"; 

const Drawer = createDrawerNavigator();

const LandmarksView = () => {

    const [landmarks, setLandmarks] = useState([]);
    const [selectedLandmark, setSelectedLandmark] = useState(null);
    const [tours, setTours] = useState([]);

    useEffect(() => {
        loadLandmarks();
        loadTours();
    }, []);

    const loadTours = async () => {

        // Load tours from the database
        const toursCollection = collection(FIREBASE_DB, "tours");
        const toursSnapshot = await getDocs(toursCollection);
        const toursData = toursSnapshot.docs.map(doc => doc.data());
        setTours(toursData);
    }

    const updateTour = (updatedTour) => {
        const updatedTours = tours.map(tour => tour.id === updatedTour.id ? updatedTour : tour);

        setTours(updatedTours);

        const updateDatabase = async () => {
            // Check if doc exists in the database
            const tourRef = doc(FIREBASE_DB, "tours", String(updatedTour.id));
            await setDoc(tourRef, updatedTour);
        }

        updateDatabase();
    }

    const deleteTour = (deletedTour) => {
        const updatedTours = tours.filter(tour => tour.id !== deletedTour.id);
        setTours(updatedTours);

        const updateDatabase = async () => {
            // Check if doc exists in the database
            const tourRef = doc(FIREBASE_DB, "tours", String(deletedTour.id));
            deleteDoc(tourRef);
        }

        updateDatabase();
    }

    const loadLandmarks = async () => {
        // Load landmarks from the database
        const landmarksCollection = collection(FIREBASE_DB, "landmarks");
        const landmarksSnapshot = await getDocs(landmarksCollection);
        const landmarksData = landmarksSnapshot.docs.map(doc => doc.data());
        setLandmarks(landmarksData);
    }

    const updateLandmark = (updatedLandmark) => {

        const updatedLandmarks = landmarks.map(landmark =>
            landmark.id === updatedLandmark.id ? updatedLandmark : landmark
        );
        setLandmarks(updatedLandmarks);
        setSelectedLandmark(updatedLandmark);
        console.log("Updated Landmark: ", updatedLandmark);

        tours.forEach(tour => {
            if (tour.landmarks.find(landmark => landmark.id === updatedLandmark.id)) {
                const updatedTour = {
                    ...tour,
                    landmarks: tour.landmarks.map(landmark =>
                        landmark.id === updatedLandmark.id ? updatedLandmark : landmark
                    )
                }
                updateTour(updatedTour);
            }
        });

        const updateDatabase = async () => {
            // Check if doc exists in the database
            const landmarkRef = doc(FIREBASE_DB, "landmarks", String(updatedLandmark.id));
            await setDoc(landmarkRef, updatedLandmark);
        }

        updateDatabase();
    };

    const deleteLandmark = (deletedLandmark) => {
        const updatedLandmarks = landmarks.filter(landmark =>
            landmark.id !== deletedLandmark.id
        );
        setLandmarks(updatedLandmarks);
        setSelectedLandmark(null);
        console.log("Deleted Landmark: ", deletedLandmark);

        tours.forEach(tour => {
            const updatedTour = {
                ...tour,
                landmarks: tour.landmarks.filter(landmark =>
                    landmark.id !== deletedLandmark.id
                )
            }
            updateTour(updatedTour);
        });

        const updateDatabase = async () => {
            // Check if doc exists in the database
            const landmarkRef = doc(FIREBASE_DB, "landmarks", String(deletedLandmark.id));
            deleteDoc(landmarkRef);
        }

        updateDatabase();
    }

    return (
        <Drawer.Navigator drawerContent={(props) =>
            <DrawerView
                {...props}
                landmarks={landmarks}
                selectedLandmark={selectedLandmark}
                updateLandmark={updateLandmark}
                deleteLandmark={deleteLandmark}
                tours={tours}
                updateTour={updateTour}
                deleteTour={deleteTour}
            />}>
            <Drawer.Screen name="Map">
                {(props) => <MapView
                    {...props}
                    selectedLandmark={selectedLandmark}
                    setSelectedLandmark={setSelectedLandmark}
                    landmarks={landmarks}
                    setLandmarks={setLandmarks}
                />}
            </Drawer.Screen>
        </Drawer.Navigator>
    );
}

export default LandmarksView;