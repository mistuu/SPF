import { CheckBox, Separator } from 'native-base';
import React, { Component } from 'react';
import { View, Text, Alert, Image, StyleSheet, Dimensions, FlatList, TouchableOpacity, TextInput, } from 'react-native';
import Colors from '../../Assets/Colors';
import Images from '../../Assets/Images';
import { Header } from '../CusComponent';
import { Dialog } from 'react-native-simple-dialogs';
import DropDownPicker from 'react-native-dropdown-picker';
import { Picker } from '@react-native-picker/picker';
import { Icon } from 'react-native-vector-icons/MaterialCommunityIcons';
import Modal from 'react-native-modal';
import { axiosAuthGet, axiosPost } from '../../utility/apiConnection';
import { getItem } from '../../utility/AsyncConfig';
import { connect } from 'react-redux';
import { mapDispatchToProps, mapStateToProps } from '../../Reducers/ApiClass';
import moment from 'moment';
import Toast from 'react-native-simple-toast'
const { width, height } = Dimensions.get('window');

class Inbox extends Component {
    constructor(props) {
        super(props);
        this.state = {
            modalVisible: false,
            mailMenu: '',
            mailMenuList: [{ value: 1, label: 'All Mail' },
            { value: 2, label: 'Sent' },
            { value: 3, label: 'Inbox' },
            { value: 4, label: 'Drafts' },
            { value: 5, label: 'SPF Email Directory' }],
            data: null,
            sentMessages: null,
            AllMessage: null,
            data1: null,
            mailId: '',
            searchMail: '',
            defaultValue: null,
            draftMails: null,
            directory: false,
            AllMember: null,
        };
    }
    async componentDidMount() {
        this.LoadData();
        this.willFocusSubscription = this.props.navigation.addListener(
            'focus',
            () => {
                this.LoadData();
                this.setState({ mailMenu: '' })
            }
        );

    }
    LoadData = async () => {
        const p = {
            "parameter": "",
            "parameter1": "",
            "pageSize": "100",
            "page": "1",
            "sortColumn": "u.member_spfid desc"

        }
        let res = await axiosPost("Member/MembersList", p)
        var memList = [];
        await res.data.filter(e => {
            if (e.spfemailid != null) {
                memList.push({ name: e.first_name, email: e.spfemailid })
            }
        })
        this.setState({ AllMember: memList })
        console.log(memList);
        var values;
        await getItem('LoginDetails').then((data) => {
            values = data.memberId;
            this.setState({ id: values })
            // console.log("Member id:", data.memberId);
        })
        // console.log("Member id:", values);

        //inbox Messages
        const params = {

            "parameter": " and (s.toid = " + values + " or s.cc = " + values + " or s.bcc = " + values + ")",
            "parameter1": values.toString(),
            "pageSize": "100",
            "page": "1",
            "sortColumn": "m.mailid desc"

        }
        try {

            let response = await axiosPost('Inbox/GetInboxList', params);
            var x = [];
            await response.filter(e => {
                e.type = 2
                x.push(e)
            })
            this.setState({ data: x })
            // console.log(x);

        } catch (error) {
            // console.log(error);
        }

        //sent messages

        try {
            const params1 = {
                "parameter": "",
                "parameter1": values.toString(),
                "pageSize": "100",
                "page": "1",
                "sortColumn": "m.mailid desc"
            }
            let response1 = await axiosPost('Inbox/GetSentList', params1);
            var y = [];
            await response1.filter(e => {
                e.type = 1
                y.push(e)
            })
            this.setState({ sentMessages: y })
            // console.log(this.state.sentMessages);
        } catch (error) {
            console.log(error);
        }
        var d = [...this.state.data, ...this.state.sentMessages]
        var temp = d.sort(function (a, b) {
            return new Date(b.date) - new Date(a.date)
        })
        // console.log("filter data", d);
        this.setState({ data1: temp, defaultValue: [...this.state.data, ...this.state.sentMessages] })
        //Drafts mails
        try {
            const draftParams = {
                "parameter": values.toString(),
                "parameter1": "",
                "pageSize": "1000000",
                "page": "1",
                "sortColumn": "m.mailid desc"
            }
            let draft = await axiosPost("Inbox/GetDraftList", draftParams)
            this.setState({ draftMails: draft })
            // console.log("Draft mail==", draft);
        } catch (error) {

        }
    }
    updateUser = (mailMenu) => {
        console.log(mailMenu);
        var x = [...this.state.data, ...this.state.sentMessages]
        if (mailMenu.value == 1) {
            this.setState({ data1: x })
            this.setState({ mailMenu: mailMenu })
            this.setState({ directory: false })

        }
        else if (mailMenu.value == 2) {
            this.setState({ data1: this.state.sentMessages })
            this.setState({ mailMenu: mailMenu })
            this.setState({ directory: false })

        }
        else if (mailMenu.value == 3) {
            this.setState({ data1: this.state.data })
            this.setState({ mailMenu: mailMenu })
            this.setState({ directory: false })

        }
        else if (mailMenu.value == 4) {
            this.setState({ data1: this.state.draftMails })
            this.setState({ mailMenu: mailMenu })
            this.setState({ directory: false })

        }
        else if (mailMenu.value == 5) {
            this.setState({ directory: true })
        }
        // this.setState({ mailMenu: mailMenu })
    }
    remove_post_on_list = (deletePostId) => {
        this.setState({
            GridViewItems: this.state.GridViewItems.filter(item => item.No != deletePostId)
        })
    }
    setModalVisible = (visible) => {
        this.setState({ modalVisible: visible });
    }
    showDialog(visible) {
        this.setState({ dialogVisible: visible })
    }
    _ViewMail = (mailId, type) => {
        const viewMail = {
            mailId: mailId,
            type: type
        }
        console.log(viewMail);
        this.setState({ mailId: mailId })
        this.props.MailId(viewMail);
        // console.log("Process===", this.props.inboxmailId());

        this.props.navigation.navigate('ViewMail')

    }
    deleteMail = async (mailId) => {
        Alert.alert(
            "Are You Sure",
            "You want to Delete this Mail",
            [
                {
                    text: "Cancel",
                    onPress: () => console.log("Cancel Pressed"),
                    style: "cancel"
                },
                {
                    text: "OK", onPress: async () => {
                        var values;
                        await getItem('LoginDetails').then((data) => {
                            values = data.memberId;
                            this.setState({ id: values })
                            // console.log("Member id:", data.memberId);
                        })
                        try {
                            console.log(values + "===" + mailId);
                            let response = await axiosAuthGet("Inbox/DeleteInboxEmail/" + mailId + "/" + values)
                            console.log(response);
                            Toast.show(response.message)
                            this.setModalVisible(false);
                            this.LoadData();

                        } catch (error) {

                        }
                    }
                }
            ]
        );


    }
    searchableMail = async (searchMail) => {
        console.log(this.state.data1);

        this.setState({ searchMail: searchMail })
        if (searchMail.trim() != '') {
            let arry = await this.state.defaultValue.filter(item =>
                item.senderName.toLowerCase().match(searchMail.toLowerCase().trim()))
            this.setState({ data1: arry })
        } else this.setState({ data1: this.state.defaultValue })

    }
    navigateMail = (draft, mailId, type) => {
        const viewMail = {
            mailId: mailId,
            type: "5"
        }
        if (draft == 0) {
            this._ViewMail(mailId, type)
        }
        else {
            this.props.MailId(viewMail);
            this.props.navigation.navigate("NewMail")
        }
        console.log("daft=", draft);
    }
    navigationMail = () => {
        this.props.MailId("6");
        this.props.navigation.navigate('NewMail')
    }
    render() {
        const { modalVisible } = this.state;

        return (
            <View style={styles.container}>
                <Header title={"Inbox"} navigation={this.props.navigation} />
                {/* <Text style={styles.listTitle}> Inbox </Text> */}
                <View style={{
                    backgroundColor: Colors.white,
                    // marginTop:10
                    zIndex: 2000 
                }}>

                    <View style={{ flexDirection: 'row', alignItems: 'center',justifyContent:'center' }}>
                        <DropDownPicker
                            items={this.state.mailMenuList}
                            style={{}}
                            placeholder="Select Mail"
                            containerStyle={{ height: 40,width: width / 1.9, }}
                            onChangeItem={item => this.updateUser(item)}
                        />
                        {/* <Picker
                            style={{ width: width / 1.9, fontWeight: 'bold' }}
                            selectedValue={this.state.mailMenu} onValueChange={this.updateUser}>
                            <Picker.Item label="All Mail" value="1" />
                            <Picker.Item label="Sent" value="2" />
                            <Picker.Item label="Inbox" value="3" />
                            <Picker.Item label="Drafts" value="4" />
                            <Picker.Item label="SPF Email Directory" value="5" />

                        </Picker> */}
                        <View style={{ backgroundColor: Colors.primary, paddingBottom: 5, paddingTop: 5, paddingLeft: 20, paddingRight: 20, borderRadius: 8, }}>
                            <TouchableOpacity onPress={() => this.navigationMail()}>
                                <View style={{ flexDirection: 'row', alignItems: 'center' }}>


                                    <Text style={{ color: Colors.white }}>New Mail</Text>
                                    <Image
                                        source={Images.mail_icon}
                                        style={{ marginLeft: 10 }} />
                                </View>
                            </TouchableOpacity>

                        </View>
                    </View>
                    <View style={styles.searchView}>
                        <Image
                            source={Images.search} />
                        <TextInput
                            style={styles.textInput}
                            placeholder="Search Messages..."
                            onChangeText={(txt) => this.searchableMail(txt)}
                            value={this.state.searchMail}
                        />

                    </View>
                </View>
                {
                    this.state.directory != true ? (
                        <FlatList
                            style={{ margin: 10 }}
                            data={this.state.data1}

                            renderItem={({ item }) =>
                                <View style={{ backgroundColor: Colors.white, margin: 5, borderRadius: 8, padding: 10 }}>
                                    <TouchableOpacity onPress={() => this.navigateMail(item.draft, item.mailId, item.type)}>

                                        <View style={{ flexDirection: 'row' }}>
                                            <Text style={{ fontWeight: 'bold', width: width / 3 }}>{item.senderName}</Text>
                                            <Text style={{ marginLeft: 'auto', marginRight: 10 }}>{moment(item.date).format("DD-MM-YYYY")}</Text>
                                        </View>
                                        <Text style={{ marginTop: 10, fontWeight: 'bold' }}>{item.subject}</Text>
                                        <View style={{ flexDirection: 'row', marginTop: 5 }}>
                                            <Text numberOfLines={1} style={{ width: width / 1.5 }}>{item.message}</Text>
                                            <TouchableOpacity onPress={() => this.deleteMail(item.mailId)}
                                                style={{ marginLeft: 'auto', justifyContent: 'flex-end', alignItems: 'flex-end' }}>
                                                <Image
                                                    source={Images.delete_red}
                                                    style={{ height: 35, width: 35 }}
                                                />
                                            </TouchableOpacity>
                                        </View>
                                    </TouchableOpacity>
                                </View>
                            }
                            numColumns={1}
                            keyExtractor={item => item.No}
                        />
                    ) : (
                        <>
                            <View style={{ padding: 5, backgroundColor: Colors.white, alignItems: 'flex-start', justifyContent: 'center' }}>
                                <View style={{ marginLeft: 10, marginTop: 10, flexDirection: 'row', justifyContent: 'flex-start', alignItems: 'flex-start' }}>
                                    <Text style={{ fontSize: 18, width: Dimensions.get('window').width / 3.0, fontWeight: 'bold' }}>Member Name</Text>
                                    <Text style={{ fontSize: 18, width: Dimensions.get('window').width / 2.5, fontWeight: 'bold' }}>SPF Email ID</Text>
                                </View>
                            </View>
                            <FlatList
                                style={{}}
                                data={this.state.AllMember}

                                renderItem={({ item }) =>
                                    <View style={{ flex: 1, padding: 5, backgroundColor: Colors.white, alignItems: 'flex-start', justifyContent: 'center' }}>
                                        <View style={{ marginLeft: 10, marginTop: 10, flexDirection: 'row', justifyContent: 'flex-start', alignItems: 'flex-start' }}>
                                            <Text style={{ fontSize: 18, width: Dimensions.get('window').width / 3.0, }}>{item.name}</Text>
                                            <Text style={{ fontSize: 18, width: Dimensions.get('window').width / 2.0 }}>: {item.email}</Text>
                                        </View>
                                    </View>
                                }
                                numColumns={1}
                                keyExtractor={item => item.No}
                            />
                        </>
                    )
                }

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

                            <TouchableOpacity onPress={() => this.props.navigation.navigate('ViewMail')}>
                                <Text style={styles.Alert_Message}> View </Text>
                            </TouchableOpacity>

                            <View style={{ width: '80%', height: 1, backgroundColor: '#fff' }} />

                            <TouchableOpacity onPress={() => this.deleteMail()}>
                                <Text style={styles.Alert_Message}>Delete </Text>
                            </TouchableOpacity>



                        </View>

                    </View>


                </Modal>

            </View>
        );
    }
}
const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: Colors.backgroundscreencolor
    },
    searchView: {
        // zIndex: 2000 ,
        flexDirection: 'row',
        justifyContent: 'flex-start',
        alignItems: 'center',
        height:40,
        // backgroundColor: '#fff',fontSize: 15, fontWeight: 'bold'
        borderWidth: 0.5,
        margin: 15,
        paddingLeft: 10,
        borderRadius: 7,
        width: 340,
    },
    textInput: {
        paddingRight: 20,
        paddingLeft: 0,
        backgroundColor: '#fff',
        color: '#424242',
        fontSize: 14,
        marginLeft: 10
    },
    Alert_Main_View: {

        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: Colors.primary,
        height: Dimensions.get('window').height / 4,
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
        elevation: 5,

        //  padding:30,
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

})
export default connect(mapStateToProps, mapDispatchToProps)(Inbox);
