import React, { Component } from 'react';
import { View, Text, BackHandler, TouchableOpacity, Image, SafeAreaView, Platform, StatusBar } from 'react-native';
import { WebView } from 'react-native-webview';
import Colors from '../../Assets/Colors';
import Images from '../../Assets/Images';

export default class WebViewScreen extends Component {
  constructor(props) {
    super(props);
    this.handleBackButtonClick = this.handleBackButtonClick.bind(this)
    this.state = {
    };
  }
  componentDidMount() {
    BackHandler.addEventListener('hardwareBackPress', this.handleBackButtonClick);

  }
  componentWillUnmount() {
    BackHandler.removeEventListener('hardwareBackPress', this.handleBackButtonClick);

  }
  handleBackButtonClick() {
    this.props.navigation.goBack()
    return true;
  }
  render() {
    return (
      <View style={{ flex: 1 }}>
        <SafeAreaView style={{ paddingTop: Platform.OS === "android" ? StatusBar.currentHeight : 0, backgroundColor: Colors.primary, flexDirection: 'row', width: '100%', height: "10%", justifyContent: 'flex-start', alignItems: 'center' }}>
          <TouchableOpacity onPress={() => this.handleBackButtonClick()} style={{ marginTop: 10, alignItems: 'flex-start', marginLeft: 10 }}>
            <Image source={Images.back}
              style={{ height: 15, width: 22, tintColor: 'white', alignSelf: 'center' }} />
          </TouchableOpacity>
          <Text style={{ fontSize: 18, fontWeight: 'bold', color: Colors.white, marginLeft: 20, marginTop: 10 }}>SPF</Text>
        </SafeAreaView>
        <WebView source={{ uri: 'https://spf.sadhumargi.com/' }} />
      </View>
    );
  }
}
