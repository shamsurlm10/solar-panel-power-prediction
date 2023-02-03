import React, { useState, setState } from 'react';
import { View, TextInput, ImageBackground, TouchableOpacity, Image, Text, ToastAndroid, StyleSheet } from 'react-native';
import { launchCamera, launchImageLibrary } from 'react-native-image-picker';
import axios from 'axios'
import Config from 'react-native-config';

// axios.interceptors.request.use(
//   async config => {
//     let request = config;
//     request.headers = {
//       'Content-Type': 'application/json',
//       Accept: 'application/json',
//     };
//     request.url = configureUrl(config.url);
//     return request;
//   },
//   error => error,
// );
// export const configureUrl = url => {
//   let authUrl = url;
//   if (url && url[url.length - 1] === '/') {
//     authUrl = url.substring(0, url.length - 1);
//   }
//   return authUrl;
// };


const image = { uri: 'https://avatars.mds.yandex.net/i?id=dfcb735fd16a96e869fac89ee101ff77-4011861-images-thumbs&n=13' };

const App = () => {
  const [state, setState] = useState({
    photo: '',
  });
  const [lux, setLux] = useState(null);
  const [time, setTime] = useState(null);
  const [temp, setTemp] = useState(null);

  const option = {
    mediaType: 'photo',
    quality: 1,
    saveToPhotos: true,
  }

  const sendFile = async () => {
    console.log('---080----')
    if (state.photo) {
      let formData = new FormData();
      formData.append("time", time);
      formData.append("lux", lux);
      formData.append("temp", temp);
      formData.append("file", state.photo);
      // const url = Config.URL;
      // axios
      //   .post('http://localhost:8000/predict', formData)
      //   .then(response => {
      //     console.log(response);
      //   })
      //   .catch(error => {
      //     console.log('err', error);
      //   });
      try {
        const res = await fetch('http://localhost:8000/predict', {
          method: "POST",
          mode: 'http://localhost:8000',
          headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json'
          },
          body: formData
        }
        )
        console.log(res)
      }
      catch (e) {
        console.log(e)
      }

    }
  }

  const clearImage = () => {
    setState({ photo: '' })
  }

  const toast = (msg) => {
    ToastAndroid.show(msg, ToastAndroid.SHORT)
  }

  const openCamera = () => {
    launchCamera(option, (res) => {
      if (res.didCancel) {
        toast('take a picture canceled')
      } else if (res.errorCode) {
        toast('error while open camera', res.errorCode)
      } else {
        setState({ photo: res.assets[0].uri });
      }
    })
  }

  const openGallery = () => {
    launchImageLibrary(option, (res) => {
      if (res.didCancel) {
        toast('gallery open canceled')
      } else if (res.errorCode) {
        toast('error while open camera', res.errorCode)
      } else {
        setState({ photo: res.assets[0].uri });
      }
    })
  }

  return (
    <View style={styles.container}>
      <View style={{ margin: 5, color: "#f9d3b4" }}>
        <Text style={{ color: "#f9d3b4", paddingLeft: 4 }}>LUX</Text>
        <TextInput
          style={{ color: "#f9d3b4" }}
          placeholder="Enter lux value"
          placeholderTextColor="#5E503A"
          value={lux}
          onChangeText={newText => setLux(newText)}
        />
      </View>
      <View style={{ margin: 5, color: "#f9d3b4" }}>
        <Text style={{ color: "#f9d3b4", paddingLeft: 4 }}>Time</Text>
        <TextInput
          style={{ color: "#f9d3b4" }}
          placeholder="Enter lux value"
          placeholderTextColor="#5E503A"
          value={time}
          onChangeText={newText => setTime(newText)}
        />
      </View>
      <View style={{ margin: 5, color: "#f9d3b4" }}>
        <Text style={{ color: "#f9d3b4", paddingLeft: 4 }}>Temperature</Text>
        <TextInput
          style={{ color: "#f9d3b4" }}
          placeholder="Enter lux value"
          placeholderTextColor="#5E503A"
          value={temp}
          onChangeText={newText => setTemp(newText)}
        />
      </View>
      {state.photo == "" ? (
        <ImageBackground source={image} resizeMode="cover" style={styles.image}>
          <Text style={styles.text}>No image selected</Text>
        </ImageBackground>
      ) : (
        <>
          <Image source={{ uri: state.photo }} style={styles.image} />
          <View style={{ flexDirection: 'row', justifyContent: 'space-between', width: 200, alignSelf: 'center' }}>
            <TouchableOpacity style={{ marginTop: 5, width: 90, backgroundColor: "#fff", padding: 10 }} onPress={clearImage}>
              <Text style={{ color: '#181a1b', alignSelf: 'center' }}>Clear Image</Text>
            </TouchableOpacity>
            <TouchableOpacity style={{ marginTop: 5, width: 90, backgroundColor: "#fff", padding: 10 }} onPress={sendFile}>
              <Text style={{ color: '#181a1b', alignSelf: 'center' }}>Submit</Text>
            </TouchableOpacity>
          </View>
        </>
      )}
      <TouchableOpacity style={{ marginTop: 5, width: 200, alignSelf: 'center', backgroundColor: "#f9d3b4", padding: 10 }} onPress={openCamera}>
        <Text style={{ color: '#181a1b', alignSelf: 'center' }}>Open Camera</Text>
      </TouchableOpacity>
      <TouchableOpacity style={{ marginTop: 5, width: 200, alignSelf: 'center', backgroundColor: "#f9d3b4", padding: 10 }} onPress={openGallery}>
        <Text style={{ color: '#181a1b', alignSelf: 'center' }}>Open Gallery</Text>
      </TouchableOpacity>
    </View>
  );
};

export default App;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#181a1b',
    color: "#f9d3b4",
  },
  image: {
    height: 256,
    width: 256,
    alignSelf: 'center',
    margin: 5,
    borderRadius: 5,
  },
  text: {
    color: '#fff',
    lineHeight: 70,
    fontSize: 16,
    textAlign: 'center',
    backgroundColor: '#000000c0',
  },
});
