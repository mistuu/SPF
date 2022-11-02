import React, { Component } from 'react'
import { Text, SafeAreaView, StatusBar, Platform, TouchableOpacity, BackHandler, FlatList, View, StyleSheet, Dimensions, TextInput, Image, Alert, ScrollView } from 'react-native'
import { getPixelSizeForLayoutSize } from 'react-native/Libraries/Utilities/PixelRatio';
import Colors from '../../Assets/Colors';
import FlotingEditText from "../CusComponent/FlotingEditText";
import Validation from "../../helper/Validation";
import { Formik } from 'formik'
import Modal from 'react-native-modal';
import { Header } from '../CusComponent';
import Images from '../../Assets/Images';
import { getItem, storeItem } from '../../utility/AsyncConfig';
import { axiosPost, axiosPostLogin } from '../../utility/apiConnection';
import Toast from 'react-native-simple-toast';
import { mapStateToProps, mapDispatchToProps } from '../../Reducers/ApiClass';
import { connect } from 'react-redux';
const { width, height } = Dimensions.get('window');

class ToDoList extends Component {
    constructor(props) {
        super(props)
        this.handleBackButtonClick = this.handleBackButtonClick.bind(this)
        this.state = {
            modalVisible: false,
            detailModal: false,
            pinnedModal: false,
            starIconCOlor: false,
            pinIcon: Images.star_grey,
            title: "",
            body: "",
            t: '',
            d: '',
            todoID: '',
            deleteResponce: null,
            data: [],
            pinTodo: [],
            tintColor: Colors.graye00,
            editTitle: "",
            editBody: "",
            editable: false,
            saveButton: false,
            memberId: '',
            loginMemberId: '',
            isDone: '',
            assignId: '',
        }

    }

    async componentDidMount() {
        BackHandler.addEventListener('hardwareBackPress', this.handleBackButtonClick);

        // this.setState({ pinData: [], data: [] });
        this.getData()
    }
    componentWillUnmount() {
        BackHandler.removeEventListener('hardwareBackPress', this.handleBackButtonClick);

    }
    handleBackButtonClick() {
        // this.props.navigation.goBack()
        this.setState({ detailModal: false });

        return true;
    }
    async getData() {
        var values;
        await getItem('LoginDetails').then((data) => {
            values = data.memberId;
            this.setState({ id: values })
            // console.log("Member id:", data.memberId);
        })
        this.setState({ loginMemberId: values })
        console.log("Member id:", values);

        const params = {

            "parameter": " and(t.todomemberid = " + values + "  or m.todomemberid = " + values + ")",
            "parameter1": "",
            "pageSize": "100",
            "page": "1",
            "sortColumn": "t.todoid desc"

        }
        try {
            let response = await axiosPost('ToDo/Get', params);
            this.setState({ data: response })
            console.log("Other Data is :=", this.state.data);

        } catch (error) {
            console.log(error);

        }
        // await getItem('ToDoPinned').then((data) => {
        //     // var values = data;
        //     console.log("From Local Storage:", data);
        //     // this.state.pinData = data
        // })
        // await getItem('ToDoPinned').then((data) => {
        //     var values = data;
        //     console.log("From Local Storage:", values);
        //     this.state.pinData.push(values)
        // })
    }
    async addArray() {
        var d = new Date();
        console.log("current date:", d);
        var values;
        await getItem('LoginDetails').then((data) => {
            values = data.memberId;
            this.setState({ id: values })
            // console.log("Member id:", data.memberId);
        })
        if (this.state.title != '' && this.state.body != '') {

            // this.state.data.push({ title: this.state.title, body: this.state.body })
            this.setState({ t: this.state.title, d: this.state.body })
            const params = {
                "toDoId": 0,
                "title": this.state.title,
                "body": this.state.body,
                "date": d,
                "memberId": values,
                "totalLenght": 0,
                // "admin":0,
            }
            try {
                let response = await axiosPost('ToDo/Save', params);
                // this.setState({ data: response })
                Toast.show(response.message)

                console.log(response);

            } catch (error) {
                console.log(error);
            }
            this.setState({ title: "", body: "" })
            this.setState({ modalVisible: false })
            this.getData()
            console.log(this.state.data);
        }
        else {
            alert('Please fill the data...');
        }

    }

    setModalVisible = (visible) => {
        this.setState({ modalVisible: visible });
    }
    setDetailModalVisible = (title, body, todoID, memberId, isDone, assignId) => {
        console.log("TodoList Id:", todoID);
        console.log("Member Id:", memberId);
        console.log("is Done:", isDone);
        console.log("assignId:", assignId);
        this.setState({ t: title, d: body, todoID: todoID, memberId: memberId, isDone: isDone, assignId: assignId })
        this.setState({ detailModal: true, pinIcon: Images.star_grey });
    }

    setPinnedModalVisible = (title, body, toDoId) => {
        console.log("TodoList Id:", toDoId);
        this.setState({ t: title, d: body, todoID: toDoId })
        this.setState({ pinnedModal: true, pinIcon: Images.star, starIconCOlor: true });
    }

    renderItem = ({ item }) => {
        console.log("Data:", item);

        return (<View style={{ margin: 5, }}>
            <TouchableOpacity onPress={this.setPinnedModalVisible.bind(this, item.title, item.body, item.toDoId)}>

                <Text
                    style={{
                        backgroundColor: Colors.white,
                        width: Dimensions.get('window').width / 2.5,
                        borderTopLeftRadius: 13,
                        borderTopRightRadius: 13,
                        padding: 15,
                    }}
                >{item.title}</Text>
                <View style={{ height: 1, borderColor: Colors.backgroundscreencolor }} />
                <Text
                    style={{
                        width: Dimensions.get('window').width / 2.5
                        , textAlign: 'left',
                        borderBottomLeftRadius: 13, borderBottomRightRadius: 13,
                        backgroundColor: COLORS.white,
                        height: Dimensions.get('window').height / 5.5,
                        padding: 15

                    }}
                >{item.body}</Text>
            </TouchableOpacity></View>
        )
    }

    async _deleteValue() {



        Alert.alert(
            "Are You Sure",
            "You want to Delete this ToDoList",
            [
                {
                    text: "Cancel",
                    onPress: () => console.log("Cancel Pressed"),
                    style: "cancel"
                },
                {
                    text: "OK", onPress: async () => {
                        try {
                            console.log(this.state.todoID);
                            let response = await axiosPost('ToDo/Delete/' + this.state.todoID);
                            this.setState({ detailModal: false })
                            this.setState({ deleteResponce: response })

                            this.setState({
                                data: this.state.data.filter(item => item.title != this.state.t)
                            })

                            this.setState({ detailModal: false })
                            console.log(this.state.deleteResponce);
                            Toast.show(response.message, Toast.LONG);

                        } catch (error) {
                            console.log(error);
                        }
                        // this.setState({
                        //     data: this.state.data.filter(item => item.body != this.state.d)
                        // })
                        // this.setState({
                        //     pinData: this.state.pinData.filter(item => item.title != this.state.t),
                        //     detailModal: false
                        // })
                        // this.setState({
                        //     pinData: this.state.pinData.filter(item => item.body != this.state.d),
                        //     detailModal: false
                        // })
                        this.setState({ detailModal: false })
                    }
                }
            ]
        );

    }
    async editTodoList() {
        console.log("Edit Value:", this.state.t + this.state.d);
        this.setState({ editable: true, saveButton: true })

    }
    async saveEdit() {
        var values;
        await getItem('LoginDetails').then((data) => {
            values = data.memberId;
            this.setState({ id: values })
            // console.log("Member id:", data.memberId);
        })
        var d = new Date();

        const params = {
            "toDoId": this.state.todoID,
            "title": this.state.t,
            "body": this.state.d,
            "date": d,
            "memberId": values,
            "totalLenght": 0
        }
        console.log("asccxcscsccccc", params);
        try {
            let resp = await axiosPost('ToDo/Save', params);
            // this.setState({ data: response })
            Toast.show(resp.message)
            this.getData()
            this.setState({ editable: false, detailModal: false, saveButton: false })
            console.log(resp);
        } catch (error) {
            console.log(error);
        }
    }
    _isDoneTodo = async () => {
        console.log(this.state.assignId);
        try {
            let response = await axiosPost("ToDo/TodoDone/" + this.state.assignId, this.state.assignId)
            console.log("is Done==", response);
            this.getData();
            this.setState({ detailModal: false })
        } catch (error) {

        }
    }
    render() {
        const { modalVisible } = this.state;
        const { detailModal } = this.state;
        const { pinnedModal } = this.state;
        return (
            <View style={styles.container}>

                <Header title={"ToDoList"} navigation={this.props.navigation} />


                <View style={{ flex: 1, }}>
                    {/* <View style={{ height: height / 2 }}>
                        <Text style={{ fontWeight: 'bold', margin: 10 }}>Pinned</Text>
                        <FlatList
                            style={{ margin: 10 }}
                            data={this.state.pinData}
                            renderItem={(item) => this.renderItem(item)}
                            numColumns={2}
                            keyExtractor={item => item.title}
                        />
                    </View> */}
                    <View style={{ flex: 1 }}>

                        <FlatList

                            style={{ margin: 10, }}
                            contentContainerStyle={{ alignItems: 'center', justifyContent: 'center', alignContent: 'center', alignSelf: 'center' }}
                            data={this.state.data}

                            renderItem={({ item }) =>

                                <View style={{ margin: 5, alignItems: 'center', justifyContent: 'center', alignContent: 'center', alignSelf: 'center' }}>
                                    <TouchableOpacity
                                        style={{ alignItems: 'center', justifyContent: 'center', alignContent: 'center', alignSelf: 'center' }} onPress={this.setDetailModalVisible.bind(this, item.title, item.body, item.toDoId, item.memberId, item.isDone, item.assignId)}>
                                        <Text

                                            style={{
                                                backgroundColor: Colors.white,
                                                width: Dimensions.get('window').width / 2.5,
                                                borderTopLeftRadius: 13,
                                                borderTopRightRadius: 13,
                                                padding: 15,
                                            }}
                                        >{item.title}</Text>
                                        <View style={{ height: 1, borderColor: Colors.backgroundscreencolor }} />
                                        <Text
                                            style={{
                                                width: Dimensions.get('window').width / 2.5
                                                , textAlign: 'left',
                                                borderBottomLeftRadius: 13, borderBottomRightRadius: 13,
                                                backgroundColor: COLORS.white,
                                                height: Dimensions.get('window').height / 5.5,
                                                padding: 15
                                            }}
                                        >{item.body}</Text>
                                    </TouchableOpacity>
                                </View>
                            }
                            numColumns={2}
                            keyExtractor={item => item.title}
                        />
                    </View>
                </View>

                {/* Add TodoList Modal */}
                <Modal
                    isVisible={this.state.modalVisible}
                    onBackdropPress={() => this.setModalVisible(false)}
                    onSwipeComplete={() => this.setModalVisible(false)}
                    swipeDirection="left"
                    onBackButtonPress={() => this.setModalVisible(false)}
                // style={{ backgroundColor:'transparent', }}
                >

                    <View style={{ backgroundColor: "transparent", justifyContent: 'center', alignItems: 'center', flex: 1,padding:"5%" }}>

                        <TextInput
                            placeholder="Title"
                            style={{
                                backgroundColor: Colors.white, marginTop: 10,
                                width: Dimensions.get('window').width / 1.4,
                                height:"5%",
                                paddingLeft:"2%",
                                borderTopLeftRadius: 13,
                                borderTopRightRadius: 13,
                            }}
                            onChangeText={title => this.setState({ title: title })}
                            value={this.state.title}
                        />
                        <View style={{ height: 1, borderColor: Colors.backgroundscreencolor }} />
                        <TextInput
                            style={{
                                height:"10%",
                                paddingLeft:"2%",
                                width: Dimensions.get('window').width / 1.4
                                , textAlign: 'left', textAlignVertical: 'top',
                                borderBottomLeftRadius: 13, borderBottomRightRadius: 13,
                            }}
                            underlineColorAndroid="transparent"
                            placeholder={"Decription"}
                            placeholderTextColor={"#9E9E9E"}
                            numberOfLines={5}
                            backgroundColor={COLORS.white}
                            multiline={true}
                            onChangeText={body => this.setState({ body: body })}
                            value={this.state.body}
                        />

                        <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                            <TouchableOpacity
                                style={styles.loginButton}
                                onPress={() => this.addArray()}><Text style={styles.logText}> Add </Text></TouchableOpacity>
                            <TouchableOpacity
                                style={[styles.loginButton, { marginLeft: 10 }]}
                                onPress={() => this.setModalVisible(!modalVisible)}><Text style={styles.logText}> Cancle </Text></TouchableOpacity>
                        </View>
                    </View>

                </Modal>

                {/* ViewToDoList Modal */}

                <Modal
                    visible={detailModal}
                    animationType="fade"
                    transparent={false}
                    style={{ backgroundColor: Colors.backgroundscreencolor, }}
                    onRequestClose={() => {
                        this.setState({ detailModal: false });
                    }}                >

                    <View style={{ flex: 1, backgroundColor: Colors.white }}>
                        <SafeAreaView style={{    paddingTop: Platform.OS === "android" ? StatusBar.currentHeight : 0, backgroundColor: Colors.primary, flexDirection: 'row', width: '100%', height: "7%", justifyContent: 'flex-start', alignItems: 'center'}}>
                            <TouchableOpacity onPress={() => this.handleBackButtonClick()} style={{ marginTop: 10, alignItems: 'flex-start', marginLeft: 10 }}>
                                <Image source={Images.back}
                                    style={{ height: 15, width: 22, tintColor: 'white', alignSelf: 'center' }} />
                            </TouchableOpacity>
                            <Text style={{ fontSize: 18, fontWeight: 'bold', color: Colors.white, marginLeft: 20, marginTop: 10 }}>View Todo</Text>
                        </SafeAreaView>
                        <ScrollView>
                            {
                                this.state.memberId != this.state.loginMemberId && this.state.isDone == 0 ?
                                    (
                                        <TouchableOpacity onPress={() => this._isDoneTodo()}>
                                            <View style={{ alignItems: 'flex-end', justifyContent: 'flex-end', marginRight: 23, marginTop: 30 }}>

                                                <Image
                                                    source={Images.right_check}
                                                    style={{ height: 30, width: 30 }}
                                                />
                                            </View>
                                        </TouchableOpacity>

                                    ) : null
                            }
                            {
                                this.state.memberId == this.state.loginMemberId ?
                                    <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'flex-end', marginRight: 23, marginTop: 30 }}>
                                        {/* <TouchableOpacity onPress={() => this.changePinColor()}>
                                <Image
                                    source={this.state.pinIcon}
                                    style={{ marginLeft: 10, height: 30, width: 30, }}
                                />

                            </TouchableOpacity> */}

                                        <TouchableOpacity onPress={() => this._deleteValue()}>
                                            <Image
                                                source={Images.trash}
                                                style={{ marginLeft: 10, height: 23, width: 23 }}
                                            />
                                        </TouchableOpacity>
                                        <TouchableOpacity onPress={() => this.editTodoList()}>
                                            <Image
                                                source={Images.editIcon}
                                                style={{ marginLeft: 10, height: 30, width: 25 }}
                                            />
                                        </TouchableOpacity>
                                    </View> : null
                            }

                            <TextInput
                                placeholder="Title"
                                style={{
                                    marginTop: 20, marginLeft: 20, fontWeight: 'bold', fontSize: 23,
                                    color: this.state.editable ? 'black' : 'black'
                                }}
                                multiline={true}
                                onChangeText={txt => this.setState({ t: txt })}
                                value={this.state.t}
                                editable={this.state.editable}
                            />
                            {/* <Text style={{ marginTop: 20, marginLeft: 20, fontWeight: 'bold', fontSize: 23 }}>{this.state.t}</Text> */}
                            <View style={{ borderWidth: 1, borderColor: Colors.grayCCC, marginTop: 5 }} />
                            <TextInput
                                placeholder="Decription"
                                style={{
                                    margin: 23, fontSize: 18, color: this.state.editable ? 'black' : 'black'

                                }}
                                multiline={true}
                                onChangeText={txt => this.setState({ d: txt })}
                                value={this.state.d}
                                editable={this.state.editable}
                            />
                            {/* <Text style={{ margin: 23, fontSize: 18, }}>{this.state.d}</Text> */}
                            {
                                this.state.saveButton ? (

                                    <View style={{ alignItems: 'center' }}>
                                        <TouchableOpacity
                                            style={styles.submitButton}
                                            onPress={() => this.saveEdit()}><Text style={styles.submitText}> Save </Text>
                                        </TouchableOpacity>
                                    </View>
                                ) : (
                                    <View >

                                    </View>
                                )
                            }
                        </ScrollView>
                    </View>

                </Modal>


                <View style={{
                    position: 'absolute',
                    alignItems: 'center',
                    justifyContent: 'center',
                    right: 30,
                    bottom: 30,
                }}>
                    <TouchableOpacity onPress={() => this.setModalVisible(true)}>
                        <Image
                            source={Images.add_icon}
                            style={{

                            }} />
                    </TouchableOpacity>
                </View>
            </View>

        )

    }
}
const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'flex-start',
        backgroundColor: Colors.backgroundscreencolor
    },
    textInputStyle: {
        color: COLORS.black,
        width: 300,
        borderRadius: 10,
        backgroundColor: COLORS.graye8,
        // borderBottomWidth: 1.2,
        // borderBottomColor: COLORS.black,
        height: (Platform.OS === 'ios' ? 40 : 50)
    },
    loginText: {
        color: Colors.black,
        fontSize: 24,
        marginTop: 32,
        textAlign: 'left',
        marginLeft: 20,
        alignItems: 'flex-start'
    },
    forgotPasswordText: {
        color: Colors.primary,
        fontSize: 18,
        alignItems: 'flex-end',
        textAlign: 'right',
        marginTop: 5
    },
    loginButton: {
        backgroundColor: Colors.primary,
        marginTop: 20,
        borderRadius: 8,
        justifyContent: 'center',
        textAlign: 'center',
        alignItems: 'center'
    },
    logText: {
        color: "#fff",
        justifyContent: 'center',
        textAlign: 'center',
        paddingTop: 5,
        paddingBottom: 5,
        paddingLeft: 20,
        paddingRight: 20,
        alignItems: 'center'
    },
    signupText: {
        color: Colors.primary,
        fontSize: 18,
        textAlign: 'center',
        marginLeft: 50,
        marginTop: 5,
    },
    submitButton: {
        backgroundColor: Colors.primary,
        marginTop: 30,
        borderRadius: 8,
        // marginLeft: 200
        width: width / 3,
        justifyContent: 'center',
        textAlign: 'center',
        alignItems: 'center'
    },
    submitText: {
        color: "#fff",
        paddingRight: 20,
        paddingLeft: 20,
        paddingTop: 5,
        fontSize: 18,
        paddingBottom: 5,
        // justifyContent: 'center',
        textAlign: 'center',
        // alignItems: 'center'
    },
})
export default connect(mapStateToProps, mapDispatchToProps)(ToDoList);
