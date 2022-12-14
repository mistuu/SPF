import React from 'react';
import {
    Alert, BackHandler, ImageBackground,



    Linking, StatusBar
} from 'react-native';
// import VersionCheck from 'react-native-version-check';
import { connect } from 'react-redux';
import { COLORS, IMAGES } from '../../Assets';
import { mapDispatchToProps, mapStateToProps } from '../../Reducers/ApiClass';
import { getItem } from '../../utility/AsyncConfig';
import { CusAlert } from '../CusComponent';


class SplashScreen extends React.Component {
    constructor(props) {
        super(props);
        // this.checkUpdateNeeded();


    }
    // async checkUpdateNeeded() {
    //     try {
    //             let updateNeeded = await VersionCheck.needUpdate();
    //             console.log("updateNeeded", updateNeeded);
    //             if (updateNeeded.isNeeded) {
    //                 Alert.alert(
    //                 'Please Update',
    //                     "You will have to update vizman to the latest version to continue using.",
    //                     [
    //                         {
    //                             text: 'Update',
    //                             onPress: () => {
    //                                 BackHandler.exitApp();
    //                                 Linking.openURL(updateNeeded.storeUrl);
    //                             },
    //                              cancelable: false 
    //                         },

    //                     ])
    //             } else {
    //                 this.navigateScreen()
    //             }
    //     } catch (error) {

    //      }
    // }
    // naviagte = (rec) => (

    //     this.naviagte111(rec)
    // )
    // naviagte111(rec) {
    //     console.log("RESSSSS", rec)
    //     this.props.navigation.replace('DrawerScreen')

    // }
    componentDidMount() {
        this.navigateScreen()
    }
    navigateScreen() {

        setTimeout(() => {
            try {
                //     if (LoginDetails != false) {
                //         if (LoginDetails.userID != 0 || LoginDetails.userID != false) {
                //             this.props.saveData(LoginDetails)
                //             this.props.GetUsersDetails(LoginDetails.empID, this.naviagte)
                //         } else {
                //             this.props.navigation.replace('LoginScreen')
                //         }
                //     } else {
                getItem('LoginDetails').then((data) => {
                    // values = data;
                    // this.setState({ id: values })
                    // console.log("All Saved Data:", data.anchalId);
                    console.log("========",data);
                    if (data.memberId != null) {
                        this.props.navigation.replace('DrawerScreen')
                    }
                    else{
                        
                        this.props.navigation.replace('FirstScreen')
                    }
                })
                // }

            } catch (error) {
            }
        }, 1000);

    }

    render() {

        return (<ImageBackground
            style={{ flex: 1, paddingTop: 25 }}
            source={IMAGES.logo2}
            imageStyle={{ resizeMode: 'contain', padding: 24 }}
            backgroundColor={COLORS.primary}
        >
            {/* <StatusBar backgroundColor={COLORS.primary} /> */}
            <StatusBar barStyle={'dark-content'} backgroundColor='transparent' translucent={true} />
            <CusAlert
                displayAlert={this.props.network?.isConnected ? this.props.error != null && this.props.error != "" ? true : !this.props.network?.isConnected : !this.props.network?.isConnected}
                iconInternet={true}
                alertMessageText={"NO INTERNET CONNECTION"}
            />
        </ImageBackground>)
    }

}
// const mapStateToProps = (state) => ({
//     network: state.NetworkReducer.network,
// });
// const mapDispatchToProps = (dispatch) => ({
//     saveData: (data) => dispatch(serviceActionLoginDetail(data)),
//     GetUsersDetails: (empId, onSuccess) => dispatch(Fetch('Users/GetUsersDetails', 'GET', empId, serviceActionUserDetail, onSuccess, false)),
// })

export default connect(mapStateToProps, mapDispatchToProps)(SplashScreen);