import React, { Component } from 'react'
import { Text, TouchableOpacity, View, StyleSheet, Image, TextInput, Dimensions, ScrollView } from 'react-native'
import { getPixelSizeForLayoutSize } from 'react-native/Libraries/Utilities/PixelRatio';
import Colors from '../../Assets/Colors';
import FlotingEditText from "../CusComponent/FlotingEditText";
import Validation from "../../helper/Validation";
import { connect } from 'react-redux';
import { Formik } from 'formik'
import CustomBackground from '../../utility/CustomBackground';
import Images from '../../Assets/Images';
import HindiString from '../../helper/HindiString';
import { axiosAuthGet, axiosPost, axiosPostLogin } from '../../utility/apiConnection';
// import { serviceActionUserDetail,LoginDetail } from '../../Reducers/Actions';
import { mapDispatchToProps, mapStateToProps } from '../../Reducers/ApiClass';
import * as Yup from 'yup';
import Strings from '../../helper/Strings';
import { loadOptions } from '@babel/core';
import { getItem, storeItem } from '../../utility/AsyncConfig';
import Toast from 'react-native-simple-toast';
import CodeInput from 'react-native-confirmation-code-input';

const { width, height } = Dimensions.get('window');
const signIn = Yup.object().shape({
    Username: Yup.string().trim().required(Strings.errorBlankEmail),
    //    .email(Strings.errorInvalidEmial),

});

class GetOtp extends Component {
    constructor(props) {
        super(props)
        this.state = {
            Login: 'Login',
            HN: 'HN',
            SPFID: 'SPF ID / MID  / Mobile No',
            OTP: "123456",
            GetOTP: 'Get OTP',
            NoAccount: 'Don’t have an account?',
            Register: 'Register Now',
            loginObject: {
                "Username": "",
                "Password": "",
            },
            AllMemberId: [],
            code: '',
            otp: '',
            username: '',
            token: ''
        }

    }
    async componentDidMount() {
        this.setState({ otp: this.props.Proid.otp, username: this.props.Proid.username, token: this.props.Proid.token })
        console.log(this.props.Proid.username);
        // let Result = await axiosAuthGet('Member/List')
        // console.log("ToDoList Data:", Result.data);
        // this.props.serviceActionUserDetail()
        // try {
        //     let response = await axiosAuthGet("Member/Login/" + 194005)
        //     await storeItem('LoginDetails', response);

        //     console.log("Login Details:-", response);
        // } catch (error) {

        // }

    }

    // async componentDidUpdate(prevProps) {
    //     // let arr=[];
    //     // var arr;
    //     if (this.props.LoginDetails !== prevProps.LoginDetails) {
    //         console.log(this.props.LoginDetails);
    //         this.setState({ OTP: this.props.LoginDetails.otp })
    //         await storeItem('LoginDetails', this.props.LoginDetails);
    //     }

    //     if (this.props.UserDetails !== prevProps.UserDetails) {

    //         this.state.AllMemberId.push(this.props.UserDetails.map(function (val) {
    //             return val.memberMIDId;
    //         }))
    //         console.log("All Member ID:", this.state.AllMemberId);
    //     }

    // }
    getOtp = async (val) => {
        // var x = this.state.AllMemberId[0].find(v => v === val);
        // console.log(x);
        // getItem('LoginDetails').then((data)=>{
        //     var values=data;
        //     console.log("All Saved Data:",values.anchalId);
        // })
        try {
            // let response = await axiosAuthGet("Member/GetToken")
            // console.log("Token:-", response.token + "===" + val);
            // var modal = {
            //     "token": response.token,
            //     "username": val,
            // }
            // let re = await axiosPostLogin("https://members.sadhumargi.com/validate/forgotpassword", modal)
            // this.setState({ OTP: re.otp })
            // Toast.show(re.message, Toast.SHORT);
            // console.log("OTP Response:-", re);


        } catch (error) {

        }
        // if (x != null) {
        //     Toast.show('OTP Sent...', Toast.SHORT);
        //     console.log("Username:", val, x);
        //     await this.props.LoginDetail(val);
        // }
        // else if(x!=val){
        //     Toast.show('Invalid MID...', Toast.LONG);

        // }
        // else {
        //     Toast.show('Please Fill the MID...', Toast.LONG);
        // }

        console.log("OTP:", this.state.OTP);

    }
    handleVerify = (code) => {
        console.log(code);
        this.setState({ code: code })

        // this.login(code)
    }
    async login() {
        if (this.state.code == this.state.otp) {
            let response = await axiosAuthGet("Member/GetToken")

            var modal = {
                "token": this.state.token,
                "username": this.state.username,
                "otp": this.state.otp
            }
            console.log("Modal OTP", modal);
            let re = await axiosPostLogin("https://members.sadhumargi.com/validate/validateloginotp", modal)
            if (re["0"].age == null) {
                re["0"].age = "0"
            }
            console.log("Main===", re["0"]);
            if (re.status == 200) {
                let r = await axiosPost("Member/SaveSanghMember", re["0"])
                console.log("sang", r);
                await storeItem('LoginDetails', r);
                this.props.navigation.replace('DrawerScreen')
                Toast.show(re.message)
            }
            console.log(re);
            console.log(re.message);
        }
        else {
            Toast.show("Please Enter Code")
        }
        // console.log("Login Values:-", values);
        // console.log("OTPPPPPPPP:", this.state.OTP);

        // if (this.state.OTP > 3) {
        //     Toast.show('Login Success...', Toast.LONG);

        //     this.props.navigation.replace('DrawerScreen')
        // }
        // else {
        //     Toast.show('Login Faield...', Toast.LONG);

        //     console.log("Login Faield...");
        // }
    }
    _changeLanguage() {
        if (this.state.HN == 'HN') {
            this.setState({
                HN: 'EN',
                Login: HindiString.Login,
                SPFID: HindiString.SPFID,
                OTP: HindiString.OTP,
                GetOTP: HindiString.GetOTP,
                NoAccount: HindiString.NoAccount,
                Register: HindiString.Register,
            })
        }
        else {
            this.setState({
                Login: 'Login',
                HN: 'HN',
                SPFID: 'SPF ID / MID  / Mobile No',
                OTP: 'OTP',
                GetOTP: 'Get OTP',
                NoAccount: 'Don’t have an account?',
                Register: 'Register Now',
            })
        }
    }
    render() {
        return (
            <View style={styles.container}>
                <ScrollView>
                <View style={styles.imageView}>
                        <Text style={{ color: Colors.primary }}>|| Jai Mahaveer ||</Text>
                        <Image style={styles.image} resizeMode='contain' source={Images.logo2} />
                        <View style={{ flexDirection: 'row',alignItems:'flex-end' }}>
                            <Text style={{ color: Colors.primary }}>|| Jai Guru Nana ||</Text>
                            <Text style={{ color: Colors.primary, marginLeft: 50 }}>|| Jai Guru Ram ||</Text>
                        </View>

                    </View>
                    <View
                        style={styles.changeLanguageView}>
                        <TouchableOpacity onPress={() => this._changeLanguage()}>
                            <Text style={styles.languageFontView}>{this.state.HN}</Text>
                        </TouchableOpacity>
                    </View>
                    <View style={styles.loginView}>
                        <Formik
                            validationSchema={signIn}
                            // initialValues={this.state.loginObject}
                            // onSubmit={(values) => this.getOtp(values)}
                            initialValues={this.state.loginObject}
                            onSubmit={values => this.login(values)}

                        >
                            {({ setFieldValue,
                                handleSubmit,
                                handleChange,
                                values, handleBlur,
                                errors, touched
                            }) => (
                                <>
                                    <Text style={styles.loginFontView}>{"OTP"}</Text>


                                    <View style={{ marginTop: 50, height: 100, width: 200, marginLeft: 10 }}>
                                        <CodeInput
                                            // ref={inputRef}
                                            secureTextEntry
                                            ignoreCase={false}
                                            className={'border-b'}
                                            activeColor={Colors.white}
                                            inactiveColor={Colors.white}
                                            space={40}
                                            cellBorderWidth={2}
                                            keyboardType="numeric"
                                            autoFocus={false}
                                            codeLength={6}
                                            size={20}
                                            inputPosition='left'
                                            onFulfill={(code) => this.handleVerify(code)}
                                        />
                                    </View>
                                    <TouchableOpacity onPress={() => this.login()}>
                                        <View style={{ marginTop: 46, borderRadius: 10, backgroundColor: Colors.white, }}>
                                            <Text style={{ color: Colors.primary, fontSize: 18, fontWeight: 'bold', paddingLeft: 50, paddingRight: 50, paddingTop: 10, paddingBottom: 10, textAlign: 'center' }}>Submit</Text>
                                        </View>
                                    </TouchableOpacity>

                                </>
                            )}

                        </Formik>

                    </View>

                </ScrollView>
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
        justifyContent: 'flex-end',
        alignItems: 'center',
    },
    image: {
        // height: height/4.5 ,
        // width: width/1.4 ,
        // margin:50,
        height:130 ,
        width: 150 ,
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
// export const mapStateToProps = (state) => ({
//     UserDetails: state.CommanReducer.UserDetails,

// });
// export const mapDispatchToProps = (dispatch) => ({
//     serviceActionUserDetail: (payload) => dispatch(serviceActionUserDetail(payload)),
// })
export default connect(mapStateToProps, mapDispatchToProps)(GetOtp);