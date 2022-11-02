import {
  createDrawerNavigator,
  DrawerItem, DrawerItemList, DrawerContentScrollView
} from '@react-navigation/drawer';
import React, { Component } from 'react';
import { Image, ScrollView, Text, TouchableOpacity, Dimensions, View } from 'react-native';

import { connect } from 'react-redux';
import Colors from '../../Assets/Colors/index.js';
import Images from '../../Assets/Images/index.js';
import { COLORS, IMAGES } from '../../Assets/index.js';
import { mapDispatchToProps, mapStateToProps } from '../../Reducers/ApiClass.js';
import { axiosAuthGet } from '../../utility/apiConnection.js';
import { getItem, storeItem } from '../../utility/AsyncConfig.js';
import Header from '../CusComponent/Header.js';
import { Activity, Calender, MemberDirectory, Dashboard, Event, Gallery, Grievances, Inbox, Program, ToDoList } from '../DrawerScreens';
import SamtaDigitalLibrary from '../DrawerScreens/SamtaDigitalLibrary.js';
import { AddNewGrievances } from '../Screens'
import { IMAGEURL } from '../../utility/util'
const { width, height } = Dimensions.get('window');

const Drawer = createDrawerNavigator();

const colors = [
  COLORS.primary,
  COLORS.third
]

class DrawerScreen extends Component {
  constructor(props) {
    super(props);
    this.state = {
      drawerProps: null,
      Name: '',
      Designation: '',
      memberImage: '',
      iS_Become: 0,
    };

  }
  async componentDidMount() {
    this.getData();
    this.willFocusSubscription = this.props.navigation.addListener(
      'focus',
      () => {
          this.getData();
      }
  );
  }
  getData = async () => {
    try {
      var values;
      await getItem('LoginDetails').then((data) => {
        values = data.memberId;
        this.setState({ memberId: values })
        // console.log("Member id:", data.memberId);
      })
      console.log("Member id:", values);
      let response = await axiosAuthGet("Member/Profile/" + values)
      this.setState({
        data: response,
        Name: response.memberName,
        Designation: response.designation,
        iS_Become: response.iS_Become,
        // MidID: response.memberMIDId,
        // SPFID: response.memberSPFId,
        // memberImage: response.memberImage,

      })
      if (response.memberImage != '') {
        var memberImage = { uri: IMAGEURL + response.memberImage }
        this.setState({ memberImage: memberImage })
      }
      else {
        var memberImage = Images.user_default
        this.setState({ memberImage: memberImage })
      }
      console.log("Profile:-", response);
    } catch (error) {

    }
  }
  async Logout() {
    try {
      await storeItem('LoginDetails', null);
      this.props.navigation.replace('FirstScreen')

    } catch (error) {
      console.log(error);
    }
  }

  CustomDrawerContent = (props) => {



    return (

      <DrawerContentScrollView style={{ flex: 1, backgroundColor: COLORS.primary }}>
        <View style={{ height: this.state.iS_Become == 1 ? "16%" : "23%", width: "100%", backgroundColor: Colors.white }}>
          <TouchableOpacity onPress={() => this.props.navigation.navigate('Profile')}>

            <View style={{ margin: 20, flexDirection: 'row', alignItems: 'center' }}>

              <Image style={{
                width: 75, height: 75, borderRadius: 75 / 2,
                overflow: "hidden",
              }}
                source={this.state.memberImage} />

              <View style={{ marginLeft: 13 }}>
                <Text style={{ color: Colors.primary, fontWeight: 'bold', width: width / 2.5 }}>{this.state.Name}</Text>
                <Text style={{ width: width / 2.5 }}>{this.state.Designation}</Text>
              </View>

            </View>
          </TouchableOpacity>
          {
            this.state.iS_Become == 0 ? (
              <TouchableOpacity 
              //  this.props.navigation.navigate('Registration')}
               >
                <Text style={{ color: Colors.primary, fontWeight: 'bold', textAlign: 'right', margin: 20 }}>Become an SPF member</Text>
              </TouchableOpacity>
            ) : null
          }
        </View>
        {/* itemStyle={{ borderColor: "black", borderTopWidth: 1, padding: -2 }} */}
        <DrawerItemList {...props} activeTintColor='#676767' activeBackgroundColor="rgba(52, 52, 52, 0.2)" inactiveTintColor='rgba(0, 0, 0, .87)' inactiveBackgroundColor='transparent' style={{ backgroundColor: COLORS.black }} labelStyle={{ color: COLORS.white, width: 150 }} />

        <DrawerItem label="Logout" onPress={() => this.Logout()} labelStyle={{ color: COLORS.white, }} icon={({ color, size }) => (<Image source={Images.logout_icon} />
        )} />
      </DrawerContentScrollView>

    )
  }

  render() {
    return (
      <View style={{ flex: 1, backgroundColor: 'green' }}>
        {/* {this.state.drawerProps && <Header title={"Change Password"} navigation={this.state.drawerProps} />} */}

        <Drawer.Navigator initialRouteName="Home" drawerContent={this.CustomDrawerContent}
          backBehavior="initialRoute"
          initialRouteName="Dashboard"

          drawerStyle={{
            width: 270,
            backgroundColor: COLORS.white,
          }}>
          <Drawer.Screen name="Dashboard" component={Dashboard} options={{
            drawerIcon: (focused, size) => (
              <Image source={Images.dashbord_icon} />
            )
          }} />
          <Drawer.Screen name="Activity" component={Activity} options={{
            drawerIcon: (focused, size) => (
              <Image source={Images.activity_icon} />
            )
          }} />
          <Drawer.Screen name="Calender" component={Calender} options={{
            drawerIcon: (focused, size) => (
              <Image source={Images.cal_icon} />
            )
          }} />
          <Drawer.Screen name="Program" component={Program} options={{
            drawerIcon: (focused, size) => (
              <Image source={Images.program_icon} />
            )
          }} />
          <Drawer.Screen name="Event" component={Event} options={{
            drawerIcon: (focused, size) => (
              <Image source={Images.event_icon} />
            )
          }} />
          <Drawer.Screen name="Samta Digital Library" component={SamtaDigitalLibrary} options={{
            drawerIcon: (focused, size) => (
              <Image source={Images.library_icon} />
            )
          }} />
          {
            this.state.iS_Become == 1 ? (
              <Drawer.Screen name="Inbox" component={Inbox} options={{
                drawerIcon: (focused, size) => (
                  <Image source={Images.inbox_icon} />
                )
              }} />
            ) : null
          }
          {
            this.state.iS_Become == 1 ? (
              <Drawer.Screen name="ToDoList" component={ToDoList} options={{
                drawerIcon: (focused, size) => (
                  <Image source={Images.todo_icon} />
                )
              }} />
            ) : null
          }
          {
            this.state.iS_Become == 1 ? (
              <Drawer.Screen name="Grievances" component={Grievances} options={{
                drawerIcon: (focused, size) => (
                  <Image source={Images.gravinc_icon} />
                )
              }} />
            ) : null
          }
          <Drawer.Screen name="Gallery" component={Gallery} options={{
            drawerIcon: (focused, size) => (
              <Image source={Images.gallery_icon} />
            )
          }} />
          <Drawer.Screen name="Member Directory" component={MemberDirectory} options={{
            drawerIcon: (focused, size) => (
              <Image source={Images.inbox_icon} />
            )
          }} />
        </Drawer.Navigator>

      </View>)

  }
}


export default connect(mapStateToProps, mapDispatchToProps)(DrawerScreen);