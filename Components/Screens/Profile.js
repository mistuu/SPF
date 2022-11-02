import moment from 'moment';
import React, { Component } from 'react'
import { Text, BackHandler, View, StyleSheet, Image, ScrollView, TextInput, Dimensions, SafeAreaView, Platform, StatusBar } from 'react-native'
import { TouchableOpacity } from 'react-native-gesture-handler';
import Colors from '../../Assets/Colors';
import Images from '../../Assets/Images';
import { axiosAuthGet } from '../../utility/apiConnection';
import { getItem } from '../../utility/AsyncConfig';
import { IMAGEURL } from '../../utility/util'
const { width, height } = Dimensions.get('window');

export default class Profile extends Component {
    constructor(props) {
        super(props);
        this.handleBackButtonClick = this.handleBackButtonClick.bind(this)

        this.state = {
            memberId: '',
            MidID: '',
            SPFID: '',
            data: null,
            editable: false,
            saveMember: false,
            saveEditButton: false,
            profile: {
                Name: '',
                FatherName: '',
                Surname: '',
                DOB: '',
                Address: '',
                NativeTown: '',
                Mobile: '',
                Landline: '',
                Email: '',
                Educaton: '',
                Profession: '',
                Company: '',
                Designation: '',
                OtherInfo: '',
            },
            memberImage: '',

        }
    }
    async componentDidMount() {
        BackHandler.addEventListener('hardwareBackPress', this.handleBackButtonClick);
        this.getData()
        this.willFocusSubscription = this.props.navigation.addListener(
            'focus',
            () => {
                this.getData();
            }
        );

    }
    componentWillUnmount() {
        BackHandler.removeEventListener('hardwareBackPress', this.handleBackButtonClick);

    }
    handleBackButtonClick() {
        this.props.navigation.goBack()
        return true;
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
                profile: {
                    Name: response.memberName,
                    FatherName: response.fatherName,
                    Surname: response.surname,
                    DOB: response.dateOfBirth,
                    Address: response.currentAddress,
                    NativeTown: response.nativeTown,
                    Mobile: response.mobile,
                    Landline: response.landline,
                    Email: response.email,
                    Educaton: response.education,
                    Profession: response.profession,
                    Company: response.company,
                    Designation: response.designation,
                    OtherInfo: response.otherInfo,
                },
                MidID: response.memberMIDId,
                SPFID: response.memberSPFId,
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
    editDetails(enble) {
        // this.setState({ editable: enble, saveMember: true, saveEditButton: true })
        this.props.navigation.navigate('UpdateProfile')

    }
    saveProfile = () => {
        // this.props.navigation.goBack('Dashboard')
    }
    render() {
        return (
            <View style={styles.container}>
                <SafeAreaView style={{ paddingTop: Platform.OS === "android" ? StatusBar.currentHeight : 0, backgroundColor: Colors.primary, flexDirection: 'row', width: '100%', height: "10%", justifyContent: 'flex-start', alignItems: 'center' }}>
                    <TouchableOpacity onPress={() => this.handleBackButtonClick()} style={{ marginTop: 10, alignItems: 'flex-start', marginLeft: 10 }}>
                        <Image source={IMAGES.back}
                            style={{ height: 15, width: 22, tintColor: 'white', alignSelf: 'center' }} />
                    </TouchableOpacity>
                    <Text style={{ fontSize: 18, fontWeight: 'bold', color: Colors.white, marginLeft: 20, marginTop: 10 }}>Profile</Text>

                    <TouchableOpacity onPress={() => this.editDetails(true)}>
                        <Text style={{ marginLeft: width / 1.7, color: Colors.white }}>Edit</Text>
                    </TouchableOpacity>

                </SafeAreaView>
                {/* <View style={{ width: width, flexDirection: 'row', margin: 20 }}>
                    <Text style={{ color: Colors.black, fontWeight: 'bold' }}>Profile</Text>


                    {
                        this.state.saveEditButton == false ?
                            (
                                <TouchableOpacity onPress={() => this.editDetails(true)}>
                                    <Text style={{ marginLeft: width / 1.4, color: Colors.primary }}>Edit</Text>
                                </TouchableOpacity>
                            ) : (
                                <TouchableOpacity onPress={() => this.saveProfile()}>
                                    <Text style={{ marginLeft: width / 1.4, color: Colors.primary }}>Save</Text>
                                </TouchableOpacity>
                            )}
                </View> */}
                <View style={{ flex: 1, alignItems: 'center' }}>
                    <View style={{ margin: 20, flexDirection: 'row', alignItems: 'center' }}>

                        <Image style={{
                            width: 75, height: 75, borderRadius: 75 / 2,
                            overflow: "hidden",
                        }}
                            source={this.state.memberImage} />

                        <View style={{ marginLeft: 13 }}>
                            <View style={{ flexDirection: 'row' }}>
                                <Text style={{ color: Colors.primary, fontWeight: 'bold' }}>MID ID :</Text>
                                <Text style={{ marginLeft: 10 }}>{this.state.MidID}</Text>
                            </View>
                            <View style={{ flexDirection: 'row' }}>
                                <Text style={{ color: Colors.primary, fontWeight: 'bold' }}>SPF ID  :</Text>
                                <Text style={{ marginLeft: 10 }}>{this.state.SPFID}</Text>
                            </View>
                        </View>
                    </View>
                    <ScrollView>
                        <View style={{ width, marginLeft: 20, marginRight: 20, flexDirection: 'row', justifyContent: 'center', alignItems: 'center' }}>
                            <Text style={{ width: Dimensions.get('window').width / 2, color: Colors.primary, fontWeight: 'bold' }}>Name</Text>
                            <TextInput
                                placeholder="Name"
                                editable={false}
                                style={{ width: Dimensions.get('window').width / 2, color: Colors.black }}
                                value={this.state.profile.Name}
                            />
                        </View>
                        <View style={{ width,marginTop:Platform.OS=='ios'?"3%":"", marginLeft: 20, marginRight: 20, flexDirection: 'row', justifyContent: 'center', alignItems: 'center' }}>
                            <Text style={{ width: Dimensions.get('window').width / 2, color: Colors.primary, fontWeight: 'bold' }}>Father Name</Text>
                            <TextInput
                                placeholder="Father Name"
                                editable={false}
                                style={{ width: Dimensions.get('window').width / 2, color: Colors.black }}
                                value={this.state.profile.FatherName}

                            />
                        </View>
                        <View style={{ width,marginTop:Platform.OS=='ios'?"3%":"", marginLeft: 20, marginRight: 20, flexDirection: 'row', justifyContent: 'center', alignItems: 'center' }}>
                            <Text style={{ width: Dimensions.get('window').width / 2, color: Colors.primary, fontWeight: 'bold' }}>Surname</Text>
                            <TextInput
                                placeholder="Surname"
                                editable={false}
                                style={{ width: Dimensions.get('window').width / 2, color: Colors.black }}
                                value={this.state.profile.Surname}

                            />
                        </View>
                        <View style={{ width,marginTop:Platform.OS=='ios'?"3%":"", marginLeft: 20, marginRight: 20, flexDirection: 'row', justifyContent: 'center', alignItems: 'center' }}>
                            <Text style={{ width: Dimensions.get('window').width / 2, color: Colors.primary, fontWeight: 'bold' }}>Date of Birth</Text>
                            <TextInput
                                placeholder="DOB"
                                editable={false}
                                style={{ width: Dimensions.get('window').width / 2, color: Colors.black }}
                                value={moment(this.state.profile.DOB).format("DD/MM/YYYY")}

                            />
                        </View>
                        <View style={{ width,marginTop:Platform.OS=='ios'?"3%":"", marginLeft: 20, marginRight: 20, flexDirection: 'row', justifyContent: 'center', alignItems: 'center' }}>
                            <Text style={{ width: Dimensions.get('window').width / 2, color: Colors.primary, fontWeight: 'bold' }}>Address</Text>
                            <TextInput
                                placeholder="Address"
                                editable={false}
                                multiline={true}
                                style={{ width: Dimensions.get('window').width / 2, color: Colors.black }}
                                value={this.state.profile.Address}

                            />
                        </View>
                        <View style={{ width,marginTop:Platform.OS=='ios'?"3%":"", marginLeft: 20, marginRight: 20, flexDirection: 'row', justifyContent: 'center', alignItems: 'center' }}>
                            <Text style={{ width: Dimensions.get('window').width / 2, color: Colors.primary, fontWeight: 'bold' }}>Native Town</Text>
                            <TextInput
                                placeholder="Native Town"
                                editable={this.state.editable}
                                style={{ width: Dimensions.get('window').width / 2, color: Colors.black }}
                                value={this.state.profile.NativeTown}

                            />
                        </View>
                        <View style={{ width,marginTop:Platform.OS=='ios'?"3%":"", marginLeft: 20, marginRight: 20, flexDirection: 'row', justifyContent: 'center', alignItems: 'center' }}>
                            <Text style={{ width: Dimensions.get('window').width / 2, color: Colors.primary, fontWeight: 'bold' }}>Mobile No</Text>
                            <TextInput
                                placeholder="Mobile"
                                editable={false}
                                style={{ width: Dimensions.get('window').width / 2, color: Colors.black }}
                                value={this.state.profile.Mobile}

                            />
                        </View>
                        <View style={{ width,marginTop:Platform.OS=='ios'?"3%":"", marginLeft: 20, marginRight: 20, flexDirection: 'row', justifyContent: 'center', alignItems: 'center' }}>
                            <Text style={{ width: Dimensions.get('window').width / 2, color: Colors.primary, fontWeight: 'bold' }}>Landline</Text>
                            <TextInput
                                placeholder="Landline"
                                editable={this.state.editable}
                                style={{ width: Dimensions.get('window').width / 2, color: Colors.black }}
                                value={this.state.profile.Landline}

                            />
                        </View>
                        <View style={{ width,marginTop:Platform.OS=='ios'?"3%":"", marginLeft: 20, marginRight: 20, flexDirection: 'row', justifyContent: 'center', alignItems: 'center' }}>
                            <Text style={{ width: Dimensions.get('window').width / 2, color: Colors.primary, fontWeight: 'bold' }}>Email id</Text>
                            <TextInput
                                placeholder="Email"
                                editable={false}
                                style={{ width: Dimensions.get('window').width / 2, color: Colors.black }}
                                value={this.state.profile.Email}
                            />
                        </View>
                        <View style={{ width,marginTop:Platform.OS=='ios'?"3%":"", marginLeft: 20, marginRight: 20, flexDirection: 'row', justifyContent: 'center', alignItems: 'center' }}>
                            <Text style={{ width: Dimensions.get('window').width / 2, color: Colors.primary, fontWeight: 'bold' }}>Education</Text>
                            <TextInput
                                placeholder="Education"
                                editable={false}
                                style={{ width: Dimensions.get('window').width / 2, color: Colors.black }}
                                value={this.state.profile.Educaton}

                            />
                        </View>
                        <View style={{ width,marginTop:Platform.OS=='ios'?"3%":"", marginLeft: 20, marginRight: 20, flexDirection: 'row', justifyContent: 'center', alignItems: 'center' }}>
                            <Text style={{ width: Dimensions.get('window').width / 2, color: Colors.primary, fontWeight: 'bold' }}>Profession</Text>
                            <TextInput
                                placeholder="Profession"
                                editable={false}
                                placeholderTextColor={Colors.black}
                                style={{ width: Dimensions.get('window').width / 2, color: Colors.black }}
                                value={this.state.profile.Profession}

                            />
                        </View>
                        <View style={{ width,marginTop:Platform.OS=='ios'?"3%":"", marginLeft: 20, marginRight: 20, flexDirection: 'row', justifyContent: 'center', alignItems: 'center' }}>
                            <Text style={{ width: Dimensions.get('window').width / 2, color: Colors.primary, fontWeight: 'bold' }}>Company</Text>
                            <TextInput
                                placeholder="Company"
                                editable={false}
                                style={{ width: Dimensions.get('window').width / 2, color: Colors.black }}
                                value={this.state.profile.Company}


                            />
                        </View>
                        <View style={{ width,marginTop:Platform.OS=='ios'?"3%":"", marginLeft: 20, marginRight: 20, flexDirection: 'row', justifyContent: 'center', alignItems: 'center' }}>
                            <Text style={{ width: Dimensions.get('window').width / 2, color: Colors.primary, fontWeight: 'bold' }}>Designation</Text>
                            <TextInput
                                placeholder="Designation"
                                editable={false}
                                style={{ width: Dimensions.get('window').width / 2, color: Colors.black }}
                                value={this.state.profile.Designation}

                            />
                        </View>
                      
                    </ScrollView>
                </View>

            </View>
        )
    }
}
const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: Colors.white
    },

});
