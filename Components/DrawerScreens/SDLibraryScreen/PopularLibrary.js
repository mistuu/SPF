import React, { Component } from 'react'
import { Text, View, BackHandler, StyleSheet, Image, FlatList, Platform, PermissionsAndroid, ScrollView, TextInput, Dimensions, TouchableOpacity, Alert, SafeAreaView, StatusBar, Linking } from 'react-native'
import { connect } from 'react-redux';
import Colors from '../../../Assets/Colors';
import { mapDispatchToProps, mapStateToProps } from '../../../Reducers/ApiClass';
import { axiosAuthGet } from '../../../utility/apiConnection';
import RNFetchBlob from 'rn-fetch-blob';
import { IMAGEURL } from '../../../utility/util'
import * as WebBrowser from 'react-native-webview';

const { width, height } = Dimensions.get('window');
const fileUrl = IMAGEURL;

class PopularLibrary extends Component {
  constructor(props) {
    super(props)
    this.handleBackButtonClick = this.handleBackButtonClick.bind(this)

    this.state = {
      data: null,
      document: null,
      name: '',
    }
  }
  async componentDidMount() {
    BackHandler.addEventListener('hardwareBackPress', this.handleBackButtonClick);
    this.setState({ name: this.props.SDLibrarys.name })
    // console.log(this.props.SDLibrarys);
    let encode = encodeURI(this.props.SDLibrarys.filePath)
    try {
      let response = await axiosAuthGet("Library/FileList/" + encode);
      this.setState({ data: response })
      console.log("Data==", this.state.data);


    } catch (error) {
      console.log(error);
    }
  }
  componentWillUnmount() {
    BackHandler.removeEventListener('hardwareBackPress', this.handleBackButtonClick);

  }
  handleBackButtonClick() {
    this.props.navigation.goBack()
    return true;
  }
  GetGridViewItem(item) {

    Alert.alert('Downloading...')

  }
  checkPermission = async (filePath) => {

    // Function to check the platform
    // If Platform is Android then check for permissions.

    if (Platform.OS === 'ios') {
      this.downloadFile(filePath)
    } else {
      try {
        const granted = await PermissionsAndroid.request(
          PermissionsAndroid.PERMISSIONS.WRITE_EXTERNAL_STORAGE,
          {
            title: 'Storage Permission Required',
            message:
              'Application needs access to your storage to download File',
          }
        );
        if (granted === PermissionsAndroid.RESULTS.GRANTED) {
          // Start downloading
          this.downloadFile(filePath)
          console.log('Storage Permission Granted.');
        } else {
          // If permission denied then show alert
          Alert.alert('Error', 'Storage Permission Not Granted');
        }
      } catch (err) {
        // To handle permission related exception
        console.log("++++" + err);
      }
    }
  }
  downloadFile = async(filePath) => {
    console.log(filePath);
    // Get today's date to add the time suffix in filename
    let date = new Date();
    // File URL which we want to download
    let FILE_URL = fileUrl + filePath;
    console.log(FILE_URL);
    // Function to get extention of the file url
    let file_ext = this.getFileExtention(FILE_URL);

    file_ext = '.' + file_ext[0];

    if (Platform.OS == 'ios') {
      Linking.openURL(FILE_URL).catch(err => console.error("Couldn't load page", err));
      // await WebBrowser.openBrowserAsync(FILE_URL);

    }
    else {
      // config: To get response by passing the downloading related options
      // fs: Root directory path to download
      const { config, fs } = RNFetchBlob;
      let RootDir = fs.dirs.PictureDir;
      let options = {
        fileCache: true,
        addAndroidDownloads: {
          path:
            RootDir +
            '/file_' +
            Math.floor(date.getTime() + date.getSeconds() / 2) +
            file_ext,
          description: 'downloading file...',
          notification: true,
          // useDownloadManager works with Android only
          useDownloadManager: true,
        },
      };
      config(options)
        .fetch('GET', FILE_URL)
        .then(res => {
          // Alert after successful downloading
          if (Platform.OS == 'ios' || Platform.OS == 'macos') {
            RNFetchBlob.ios.openDocument(res.data);
          }
          console.log('res -> ', JSON.stringify(res));
          alert('File Downloaded Successfully.');
        });
    }
  }

  getFileExtention = fileUrl => {
    // To get the file extension
    return /[.]/.exec(fileUrl) ?
      /[^.]+$/.exec(fileUrl) : undefined;
  }
  render() {
    return (
      <View style={styles.container}>
        <SafeAreaView style={{ paddingTop: Platform.OS === "android" ? StatusBar.currentHeight : 0, backgroundColor: Colors.primary, flexDirection: 'row', width: '100%', height: "10%", justifyContent: 'flex-start', alignItems: 'center' }}>
          <TouchableOpacity onPress={() => this.handleBackButtonClick()} style={{ marginTop: 10, alignItems: 'flex-start', marginLeft: 10 }}>
            <Image source={IMAGES.back}
              style={{ height: 15, width: 22, tintColor: 'white', alignSelf: 'center' }} />
          </TouchableOpacity>
          <Text style={{ fontSize: 18, fontWeight: 'bold', color: Colors.white, marginLeft: 20, marginTop: 10 }}>{this.state.name}</Text>
        </SafeAreaView>
        {/* <Text style={{ fontWeight: 'bold', margin: 20 }}>Most Popular</Text> */}
        <FlatList

          style={{ margin: 10 }}
          data={this.state.data}

          renderItem={({ item }) =>
            <View style={styles.GridViewBlockStyle}>
              <View>
                <TouchableOpacity onPress={() => this.checkPermission(item.filePath)}>
                  <Image
                    source={{ uri: IMAGEURL + item.jpgName }}
                    style={{ resizeMode: 'stretch', alignSelf: 'center', height: 130, width: 100 }}
                  />
                  <Text style={styles.picsStyle}>{item.fileName}</Text>
                </TouchableOpacity>

              </View>
            </View>

          }
          numColumns={2}
          keyExtractor={item => item.fileName}
        />

      </View>
    )
  }
}
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#E5E5E5'
  },
  galleryTitle: {
    color: Colors.black,
    fontSize: 24,
    marginTop: 32,
    textAlign: 'left',
    marginLeft: 20,
    alignItems: 'flex-start'
  },
  cardView: {
    backgroundColor: Colors.white,
    borderRadius: 13,
    margin: 20,
    marginBottom: 50
  },
  GridViewBlockStyle: {

    justifyContent: 'center',
    flex: 1,
    flexDirection: 'column',
    alignItems: 'center',
    // height: 50,
    padding: 10,
    borderRadius: 13,
    margin: 5,
    backgroundColor: COLORS.white

  }
  ,
  GridImageStyle: {
    height: 70,
    width: 150,
  },
  GridViewInsideTextItemStyle: {

    color: Colors.primary,
    fontSize: 18,
    justifyContent: 'center',

  },
  picsStyle: {
    fontSize: 16,
    color: COLORS.primary,
    fontWeight: 'bold'
  }
});
export default connect(mapStateToProps, mapDispatchToProps)(PopularLibrary);

