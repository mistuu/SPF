import moment from 'moment';
import React, { Component } from 'react'
import { Text, View, StyleSheet, FlatList, Image, TouchableOpacity, Dimensions, Alert, ScrollView, Linking } from 'react-native'
import Colors from '../../../Assets/Colors';
import { axiosAuthGet, axiosPost } from '../../../utility/apiConnection';
import { getItem } from '../../../utility/AsyncConfig';
import Modal from 'react-native-modal';
import HTMLView from 'react-native-htmlview';

const { width, height } = Dimensions.get('window');

export default class MyActivity extends Component {
    constructor(props) {
        super(props);
        this.state = {
            data: null,
            modalVisible: false,
            activityName: '',
            activityDate: '',
            activityDescription: '',
            activityLink: '',
            status: null,
        };
    }

    async componentDidMount() {
        this.getData()
        this.willFocusSubscription = this.props.navigation.addListener(
            'focus',
            () => {
                this.getData();
            }
        );
    }
    setModalVisible = async (visible, id, status) => {

        if (visible == true) {
            try {
                let response = await axiosAuthGet("Program/GetEditByProgram/" + id + "/" + "1")
                response.forEach(element => {
                    this.setState({ activityName: element.name, activityDate: element.endDate, activityLink: element.link, activityDescription: element.description })
                });
                console.log(response);
            } catch (error) {

            }
        }
        this.setState({ status: status })
        this.setState({ modalVisible: visible });
        console.log(id);
    }
    componentDidUpdate(prevState) {
        if (prevState.data != this.state.data) {
            // this.getData()
            console.log("Hello");
        }
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
            "parameter": " and p.pro_type = 3 and status NOT IN (0)",
            "parameter1": values.toString(),
            "pageSize": "100",
            "page": "1",
            "sortColumn": "pro_id desc"
        }
        try {
            let response = await axiosPost("ProgramEventActivity/List", params)
            this.setState({ data: response })
            this.getData();
            console.log("Activity:=", response);
        } catch (error) {

        }
    }
    EmptyListMessage = () => {
        return (
            // Flat List Item
            <View style={styles.emptyListStyle}>
                <Text style={styles.emptyMessageStyle}>No Activity</Text>
            </View>
        );
    }
    render() {
        return (
            <View>
                <FlatList

                    style={{ margin: 10 }}
                    data={this.state.data}
                    renderItem={({ item }) =>
                        <View style={{ flex: 1, }}>
                            <TouchableOpacity onPress={() => this.setModalVisible(true, item.eventId, item.status)}>

                                <View style={styles.activityMainCardview}>
                                    <Text style={styles.ActivityTitle}>{item.eventName}</Text>
                                    {
                                        item.status == 3 ?
                                            (
                                                <View style={{ flexDirection: 'row', marginTop: 10 }}>
                                                    <Text style={{ color: Colors.primary, fontSize: 18 }}>Link</Text>
                                                    <TouchableOpacity onPress={() => Linking.openURL(item.link).catch(err => console.error("Couldn't load page", err))}>
                                                        <Text style={{ marginLeft: 20, fontSize: 18, color: Colors.primary, width: width / 1.7 }}>{item.link}</Text>
                                                    </TouchableOpacity>
                                                </View>
                                            ) : null
                                    }

                                    <View style={{ flexDirection: 'row', marginTop: 10 }}>
                                        <Text style={{ color: Colors.primary, fontSize: 18 }}>Timing</Text>
                                        <Text style={{ marginLeft: 20, fontSize: 18 }}>{item.time.hours}:{item.time.minutes}</Text>
                                    </View>
                                </View>
                                <View style={styles.subcardView}>
                                    <Text style={{ fontWeight: 'bold', textAlign: 'center', padding: 10, color: Colors.black, fontSize: 18 }}>{moment(item.eventStartDate).format("DD MMM")}</Text>
                                </View>
                            </TouchableOpacity>
                        </View>
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
                // style={{ backgroundColor:'transparent', }}
                >
                    <View style={{ padding: 20, borderRadius: 8, backgroundColor: Colors.white, alignItems: 'center', justifyContent: 'center' }}>
                        <Text style={styles.Alert_Title}>Activity Details</Text>

                        <View style={{ width: '70%', height: 2, backgroundColor: Colors.black }} />
                        <ScrollView>
                            <View style={{ marginTop: 20, flexDirection: 'row', }}>
                                <Text style={{ fontSize: 18, width: Dimensions.get('window').width / 2.9, color: Colors.primary, fontWeight: 'bold' }}>Activity Name</Text>
                                <Text style={{ fontSize: 18, width: Dimensions.get('window').width / 2.5 }}>: {this.state.activityName}</Text>
                            </View>


                            {/* <View style={{ width: '100%', height: 1, backgroundColor: Colors.graye00 }} /> */}
                            <View style={{ marginTop: 20, flexDirection: 'row', }}>
                                <Text style={{ fontSize: 18, width: Dimensions.get('window').width / 2.9, color: Colors.primary, fontWeight: 'bold' }}>Avtivity Date</Text>
                                <Text style={{ fontSize: 18, width: Dimensions.get('window').width / 2.5 }}>: {moment(this.state.activityDate).format("DD-MM-YYYY")}</Text>
                            </View>
                            {/* <View style={{ width: '100%', height: 1, backgroundColor: Colors.graye00 }} /> */}
                            <View style={{ marginTop: 20, flexDirection: 'row', }}>
                                <Text style={{ fontSize: 18, width: Dimensions.get('window').width / 2.9, color: Colors.primary, fontWeight: 'bold' }}>Description</Text>
                                <View style={{ fontSize: 18, width: Dimensions.get('window').width / 2.5 }}>
                                    <HTMLView
                                        value={this.state.activityDescription}
                                    /></View>
                            </View>
                            {/* <View style={{ width: '100%', height: 1, backgroundColor: Colors.graye00 }} /> */}
                            {
                                this.state.status == 3 ?
                                    (
                                        <View style={{ marginTop: 20, flexDirection: 'row', }}>
                                            <Text style={{ fontSize: 18, width: Dimensions.get('window').width / 2.9, color: Colors.primary, fontWeight: 'bold' }}>Link</Text>
                                            <TouchableOpacity onPress={() => Linking.openURL(this.state.activityLink).catch(err => console.error("Couldn't load page", err))}>

                                                <Text style={{ fontSize: 18, width: Dimensions.get('window').width / 2.5 }}>: {this.state.activityLink}</Text>
                                            </TouchableOpacity>
                                        </View>
                                    ) : null
                            }
                        </ScrollView>
                    </View>
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
    activityMainCardview: {
        // width: Dimensions.get('window').width / 1.2,
        borderRadius: 13,
        // flex: 1,
        backgroundColor: Colors.white,
        margin: 20,
        marginLeft: 12,
        padding: 20,
    },
    subcardView: {
        height: 70, width: 70,
        backgroundColor: Colors.white,
        borderRadius: 13,
        marginLeft: Dimensions.get('window').width / 1.3,
        position: 'absolute',
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
        alignItems: 'flex-start'
    },
    ActivityTitle: {
        color: Colors.primary,
        fontSize: 20,
        width: width / 1.7,
        fontWeight: 'bold',
        textAlign: 'left',
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
        backgroundColor: Colors.white,
        borderRadius: 13,
        margin: 25,
        width: Dimensions.get('window').width / 1.2,
        padding: 20
    },
    cardView: {
        backgroundColor: Colors.white,
        borderRadius: 13,
        margin: 25,
        width: Dimensions.get('window').width / 1.1,
        marginBottom: 500,
        paddingBottom: 20,
        paddingTop: 20
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
        backgroundColor: Colors.white,
        margin: 10,
        // height: Dimensions.get('window').height / 3.3,
        // width: Dimensions.get('window').width / 1.4,
        borderWidth: 1,
        borderColor: Colors.black,
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
        color: Colors.black,
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

