import React from 'react';
import { Image, Platform,SafeAreaView, StatusBar, Text, TouchableOpacity, View } from 'react-native';
import { connect } from 'react-redux';
// import { IMAGEURL } from "../../utility/util";
import { COLORS, IMAGES } from '../../Assets';



// var PushNotification = require("react-native-push-notification");


const colors1 = [
  COLORS.primary,
  COLORS.primary
]


class Header extends React.Component {
  constructor(props) {
    super(props)
    global.this = this
    this.state = {
      unReadNotification: 0,
      searchOpen: false,
    }

    // this.didFocusListener = this.props.navigation.addListener(
    //   'didFocus',
    //   (obj) => {

    //     //     this.setState({unReadNotification: global.unReadNotification})

    //   })
  }


  // componentDidMount() {
  //   this.props.NotificationsListByuser(this.props.LoginDetails.empID + "/" + this.props.LoginDetails.userRoleId)

  // }
  // notificationListSuccess=(res)=>(this.afternotificationListSuccess(res))
  // afternotificationListSuccess(respp){
  //   if (respp != null) {
  //     var unReadNotification = respp.filter(e => !e.isRead)
  //     this.setState({ unReadNotification: unReadNotification.length })
  //     //  BadgeAndroid.setBadge(unReadNotification.length );
  //     PushNotification.setApplicationIconBadgeNumber(unReadNotification.length)
  //   }
  // }

  render() {
    const { navigation, title } = this.props
    return (

      <SafeAreaView style={{
        height: "10%", width: '100%',
        justifyContent: 'center',
        alignItems:'center',
        backgroundColor: COLORS.primary,
        paddingTop: Platform.OS === "android" ? StatusBar.currentHeight : 0,
        paddingBottom: Platform.OS === "android" ? StatusBar.currentHeight : 0,

        // borderBottomLeftRadius: this.props.LoginDetails.userRoleId == 4 ? 0 : 15,
        // borderBottomRightRadius: this.props.LoginDetails.userRoleId == 4 ? 0 : 15,
      }}
      >
        {/* {
          Platform.OS === 'android' ?
            <StatusBar backgroundColor={COLORS.primary} />
            : null
        } */}

        {/* <StatusBar barStyle={'dark-content'} backgroundColor={COLORS.primary} /> */}
        <View style={{ height: '100%',         paddingTop: Platform.OS === "android" ? StatusBar.currentHeight : 0,flexDirection: 'row'  ,}}>
          <TouchableOpacity style={{ width: 50, height: 50, alignSelf: 'center', alignItems: 'center', justifyContent: 'center' }} onPress={() => navigation.openDrawer()}>
            <Image
              source={IMAGES.menuopen}
              style={{ height: 20, width: 20, resizeMode: "contain", alignSelf: 'center' }}
            />
            {/* width: '100%', height: "100%",  */}
          </TouchableOpacity>
          {/* { this.props.LoginDetails.photoURL != null &&  <View style={{  width: 50,height:50,borderRadius:50/2,alignItems:'center',justifyContent:'center'}}> */}
          {/* {
              this.props.UserDetails.photoUrl == null ?
                <Image source={IMAGES.logo} style={{ resizeMode: 'contain', height: 50, width: 60, bottom: 2 }} />
                : */}
          {/* <Image source={{ uri: IMAGEURL + this.props.LoginDetails.photoURL }} style={{ resizeMode: 'center', height: 40, width: 40,borderRadius:40/2, bottom: 2 }} /> */}
          {/* } */}

          {/* </View>} */}
          <View style={{ flexGrow: 1, justifyContent: 'center' }}>
            <Text style={{ color: "white", textAlign: "left", padding: 5, fontSize: 20, fontWeight: 'bold' }}>{title}</Text>
          </View>
          {/* <View style={{ justifyContent: 'center' }}>

            <TouchableOpacity style={{ width: 40, height: 55, alignItems: 'center', justifyContent: 'center' }} onPress={() => { }}>
              <Image source={IMAGES.search}
                style={{ height: 28, width: 28, resizeMode: 'contain', tintColor: COLORS.white }} />
            </TouchableOpacity>

          </View>
          <View style={{ justifyContent: 'center' }}>

            <TouchableOpacity style={{ width: 40, height: 55, alignItems: 'center', justifyContent: 'center' }} onPress={() => { }}>
              <Image source={IMAGES.languageChange}
                style={{ height: 28, width: 28, resizeMode: 'contain', tintColor: COLORS.white }} />
            </TouchableOpacity>

          </View> */}
          {/* <View style={{ justifyContent: 'center' }}>
            {this.props.NotificationList?.length > 0 ?
              Platform.OS === 'ios'
                ?
                <View style={{ left: 20, zIndex: 99, top: -4, position: 'absolute', borderRadius: 17 / 2, overflow: 'hidden', }}>
                  <Text style={{
                    paddingTop: 1.5, fontWeight: 'bold', height: 17, width: 17, borderRadius: 17 / 2, backgroundColor: 'red',
                    color: COLORS.white, fontSize: 10, textAlign: 'center', alignSelf: 'center'
                  }}>
                    {this.props.NotificationList?.length}</Text></View>
                :
                <View style={{ marginTop: 4, left: 20, zIndex: 99, top: -1, position: 'absolute', borderWidth: 1, borderColor: COLORS.white, borderRadius: 17 / 2 }}>
                  <Text style={{
                    paddingTop: 1.5, fontWeight: 'bold', height: 15, width: 15, borderRadius: 17 / 2, backgroundColor: 'red',
                    color: COLORS.white, fontSize: 10, textAlign: 'center', alignSelf: 'center'
                  }}>
                    {this.props.NotificationList?.length}</Text></View>
              : null}
            <TouchableOpacity style={{ width: 40, height: 55, alignItems: 'center', justifyContent: 'center' }} onPress={() => this.props.navigation.navigate('NotificationScreen')}>
              <Image source={IMAGES.noti}
                style={{ height: 28, width: 28, resizeMode: 'contain' }} />
            </TouchableOpacity>

          </View> */}
          <View>

          </View>

          {/* <View style={{width:'100%', borderBottomWidth:0.2, borderBottomColor:'white'}}/> */}


        </View>
        {/* <View style={{width:'100%', borderBottomWidth:0.2, borderBottomColor:'white'}}/> */}
        {/* </SafeAreaView> */}
      </SafeAreaView>

    )
  }
}
const mapStateToProps = (state) => ({
  // network: state.NetworkReducer.network,
  // error: state.CommanReducer.error,
  UserDetails: state.CommanReducer.UserDetails,
  LoginDetails: state.CommanReducer?.LoginDetails,
  NotificationList: state.CommanReducer.NotificationList,
});
const mapDispatchToProps = (dispatch) => ({
  // NotificationsListByuser: (params, onSuccess) => dispatch(Fetch('Notification/NotificationsListByuser', 'GET', params, serviceActionNotificationsListByuser, onSuccess, false)),


})

export default connect(mapStateToProps, mapDispatchToProps)(Header);