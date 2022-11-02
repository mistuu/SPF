import React, { Component } from 'react';
import { Dimensions, FlatList, Image, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { connect } from 'react-redux';
import VideoPlayer from 'react-native-video-controls';
const width = Dimensions.get('window').width;
const height = Dimensions.get('window').height;
import { mapStateToProps } from '../../../../Reducers/ApiClass';
import Colors from '../../../../Assets/Colors';
import YoutubePlayer from 'react-native-youtube-iframe';

class VideoScreen extends Component {
  constructor(props) {
    super(props);
    this.state = {
      data: null,
      allData:null,
      page: 1,
      hasScrolled: false

    };
  }

  async componentDidMount() {
    this.LoadData();

  }
  onScroll = () => {
    this.setState({hasScrolled: true})
   }
  LoadData = async () => {
    console.log("Documents", this.props.documentsDetailss);
    var data = this.props.documentsDetailss;
    data = await data.filter(element => {
      return element.docType == 1
    });
    // var data1=data.slice(0, 3);
    // console.log("Video==", data);
    // this.setState({allData:data,
    //   data: this.state.page === 1 ? data1 :
    //     [...this.state.data, ...data1]
    // })
    this.setState({ data: data })
    console.log(data);
  }
  LoadMoreData = () => {
    console.log("dcbv");
    console.log("dcbv",this.state.page,this.state.data.length);
    var data1=this.state.allData.slice(0, (this.state.page+1)*3);
    this.setState({data:data1,
      page: this.state.page + 1
    }, () => this.LoadData());
  }
  render() {
    return (
      <View style={{ flex: 1, alignItems: 'center' }}>

        <FlatList
          style={{ margin: 10, }}
          data={this.state.data}
          renderItem={({ item }) =>

            <View style={{ marginBottom: 10 }}>

              <View style={styles.cardView}>
                <Text style={{ color: Colors.white, fontSize: 18 }}>{item.docHeading}</Text>
              </View>
              <View style={{
                backgroundColor: Colors.white,
                borderBottomLeftRadius: 13,
                borderBottomRightRadius: 13,
                width: width / 1.1,
                height: height / 3.2,
                alignItems: 'center',
              }}>
                <YoutubePlayer
                  height={"100%"}
                  width={width / 1.1}
                  play={false}
                  videoId={item.docUrl}
                />
              </View>

            </View>
          }
          numColumns={1}
          onEndThreshold={0}
          // keyExtractor={item => item.No}
          // onEndReached={this.LoadMoreData}
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
    backgroundColor: Colors.primary,
    borderTopLeftRadius: 13,
    borderTopRightRadius: 13,
    width: width / 1.1,
    // margin: 5,
    alignItems: 'center',
    // padding: 10,
    // paddingBottom: 5,
    paddingTop: 5

  },
})
export default connect(mapStateToProps)(VideoScreen)