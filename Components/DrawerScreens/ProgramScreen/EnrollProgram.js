import React, { Component } from 'react';
import { Text, View, StyleSheet, FlatList, Image, TouchableOpacity, Dimensions, Alert, ScrollView, } from 'react-native';
import Colors from '../../../Assets/Colors';
import Images from '../../../Assets/Images';
import Modal from 'react-native-modal';
import { getItem } from '../../../utility/AsyncConfig';
import { axiosAuthGet, axiosPost } from '../../../utility/apiConnection';
import moment from 'moment';
import HTMLView from 'react-native-htmlview';
import { IMAGEURL } from '../../../utility/util'
const { width, height } = Dimensions.get('window');

export default class EnrollProgram extends Component {
    constructor(props) {
        super(props);
        this.state = {
            modalVisible: false,
            data: null,
            details: null,
            imgpath: "",
            imageModalVisible: false,
        };
    }
    setModalVisible = async (visible, programId, formId, memberId, applicationId) => {

        console.log(programId, formId, memberId);

        if (visible == true) {

            try {

                let response = await axiosAuthGet("Program/GetForm/" + programId + "/" + formId + "/" + memberId + "/" + applicationId)

                this.setState({ details: response })

                console.log("details:-", response);
            } catch (error) {

            }
        }
        this.setState({ modalVisible: visible });
    }
    componentDidMount() {
        this.getData()
        this.willFocusSubscription = this.props.navigation.addListener(
            'focus',
            () => {
                this.getData();
            }
        );
    }
    getData = async () => {
        var values;
        await getItem('LoginDetails').then((data) => {
            values = data.memberId;
            // this.setState({ memberId: values })
            // console.log("Member id:", data.memberId);
        })
        console.log("Member id:", values);
        let params = {
            "parameter": "and protype = 1 and pm.member_id =" + values,
            "parameter1": "",
            "pageSize": "100",
            "page": "1",
            "sortColumn": "p.pro_id desc"
        }
        try {
            let response = await axiosPost("ProgramEventActivity/MemberEnrollList", params)
            await response.sort((a, b) =>
                a.applicationId - b.applicationId
            ).reverse()
            this.setState({ data: response })
            console.log("Program:=", response);
        } catch (error) {

        }
    }
    setImageModalVisible = (item, visible) => {
        this.setState({ imgpath: item })
        this.setState({ imageModalVisible: visible });

        // Alert.alert( );
        console.log("Images:", item);


    }
    EmptyListMessage = () => {
        return (
            // Flat List Item
            <View style={styles.emptyListStyle}>
                <Text style={styles.emptyMessageStyle}>No Program</Text>
            </View>
        );
    }
    render() {
        const { modalVisible } = this.state;

        return (
            <View>
                <FlatList
                    style={{ margin: 10 }}
                    data={this.state.data}

                    renderItem={({ item }) =>
                        <TouchableOpacity onPress={() => this.setModalVisible(true, item.programId, item.formId, item.memberId, item.applicationId)}>
                            <View style={styles.cardView}>
                                {/* <Image
                                source={Images.SPFLogo}
                                style={{ width: width / 5, resizeMode: 'stretch', height: 75 }} /> */}
                                <View>
                                    <View style={{ flexDirection: 'row', marginLeft: 10 }}>
                                        <Text style={{ color: Colors.primary, width: width / 4 }}>Program Name</Text>
                                        <Text style={{ width: width / 4, marginLeft: 10 }}>: {item.programTitle}</Text>
                                    </View>
                                    <View style={{ flexDirection: 'row', marginLeft: 10 }}>
                                        <Text style={{ color: Colors.primary, width: width / 4 }}>Form Name</Text>
                                        <Text style={{ width: width / 4, marginLeft: 10 }}>: {item.programFormName}</Text>
                                    </View>

                                    <View style={{ flexDirection: 'row', marginLeft: 10 }}>
                                        <Text style={{ color: Colors.primary, width: width / 4 }}>Application Id</Text>
                                        <Text style={{ width: width / 4, marginLeft: 10 }}>: {item.applicationId}</Text>
                                    </View>
                                    <View style={{ flexDirection: 'row', marginLeft: 10 }}>
                                        <Text style={{ color: Colors.primary, width: width / 4 }}>Status</Text>
                                        <Text style={{ width: width / 4, marginLeft: 10 }}>: {item.status == 1 ? "Pending" : (item.status == 3 ? "Approved" : (item.status == 4 ? "Rejected" : '-'))}</Text>

                                    </View>
                                    {/* <TouchableOpacity onPress={() => this.props.navigation.navigate('OtherProgramDescription')}>
                                    <View style={{ backgroundColor: Colors.primary, marginTop: 20, padding: 3, paddingLeft: 20, paddingRight: 20, borderRadius: 8, marginLeft: 150 }}>
                                        <Text style={{ color: Colors.white }}>Apply</Text>
                                    </View>
                                </TouchableOpacity> */}
                                </View>
                            </View>
                        </TouchableOpacity>
                    }
                    numColumns={1}
                    ListEmptyComponent={this.EmptyListMessage()}
                    keyExtractor={item => item.No}
                />

                <Modal
                    isVisible={this.state.modalVisible}
                    onBackdropPress={() => this.setModalVisible(false)}
                    onSwipeComplete={() => this.setModalVisible(false)}
                    swipeDirection="left"
                    onBackButtonPress={() => this.setModalVisible(false)}
                >
                    <View style={{ padding: 20, borderRadius: 8, backgroundColor: Colors.white, alignItems: 'center', justifyContent: 'center' }}>

                        <Text style={styles.Alert_Title}>Program Details</Text>

                        <View style={{ width: '70%', height: 2, backgroundColor: Colors.black }} />

                        <FlatList
                            style={{ margin: 10 }}
                            data={this.state.details}

                            renderItem={({ item }) =>
                                // <ScrollView>
                                <View style={{ flex: 1, padding: 20, backgroundColor: Colors.white, alignItems: 'center', justifyContent: 'center' }}>

                                    {
                                        item?.formType == 5 ? (
                                            <View style={{ marginTop: 10, flexDirection: 'row', justifyContent: 'flex-start', alignItems: 'flex-start' }}>
                                                <Text style={{ fontSize: 18, width: Dimensions.get('window').width / 3.9, color: Colors.primary, fontWeight: 'bold' }}>{item.formLabelName}</Text>
                                                <TouchableOpacity onPress={() => this.setImageModalVisible(item.formLabelValue, true)}>

                                                    <Image
                                                        source={{ uri: IMAGEURL + item.formLabelValue }}
                                                        style={{ marginBottom: 10, height: 50, resizeMode: 'stretch', width: Dimensions.get('window').width / 2.5 }}
                                                    />
                                                </TouchableOpacity>
                                            </View>

                                        ) : (
                                            <View style={{ marginTop: 10, flexDirection: 'row', justifyContent: 'flex-start', alignItems: 'flex-start' }}>
                                                <Text style={{ fontSize: 18, width: Dimensions.get('window').width / 3.9, color: Colors.primary, fontWeight: 'bold' }}>{item.formLabelName}</Text>
                                                <Text style={{ fontSize: 18, width: Dimensions.get('window').width / 2.5 }}>: {item.formLabelValue}</Text>
                                            </View>


                                        )
                                    }
                                    {/* <View style={{ width: '100%', height: 1, backgroundColor: Colors.graye00 }} /> */}


                                </View>
                                // </ScrollView>
                            }
                            numColumns={1}
                            ListEmptyComponent={this.EmptyListMessage()}
                            keyExtractor={item => item.No}
                        />
                    </View>
                </Modal>
                <Modal
                    isVisible={this.state.imageModalVisible}
                    onBackdropPress={() => this.setImageModalVisible(false)}
                    onSwipeComplete={() => this.setImageModalVisible(false)}
                    swipeDirection="left"
                    onBackButtonPress={() => this.setImageModalVisible(false)}
                >
                    {/* <View style={{ flex: 1, backgroundColor: Colors.black, alignItems: 'center', justifyContent: 'center' }}> */}

                    <Image
                        style={{ resizeMode: 'stretch', alignItems: 'center', justifyContent: 'center', alignContent: 'center', alignSelf: 'center', height: "50%", width: "90%" }}
                        source={{ uri: IMAGEURL + this.state.imgpath }}
                    />

                    {/* </View> */}
                </Modal>
            </View>
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
    emptyListStyle: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        textAlignVertical: 'center'

    },
    emptyMessageStyle: {
        textAlign: 'center',
        justifyContent: 'center',
        alignItems: 'center',
        textAlignVertical: 'center'

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
        height: Dimensions.get('window').height / 3.3,
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
        color: Colors.black,
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

