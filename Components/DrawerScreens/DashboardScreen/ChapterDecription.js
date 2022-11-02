import React, { Component } from 'react';
import { Text, View, BackHandler, StyleSheet, Image, FlatList, ScrollView, TextInput, Dimensions, TouchableOpacity } from 'react-native'
import { AccordionList, CollapseHeader, CollapseBody, Collapse } from "accordion-collapse-react-native";
import Colors from '../../../Assets/Colors';
import { mapStateToProps, mapDispatchToProps } from '../../../Reducers/ApiClass';
import { connect } from 'react-redux';
import { COLORS, IMAGES } from '../../../Assets';
import { Separator } from 'native-base';
import { PermissionsAndroid } from 'react-native';

import Accordion from 'react-native-collapsible/Accordion';

const { width, height } = Dimensions.get('window');
class ChapterDecription extends Component {

  constructor(props) {
    
    super(props);
    this.handleBackButtonClick = this.handleBackButtonClick.bind(this)
    this.state = {
      expanded: false,
      core_team: false,
      data: null,
      title:null,
      activeSections: [],
    };
  }
  componentDidMount() {
    BackHandler.addEventListener('hardwareBackPress', this.handleBackButtonClick);
    // console.log(this.props.ChaptersList.title);
    this.setState({ data: this.props.ChaptersList.data,title:this.props.ChaptersList.title })
    // console.log("did mount+++", this.state.data);
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
      <View style={{ flex: 1, }}>

        <View style={{backgroundColor:COLORS.primary, flexDirection: 'row', width: '100%', height: "7%", justifyContent: 'flex-start', alignItems: 'center', borderBottomLeftRadius: 8, borderBottomRightRadius: 8 }}>
          <TouchableOpacity onPress={() => this.handleBackButtonClick()} style={{ marginTop: 10, alignItems: 'flex-start', marginLeft: 10 }}>
            <Image source={IMAGES.back}
              style={{ height: 15, width: 22, tintColor: 'white', alignSelf: 'center' }} />
          </TouchableOpacity>
          <Text style={{ fontSize: 18, fontWeight: 'bold', color: Colors.white, marginLeft: 20, marginTop: 10 }}>{this.state.title}</Text>
        </View>
        {/* <View style={{ width: "100%", alignItems: 'center' }}> */}
        <FlatList

          style={{ margin: 10 }}
          data={this.state.data}

          renderItem={({ item }) =>
            <View style={styles.GridViewBlockStyle}>
              <View>
                {/* <TouchableOpacity onPress={this.GetGridViewItem.bind(this, item.chapter)}> */}

                <Text style={styles.picsStyle}>{item.branchTitle}</Text>
                {/* </TouchableOpacity> */}

              </View>
            </View>

          }
          numColumns={2}
          keyExtractor={item => item.branchId}
        />

        {/* </View> */}
      </View >
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
export default connect(mapStateToProps, mapDispatchToProps)(ChapterDecription);