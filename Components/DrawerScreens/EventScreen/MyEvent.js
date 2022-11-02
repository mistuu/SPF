import React, { Component } from 'react'
import { Text, View, StyleSheet, FlatList, Image, TouchableOpacity, Dimensions, Alert, } from 'react-native'
import Colors from '../../../Assets/Colors'
import Images from '../../../Assets/Images';
import { Header } from '../../CusComponent';
import { Dialog } from 'react-native-simple-dialogs';
import { AccordionList } from "accordion-collapse-react-native";
import { Separator } from 'native-base';
import Modal from 'react-native-modal';
import { getItem } from '../../../utility/AsyncConfig';
import { axiosAuthGet, axiosPost } from '../../../utility/apiConnection';
import moment from 'moment';
import Toast from 'react-native-simple-toast'
const { width, height } = Dimensions.get('window');

export default class MyEvent extends Component {
    constructor(props) {
        super(props);
        this.state = {
            modalVisible: false,
            data: null,
            eventId: '',
            eventName: '',
            eventStartDate: "",
            eventEndDate: ""
        };
    }
    setModalVisible = (visible, eventId, eventName, eventStartDate, eventEndDate) => {
        this.setState({ modalVisible: visible, eventId: eventId, eventName: eventName, eventStartDate: eventStartDate, eventEndDate: eventEndDate });
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

        let params1 = {
            "parameter": " and p.pro_type = 2 and status NOT IN (0)",
            "parameter1": values.toString(),
            "pageSize": "100",
            "page": "1",
            "sortColumn": "pro_id desc"
        }

        try {
            let respons1 = await axiosPost("ProgramEventActivity/List", params1)

            var data = respons1
            this.setState({ data: data })
            console.log("Event:=", respons1);
        } catch (error) {

        }
    }
    apply = async (proId, proType) => {
        try {
            var values;
            await getItem('LoginDetails').then((data) => {
                values = data.memberId;
                // this.setState({ memberId: values })
                // console.log("Member id:", data.memberId);
            })

            console.log("Params==", values + "=" + proId + "=" + proType);
            let response = await axiosAuthGet("ProgramEventActivity/Apply/" + values + "/" + proId + "/" + 1 + "/" + proType)
            Toast.show(response.message)
            this.getData();
            console.log(response);
        } catch (error) {

        }
    }
    EmptyListMessage = () => {
        return (
            // Flat List Item
            <View style={styles.emptyListStyle}>
                <Text style={styles.emptyMessageStyle}>No Event</Text>
            </View>
        );
    }
    render() {
        const { modalVisible } = this.state;

        return (
            <View style={styles.container}>
                <FlatList
                    style={{ margin: 10 }}
                    data={this.state.data}

                    renderItem={({ item }) =>
                        <TouchableOpacity onPress={() => this.setModalVisible(true, item.eventId, item.eventName, item.eventStartDate, item.eventEndDate)} >
                            <View style={styles.cardView}>
                                <View>
                                    <View style={{ flexDirection: 'row', marginLeft: 10 }}>
                                        <Text style={{ color: Colors.primary, width: width / 4 }}>Event Name</Text>
                                        <Text style={{ width: width / 3, marginLeft: 20 }}>: {item.eventName}</Text>
                                    </View>
                                    <View style={{ flexDirection: 'row', marginLeft: 10 }}>
                                        <Text style={{ color: Colors.primary, width: width / 4 }}>Start Date</Text>
                                        <Text style={{ width: width / 3, marginLeft: 20 }}>: {moment(item.eventStartDate).format("DD/MM/YYYY")}</Text>
                                    </View>

                                    <View style={{ flexDirection: 'row', marginLeft: 10 }}>
                                        <Text style={{ color: Colors.primary, width: width / 4 }}>End Date</Text>
                                        <Text style={{ width: width / 3, marginLeft: 20 }}>: {moment(item.eventEndDate).format("DD/MM/YYYY")}</Text>
                                    </View>
                                    <View style={{ flexDirection: 'row', marginLeft: 10 }}>
                                        <Text style={{ color: Colors.primary, width: width / 4 }}>Status</Text>
                                        <Text style={{ width: width / 3, marginLeft: 20, color: item.status == 1 ? "orange" : (item.status == 3 ? "green" : "red") }}>: {item.status == 1 ? "Pending" : (item.status == 3 ? "Approve" : "Reject")}</Text>
                                        {/* if ({item.status=="close"}) {
                              <Text style={{ width: width / 3, marginLeft: 20, color: 'red' }}>:{item.status}</Text>
                          } else {
                              <Text style={{ width: width / 3, marginLeft: 20, color: Colors.tempGreen }}>:{item.status}</Text>
                          } */}
                                    </View>
                                </View>
                                <View>
                                    {/* <TouchableOpacity onPress={() => this.setModalVisible(true)}>
                          <Image
                              source={Images.horizontalDot}
                              style={{ marginTop: 5, marginLeft: 50 }}
                          />
                      </TouchableOpacity> */}
                                    {/* {
                          item.apply == 0 ? (
                              <TouchableOpacity onPress={() => this.apply(item.eventId, item.eventType)}>
                                  <View style={{ backgroundColor: Colors.primary, padding: 3, paddingLeft: 20, paddingRight: 20, borderRadius: 8, marginTop: 30 }}>
                                      <Text style={{ color: Colors.white }}>Apply</Text>
                                  </View>
                              </TouchableOpacity>
                          ) : null
                      } */}

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
                        <Text style={styles.Alert_Title}>View Event</Text>

                        <View style={{ width: '70%', height: 2, backgroundColor: Colors.black }} />
                        <View style={{ marginTop: 20, flexDirection: 'row', }}>
                            <Text style={{ fontSize: 18, width: Dimensions.get('window').width / 2.9, color: Colors.primary, fontWeight: 'bold' }}>Event ID</Text>
                            <Text style={{ fontSize: 18, width: Dimensions.get('window').width / 2.5 }}>: {this.state.eventId}</Text>
                        </View>
                        <View style={{ marginTop: 20, flexDirection: 'row', }}>
                            <Text style={{ fontSize: 18, width: Dimensions.get('window').width / 2.9, color: Colors.primary, fontWeight: 'bold' }}>Event Name</Text>
                            <Text style={{ fontSize: 18, width: Dimensions.get('window').width / 2.5 }}>: {this.state.eventName}</Text>
                        </View>

                        {/* <View style={{ width: '100%', height: 1, backgroundColor: Colors.graye00 }} /> */}
                        <View style={{ marginTop: 20, flexDirection: 'row', }}>
                            <Text style={{ fontSize: 18, width: Dimensions.get('window').width / 2.9, color: Colors.primary, fontWeight: 'bold' }}>Start Date</Text>
                            <Text style={{ fontSize: 18, width: Dimensions.get('window').width / 2.5 }}>: {moment(this.state.eventStartDate).format("DD-MM-YYYY")}</Text>
                        </View>
                        <View style={{ marginTop: 20, flexDirection: 'row', }}>
                            <Text style={{ fontSize: 18, width: Dimensions.get('window').width / 2.9, color: Colors.primary, fontWeight: 'bold' }}>End Date</Text>
                            <Text style={{ fontSize: 18, width: Dimensions.get('window').width / 2.5 }}>: {moment(this.state.eventEndDate).format("DD-MM-YYYY")}</Text>
                        </View>
                    </View>


                </Modal>

            </View >
        )
    }
}
const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'flex-start',
        backgroundColor: Colors.backgroundscreencolor
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
