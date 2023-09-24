/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 */

import React, {useEffect, useRef, useState} from 'react';
import {
  ActivityIndicator,
  Button,
  Image,
  PermissionsAndroid,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import {Camera, useCameraDevices} from 'react-native-vision-camera';

function App(): JSX.Element {
  const devices = useCameraDevices();
  const device = devices.back;
  const camera = useRef<Camera>(null);

  const [cameraPermission, setCameraPermission] = useState(false);
  const [image, setImage] = useState('');

  useEffect(() => {
    checkPermission();
  }, []);

  const checkPermission = async () => {
    try {
      const granted = await PermissionsAndroid.request(
        PermissionsAndroid.PERMISSIONS.CAMERA,
      );
      if (granted === PermissionsAndroid.RESULTS.GRANTED) {
        setCameraPermission(true);
      } else {
        setCameraPermission(false);
      }
    } catch (err) {
      console.warn(err);
    }
  };

  const takePicture = async () => {
    setImage('');

    if (!cameraPermission) {
      checkPermission();
    }

    try {
      const photo = await camera?.current?.takePhoto({flash: 'on'});
      if (photo) {
        setImage(photo?.path);
      }
    } catch (error) {
      console.log(error);
    }
  };

  if (device == null) {
    return (
      <View style={styles.container}>
        <ActivityIndicator />
      </View>
    );
  }

  return cameraPermission ? (
    image ? (
      <View style={styles.container}>
        <View style={styles.imageContainer}>
          <Image style={styles.image} source={{uri: `file://${image}`}} />
        </View>
        <Button title="Take Another" onPress={takePicture} />
      </View>
    ) : (
      <View style={styles.container}>
        <Camera
          style={StyleSheet.absoluteFill}
          ref={camera}
          device={device}
          isActive={true}
          photo={true}
        />
        <TouchableOpacity onPress={takePicture} style={styles.snapButton} />
      </View>
    )
  ) : (
    <View style={styles.container}>
      <Text>You need to give camera permission to use this app.</Text>
      <Button title="Give Permission" onPress={takePicture} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F5F5DC',
    justifyContent: 'center',
    alignItems: 'center',
  },

  snapButton: {
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: '#FFB000',
    position: 'absolute',
    bottom: 50,
  },

  imageContainer: {padding: 10, width: '90%', height: '80%'},

  image: {
    width: '100%',
    height: '100%',
  },
});

export default App;
