/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 */

import React from 'react';
import ImgToBase64 from 'react-native-image-base64';
import * as ImagePicker from 'react-native-image-picker';

import { useState, useCallback } from 'react';
import {
  Button,
  Text,
  View,
  ScrollView,
  Image,
  Alert,
  PermissionsAndroid, 
} from 'react-native';
import DocumentPicker from 'react-native-document-picker'

const App = () => {
  
  const [fileResponse, setFileResponse] = useState([]);
  const [parsedRes, setParsedRes] = useState()
  const [filePath, setFilePath] = useState({})
  const [respons, setRespons] = useState({})



  const requestCameraPermission = async () => {
      try {
        const granted = await PermissionsAndroid.request(
          PermissionsAndroid.PERMISSIONS.CAMERA,{
            title: 'Camera Permission',
            message:
              'App needs access to your camera ',
            buttonNeutral: 'Ask Me Later',
            buttonNegative: 'Cancel',
            buttonPositive: 'OK',
          }
        );
        // If CAMERA Permission is granted
        return granted === PermissionsAndroid.RESULTS.GRANTED;
      } catch (err) {
        console.warn(err);
        return false;
      }
  };
  const requestExternalWritePermission = async () => {
      try {
        const granted = await PermissionsAndroid.request(
          PermissionsAndroid.PERMISSIONS.READ_EXTERNAL_STORAGE,{
            title: 'Storage Permission',
            message:
              'App needs access to your storage ',
            buttonNeutral: 'Ask Me Later',
            buttonNegative: 'Cancel',
            buttonPositive: 'OK',
          }
        );
        // If WRITE_EXTERNAL_STORAGE Permission is granted
        return granted === PermissionsAndroid.RESULTS.GRANTED;
      } catch (err) {
        console.warn(err);
        return false;
      }
  };

  const pickImage = async (type) => {
    // var options  = new CameraOptions()

    let isCameraPermitted = await requestCameraPermission();
    let isStoragePermitted = await requestExternalWritePermission();
    console.log(isCameraPermitted)
    console.log(isStoragePermitted)

    if (isCameraPermitted || isStoragePermitted) {
      ImagePicker.launchImageLibrary({mediaType: "photo",includeBase64: true}, setRespons)
      .then(response => {
        console.log(response)
      var myHeaders = new Headers();
    myHeaders.append("apikey", "K88711416488957");

      var formdata = new FormData();
      formdata.append("base64Image","data:"+response['assets'][0]['type']+";base64,"+response['assets'][0]['base64'])
      var requestOptions = {
        method: 'POST',
        headers: myHeaders,
        body: formdata,
        redirect: 'follow'
      };

      fetch("https://api.ocr.space/parse/image", requestOptions)
        .then(response => response.text())
        .then(result => {console.log((JSON.parse(result))["ParsedResults"][0]["ParsedText"])
          setParsedRes((JSON.parse(result))["ParsedResults"][0]["ParsedText"])})
        .catch(error => console.log('error', error));
    })
    }
  };

  const captureImage = async (type) => {
    // var options  = new CameraOptions()

    let isCameraPermitted = await requestCameraPermission();
    let isStoragePermitted = await requestExternalWritePermission();
    console.log(isCameraPermitted)
    console.log(isStoragePermitted)

    if (isCameraPermitted || isStoragePermitted) {
      ImagePicker.launchCamera({mediaType: "photo",includeBase64: true,maxHeight: 300,maxWidth: 300}, setRespons)
      .then(response => {
        console.log(response)
      var myHeaders = new Headers();
    myHeaders.append("apikey", "K88711416488957");

      var formdata = new FormData();
      formdata.append("base64Image","data:"+response['assets'][0]['type']+";base64,"+response['assets'][0]['base64'])
      var requestOptions = {
        method: 'POST',
        headers: myHeaders,
        body: formdata,
        redirect: 'follow'
      };

      fetch("https://api.ocr.space/parse/image", requestOptions)
        .then(response => response.text())
        .then(result => {console.log((JSON.parse(result)))
          setParsedRes((JSON.parse(result))["ParsedResults"][0]["ParsedText"])})
        .catch(error => console.log('error', error));
    })
    }
  };




  return(
    <View style={{
      backgroundColor: 'white',
      flex: 1,
      flexDirection: 'column',
    }}>
              <View style={{flex: 2,flexDirection: 'row',alignItems: "center",justifyContent: "center"}} >
                    <View style={{padding: 40,transform: [{scale: 1.5}]}}><Button title="Image 🖼️" onPress={pickImage} /></View>
                    <View style={{padding: 40,transform: [{scale: 1.5}] }}><Button title="Capture 📸"  onPress={captureImage} /></View>                   
              </View>
              <View style={{flex: 5, backgroundColor: 'gray',padding: 30}}><ScrollView>
                <Text style={{color: 'black',fontSize: 25}}>
                  {parsedRes}
                </Text>
                </ScrollView></View>
    </View>
  )
}

export default App



// const handleDocumentSelection = useCallback(async () => {
//   try {
//     const response = await DocumentPicker.pick({
//       presentationStyle: 'fullScreen',
//     })
//     console.log(response[0])
//     ImgToBase64.getBase64String(response[0]['uri'])
//     .then(base64String => 
//       // getData(response[0]))
//     getData("data:image/jpeg;base64,"+base64String))
//     setFileResponse(response);
//   } catch (err) {
//     console.warn(err);
//   }
// }, []);

  // const getData = async baseString => {
  //   console.log(baseString)
  //   var myHeaders = new Headers();
  //   myHeaders.append("apikey", "K88711416488957");

  //     var formdata = new FormData();
  //     formdata.append("base64Image",baseString)
  //     // formdata.append("file",baseString)
  //     var requestOptions = {
  //       method: 'POST',
  //       headers: myHeaders,
  //       body: formdata,
  //       redirect: 'follow'
  //     };

  //     fetch("https://api.ocr.space/parse/image", requestOptions)
  //       .then(response => response.text())
  //       .then(result => {console.log((JSON.parse(result))["ParsedResults"][0]["ParsedText"])
  //         setParsedRes((JSON.parse(result))["ParsedResults"][0]["ParsedText"])})
  //       .catch(error => console.log('error', error));
      
  // };