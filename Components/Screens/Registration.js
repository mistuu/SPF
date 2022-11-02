import React, { Component } from 'react'
import { Text, TouchableOpacity, View, StyleSheet, Image, Alert, TextInput, Dimensions, ScrollView, PermissionsAndroid } from 'react-native'
import { getPixelSizeForLayoutSize } from 'react-native/Libraries/Utilities/PixelRatio';
import Colors from '../../Assets/Colors';
import FlotingEditText from "../CusComponent/FlotingEditText";
import Validation from "../../helper/Validation";
import { Formik } from 'formik'
import ImgToBase64 from 'react-native-image-base64';
import CustomBackground from '../../utility/CustomBackground';
import Images from '../../Assets/Images';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons'
import { Picker } from '@react-native-picker/picker';
import HindiString from '../../helper/HindiString';
import { getItem } from '../../utility/AsyncConfig';
import { axiosAuthGet, axiosPost } from '../../utility/apiConnection';
import Modal from 'react-native-modal';
import { launchCamera, launchImageLibrary } from 'react-native-image-picker';
import Toast from 'react-native-simple-toast'
import {IMAGEURL} from '../../utility/util'
const { width, height } = Dimensions.get('window');

export default class Registration extends React.Component {
    constructor(props) {
        super(props)
        this.state = {
            HN: 'HN',
            SPF_Member_Register: 'SPF Member Register',
            MID_ID: 'MID ID',
            Name: '',
            Father_Name: 'Father Name',
            Surname: 'Surname',
            DOB: 'Date of Birth',
            Address: 'Address',
            Native_Town: '',
            Mobile_No: 'Mobile No',
            Landline: '',
            Email_id: 'Email id',
            Education: '',
            Qualification: '',
            Profession: '',
            Company: '',
            Designation: '',
            Any_Other_Information: 'Any Other Information',
            Have_Account: 'Have already an account?',
            LoginHere: 'Login here',
            MidID: '',
            memberImage: '',
            education: [
                { id: 1, name: 'Bachelors Degree' },
                { id: 2, name: 'Masters Degree' },
                { id: 3, name: 'Doctorate' }
            ],
            qualification: [
                { id: 1, name: 'ICWA' },
                { id: 2, name: 'CA' },
                { id: 3, name: 'CS' },
                { id: 4, name: 'CFA' },
                { id: 5, name: 'LLB' },
                { id: 6, name: 'MBA' },
                { id: 7, name: 'ADVOCATE' },
                { id: 8, name: 'MTECH' },
                { id: 9, name: 'BTECH' },
                { id: 10, name: 'IAS' },
                { id: 11, name: 'IPS' },
                { id: 12, name: 'IFS' },
                { id: 13, name: 'IRS' },
                { id: 14, name: 'CPA' },
                { id: 15, name: 'INTERIOR DESIGNER' },
                { id: 16, name: 'GRAPHIC DESIGNER' },
                { id: 17, name: 'ARCHITECT' },
                { id: 18, name: 'ACTUARY' },
                { id: 19, name: 'MCA' },
                { id: 20, name: 'MCM' },
                { id: 21, name: 'DOCTORS' },
                { id: 22, name: 'VALUERS' },
                { id: 23, name: 'MASS COMMUNICATION' },
                { id: 24, name: 'FASHION DESIGNER' },
                { id: 25, name: 'PHOTOGRAPHY' },
                { id: 26, name: 'JOURNALISM' },
                { id: 27, name: 'DIGITAL MARKETING' }
            ],
            modalVisible: false,
            imagePath: null,
            imageUri: null,
            data:null
        }

    }
    async componentDidMount() {
        var date = new Date().getDate();
        var month = new Date().getMonth() + 1;
        var year = new Date().getFullYear();

        // Alert.alert(date + '-' + month + '-' + year);
        // You can turn it in to your desired format
        var currentDate = date + '-' + month + '-' + year;//format: dd-mm-yyyy;
        this.setState({ DOB: currentDate })
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
                Father_Name: response.fatherName,
                Surname: response.surname,
                DOB: response.dateOfBirth,
                Address: response.currentAddress,
                // NativeTown: response.nativeTown,
                Mobile_No: response.mobile,
                // Landline: response.landline,
                Email: response.email,
                // Educaton: response.education,
                // Profession: response.profession,
                // Company: response.company,
                // Designation: response.designation,
                // OtherInfo: response.otherInfo,

                MidID: response.memberMIDId,
                // SPFID: response.memberSPFId,
                // memberImage: response.memberImage,

            })
            var memberImage = { uri: IMAGEURL + response.memberImage }
            this.setState({ memberImage: memberImage })
            console.log("Profile:-", response);
        } catch (error) {

        }
    }
    setModalVisible(visible) {
        this.setState({ modalVisible: visible })
    }
    onChangeEducation = (value) => {
        this.setState({ Education: value })

    }
    onChangeQualification = (value) => {
        this.setState({ Qualification: value })

    }
    chooseFileCamera = async () => {
        try {
            if (Platform.OS === 'android') {
                // Calling the permission function
                console.log("step:1");
                const granted = await PermissionsAndroid.request(
                    PermissionsAndroid.PERMISSIONS.CAMERA
                );
                console.log("==", granted + "==" + PermissionsAndroid.RESULTS.GRANTED);
                if (granted === PermissionsAndroid.RESULTS.GRANTED) {
                    console.log("step:2");

                    // Permission Granted
                    // proceed();
                    // alert('CAMERA Permission ');
                    const options = {
                        quality: 1,
                        mediaType: 'photo',
                        // includeBase64:true,
                        maxWidth: 350,
                        maxHeight: 350,
                        storageOptions: {
                            skipBackup: true
                        }
                    };

                    launchCamera(options, (response) => {

                        if (response.didCancel) {
                            this.setState({ modalVisible: false })
                            console.log("Cancle");
                        }
                        else {
                            response = response.assets
                            response = Object.assign({}, ...response)
                            console.log(response);
                            // 385x256
                            // response.fileName + "," + "data:" + response.type + ";base64," + base64String.trim()
                            if (Platform.OS == 'ios') {
                                var tempSplit = response.uri.split("/")
                                response.fileName = tempSplit[tempSplit.length - 1]
                            }
                            let ImageResponse = { fileName: response.fileName, data: "data:image/jpeg;base64," + response }

                            // if (type == 'Photo') {
                            // const VisitorDetails = Object.assign({}, this.state.VisitorDetails, { imageBase64StringPhotoProof: ImageResponse.data })
                            this.setState({ imageBase64StringPhotoProof: response });
                            ImgToBase64.getBase64String(response.uri)
                                .then(base64String => {
                                    this.setState({ imagePath: response.fileName + "," + base64String })
                                    this.setState({ imageUri: "data:" + response.type + ";base64," + base64String })

                                    // console.log("+++++++", response.fileName + "," + base64String);
                                }
                                )
                                .catch();
                            this.setState({ modalVisible: false })
                            // console.log(this.state.imageBase64StringPhotoProof);
                            // } else if (type == 'Id') {
                            // const VisitorDetails = Object.assign({}, this.state.VisitorDetails, { imageBase64StringIdProof: ImageResponse.data })
                            // this.setState({ VisitorDetails, imageBase64StringIdProof: ImageResponse });
                            // }
                        }
                    });
                } else {
                    // Permission Denied
                    alert('CAMERA Permission Denied');
                    this.setState({ modalVisible: false })

                }
            } else {
                // proceed();
                const options = {
                    quality: 1,
                    mediaType: 'photo',
                    // includeBase64:true,
                    maxWidth: 350,
                    maxHeight: 350,
                    storageOptions: {
                        skipBackup: true
                    }
                };

                launchCamera(options, (response) => {

                    if (response.didCancel) {
                        this.setState({ modalVisible: false })
                        console.log("Cancle");
                    }
                    else {
                        response = response.assets
                        response = Object.assign({}, ...response)
                        console.log(response);
                        // 385x256
                        // response.fileName + "," + "data:" + response.type + ";base64," + base64String.trim()
                        if (Platform.OS == 'ios') {
                            var tempSplit = response.uri.split("/")
                            response.fileName = tempSplit[tempSplit.length - 1]
                        }
                        let ImageResponse = { fileName: response.fileName, data: "data:image/jpeg;base64," + response }

                        // if (type == 'Photo') {
                        // const VisitorDetails = Object.assign({}, this.state.VisitorDetails, { imageBase64StringPhotoProof: ImageResponse.data })
                        this.setState({ imageBase64StringPhotoProof: response });
                        ImgToBase64.getBase64String(response.uri)
                            .then(base64String => {
                                this.setState({ imagePath: response.fileName + "," + base64String })
                                this.setState({ imageUri: "data:" + response.type + ";base64," + base64String })

                                // console.log("+++++++", response.fileName + "," + base64String);
                            }
                            )
                            .catch();
                        this.setState({ modalVisible: false })
                        // console.log(this.state.imageBase64StringPhotoProof);
                        // } else if (type == 'Id') {
                        // const VisitorDetails = Object.assign({}, this.state.VisitorDetails, { imageBase64StringIdProof: ImageResponse.data })
                        // this.setState({ VisitorDetails, imageBase64StringIdProof: ImageResponse });
                        // }
                    }
                });
            }

        } catch (err) {
            console.warn(err);
        }

    }
    chooseFileGallary = () => {
        const options = {
            quality: 1.0,
            maxWidth: 500,
            maxHeight: 500,
            storageOptions: {
                skipBackup: true
            }
        };
        launchImageLibrary(options, (response) => {
            if (response.didCancel) {
                this.setState({ modalVisible: false })

            }
            else {
                response = response.assets
                response = Object.assign({}, ...response)
                console.log(response);

                // response.fileName + "," + "data:" + response.type + ";base64," + base64String.trim()
                if (Platform.OS == 'ios') {
                    var tempSplit = response.uri.split("/")
                    response.fileName = tempSplit[tempSplit.length - 1]
                }
                let ImageResponse = { fileName: response.fileName, data: "data:image/jpeg;base64," + response }

                // if (type == 'Photo') {
                // const VisitorDetails = Object.assign({}, this.state.VisitorDetails, { imageBase64StringPhotoProof: ImageResponse.data })
                // this.setState({ imageBase64StringPhotoProof: response });
                ImgToBase64.getBase64String(response.uri)
                    .then(base64String => {
                        this.setState({ imagePath: response.fileName + "," + base64String })
                        this.setState({ imageUri: "data:" + response.type + ";base64," + base64String })

                        // console.log("+++++++", response.fileName + "," + base64String);
                    }
                    )
                    .catch();
                this.setState({ modalVisible: false })
                // console.log(this.state.imageBase64StringPhotoProof);
                // } else if (type == 'Id') {
                // const VisitorDetails = Object.assign({}, this.state.VisitorDetails, { imageBase64StringIdProof: ImageResponse.data })
                // this.setState({ VisitorDetails, imageBase64StringIdProof: ImageResponse });
                // }
            }
        });
    }
    submitData = async() => {
        console.log("Data===Params:=",this.state.data);
        let params = {
            memberId: this.state.data.memberId,
            memberSPFId: "",
            memberMIDId: this.state.data.memberMIDId,
            memberName: this.state.data.memberName,
            surname: this.state.data.surname,
            memberImage: this.state.imagePath,
            fatherName: this.state.data.fatherName,
            dateOfBirth: this.state.data.dateOfBirth,
            nativeTown: this.state.Native_Town,
            education: this.state.Education,
            landline: this.state.Landline,
            city: this.state.data.city,
            qualification: this.state.Qualification,
            currentAddress: this.state.data.currentAddress,
            profession: this.state.Profession,
            email: this.state.data.email,
            mobile: this.state.data.mobile,
            company: this.state.Company,
            designation: this.state.Designation,
            otherInfo: "",
            iS_Become: 1
        }
        console.log("Data ===", params);
        if(this.state.Education!=''){
            if(this.state.Qualification!=''){
                let response =await axiosPost("Member/Save",params)
                console.log(response.message);
                this.props.navigation.replace('LoginScreen')
                // console.log("Success..");
            }
            else{
                Toast.show("Qualification is required.")
            }
        }
        else {
            Toast.show("Highest Education is required.")
        }
    }
    render() {
        return (
            <View style={styles.container}>
                <ScrollView>
                    <View style={styles.imageView}>
                        <Image style={styles.image} source={Images.SPFLogo} />

                    </View>
                    {/* <View
                        style={styles.changeLanguageView}>
                        <TouchableOpacity onPress={() => this._changeLanguage()}>
                            <Text style={styles.languageFontView}>{this.state.HN}</Text>
                        </TouchableOpacity>
                    </View> */}
                    <View style={styles.loginView}>

                        <Text style={styles.loginFontView}>Become SPF Member</Text>
                        <Formik
                            enableReinitialize={true}
                            validationSchema={Validation.profile}
                            initialValues={this.state.RegistrationObject}
                            onSubmit={() => console.log("Hello")}
                        >
                            {({ setFieldValue,
                                handleSubmit,
                                handleChange,
                                values, handleBlur,
                                errors, touched
                            }) => (
                                <>

                                    <TextInput
                                        placeholder={this.state.MID_ID}
                                        placeholderTextColor={Colors.white}
                                        style={styles.TextInput}
                                        editable={false}
                                        value={"MID ID :" + this.state.MidID}
                                        underlineColorAndroid="transparent"
                                    />

                                    <TextInput
                                        placeholder={this.state.Name}
                                        placeholderTextColor={Colors.white}
                                        style={styles.TextInput}
                                        editable={false}
                                        underlineColorAndroid="transparent"
                                        value={"Name : " + this.state.Name}
                                    />

                                    <TextInput
                                        placeholder={this.state.Father_Name}
                                        placeholderTextColor={Colors.white}
                                        style={styles.TextInput}
                                        editable={false}
                                        value={"Father Name : " + this.state.Father_Name}
                                        underlineColorAndroid="transparent"
                                    />

                                    <TextInput
                                        placeholder={this.state.Surname}
                                        placeholderTextColor={Colors.white}
                                        style={styles.TextInput}
                                        underlineColorAndroid="transparent"
                                        editable={false}
                                        value={"Surname : " + this.state.Surname}
                                    />

                                    <TextInput
                                        placeholder={this.state.Mobile_No}
                                        placeholderTextColor={Colors.white}
                                        style={styles.TextInput}
                                        underlineColorAndroid="transparent"
                                        keyboardType='numeric'
                                        editable={false}
                                        value={"Mobile No : " + this.state.Mobile_No}
                                    />

                                    <View style={{
                                        borderColor: Colors.white,
                                        borderBottomWidth: 1,
                                        marginTop: 10,
                                        borderRadius: 4

                                    }}>

                                        <Icon
                                            name="menu-down"
                                            color={Colors.primary}
                                            // size={18}
                                            type="MaterialIcons"
                                            style={styles.pickerIcon}
                                        />
                                        <Picker
                                            style={styles.pickerContent}

                                            selectedValue={this.state.Education}
                                            onValueChange={(value) => this.onChangeEducation(value)}
                                        >
                                            <Picker.Item value='' label='Highest Education *' />
                                            {
                                                this.state.education && this.state.education.map((item) => {
                                                    return (
                                                        <Picker.Item label={item.name} value={item.name} />
                                                    );
                                                })
                                            }


                                        </Picker>

                                    </View>
                                    <View style={{
                                        borderColor: Colors.white,
                                        borderBottomWidth: 1,
                                        marginTop: 10,
                                        borderRadius: 4

                                    }}>

                                        <Icon
                                            name="menu-down"
                                            color={Colors.primary}
                                            // size={18}
                                            type="MaterialIcons"
                                            style={styles.pickerIcon}
                                        />
                                        <Picker
                                            style={styles.pickerContent}

                                            selectedValue={this.state.Qualification}
                                            onValueChange={(value) => this.onChangeQualification(value)}
                                        >
                                            <Picker.Item value='' label='Qualification *' />
                                            {
                                                this.state.qualification && this.state.qualification.map((item) => {
                                                    return (
                                                        <Picker.Item label={item.name} value={item.name} />
                                                    );
                                                })
                                            }


                                        </Picker>

                                    </View>
                                    <TextInput
                                        placeholder={"Company"}
                                        placeholderTextColor={Colors.white}
                                        style={styles.TextInput}
                                        underlineColorAndroid="transparent"
                                        onChangeText={txt => this.setState({ Company: txt })}
                                        value={this.state.Company}
                                    />

                                    <TextInput
                                        placeholder={"Designation"}
                                        placeholderTextColor={Colors.white}
                                        style={styles.TextInput}
                                        underlineColorAndroid="transparent"
                                        onChangeText={txt => this.setState({ Designation: txt })}
                                        value={this.state.Designation}

                                    />

                                    <TextInput
                                        placeholder={"Landline"}
                                        placeholderTextColor={Colors.white}
                                        style={styles.TextInput}
                                        underlineColorAndroid="transparent"
                                        keyboardType='phone-pad'
                                        onChangeText={txt => this.setState({ Landline: txt })}
                                        value={this.state.Landline}

                                    />

                                    <TextInput
                                        placeholder={"Native Town"}
                                        placeholderTextColor={Colors.white}
                                        style={styles.TextInput}
                                        underlineColorAndroid="transparent"
                                        onChangeText={txt => this.setState({ Native_Town: txt })}
                                        value={this.state.Native_Town}

                                    />

                                    <TextInput
                                        placeholder={"Profession"}
                                        placeholderTextColor={Colors.white}
                                        style={styles.TextInput}
                                        underlineColorAndroid="transparent"
                                        onChangeText={txt => this.setState({ Profession: txt })}
                                        value={this.state.Profession}

                                    />
                                    <View style={{ flexDirection: 'row' }}>
                                        <TouchableOpacity onPress={() => this.setModalVisible(true)}
                                            style={{ flexDirection: 'row', alignItems: 'center', alignContent: 'center' }}>
                                            <Image
                                                source={Images.upload}
                                                style={{ marginTop: 10 }} />
                                            <Image
                                                source={{ uri: this.state?.imageUri }}
                                                style={{ height: 30, width: 30, marginLeft: 10, marginTop: 10 }} />
                                        </TouchableOpacity>
                                    </View>
                                    <TouchableOpacity onPress={() => this.submitData()}>
                                        <Image
                                            source={Images.go_right}
                                            style={{ marginTop: 29, marginLeft: "50%" }}
                                        />
                                    </TouchableOpacity>

                                </>
                            )}

                        </Formik>

                    </View>
                    <Modal
                        isVisible={this.state.modalVisible}
                        onBackdropPress={() => this.setModalVisible(false)}
                        onSwipeComplete={() => this.setModalVisible(false)}
                        swipeDirection="left"
                        onBackButtonPress={() => this.setModalVisible(false)}
                    >
                        <View style={{ alignItems: 'center', justifyContent: 'center' }}>
                            <View style={{ width: "70%", padding: 10, borderRadius: 13, backgroundColor: "#fff", alignItems: 'center', justifyContent: 'center' }}>
                                <Text style={{ fontSize: 18, fontWeight: 'bold', padding: 10, color: "#FF9214" }}>Choose Image</Text>
                                <View style={{ borderWidth: 0.5, width: "100%", borderColor: "#000" }} />
                                <TouchableOpacity onPress={() => this.chooseFileCamera()}>
                                    <Text style={{ fontSize: 15, padding: 10, color: '#FF9214' }}>Camera</Text>
                                </TouchableOpacity>
                                <View style={{ borderWidth: 0.5, width: "100%", borderColor: "#000" }} />
                                <TouchableOpacity onPress={() => this.chooseFileGallary()}>
                                    <Text style={{ fontSize: 15, padding: 10, color: "#FF9214" }}>Gallery</Text>
                                </TouchableOpacity>
                            </View>
                        </View>
                    </Modal>
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
        height: Dimensions.get('window').height / 3.9,
        backgroundColor: Colors.white,
        width: "100%",
        justifyContent: 'center',
        alignItems: 'center'
    },
    pickerIcon: {
        color: COLORS.primary,
        position: "absolute",
        bottom: 15,
        right: 10,
        fontSize: 20
    },
    image: {
        // height: "75%",
        // width: "62%",
        // padding:20
    },
    pickerContent: {
        color: Colors.white,
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
