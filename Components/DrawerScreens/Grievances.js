import React, { Component } from 'react'
import { Text, View, StyleSheet, FlatList, RefreshControl, Image, TouchableOpacity, Dimensions, Alert, } from 'react-native'
import Colors from '../../Assets/Colors'
import Images from '../../Assets/Images';
import { Header } from '../CusComponent';
const { width, height } = Dimensions.get('window');
import Modal from 'react-native-modal';
import { getItem } from '../../utility/AsyncConfig';
import { axiosAuthGet, axiosPost } from '../../utility/apiConnection';
import moment from 'moment';
import { connect } from 'react-redux';
import Toast from 'react-native-simple-toast';
import { Formik } from 'formik';
import * as Yup from 'yup';
import { mapStateToProps, mapDispatchToProps } from '../../Reducers/ApiClass';
// const subscribe=null;
const book = Yup.object().shape({
    bookName: Yup.string().trim().required("Book Name is required.")
  
  });
class Grievances extends Component {
    constructor(props) {
        super(props);
        this.state = {
            modalVisible: false,
            data: null,
            loading: true,
            loadingExtradata: false,
            page: 1,
            grievanceId: '',
            isFetching: false,
        }
    }

    async componentDidMount() {
        this.LoadData();
        this.willFocusSubscription = this.props.navigation.addListener(
            'focus',
            () => {
                this.LoadData();
            }
        );
    }

    onRefresh() {
        this.setState({ isFetching: true, }, () => { this.LoadData(); });
    }
    LoadData = async () => {
        try {
            var values;
            await getItem('LoginDetails').then((data) => {
                values = data.memberId;
                this.setState({ id: values })
                // console.log("Member id:", data.memberId);
            })
            console.log("Member id:", values);
            const params = {

                "parameter": " and memberId =" + values,
                "parameter1": "",
                "pageSize": "10",
                "page": this.state.page.toString(),
                "sortColumn": " grievance_id desc"

            }

            let response = await axiosPost('Grievance/Get', params);
            console.log("Graviance:-", response);
            this.setState({
                data: this.state.page === 1 ? response :
                    [...this.state.data, ...response]
            })
            this.setState({ isFetching: false })

            // console.log(this.state.data);
        } catch (error) {
            console.log(error);
        }
    }
    LoadMoreData = () => {
        this.setState({
            page: this.state.page + 1
        }, () => this.LoadData())
    }
    setModalVisible = (visible, id) => {

        this.setState({ modalVisible: visible, grievanceId: id });
    }
    viewGrievanceDetails = async (id) => {
        this.setModalVisible(false)
        await this.props.GrievanceData(id)
        this.props.navigation.navigate('ViewGrievances')
    }
    updateScreen = async () => {
        this.setModalVisible(false)
        await this.props.gervId(this.state.grievanceId)
        this.props.navigation.navigate('EditGrievances')
    }

    deleteGrievance = async () => {
        try {
            let response = await axiosPost('Grievance/Delete/' + this.state.grievanceId);
            // this.setState({ data: response })
            console.log(response);
            let filteredItems = this.state.data.filter(item => item.grievanceId != this.state.grievanceId);
            this.setState({ data: filteredItems })
            // this.LoadData();
            Toast.show(response.message, Toast.SHORT);

        } catch (error) {
            console.log(error);
        }
        this.setState({ modalVisible: false })

    }
    EmptyListMessage = () => {
        return (
            // Flat List Item
            <View style={styles.emptyListStyle}>
                <Text style={styles.emptyMessageStyle}>No Grievances</Text>
            </View>
        );
    }
    render() {
        const { modalVisible } = this.state;
        return (

            <View style={styles.container}>
                <Header title={"Grievances"} navigation={this.props.navigation} />


                <FlatList
                    style={{ margin: 10 }}
                    data={this.state.data}
                    refreshControl={
                        <RefreshControl
                            //refresh control used for the Pull to Refresh
                            refreshing={this.state.isFetching}
                            onRefresh={() => this.onRefresh()}
                        />
                    }
                    renderItem={({ item }) =>
                        <View style={styles.cardView}>
                            {
                                item.status == 1 ? (
                                    <TouchableOpacity style={{ alignItems: 'flex-end', marginRight: 10, justifyContent: 'center' }}
                                        onPress={() => this.setModalVisible(true, item.grievanceId)}>
                                        <Image
                                            source={Images.horizontalDot}
                                            style={{ marginTop: 5, }}
                                        />
                                    </TouchableOpacity>
                                ) : null
                            }

                            <View>
                                <TouchableOpacity onPress={() => this.viewGrievanceDetails(item.grievanceId)}>

                                    <View style={{ flexDirection: 'row', marginLeft: 10 }}>
                                        <Text style={{ color: Colors.primary, width: width / 5 }}>Title</Text>
                                        <Text style={{ width: width / 3, }}>: {item.title}</Text>
                                    </View>

                                    <View style={{ flexDirection: 'row', marginLeft: 10 }}>
                                        <Text style={{ color: Colors.primary, width: width / 5 }}>Add Date</Text>
                                        <Text style={{ width: width / 3, }}>: {moment(item.grievanceDate).format("MM-DD-YYYY")}</Text>
                                    </View>
                                    {/* <View style={{ flexDirection: 'row', marginLeft: 10 }}>
                                        <Text style={{ color: Colors.primary, width: width / 5 }}>End Date</Text>
                                        <Text style={{ width: width / 3, }}>: {"-"}</Text>
                                    </View> */}
                                    <View style={{ flexDirection: 'row', marginLeft: 10 }}>
                                        <Text style={{ color: Colors.primary, width: width / 5 }}>Status</Text>
                                        <Text style={{ width: width / 3,color:item.status==1?"green":(item.status==2?"orange":"red") }}>: {item.status == 1 ? "Open" : (item.status == 2 ? "Resolve" : "Close")}</Text>
                                    </View>

                                </TouchableOpacity>

                            </View>

                        </View>
                    }
                    numColumns={1}
                    keyExtractor={item => item.No}
                    onEndReachedThreshold={0}
                    ListEmptyComponent={this.EmptyListMessage()}
                    refreshing={this.state.isFetching}
                    onEndReached={this.LoadMoreData}
                />

                <Modal
                    isVisible={this.state.modalVisible}
                    onBackdropPress={() => this.setModalVisible(false)}
                    onSwipeComplete={() => this.setModalVisible(false)}
                    swipeDirection="left"
                    onBackButtonPress={() => this.setModalVisible(false)}
                >

                    <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>

                        <View style={styles.Alert_Main_View}>

                            <Text style={styles.Alert_Title}>Actions</Text>

                            <View style={{ width: '80%', height: 2, backgroundColor: '#fff' }} />

                            {/* <TouchableOpacity onPress={() => this.props.navigation.navigate('ViewGrievances')}>
                                <Text style={styles.Alert_Message}> View </Text>
                            </TouchableOpacity>

                            <View style={{ width: '80%', height: 1, backgroundColor: '#fff' }} /> */}
                            <TouchableOpacity onPress={() => this.updateScreen()}>
                                <Text style={styles.Alert_Message}> Edit </Text>
                            </TouchableOpacity>

                            <View style={{ width: '80%', height: 1, backgroundColor: '#fff' }} />

                            <TouchableOpacity onPress={() => this.deleteGrievance()}>
                                <Text style={styles.Alert_Message}>Delete </Text>
                            </TouchableOpacity>

                        </View>

                    </View>


                </Modal>

                <View style={{
                    position: 'absolute',
                    alignItems: 'center',
                    justifyContent: 'center',
                    right: 30,
                    bottom: 30,
                }}>
                    <TouchableOpacity onPress={() => this.props.navigation.navigate('AddNewGrievances')}>
                        <Image
                            source={Images.add_icon}
                            style={{

                            }} />
                    </TouchableOpacity>
                </View>
            </View >
        )
    }
}
const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'space-between',
        backgroundColor: "#E5E5E5"
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
        // width: width / 1.1,
        margin: 5,
        // flexDirection: 'row',
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
        height: Dimensions.get('window').height / 3.7,
        width: Dimensions.get('window').width / 1.7,
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
export default connect(mapStateToProps, mapDispatchToProps)(Grievances);