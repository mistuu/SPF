import React, { Component } from 'react'
import { Text, TouchableOpacity, View, StyleSheet, Image, TextInput, Dimensions, ScrollView, Linking } from 'react-native'
import { getPixelSizeForLayoutSize } from 'react-native/Libraries/Utilities/PixelRatio';
import Colors from '../../Assets/Colors';
import FlotingEditText from "../CusComponent/FlotingEditText";
import Validation from "../../helper/Validation";
import { connect } from 'react-redux';
import { Formik } from 'formik'
import CustomBackground from '../../utility/CustomBackground';
import Images from '../../Assets/Images';
import HindiString from '../../helper/HindiString';
import { axiosAuthGet, axiosPostLogin } from '../../utility/apiConnection';
// import { serviceActionUserDetail,LoginDetail } from '../../Reducers/Actions';
import { mapDispatchToProps, mapStateToProps } from '../../Reducers/ApiClass';
import * as Yup from 'yup';
import Strings from '../../helper/Strings';
import { loadOptions } from '@babel/core';
import { getItem, storeItem } from '../../utility/AsyncConfig';
import Toast from 'react-native-simple-toast';
import CodeInput from 'react-native-confirmation-code-input';

const { width, height } = Dimensions.get('window');
export default class FirstScreen extends Component {
    reDirect = (url) => {
        Linking.openURL(url).catch(err => console.error("Couldn't load page", err));

    }
    render() {
        return (
            <View style={styles.container}>
                <ScrollView>
                    <View style={{ marginTop: 22, alignItems: 'center' }}>
                        <Text style={{ color: Colors.white }}>|| Jai Mahaveer ||</Text>
                        <View style={{ flexDirection: 'row', marginTop: 12 }}>
                            <Text style={{ color: Colors.white }}>|| Jai Guru Nana ||</Text>
                            <Text style={{ color: Colors.white, marginLeft: 22 }}>|| Jai Guru Ram ||</Text>
                        </View>
                        <Image
                            source={Images.logo1}
                            style={{ marginTop: 19,height:130,width:130,resizeMode:'center' }}
                        />
                        <Text style={{ width: width / 2, textAlign: 'center', color: Colors.white, fontWeight: 'bold', fontSize: 24, marginTop: 14 }}>SADHUMARGI
                            PROFESSIONAL
                            FORUM</Text>
                        <Text style={{ width: width / 1.2, fontSize:14,color: Colors.white,textAlign: 'center',marginTop:14}}>(Vertical of Shree Akhil Bharatvarshiya
                            Sadhumaragi Jain Sangh)</Text>
                            <Image
                            source={Images.logo2}
                            style={{ marginTop: 19,height:130,width:130 }}
                        />
                    </View>

                </ScrollView>
                <View style={styles.imageView}>
                    <TouchableOpacity onPress={() => this.props.navigation.navigate("LoginScreen")}>
                        <View style={{ borderRadius: 13, padding: 10, paddingLeft: 25, paddingRight: 25, alignItems: 'center', borderWidth: 1.5, borderColor: Colors.primary }}>
                            <Image
                                source={Images.app_log}
                            />
                            <Text style={{ fontSize: 18, fontWeight: 'bold', color: Colors.primary, marginTop: 17 }}>Login</Text>
                        </View>
                    </TouchableOpacity>
                    <TouchableOpacity onPress={() => this.props.navigation.navigate("WebViewScreen")}>
                        <View style={{ marginLeft: 47, borderRadius: 13, padding: 10, paddingLeft: 25, paddingRight: 25, alignItems: 'center', borderWidth: 1.5, borderColor: Colors.primary }}>
                            <Image
                                source={Images.web_log}
                            />
                            <Text style={{ fontSize: 18, fontWeight: 'bold', color: Colors.primary, marginTop: 17 }}>SPF</Text>
                        </View>
                    </TouchableOpacity>
                </View>
            </View>
        )
    }
}
const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: Colors.primary
    },
    imageView: {
        height: Dimensions.get('window').height / 3.8,
        backgroundColor: Colors.white,
        // width: "100%",
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center',
    },
    image: {
        // height: height/4.5 ,
        // width: width/1.4 ,
        // margin:50
    },
    changeLanguageView: {
        backgroundColor: Colors.YellowDark,
        marginTop: 9,
        borderRadius: 999,
        position: 'absolute',
        marginLeft: Dimensions.get('window').width / 1.2,
        marginTop: Dimensions.get('window').height / 3.6,
        width: Dimensions.get('window').width / 7,
        height: Dimensions.get('window').height / 25.5,
        justifyContent: 'center',
        alignItems: 'center',
    },
    languageFontView: {
        fontWeight: 'bold',
        color: Colors.primary,
        letterSpacing: 2
    },
    loginView: {
        marginTop: Dimensions.get('window').height / 7,
        margin: 29,
    },
    loginFontView: {
        fontWeight: 'bold',
        color: Colors.white,
        fontSize: 18,
    },
    otpView: {
        flexDirection: 'row',
        width: "100%",
        borderBottomWidth: 1,
        borderBottomColor: Colors.white,
        marginTop: 40,
        alignItems: 'center',
        backgroundColor: Colors.primary
    },
    TextInput: {
        fontSize: 18,
        width: "100%",
        borderBottomWidth: 1,
        borderBottomColor: Colors.white,
        color: Colors.white,
        marginTop: 40,
        backgroundColor: Colors.primary
    },
    registerView: {
        // position: 'absolute',
        justifyContent: 'center',
        flexDirection: 'row',
        marginBottom: 10
    },
    noAccountFont: {
        textAlign: 'center',
        color: Colors.white,
        fontSize: 14
    },
    registerFont: {
        textAlign: 'center',
        color: Colors.white,
        fontWeight: 'bold',
        marginLeft: 5,
        fontSize: 14
    }
})