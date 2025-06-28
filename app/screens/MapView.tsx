import React, { useRef, useState, useEffect } from 'react';
import { ScrollView, Image, StyleSheet, Dimensions, Animated, TouchableWithoutFeedback, View, Text, Button, TouchableOpacity  } from 'react-native';
import { PanResponder } from 'react-native-web';

const ARROW_LENGTH = 20; // Set the desired length of the arrows

const MapView = ({ navigation, landmarks, setLandmarks, selectedLandmark, setSelectedLandmark }) => {
    const aspectRatio = 1721 / 1106; // Replace with your image's aspect ratio
    const scale = useRef(new Animated.Value(1)).current;
    const lastScale = useRef(1);
    const pan = useRef(new Animated.ValueXY()).current;
    const lastPan = useRef({ x: 0, y: 0 });
    const [dragging, setDragging] = useState(false);
    const [touchablePressed, setTouchablePressed] = useState(false); // Flag to handle touchable presses
    const imageWidthRef = useRef(0);
    const imageHeightRef = useRef(0);
    const xOffsetRef = useRef(0);
    const yOffsetRef = useRef(0);
    const [windowSize, setWindowSize] = useState({ width: 0, height: 0 });

    useEffect(() => {
        const updateDimensions = () => {
            const windowWidth = Dimensions.get('window').width;
            const windowHeight = Dimensions.get('window').height - 64; // Adjust for the header height

            if (windowWidth / windowHeight > aspectRatio) {
                // Window is wider than the image aspect ratio, so limit by height
                const height = windowHeight;
                const width = height * aspectRatio;
                imageWidthRef.current = width;
                imageHeightRef.current = height;
                xOffsetRef.current = (windowWidth - width) / 2;
                yOffsetRef.current = 0;
            } else {
                // Window is narrower, limit by width
                const width = windowWidth;
                const height = width / aspectRatio;
                imageWidthRef.current = width;
                imageHeightRef.current = height;
                xOffsetRef.current = 0;
                yOffsetRef.current = (windowHeight - height) / 2;
            }

            setWindowSize({ width: windowWidth, height: windowHeight });
        };

        // Call the function initially
        updateDimensions();

        // Add event listener for window resize
        const listener = Dimensions.addEventListener('change', updateDimensions);

        // Cleanup listener when component unmounts or changes
        return () => listener.remove();
    }, []);

    const panResponder = useRef(
        PanResponder.create({
            onStartShouldSetPanResponder: () => false,
            onStartShouldSetPanResponderCapture: () => false,
            onMoveShouldSetPanResponder: (_, gestureState) => {
                const { dx, dy } = gestureState
                return (dx > 2 || dx < -2 || dy > 2 || dy < -2)
            },
            
            onMoveShouldSetPanResponderCapture: (_, gestureState) => {
                const { dx, dy } = gestureState
                return (dx > 2 || dx < -2 || dy > 2 || dy < -2)
            },
            onPanResponderGrant: () => {
                pan.setOffset({
                    x: lastPan.current.x,
                    y: lastPan.current.y,
                });
                pan.setValue({ x: 0, y: 0 });
            },
            onPanResponderMove: Animated.event(
                [
                    null,
                    { dx: pan.x, dy: pan.y }
                ],
                { useNativeDriver: false }
            ),
            onPanResponderRelease: (e, gestureState) => {

                const imWidth = imageWidthRef.current * lastScale.current;
                const imHeight = imageHeightRef.current * lastScale.current;

                let newX = lastPan.current.x + (gestureState.dx);
                let newY = lastPan.current.y + (gestureState.dy);

                const maxX = Math.abs(imWidth - imageWidthRef.current) / lastScale.current / 2.0;
                const maxY = Math.abs(imHeight - imageHeightRef.current) / lastScale.current / 2.0;

                if (newX > maxX) newX = maxX;
                if (newX < -maxX) newX = -maxX;
                if (newY > maxY) newY = maxY;
                if (newY < -maxY) newY = -maxY;

                lastPan.current = { x: newX, y: newY };
                pan.setOffset({ x: newX, y: newY });
                pan.setValue({ x: 0, y: 0 });
                
            },
        })
    ).current;

    const handleMouseDown = (e) => {
        e.preventDefault(); // Prevent the context menu from appearing
        if (e.button == 2) { // Check if the right mouse button was clicked
            const boundingRect = e.target.getBoundingClientRect();
            const x = ((e.clientX - boundingRect.left) / lastScale.current - xOffsetRef.current) / imageWidthRef.current
            const y = ((e.clientY - boundingRect.top) / lastScale.current -yOffsetRef.current) / imageHeightRef.current;
            const newLandmark = { id: Date.now(), x, y, endx: x, endy: y, name: 'New Landmark', info: '' };
            setLandmarks([...landmarks, newLandmark]);
            setSelectedLandmark(newLandmark);
            setDragging(true);
        }
    };

    const handleMouseMove = (e) => {
        if (dragging && e.button == 2) {
            const boundingRect = e.target.getBoundingClientRect();
            const x = (e.clientX - boundingRect.left) / lastScale.current;
            const y = (e.clientY - boundingRect.top) / lastScale.current;
        }
    };

    const handleMouseUp = (e) => {
        if (dragging && e.button == 2) {
            const boundingRect = e.target.getBoundingClientRect();
            const x = (e.clientX - boundingRect.left) / lastScale.current;
            const y = (e.clientY - boundingRect.top) / lastScale.current;
            const startPoint = { x: selectedLandmark.x * imageWidthRef.current + xOffsetRef.current , y: selectedLandmark.y * imageHeightRef.current + yOffsetRef.current };
            const endPoint = normalizeArrow(startPoint, { x, y });
            selectedLandmark.endx = (endPoint.x - xOffsetRef.current) / imageWidthRef.current;
            selectedLandmark.endy = (endPoint.y - yOffsetRef.current) / imageHeightRef.current;
            setDragging(false);
            navigation.openDrawer();
        }
        else if (touchablePressed) {
            setSelectedLandmark(null);
        }
    };

    const normalizeArrow = (start, end) => {
        const dx = end.x - start.x;
        const dy = end.y - start.y;
        const length = Math.sqrt(dx * dx + dy * dy);
        console.log(start);
        const scale = ARROW_LENGTH / length;
        console.log (start.x + dx * scale, start.y + dy * scale)
        return {
            x: Math.round(start.x + dx * scale),
            y: Math.round(start.y + dy * scale)
        };
    };

    const selectLandmark = (landmark) => {
        setSelectedLandmark(landmark);
        setTouchablePressed(true);
        navigation.openDrawer();
    }

    const handleWheel = (event) => {
        const newScale = lastScale.current - event.deltaY / 500;
        lastScale.current = Math.min(Math.max(newScale, 1), 3); // Limit the scale between 0.5 and 3
        scale.setValue(lastScale.current);
    };

    const LandmarkComponent = ({ landmark, windowSize }) => {
        const [textWidth, setTextWidth] = useState(0);

        const handleTextLayout = (event) => {
            setTextWidth(event.nativeEvent.layout.width);
        };

        const markerSize = imageHeightRef.current * 0.01;
        const textSize = imageHeightRef.current * 0.01;
        const arrowSize = imageHeightRef.current * 0.01;

        return (
            <React.Fragment>
                <Text 
                    style={[styles.landmarkText, {
                        left: landmark.x * imageWidthRef.current + xOffsetRef.current - textWidth / 2,
                        top: landmark.y * imageHeightRef.current + yOffsetRef.current - textSize * 3,
                        fontSize: textSize,
                        overflow: 'visible'
                    }]}
                    onLayout={handleTextLayout}
                    numberOfLines={1}
                >
                    {landmark.name}
                    </Text>
                <View
                    style={[
                        styles.circle,
                        {
                            width: markerSize,
                            height: markerSize,
                            borderRadius: markerSize / 2,
                            left: landmark.x * imageWidthRef.current + xOffsetRef.current - markerSize / 2,
                            top: landmark.y * imageHeightRef.current + yOffsetRef.current - markerSize / 2,
                            backgroundColor: selectedLandmark && selectedLandmark.id === landmark.id ? 'rgba(0, 0, 255, 0.5)' : 'rgba(255, 0, 0, 0.5)',
                        },
                    ]}
                />
                <svg style={styles.svgContainer}>
                    <line
                        x1={landmark.x * imageWidthRef.current + xOffsetRef.current}
                        y1={landmark.y * imageHeightRef.current + yOffsetRef.current}
                        x2={landmark.endx * imageWidthRef.current + xOffsetRef.current}
                        y2={landmark.endy * imageHeightRef.current + yOffsetRef.current}
                        stroke="red"
                        strokeWidth="1"
                        markerEnd="url(#arrowhead)"
                    />
                    <defs>
                        <marker
                            id="arrowhead"
                            markerWidth={arrowSize}  // Scale marker width
                            markerHeight={arrowSize * 0.7}  // Scale marker height
                            refX={arrowSize}  // Adjust refX to match the arrowhead size
                            refY={arrowSize / 3}  // Adjust refY to match the arrowhead size
                            orient="auto"
                        >
                            <polygon
                                points={`0 0, ${arrowSize} ${arrowSize / 3}, 0 ${arrowSize * 0.7}`} // Scale the points based on arrowSize
                                fill="red"
                            />
                        </marker>
                    </defs>
                </svg>
                <TouchableOpacity style={{
                    position: "absolute",
                    left: landmark.x * imageWidthRef.current + xOffsetRef.current - (markerSize * 2) / 2,
                    top: landmark.y * imageHeightRef.current + yOffsetRef.current - (markerSize * 2) / 2,
                    width: markerSize * 2,
                    height: markerSize * 2
                }}
                    onPress={() => selectLandmark(landmark)}>
                </TouchableOpacity>
            </React.Fragment>
        );
    };

    return (
        <div style={styles.scrollView} onWheel={handleWheel} onContextMenu={(e) => e.preventDefault()}>
            <div 
                onMouseDown={handleMouseDown}
                onMouseMove={handleMouseMove}
                onMouseUp={handleMouseUp}
                style={{ width: '100%', height: '100%', position: 'relative', display: 'flex', justifyContent: 'center', alignItems: 'center' }}
            >
                <Animated.View
                    style={{
                        height: "100%",
                        width: "100%",
                        transform: [{ scaleX: scale }, { scaleY: scale }, { translateX: pan.x }, { translateY: pan.y }],
                    }}
                    {...panResponder.panHandlers}
                >
                    <Image
                        source={require('../../assets/ahg_full_open.png')}
                        style={styles.image}
                        resizeMode="contain"
                    />
                    {landmarks.map((landmark) => (
                            <LandmarkComponent key={landmark.id} landmark={landmark} windowSize={windowSize} />
                        ))}
                </Animated.View>
                <Text style={[styles.instructions_txt,{ pointerEvents: 'none' }]}>Right click and drag to add a landmark</Text>
            </div>
        </div>
    );
};


const styles = StyleSheet.create({
    scrollView: {
        display: "flex",
        justifyContent: 'center',
        alignItems: 'center',
        width: '100%',
        height: '100%',
    },
    image: {
        width: '100%',
        height: '100%',
    },
    circle: {
        position: 'absolute',
        width: 8,
        height: 8,
        borderRadius: 2,
        backgroundColor: 'rgba(255, 0, 0, 0.5)',
    },
    landmarkContainer: {
        position: 'absolute',
        width: '100%',
        height: '100%',
    },
    landmarkText: {
        position: 'absolute',
        textAlign: 'center',
        color: 'red',
        height: 20,
        fontSize: 12,
    },
    svgContainer: {
        position: 'absolute',
        left: 0,
        top: 0,
        width: '100%',
        height: '100%',
        pointerEvents: 'none',
    },
    instructions_txt: {
        fontSize: 15,
        textAlign: 'center',
        margin: 10,
        position: 'absolute',
        top: "5%",
        left: 0,
        right: 0,
        bottom: 0,
    },
});

export default MapView;
