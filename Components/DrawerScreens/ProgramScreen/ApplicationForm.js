import React, { Component } from 'react';
import { View, Text, BackHandler, StyleSheet, FlatList, Image, TouchableOpacity, Linking, SafeAreaView, Platform, StatusBar } from 'react-native';
import { connect } from 'react-redux';
import Colors from '../../../Assets/Colors';
import Images from '../../../Assets/Images';
import { mapStateToProps, mapDispatchToProps } from '../../../Reducers/ApiClass';
class ApplicationForm extends Component {
  constructor(props) {
    super(props);
    this.handleBackButtonClick = this.handleBackButtonClick.bind(this)
    this.state = {
      data: null,
    };
  }
  componentDidMount() {
    BackHandler.addEventListener('hardwareBackPress', this.handleBackButtonClick);

    // console.log(this.props.programDetails);
    this.setState({ data: this.props.programDetails })
  }
  componentWillUnmount() {
    BackHandler.removeEventListener('hardwareBackPress', this.handleBackButtonClick);

  }
  handleBackButtonClick() {
    this.props.navigation.goBack()
    return true;
  }
  reDirect = (id) => {
    // console.log(id);
    this.props.ProId(id);
    this.props.navigation.navigate('dynamicForm')

  }
  EmptyListMessage = () => {
    return (
      // Flat List Item
      <View style={styles.emptyListStyle}>
        <Text style={styles.emptyMessageStyle}>No Form Available</Text>
      </View>
    );
  }
  render() {
    return (
      <View style={{ flex: 1 }}>
        <SafeAreaView style={{ paddingTop: Platform.OS === "android" ? StatusBar.currentHeight : 0, backgroundColor: Colors.primary, flexDirection: 'row', width: '100%', height: "10%", justifyContent: 'flex-start', alignItems: 'center' }}>
          <TouchableOpacity onPress={() => this.handleBackButtonClick()} style={{ marginTop: 10, alignItems: 'flex-start', marginLeft: 10 }}>
            <Image source={Images.back}
              style={{ height: 15, width: 22, tintColor: 'white', alignSelf: 'center' }} />
          </TouchableOpacity>
          <Text style={{ fontSize: 18, fontWeight: 'bold', color: Colors.white, marginLeft: 20, marginTop: 10 }}>Application Form</Text>
        </SafeAreaView>
        <FlatList
          style={{ margin: 10 }}
          data={this.state.data}

          renderItem={({ item }) =>
            <TouchableOpacity onPress={() => this.reDirect(item.ProgramId)}>
              <View style={styles.GridViewBlockStyle}>
                {/* <Text>{item.No}</Text> */}
                <Text style={styles.picsStyle}>{item.programName}</Text>
              </View>
            </TouchableOpacity>
          }
          numColumns={1}
          ListEmptyComponent={this.EmptyListMessage()}
          keyExtractor={item => item.ProgramId}

        />
      </View>
    );
  }
}
const styles = StyleSheet.create({
  container: {
    flex: 1
  },
  picsStyle: {
    fontSize: 16,
    color: COLORS.primary,
    fontWeight: 'bold'
  },
  emptyListStyle: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    textAlignVertical: 'center'

  },
  emptyMessageStyle: {
    textAlign: 'center',
    justifyContent: 'center',
    alignItems: 'center',
    textAlignVertical: 'center'

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
})
export default connect(mapStateToProps, mapDispatchToProps)(ApplicationForm);