import React, { Component } from 'react';
import { Text, View, BackHandler, StyleSheet, Linking,Image, FlatList, Platform, PermissionsAndroid, ScrollView, TextInput, Dimensions, TouchableOpacity, Alert } from 'react-native'
import { connect } from 'react-redux';
import { COLORS } from '../../../../Assets';
import Colors from '../../../../Assets/Colors';
import { mapStateToProps } from '../../../../Reducers/ApiClass';
import RNFetchBlob from 'rn-fetch-blob';
import { IMAGEURL } from '../../../../utility/util'
const fileUrl = IMAGEURL;

class BookScreen extends Component {
  constructor(props) {
    super(props);
    this.state = {
      data: null
    };
  }
  async componentDidMount() {
    console.log("Documents", this.props.documentsDetailss);
    var data = this.props.documentsDetailss;
    data = data.filter(element => {
      return element.docType == 3
    });
    console.log(data);
    this.setState({ data: data })
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
  downloadFile = (filePath) => {
    console.log(filePath);
    // Get today's date to add the time suffix in filename
    let date = new Date();
    // File URL which we want to download
    let FILE_URL = fileUrl + filePath;
    // Function to get extention of the file url
    let file_ext = this.getFileExtention(FILE_URL);

    file_ext = '.' + file_ext[0];

    if (Platform.OS == 'ios') {
      Linking.openURL(FILE_URL).catch(err => console.error("Couldn't load page", err));

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
        <FlatList

          style={{ margin: 10 }}
          data={this.state.data}

          renderItem={({ item }) =>
            <View style={styles.GridViewBlockStyle}>
              <View>
                <TouchableOpacity onPress={() => this.checkPermission(item.docUrl)}>
                  <Image
                    source={{ uri: IMAGEURL + item.docImg }}
                    style={{ resizeMode: 'stretch', alignSelf: 'center', height: 130, width: 100 }}
                  />
                  <Text style={styles.picsStyle}>{item.docTitle}</Text>
                </TouchableOpacity>

              </View>
            </View>

          }
          numColumns={2}
          keyExtractor={item => item.fileName}
        />

      </View>
    );
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
export default connect(mapStateToProps)(BookScreen);