import React, { Component } from 'react';
import { Text, View, StyleSheet, FlatList, BackHandler, Image, TouchableOpacity, Dimensions, Alert, SafeAreaView, Platform, StatusBar, } from 'react-native'
import Colors from '../../../Assets/Colors';
import Images from '../../../Assets/Images';
import Modal from 'react-native-modal';
import { connect } from 'react-redux';
import { mapDispatchToProps, mapStateToProps } from '../../../Reducers/ApiClass';
import { axiosPost } from '../../../utility/apiConnection';
const { width, height } = Dimensions.get('window');

class MemberDirectoryList extends Component {
    constructor(props) {
        super(props);
        this.handleBackButtonClick = this.handleBackButtonClick.bind(this)

        this.state = {
            GridViewItems: [
                // { srNo: "Sr. No", key: "Grievances Title", addDate: "Add Date", endDat: "End Date", status: "Status", Actions: "Actions" },

                { No: "1", image: Images.img9, name: 'Deepak', city: "Ahmedabad", qualification: "CA", LDE: "05/03/2021", status: "open", action: Images.horizontalDot },
                { No: "2", image: Images.img9, name: 'Deepak', city: "Ahmedabad", qualification: "CA", action: Images.horizontalDot },
                { No: "3", image: Images.img9, name: 'Deepak', city: "Ahmedabad", qualification: "CA", action: Images.horizontalDot },
                { No: "4", image: Images.img9, name: 'Deepak', city: "Ahmedabad", qualification: "CA", action: Images.horizontalDot },
                { No: "5", image: Images.img9, name: 'Deepak', city: "Ahmedabad", qualification: "CA", action: Images.horizontalDot },
                { No: "6", image: Images.img9, name: 'Deepak', city: "Ahmedabad", qualification: "CA", action: Images.horizontalDot },
                { No: "7", image: Images.img9, name: 'Deepak', city: "Ahmedabad", qualification: "CA", action: Images.horizontalDot },
                { No: "8", image: Images.img9, name: 'Deepak', city: "Ahmedabad", qualification: "CA", action: Images.horizontalDot },
                { No: "9", image: Images.img9, name: 'Deepak', city: "Ahmedabad", qualification: "CA", action: Images.horizontalDot },
                { No: "10", image: Images.img9, name: 'Deepak', city: "Ahmedabad", qualification: "CA", action: Images.horizontalDot },
                { No: "11", image: Images.img9, name: 'Deepak', city: "Ahmedabad", qualification: "CA", action: Images.horizontalDot },
                { No: "12", image: Images.img9, name: 'Deepak', city: "Ahmedabad", qualification: "CA", action: Images.horizontalDot },
                { No: "13", image: Images.img9, name: 'Deepak', city: "Ahmedabad", qualification: "CA", action: Images.horizontalDot },
                { No: "14", image: Images.img9, name: 'Deepak', city: "Ahmedabad", qualification: "CA", action: Images.horizontalDot },
                { No: "15", image: Images.img9, name: 'Deepak', city: "Ahmedabad", qualification: "CA", action: Images.horizontalDot }

            ],
            data: null,
            member_id: '',
            modalVisible: false,
            dummy: [],
        };
    }
    async componentDidMount() {
        BackHandler.addEventListener('hardwareBackPress', this.handleBackButtonClick);
        console.log("Details:=", this.props.MemberDetailss);

        var params = {
            "parameter": " and u.mem_id LIKE \"%" + this.props.MemberDetailss.MID + "%\" and u.first_name LIKE \"%" + this.props.MemberDetailss.Name + "%\" and u.guardian_name LIKE \"%" + this.props.MemberDetailss.FatherName + "%\" and u.last_name LIKE \"%" + this.props.MemberDetailss.Surname + "%\" and u.mobile LIKE \"%" + this.props.MemberDetailss.Mob + "%\" and u.city LIKE \"%" + this.props.MemberDetailss.City + "%\" and u.anchal_id LIKE \"%" + this.props.MemberDetailss.Anchal + "%\"",
            "parameter1": "",
            "pageSize": "100",
            "page": "1",
            "sortColumn": "u.member_spfid desc"
        }
        try {
            let response = await axiosPost("Member/MembersList", params)
            console.log("List:=", response.data);
            this.setState({ data: response.data, dummy: response.data })
            // var data = []
            // await response.data.filter(e => {
            //     if (e.first_name.match(this.props.MemberDetailss.Name) ||
            //         e.city.match(this.props.MemberDetailss.City) ||
            //         e.mobile.match(this.props.MemberDetailss.Mob) ||
            //         e.member_id.match(this.props.MemberDetailss.MID)) {
            //         data.push(e)
            //     }
            // })
            // console.log("Data is:=", data);

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
    setModalVisible = (visible, member_id) => {

        this.setState({ modalVisible: visible, member_id: member_id });
    }
    getDetails = (member_id) => {
        this.props.MemberId(member_id)
        // console.log("Member ID:=", this.props.Member_Id);
        this.props.navigation.navigate('MemberDirectoryDetails')
    }
    EmptyListMessage = () => {
        return (
            // Flat List Item
            <View style={styles.emptyListStyle}>
                <Text style={styles.emptyMessageStyle}>No Member Found</Text>
            </View>
        );
    }
    render() {
        const { modalVisible } = this.state;

        return (
            <View style={{ flex: 1 }}>
                <SafeAreaView style={{ paddingTop: Platform.OS === "android" ? StatusBar.currentHeight : 0, backgroundColor: Colors.primary, flexDirection: 'row', width: '100%', height: "10%", justifyContent: 'flex-start', alignItems: 'center' }}>
                    <TouchableOpacity onPress={() => this.handleBackButtonClick()} style={{ marginTop: 10, alignItems: 'flex-start', marginLeft: 10 }}>
                        <Image source={Images.back}
                            style={{ height: 15, width: 22, tintColor: 'white', alignSelf: 'center' }} />
                    </TouchableOpacity>
                    <Text style={{ fontSize: 18, fontWeight: 'bold', color: Colors.white, marginLeft: 20, marginTop: 10 }}>Member Directory List</Text>
                </SafeAreaView>
                {/* { */}
                {/* this.state.dummy > 0 ? ( */}
                <FlatList
                    style={{ margin: 10 }}
                    data={this.state.data}

                    renderItem={({ item }) =>
                        <View style={styles.cardView}>
                            <TouchableOpacity onPress={() => this.getDetails(item.member_id)}>

                            <View>
                                <View style={{ flexDirection: 'row', marginLeft: 10 }}>
                                    <Text style={{ color: Colors.primary, width: width / 4 }}>Member Name</Text>
                                    <Text style={{ width: width / 3, marginLeft: 20 }}>:{item.first_name}</Text>
                                </View>
                                <View style={{ flexDirection: 'row', marginLeft: 10 }}>
                                    <Text style={{ color: Colors.primary, width: width / 4 }}>City</Text>
                                    <Text style={{ width: width / 3, marginLeft: 20 }}>:{item.city}</Text>
                                </View>

                                <View style={{ flexDirection: 'row', marginLeft: 10 }}>
                                    <Text style={{ color: Colors.primary, width: width / 4 }}>Qualification</Text>
                                    <Text style={{ width: width / 3, marginLeft: 20 }}>:{item.qualification}</Text>
                                </View>
                            </View>
                            </TouchableOpacity>
                            {/* <View>
                                <TouchableOpacity onPress={() => this.setModalVisible(true, item.member_id)}>
                                    <Image
                                        source={Images.horizontalDot}
                                        style={{ marginTop: 5, marginLeft: 50 }}
                                    />
                                </TouchableOpacity>

                            </View> */}
                        </View>
                    }
                    numColumns={1}
                    ListEmptyComponent={this.EmptyListMessage()}
                    keyExtractor={item => item.No}
                />
                {/* ) : (
                        <View style={styles.emptyListStyle}>
                            <Text style={styles.emptyMessageStyle}>No Member Found</Text>
                        </View>
                    )
                } */}

                <Modal
                    isVisible={this.state.modalVisible}
                    onBackdropPress={() => this.setModalVisible(false)}
                    onSwipeComplete={() => this.setModalVisible(false)}
                    swipeDirection="left"
                    onBackButtonPress={() => this.setModalVisible(false)}
                >

                    <View style={{ alignItems: 'center', justifyContent: 'center' }}>

                        <View style={styles.Alert_Main_View}>

                            <Text style={styles.Alert_Title}>Actions</Text>

                            <View style={{ width: '80%', height: 2, backgroundColor: '#fff' }} />

                            <TouchableOpacity onPress={() => this.getDetails()}>
                                <Text style={styles.Alert_Message}> View </Text>
                            </TouchableOpacity>

                        </View>

                    </View>


                </Modal>

            </View >
        );
    }
}
const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'flex-start',
        backgroundColor: Colors.backgroundscreencolor
    },
    listTitle: {
        fontSize: 13,
        color: Colors.primary
    },
    itemMainView: {
        backgroundColor: Colors.primary,
        // margin: 15,
        marginRight: 15,
        marginLeft: 15,
        marginBottom: 5,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        borderRadius: 13,
        height: Dimensions.get('window').height / 16,

    },
    emptyListStyle: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        textAlignVertical:'center'

    },
    emptyMessageStyle: {
        textAlign: 'center',
        justifyContent: 'center',
        alignItems: 'center',
        textAlignVertical:'center'

    },
    GrievancesTitle: {
        color: Colors.black,
        fontSize: 24,
        marginTop: 32,
        textAlign: 'left',
        marginLeft: 20,
        fontWeight: 'bold',
        alignItems: 'flex-start'
    },
    enrollCardView: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        backgroundColor: Colors.white,
        borderRadius: 13,
        margin: 25,
        width: Dimensions.get('window').width / 1.5,
        padding: 20
    },
    otherCardView: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        backgroundColor: Colors.white,
        borderRadius: 13,
        margin: 25,
        width: Dimensions.get('window').width / 1.5,
        padding: 20
    },
    cardView: {
        backgroundColor: Colors.white,
        borderRadius: 13,
        width: width / 1.1,
        margin: 5,
        flexDirection: 'row',
        padding: 10,

    },
    GridViewInsideTextItemStyle: {
        color: "#fff",
        fontSize: 15,
        padding: 10,
        justifyContent: 'center',
    },
    insideDetails: {
        textAlign: 'center',
        color: Colors.black,

    },
    threeDotsStyle: {
        backgroundColor: Colors.primary,
        justifyContent: 'center',
        alignItems: 'center',
        height: 41,
        marginTop: 5,
        tintColor: Colors.white
    },
    Alert_Main_View: {

        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: Colors.primary,
        height: Dimensions.get('window').height / 5.5,
        width: Dimensions.get('window').width / 1.4,
        borderWidth: 1,
        borderColor: Colors.white,
        borderRadius: 7,
        shadowColor: "#000",
        shadowOffset: {
            width: 0,
            height: 2
        },
        shadowOpacity: 0.25,
        shadowRadius: 4,
        elevation: 5

        // padding:30,
    },

    Alert_Title: {

        fontSize: 25,
        color: "#fff",
        textAlign: 'center',
        padding: 10,
    },

    Alert_Message: {

        fontSize: 15,
        color: "#fff",
        textAlign: 'center',
        padding: 10,

    },

    buttonStyle: {

        width: '50%',
        height: '100%',
        justifyContent: 'center',
        alignItems: 'center'

    },

    TextStyle: {
        color: '#fff',
        textAlign: 'center',
        fontSize: 22,
        marginTop: -5
    }
})
export default connect(mapStateToProps, mapDispatchToProps)(MemberDirectoryList);