import React, { Component } from 'react';
import { Dimensions, BackHandler, FlatList, Image, ImageStore, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { connect } from 'react-redux';
import VideoPlayer from 'react-native-video-controls';
const width = Dimensions.get('window').width;
const height = Dimensions.get('window').height;
import { mapStateToProps } from '../../../../Reducers/ApiClass';
import Colors from '../../../../Assets/Colors';
import Images from '../../../../Assets/Images';
import AudioRecorderPlayer, {
  AVEncoderAudioQualityIOSType,
  AVEncodingOption,
  AudioEncoderAndroidType,
  AudioSourceAndroidType,
} from 'react-native-audio-recorder-player';
import Slider from 'react-native-slider';

import { IMAGEURL } from '../../../../utility/util';
const audioRecorderPlayer = new AudioRecorderPlayer()
let prevIndex = -1
let audioList = null
let currentIndex
let setCommentList
let setTimeElapsed
let setDuration
let duration = "00:00:00"
let timeElapsed = "00:00:00"
class AudioScreen extends Component {
  constructor(props) {
    super(props);
    this.handleBackButtonClick = this.handleBackButtonClick.bind(this)

    this.state = {
      data: null,
      duration: "00:00:00"
    };
  }
  componentDidMount() {
    BackHandler.addEventListener('hardwareBackPress', this.handleBackButtonClick);

    console.log("Documents", this.props.documentsDetailss);
    var data = this.props.documentsDetailss;
    data = data.filter(element => {
      return element.docType == 2
    });
    var x = [];
    data = data.filter(item => {
      x.push({ docUrl: item.docUrl, timeElapsed: "00:00:00", duration: "00:00:00", isSelected: false, value: 0, image: Images.play_button })
    })
    audioList = x
    console.log(x);
    this.setState({ data: x })

  }
  componentWillUnmount() {
    BackHandler.removeEventListener('hardwareBackPress', this.handleBackButtonClick);

  }
 async handleBackButtonClick() {
    await audioRecorderPlayer.stopPlayer()
    audioRecorderPlayer.removePlayBackListener()
    this.props.navigation.goBack()
    return true;
  }
  onStartPlay = async (index, audioPath) => {
    console.log('onStartPlay', audioList[index].isSelected);

    if (!audioList[index].isSelected) {
      if (index == prevIndex) {
        // audioRecorderPlayer.setDuration(duration)
      }
      currentIndex = index

      var temp = [...audioList]
      await audioRecorderPlayer.stopPlayer()
      audioRecorderPlayer.removePlayBackListener()
      if (prevIndex != -1) {
        temp[prevIndex].value = 0
        temp[prevIndex].isSelected = false
        temp[prevIndex].image = Images.play_button
        this.setState({ data: temp })

        // setCommentList(temp)
      }
      prevIndex = index

      temp = temp.map((el, index1) => (
        index == index1 ? { ...el, isSelected: true, value: 0, image: Images.stop_button } : el //{...el, isSelected: false, value : 0, image : require('../../assets/play_audio.png') }
      ))
      // setCommentList(temp)
      this.setState({ data: temp })


      // ? Custom path
      const msg = await audioRecorderPlayer.startPlayer(IMAGEURL + audioPath);
      //? Default path
      // const msg = await this.audioRecorderPlayer.startPlayer();
      const volume = await audioRecorderPlayer.setVolume(1.0);
      // setAudioImg(require('../../assets/stop_audio.png'))
      // console.log(`file: ${msg}`, `volume: ${volume}`);

      // audioRecorderPlayer.setCurrentPositionSec(commentList[index].value)
      audioRecorderPlayer.addPlayBackListener((e) => {
        console.log(" currentPosition: ", e.currentPosition)
        console.log("  duration: ", e.duration)
        console.log(" play back:1: ", audioRecorderPlayer.mmssss(
          Math.floor(e.currentPosition)))
        console.log(" play back:2: ", audioRecorderPlayer.mmssss(Math.floor(e.duration)))

        if (e.currentPosition == e.duration) {
          var temp = [...audioList]
          temp = temp.map((el, index1) => (
            index == index1 ? { ...el, isSelected: false, value: 0, image: Images.play_button } : { ...el, isSelected: false, value: 0, image: Images.play_button }
          ))
          this.setState({ data: temp })

          // setCommentList(temp)
        } else {
          var updateList = [...audioList]
          let percent = Math.round((e.currentPosition / e.duration) * 100);
          updateList[index].value = percent
          updateList[index].isSelected = true
          updateList[index].image = Images.stop_button
          // setCommentList(updateList)
          this.setState({ data: updateList })

          // console.log("  percent: ",percent)

        }
        setTimeElapsed = audioRecorderPlayer.mmssss(
          Math.floor(e.duration));
        // duration = setDuration
        setDuration = audioRecorderPlayer.mmssss(
          Math.floor(e.currentPosition));
        console.log(" currentPosition: ", e.currentPosition)
        console.log(" currentPosition: ", audioRecorderPlayer.mmssss(
          Math.floor(e.currentPosition)))
        updateList[index].duration = setDuration
        updateList[index].timeElapsed = setTimeElapsed

        // timeElapsed = setTimeElapsed

      });
    } else {
      await audioRecorderPlayer.stopPlayer()
      var temp = [...audioList]
      temp[index].value = 1
      temp[index].isSelected = false
      temp[index].image = Images.play_button
      // setCommentList(temp)
      this.setState({ data: temp })

    }

  }
  render() {
    return (
      <View style={{ flex: 1, alignItems: 'center' }}>

        <FlatList
          style={{ flex: 1, margin: 10 }}
          // contentContainerStyle={{ flexGrow: 1, }}
          data={audioList}
          renderItem={({ item, index }) =>
            <View style={styles.cardView}>
              <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                <Image source={Images.song} style={{ height: 30, width: 30, marginRight: 10 }} />

                <View style={{ flex: 1, alignSelf: 'center', }}>

                  <Slider
                    maximumValue="89" minimumValue="0"
                    minimumTrackTintColor={Colors.graye00}
                    maximumTrackTintColor={Colors.grayCCC}
                    value={item.value}
                    onValueChange={value => this.setState({ duration: value })}
                    thumbStyle={{ justifyContent: 'center', alignItems: 'center', height: 15, width: 15, backgroundColor: Colors.primary }}
                  />
                  <View style={{ flexDirection: 'row', marginTop: -8, flex: 1 }}>
                    <Text style={{ flex: 1, fontSize: 10,  }}>{item.duration}</Text>
                    <Text style={{ alignSelf: 'flex-end', fontSize: 10, }}>{item.timeElapsed}</Text>
                  </View>

                </View>
                <TouchableOpacity style={{ height: 30, width: 30, marginLeft: 10 }} onPress={() => this.onStartPlay(index, item.docUrl)}>
                  <Image source={item.image} style={{ height: 30, width: 30, padding: 10 }} />

                </TouchableOpacity>
              </View>
            </View>
          }
          numColumns={1}
          keyExtractor={item => item.No}
          onEndReachedThreshold={0}
        />
      </View>
    );
  }
}
const styles = StyleSheet.create({

  container: {
    flex: 1,
    flexDirection: 'column',
    justifyContent: 'space-between',
  },
  cardView: {
    backgroundColor: Colors.white,
    borderRadius: 10,
    width: width / 1.1,
    margin: 5,
    alignItems: 'center',
    // padding: 10,
    // paddingBottom: 5,
    padding: 10

  },
})
export default connect(mapStateToProps)(AudioScreen)