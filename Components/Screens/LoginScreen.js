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
const signIn = Yup.object().shape({
    Username: Yup.string().trim().required("Fill the MID ID"),
    //    .email(Strings.errorInvalidEmial),

});

class LoginScreen extends Component {
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

        }

    }
    async componentDidMount() {
        // let Result = await axiosAuthGet('Member/List')
        // console.log("ToDoList Data:", Result.data);
        this.props.serviceActionUserDetail()
        // try {
        //     let response = await axiosAuthGet("Member/Login/" + 194005)
        //     await storeItem('LoginDetails', response);

        //     console.log("Login Details:-", response);
        // } catch (error) {

        // }

    }

    async componentDidUpdate(prevProps) {
        // let arr=[];
        var arr = [];
        var s = { "_duplicate_flag": "0", "_notes": null, "_refcode": null, "_reg_ip": "157.38.66.104", "_reg_type": "web2", "_regdate": "2021-04-24 12:11:45", "active_member": "0", "address": "BBC", "address2": "", "address_type": "Residential", "adhar1": "", "adhar2": "", "adhar3": "", "adhar_name": "Ashish", "adharfatherName": "Nirmal", "age": null, "alternate_number": "", "anchal_id": "8", "app_token": "8775e023c15ee95a08a1ed42e56298d7", "birth_day": "1975-07-10", "blood_group": "", "child_count": "0", "city": "Ahmedabad", "country": "India", "country_code": null, "district": "Ahmedabad", "education": "Graduate", "email_address": "", "family_change": "0", "family_id": "1013", "first_name": "Ashish", "gender": "Male", "guardian_name": "Nirmal", "guardian_type": "Father", "id": "94005", "is_head_of_family": "1", "last_login_date": null, "last_name": "Jain", "local_sangh_id": "2", "login_key": "219426", "marital_status": "0", "marriage_date": null, "member_id": "194005", "membership_spf": "0", "membership_type": "", "mobile": "9016323229", "mother_name": null, "occupation": "Business", "password": "f654edd7c5eb3459527efcbb7cbeebc8", "pincode": "380006", "post": "Ahmedabad", "print_slot": "", "profile_created_by": "", "profile_pic": "fb826b570e1e58f04aeb3b1716c39192.jpg", "profile_update_date": "2021-11-12 20:01:53", "progress": "0", "rel_faith": "Sadhumargi", "relation_id": "1", "sadhumargi_beti": "0", "salution": "Shree", "sapath": "1", "sapath_date": "2021-06-16", "sapath_reject": "0", "shramnopasak": "0", "state": "Gujarat", "sub_title": null, "swadhyai": "", "username": "", "whatsapp_number": "9016323229" }
        arr.push(s)
        var a = []
        arr.filter((val, index) => {
            return index != val.age
        })
        if (s.age == null) {
            s.age = 0
        }
        else {
            s.age
        }

        console.log(s);
        // arr.filter(val => {
        //     if (val.age == null) {

        //         a.push(val)
        //     }
        //     else {

        //     }
        // })
        if (this.props.LoginDetails !== prevProps.LoginDetails) {
            console.log(this.props.LoginDetails);
            this.setState({ OTP: this.props.LoginDetails.otp })
            await storeItem('LoginDetails', this.props.LoginDetails);
        }

        if (this.props.UserDetails !== prevProps.UserDetails) {

            this.state.AllMemberId.push(this.props.UserDetails.map(function (val) {
                return val.memberMIDId;
            }))
            console.log("All Member ID:", this.state.AllMemberId);
        }

    }
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
    async login(values) {
        console.log("Login Values:-", values.Username);
        var x = false;
        var s = null
        // this.state.AllMemberId = Object.assign({}, ...this.state.AllMemberId)
        s = this.state.AllMemberId.flat();
        console.log("Members:=", s);
        await s.filter(val => {
            if (values.Username == val) {
                x = true
                console.log(x);
            }

        })
        console.log(x);
        if (x == true) {
            try {
                let response = await axiosAuthGet("Member/Login/" + values.Username)
                await storeItem('LoginDetails', response);
                this.props.navigation.replace('DrawerScreen')
                
                //live api integration
                // let response = await axiosAuthGet("Member/GetToken")
                // console.log("Token:-", response.token + "===" + values.Username);
                // var modal = {
                //     "token": response.token,
                //     "username": values.Username,
                // }
                // let re = await axiosPostLogin("https://members.sadhumargi.com/validate/forgotpassword", modal)
                // // this.setState({ OTP: re.otp })
                // Toast.show(re.message, Toast.SHORT);
                // console.log("OTP Response:-", re.otp);

                // var m = {
                //     "otp": re.otp,
                //     "username": values.Username,
                //     "token": response.token
                // }
                // this.props.ProId(m)
                // this.props.navigation.navigate('GetOtp')

                // console.log("Login Details:-", response);
            } catch (error) {

            }
        }
        else {
            Toast.show("Invalid Member ID")
        }
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
                    {/* <View
                        style={styles.changeLanguageView}>
                        <TouchableOpacity onPress={() => this._changeLanguage()}>
                            <Text style={styles.languageFontView}>{this.state.HN}</Text>
                        </TouchableOpacity>
                    </View> */}
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
                                    <Text style={styles.loginFontView}>{this.state.Login}</Text>

                                    <TextInput
                                        placeholder={"MID ID"}
                                        placeholderTextColor={Colors.white}
                                        style={styles.TextInput}
                                        underlineColorAndroid="transparent"
                                        onBlur={handleBlur("Username")}
                                        onChangeText={handleChange("Username")}
                                        value={values.Username}
                                        maxLength={6}

                                    />
                                    {
                                        console.log("Errors:", errors.Username),
                                        errors.Username && touched.Username ?
                                            <Text style={{ color: Colors.red, fontSize: 15 }}>{errors.Username}</Text>
                                            : null
                                    }
                                    <TouchableOpacity onPress={() => handleSubmit()}>
                                        <View style={{ marginTop: 46, borderRadius: 10, backgroundColor: Colors.white, }}>
                                            <Text style={{ color: Colors.primary, fontSize: 18, fontWeight: 'bold', paddingLeft: 50, paddingRight: 50, paddingTop: 10, paddingBottom: 10, textAlign: 'center' }}>Get OTP</Text>
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
        height:130 ,
        width: 150 ,
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
// export const mapStateToProps = (state) => ({
//     UserDetails: state.CommanReducer.UserDetails,

// });
// export const mapDispatchToProps = (dispatch) => ({
//     serviceActionUserDetail: (payload) => dispatch(serviceActionUserDetail(payload)),
// })
export default connect(mapStateToProps, mapDispatchToProps)(LoginScreen);