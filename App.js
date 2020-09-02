import React, {Component} from 'react';
import {Text, View, Platform} from 'react-native';
import firebase from 'react-native-firebase';
import {sendPushNotification} from './functions';

export default class App extends Component {
  componentDidMount = async () => {
    this.checkPermission();
  };
  checkPermission = async () => {
    console.log('check');
    if (Platform.OS === 'android') {
      this.getToken();
    } else if (Platform.OS === 'ios') {
      await firebase
        .messaging()
        .hasPermission()
        .then(enabled => {
          this.getToken();
        })
        .catch(err => {
          this.requestPermission();
        });
    }
  };

  //3
  getToken = async () => {
    var fcmToken = await firebase.messaging().getToken();
    console.log('fcmToken:', fcmToken);
    if (fcmToken) {
      firebase
        .database()
        .ref('/users/' + Math.floor(Math.random() * Math.floor(1000)))
        .set({
          email: 'instaman@gmail.com',
          notification_token: fcmToken,
          created_at: Date.now(),
        })
        .then(res => {
          console.log(res);
        });
    }
    // await AsyncStorage.setItem('fcmToken', fcmToken);
  };

  requestPermission = async () => {
    try {
      await firebase.messaging().requestPermission();
      this.getToken();
    } catch (error) {
      console.log('permission rejected');
    }
  };

  render() {
    return (
      <View>
        <Text> textInComponent </Text>
      </View>
    );
  }
}
