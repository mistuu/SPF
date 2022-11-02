import React, { Component } from 'react'
import { Text, View, BackHandler, StyleSheet, Image, FlatList, ScrollView, TextInput, Dimensions, TouchableOpacity } from 'react-native'
import { connect } from 'react-redux';
import { COLORS } from '../../../Assets';
import Colors from '../../../Assets/Colors';
import { axiosPost } from '../../../utility/apiConnection';
import { mapDispatchToProps, mapStateToProps } from '../../../Reducers/ApiClass';

const { width, height } = Dimensions.get('window');

class Chapters extends Component {
  constructor(props) {
    super(props)
    this.handleBackButtonClick = this.handleBackButtonClick.bind(this)

    this.state = {
      data: null,
      chapters: [
        { title: 'Ahmedabad' },
        { title: 'Banglor' },
        { title: 'Rajkot' },
        { title: 'Junagadha' },
        { title: 'Lorem Ipsum' },
        { title: 'Lorem Ipsum' },
        { title: 'Lorem Ipsum' },
        { title: 'Lorem Ipsum' },]
    }
  }
  GetGridViewItem(item,title) {
    var data={
      data:item,
      title:title
    }
    // console.log(data);
    this.props.Chapters(data)
    this.props.navigation.navigate('ChapterDecription')

  }
  async componentDidMount() {
    BackHandler.addEventListener('hardwareBackPress', this.handleBackButtonClick);

    const params = {
      "parameter": "",
      "parameter1": "",
      "pageSize": "1000",
      "page": "1",
      "sortColumn": "br.branch_id"
    }
    try {
      let response = await axiosPost("Branch/List", params);
      this.setState({ data: response })
      console.log(this.state.data);

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
  render() {
    return (
      <View style={styles.container}>
        <View style={{backgroundColor:COLORS.primary, flexDirection: 'row', width: '100%', height: "7%", justifyContent: 'flex-start', alignItems: 'center', borderBottomLeftRadius: 8, borderBottomRightRadius: 8 }}>
          <TouchableOpacity onPress={() => this.handleBackButtonClick()} style={{ marginTop: 10, alignItems: 'flex-start', marginLeft: 10 }}>
            <Image source={IMAGES.back}
              style={{ height: 15, width: 22, tintColor: 'white', alignSelf: 'center' }} />
          </TouchableOpacity>
          <Text style={{ fontSize: 18, fontWeight: 'bold', color: Colors.white, marginLeft: 20, marginTop: 10 }}>Chapters</Text>
        </View>
        {/* <Text style={{ fontWeight: 'bold', margin: 20 }}>Chapters</Text> */}
        <FlatList

          style={{ margin: 10 }}
          data={this.state.data}

          renderItem={({ item }) =>
            <View style={styles.GridViewBlockStyle}>
              <View>
                <TouchableOpacity onPress={this.GetGridViewItem.bind(this, item.chapter,item.branchTitle)}>

                  <Text style={styles.picsStyle}>{item.branchTitle}</Text>
                </TouchableOpacity>

              </View>
            </View>

          }
          numColumns={2}
          keyExtractor={item => item.branchId}
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
    height: 50,
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
export default connect(mapStateToProps, mapDispatchToProps)(Chapters)