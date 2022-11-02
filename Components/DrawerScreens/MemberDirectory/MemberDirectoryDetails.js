import moment from 'moment';
import React, { Component } from 'react';
import { Text, View, StyleSheet, FlatList, BackHandler, Image, TouchableOpacity, Dimensions, Alert, TextInput, ScrollView, SafeAreaView, Platform, StatusBar, } from 'react-native'
import { connect } from 'react-redux';
import Colors from '../../../Assets/Colors';
import Images from '../../../Assets/Images';
import { mapStateToProps } from '../../../Reducers/ApiClass';
import { axiosAuthGet, axiosPost } from '../../../utility/apiConnection';
import { IMAGEURL } from '../../../utility/util'
const { width, height } = Dimensions.get('window');

class MemberDirectoryDetails extends Component {
    constructor(props) {
        super(props);
        this.handleBackButtonClick = this.handleBackButtonClick.bind(this)

        this.state = {
            MID: '',
            SPFID: '',
            Name: '',
            FatherName: '',
            Surname: '',
            DOB: '',
            Address: '',
            City: '',
            NativeTown: '',
            Mobile: '',
            Email: '',
            Educaton: '-',
            Qualification: '-',
            Company: '-',
            Designation: '-',
            OtherInfo: '-',
            memberImage: '-',
            bloodGroup: '-',
            country: '',
            pincode: '',
            marriage_date: '',
            salution: '',
            age: '',
            adhar_name: '',
            district: '',
            post: '',
            guardian_type: '',
            guardian_name: '',
            spfemailid: '',
        };
    }
    async componentDidMount() {
        BackHandler.addEventListener('hardwareBackPress', this.handleBackButtonClick);
        console.log("Member Id:=", this.props.Member_Id);
        var params = {
            "parameter": " and member_id=" + this.props.Member_Id,
            "parameter1": "",
            "pageSize": "10",
            "page": "1",
            "sortColumn": "member_id desc"
        }
        try {
            let response = await axiosPost("Member/MembersList", params)
            response = Object.assign({}, ...response.data)
            console.log(response);
            this.setState({
                MID: response.mem_id,
                SPFID: response.member_spfid,
                Name: response.first_name,
                FatherName: response.guardian_name,
                Surname: response.last_name,
                DOB: response.member_dateofbirth,
                Address: response.memeber_currentaddress,
                City: response.city,
                NativeTown: response.member_nativetown,
                Mobile: response.mobile,
                Email: response.member_email,
                Educaton: response.member_education,
                Qualification: response.qualification,
                Company: response.member_company,
                Designation: response.member_designation,
                OtherInfo: response.otherInfo,
                memberImage: response.member_image,
                bloodGroup: response.blood_group,
                country: response.country,
                pincode: response.pincode,
                marriage_date: response.marriage_date,
                salution: response.salution,
                age: response.age,
                adhar_name: response.adhar_name,
                district: response.district,
                post: response.post,
                guardian_type: response.guardian_type,
                guardian_name: response.guardian_name,
                spfemailid: response.spfemailid,
            })
        } catch (error) {

        }

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
            <View style={{ flex: 1 }}>
                <SafeAreaView style={{ paddingTop: Platform.OS === "android" ? StatusBar.currentHeight : 0, backgroundColor: Colors.primary, flexDirection: 'row', width: '100%', height: "10%", justifyContent: 'flex-start', alignItems: 'center' }}>
                    <TouchableOpacity onPress={() => this.handleBackButtonClick()} style={{ marginTop: 10, alignItems: 'flex-start', marginLeft: 10 }}>
                        <Image source={Images.back}
                            style={{ height: 15, width: 22, tintColor: 'white', alignSelf: 'center' }} />
                    </TouchableOpacity>
                    <Text style={{ fontSize: 18, fontWeight: 'bold', color: Colors.white, marginLeft: 20, marginTop: 10 }}>Member Directory Details</Text>
                </SafeAreaView>

                <View style={{ marginBottom: 20, flex: 1, marginTop: 20, marginLeft: 20, marginRight: 20, justifyContent: 'center', alignItems: 'center' }}>
                    <ScrollView >
                        <View>
                            <Image
                                source={{ uri: IMAGEURL + this.state?.memberImage }}
                                style={{ resizeMode: 'stretch', alignSelf: 'center', height: 130, width: 100 }}
                            />
                        </View>
                        <View style={{ marginTop: 10, flexDirection: 'row', }}>
                            <Text style={{ fontSize: 18, width: Dimensions.get('window').width / 2.5, color: Colors.primary, fontWeight: 'bold' }}>MID</Text>
                            <Text style={{ fontSize: 18, width: Dimensions.get('window').width / 2.5 }}>: {this.state.MID}</Text>
                        </View>
                        <View style={{ marginTop: 10, flexDirection: 'row', }}>
                            <Text style={{ fontSize: 18, width: Dimensions.get('window').width / 2.5, color: Colors.primary, fontWeight: 'bold' }}>SPF ID</Text>
                            <Text style={{ fontSize: 18, width: Dimensions.get('window').width / 2.5 }}>: {this.state.SPFID}</Text>
                        </View>
                        <View style={{ marginTop: 10, flexDirection: 'row', }}>
                            <Text style={{ fontSize: 18, width: Dimensions.get('window').width / 2.5, color: Colors.primary, fontWeight: 'bold' }}>Name</Text>
                            <Text style={{ fontSize: 18, width: Dimensions.get('window').width / 2.5 }}>: {this.state.Name}</Text>
                        </View>
                        <View style={{ marginTop: 10, flexDirection: 'row', }}>
                            <Text style={{ fontSize: 18, width: Dimensions.get('window').width / 2.5, color: Colors.primary, fontWeight: 'bold' }}>Father Name</Text>
                            <Text style={{ fontSize: 18, width: Dimensions.get('window').width / 2.5 }}>: {this.state.FatherName}</Text>

                        </View>
                        <View style={{ marginTop: 10, flexDirection: 'row', }}>
                            <Text style={{ fontSize: 18, width: Dimensions.get('window').width / 2.5, color: Colors.primary, fontWeight: 'bold' }}>Surname</Text>
                            <Text style={{ fontSize: 18, width: Dimensions.get('window').width / 2.5 }}>: {this.state.Surname}</Text>

                        </View>
                        <View style={{ marginTop: 10, flexDirection: 'row', }}>
                            <Text style={{ fontSize: 18, width: Dimensions.get('window').width / 2.5, color: Colors.primary, fontWeight: 'bold' }}>Guardian Name</Text>
                            <Text style={{ fontSize: 18, width: Dimensions.get('window').width / 2.5 }}>: {this.state.guardian_name}</Text>

                        </View>
                        <View style={{ marginTop: 10, flexDirection: 'row', }}>
                            <Text style={{ fontSize: 18, width: Dimensions.get('window').width / 2.5, color: Colors.primary, fontWeight: 'bold' }}>Guardian Type</Text>
                            <Text style={{ fontSize: 18, width: Dimensions.get('window').width / 2.5 }}>: {this.state.guardian_type}</Text>

                        </View>
                        <View style={{ marginTop: 10, flexDirection: 'row', }}>
                            <Text style={{ fontSize: 18, width: Dimensions.get('window').width / 2.5, color: Colors.primary, fontWeight: 'bold' }}>Adhar Name</Text>
                            <Text style={{ fontSize: 18, width: Dimensions.get('window').width / 2.5 }}>: {this.state.adhar_name}</Text>

                        </View>
                        <View style={{ marginTop: 10, flexDirection: 'row', }}>
                            <Text style={{ fontSize: 18, width: Dimensions.get('window').width / 2.5, color: Colors.primary, fontWeight: 'bold' }}>Age</Text>
                            <Text style={{ fontSize: 18, width: Dimensions.get('window').width / 2.5 }}>: {this.state.age}</Text>

                        </View>

                        <View style={{ marginTop: 10, flexDirection: 'row', }}>
                            <Text style={{ fontSize: 18, width: Dimensions.get('window').width / 2.5, color: Colors.primary, fontWeight: 'bold' }}>Date of Birth</Text>
                            <Text style={{ fontSize: 18, width: Dimensions.get('window').width / 2.5 }}>: {moment(this.state.DOB).format("DD/MM/YYYY")}</Text>

                        </View>
                        <View style={{ marginTop: 10, flexDirection: 'row', }}>
                            <Text style={{ fontSize: 18, width: Dimensions.get('window').width / 2.5, color: Colors.primary, fontWeight: 'bold' }}>Address</Text>
                            <Text style={{ fontSize: 18, width: Dimensions.get('window').width / 2.5 }}>: {this.state.Address}</Text>

                        </View>
                        <View style={{ marginTop: 10, flexDirection: 'row', }}>
                            <Text style={{ fontSize: 18, width: Dimensions.get('window').width / 2.5, color: Colors.primary, fontWeight: 'bold' }}>City</Text>
                            <Text style={{ fontSize: 18, width: Dimensions.get('window').width / 2.5 }}>: {this.state.City}</Text>

                        </View>
                        <View style={{ marginTop: 10, flexDirection: 'row', }}>
                            <Text style={{ fontSize: 18, width: Dimensions.get('window').width / 2.5, color: Colors.primary, fontWeight: 'bold' }}>District</Text>
                            <Text style={{ fontSize: 18, width: Dimensions.get('window').width / 2.5 }}>: {this.state.district}</Text>

                        </View>
                        <View style={{ marginTop: 10, flexDirection: 'row', }}>
                            <Text style={{ fontSize: 18, width: Dimensions.get('window').width / 2.5, color: Colors.primary, fontWeight: 'bold' }}>Post</Text>
                            <Text style={{ fontSize: 18, width: Dimensions.get('window').width / 2.5 }}>: {this.state.post}</Text>

                        </View>
                        <View style={{ marginTop: 10, flexDirection: 'row', }}>
                            <Text style={{ fontSize: 18, width: Dimensions.get('window').width / 2.5, color: Colors.primary, fontWeight: 'bold' }}>Native Town</Text>
                            <Text style={{ fontSize: 18, width: Dimensions.get('window').width / 2.5 }}>: {this.state.NativeTown}</Text>

                        </View>
                        <View style={{ marginTop: 10, flexDirection: 'row', }}>
                            <Text style={{ fontSize: 18, width: Dimensions.get('window').width / 2.5, color: Colors.primary, fontWeight: 'bold' }}>Mobile No</Text>
                            <Text style={{ fontSize: 18, width: Dimensions.get('window').width / 2.5 }}>: {this.state.Mobile}</Text>

                        </View>
                        <View style={{ marginTop: 10, flexDirection: 'row', }}>
                            <Text style={{ fontSize: 18, width: Dimensions.get('window').width / 2.5, color: Colors.primary, fontWeight: 'bold' }}>Email id</Text>
                            <Text style={{ fontSize: 18, width: Dimensions.get('window').width / 2.5 }}>: {this.state.Email}</Text>

                        </View>

                        <View style={{ marginTop: 10, flexDirection: 'row', }}>
                            <Text style={{ fontSize: 18, width: Dimensions.get('window').width / 2.5, color: Colors.primary, fontWeight: 'bold' }}>Education</Text>
                            <Text style={{ fontSize: 18, width: Dimensions.get('window').width / 2.5 }}>: {this.state.Educaton}</Text>

                        </View>
                        <View style={{ marginTop: 10, flexDirection: 'row', }}>
                            <Text style={{ fontSize: 18, width: Dimensions.get('window').width / 2.5, color: Colors.primary, fontWeight: 'bold' }}>Qualification</Text>
                            <Text style={{ fontSize: 18, width: Dimensions.get('window').width / 2.5 }}>: {this.state.Qualification}</Text>

                        </View>
                        <View style={{ marginTop: 10, flexDirection: 'row', }}>
                            <Text style={{ fontSize: 18, width: Dimensions.get('window').width / 2.5, color: Colors.primary, fontWeight: 'bold' }}>Company</Text>
                            <Text style={{ fontSize: 18, width: Dimensions.get('window').width / 2.5 }}>: {this.state.Company}</Text>

                        </View>
                        <View style={{ marginTop: 10, flexDirection: 'row', }}>
                            <Text style={{ fontSize: 18, width: Dimensions.get('window').width / 2.5, color: Colors.primary, fontWeight: 'bold' }}>Designation</Text>
                            <Text style={{ fontSize: 18, width: Dimensions.get('window').width / 2.5 }}>: {this.state.Designation}</Text>

                        </View>
                        <View style={{ marginTop: 10, flexDirection: 'row', }}>
                            <Text style={{ fontSize: 18, width: Dimensions.get('window').width / 2.5, color: Colors.primary, fontWeight: 'bold' }}>Blood Group</Text>
                            <Text style={{ fontSize: 18, width: Dimensions.get('window').width / 2.5 }}>: {this.state.bloodGroup}</Text>
                        </View>
                        <View style={{ marginTop: 10, flexDirection: 'row', }}>
                            <Text style={{ fontSize: 18, width: Dimensions.get('window').width / 2.5, color: Colors.primary, fontWeight: 'bold' }}>Country</Text>
                            <Text style={{ fontSize: 18, width: Dimensions.get('window').width / 2.5 }}>: {this.state.country}</Text>
                        </View>
                        <View style={{ marginTop: 10, flexDirection: 'row', }}>
                            <Text style={{ fontSize: 18, width: Dimensions.get('window').width / 2.5, color: Colors.primary, fontWeight: 'bold' }}>Pincode</Text>
                            <Text style={{ fontSize: 18, width: Dimensions.get('window').width / 2.5 }}>: {this.state.pincode}</Text>
                        </View>
                        <View style={{ marginTop: 10, flexDirection: 'row', }}>
                            <Text style={{ fontSize: 18, width: Dimensions.get('window').width / 2.5, color: Colors.primary, fontWeight: 'bold' }}>Salution</Text>
                            <Text style={{ fontSize: 18, width: Dimensions.get('window').width / 2.5 }}>: {this.state.salution}</Text>
                        </View>
                        <View style={{ marginTop: 10, flexDirection: 'row', }}>
                            <Text style={{ fontSize: 18, width: Dimensions.get('window').width / 2.5, color: Colors.primary, fontWeight: 'bold' }}>Marriage Date</Text>
                            <Text style={{ fontSize: 18, width: Dimensions.get('window').width / 2.5 }}>: {this.state.marriage_date}</Text>
                        </View>
                        <View style={{ marginTop: 10, flexDirection: 'row', }}>
                            <Text style={{ fontSize: 18, width: Dimensions.get('window').width / 2.5, color: Colors.primary, fontWeight: 'bold' }}>SPF EmailId</Text>
                            <Text style={{ fontSize: 18, width: Dimensions.get('window').width / 2.5 }}>: {this.state.spfemailid}</Text>
                        </View>
                    </ScrollView>
                </View>
            </View>
        );
    }
}
export default connect(mapStateToProps)(MemberDirectoryDetails)
