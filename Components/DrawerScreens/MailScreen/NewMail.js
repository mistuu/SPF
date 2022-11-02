import React, { Component } from 'react';
import { View, BackHandler, Text, StyleSheet, Image, TextInput, Dimensions, TouchableOpacity, ScrollView, FlatList, Platform, SafeAreaView, StatusBar } from 'react-native';
import Colors from '../../../Assets/Colors';
import Images from '../../../Assets/Images';
import DocumentPickerHandle from 'react-native-document-picker';
import RNFS from 'react-native-fs';
import { axiosAuthGet, axiosPost } from '../../../utility/apiConnection';
import { getItem } from '../../../utility/AsyncConfig';
import Toast from 'react-native-simple-toast';
import SectionedMultiSelect from 'react-native-sectioned-multi-select';
import Icon from 'react-native-vector-icons/MaterialIcons';
import { connect } from 'react-redux';
import { mapStateToProps } from '../../../Reducers/ApiClass';

const { width, height } = Dimensions.get('window');

class NewMail extends Component {
    constructor(props) {
        super(props);
        this.handleBackButtonClick = this.handleBackButtonClick.bind(this)

        this.state = {
            from: '',
            to: '',
            subject: '',
            message: '',
            cc: '',
            bcc: '',
            x: [],
            size: [],
            selectedStateItems: [],
            data1: null,
            selectedCCItems: [],
            selectedBCCItem: [],
            displayImg: null,
            AllMemberList: null,
            mailId: '',
            newMail: '',
        };
    }
    async componentDidMount() {
        BackHandler.addEventListener('hardwareBackPress', this.handleBackButtonClick);
        console.log("New Mail=", this.props.inboxmailId);
        if (this.props.inboxmailId != null) {
            this.setState({ mailId: this.props.inboxmailId.mailId, newMail: this.props.inboxmailId })
        }
        if (this.props.inboxmailId.type == 5) {

            var values;
            await getItem('LoginDetails').then((data) => {
                values = data.memberId;
                this.setState({ id: values })
                // console.log("Member id:", data.memberId);
            })
            try {
                let draftresponse = await axiosAuthGet("Inbox/GetViewEmail/" + this.props.inboxmailId.mailId + "/" + "1" + "/" + values)
                console.log("drafty=", draftresponse);
                this.setState({ subject: draftresponse.subject, message: draftresponse.message })
                draftresponse.viewemail.forEach(element => {
                    if (element.bcc == 1) {
                        this.state.selectedBCCItem.push(element.emailAddress)

                    }
                    else if (element.cc == 1) {
                        this.state.selectedCCItems.push(element.emailAddress)

                    } else {

                        this.state.selectedStateItems.push(element.emailAddress)
                    }
                }); // this.setState({x:draftresponse.attachment})
            } catch (error) {

            }
        }

        // var draftMail=this.props.inboxmailId;
        // this.setState({subject:draftMail.subject,message:draftMail.message})

        try {
            const params = {
                "parameter": "",
                "parameter1": "",
                "pageSize": "100",
                "page": "1",
                "sortColumn": "u.member_spfid desc"

            }
            let res = await axiosPost("Member/MembersList", params)
            var data = []
            var allMem = []
            await res.data.filter(val => {
                if (val.spfemailid != null) {
                    data.push({ id: val.member_id, name: val.spfemailid })
                    allMem.push({ emailaddress: val.spfemailid, id: val.member_id })
                }
            })
            this.setState({ data1: data, AllMemberList: allMem })
            console.log(this.state.data1);
            console.log(districtItems);
        } catch (error) {

        }
        var date = new Date()
        console.log(date);
        this.setState({ date: date })
    }
    componentWillUnmount() {
        BackHandler.removeEventListener('hardwareBackPress', this.handleBackButtonClick);

    }
    async handleBackButtonClick() {
        console.log(this.state.x);
        if (this.state.mailId != null) {
            var values;
            var newTo = [];
            var newCC = [];
            var newBCC = [];

            await this.state.AllMemberList.filter(val => {
                this.state.selectedStateItems.filter(v => {
                    if (v == val.emailaddress) {
                        newTo.push(val)
                    }

                })
            })
            await this.state.AllMemberList.filter(val => {
                this.state.selectedCCItems.filter(v => {
                    if (v == val.emailaddress) {
                        newCC.push(val)
                    }

                })
            })
            await this.state.AllMemberList.filter(val => {
                this.state.selectedBCCItem.filter(v => {
                    if (v == val.emailaddress) {
                        newBCC.push(val)
                    }

                })
            })
            console.log("New To", newTo);

            await getItem('LoginDetails').then((data) => {
                values = data.memberId;
                this.setState({ id: values })
                // console.log("Member id:", data.memberId);
            })

            try {
                var status = true;

                var email = []
                var id = []
                var CCEmail = []
                var BCCEmail = []
                newTo.forEach(element => {
                    email.push({ emailaddress: element.emailaddress })
                    id.push({ id: element.id })

                });
                newCC.forEach(element => {
                    CCEmail.push({ cc: element.emailaddress })
                    id.push({ id: element.id })

                });
                newBCC.forEach(element => {
                    BCCEmail.push({ bcc: element.emailaddress })
                    id.push({ id: element.id })

                });
                console.log(email);
                console.log(CCEmail);
                console.log(BCCEmail);
                console.log(id);
                console.log(this.state.attachment);
                if (email.length != 0) {
                    if (status == true) {
                        var formdata = new FormData()
                        this.state.x.forEach(element => {
                            formdata.append("Attachment", element)
                        });
                        console.log("Formdata=", formdata);
                        formdata.append("mailId", 0)
                        formdata.append("senderId", JSON.stringify(values))
                        formdata.append("sendTo", JSON.stringify(email))
                        formdata.append("subject", this.state.subject)
                        formdata.append("message", this.state.message)
                        // formdata.append("cc", JSON.stringify(CCEmail))
                        // formdata.append("bcc", JSON.stringify(BCCEmail))
                        formdata.append("sendCC", JSON.stringify(CCEmail))
                        formdata.append("sendBCC", JSON.stringify(BCCEmail))
                        formdata.append("sendToId", JSON.stringify(id))
                        formdata.append('draft', 1)
                        // console.log("Form Data===",formdata);
                        let response1 = await axiosPost("Inbox/SendMessage/", formdata)
                        console.log("New Mail Response:-", response1);
                        if (response1.responseCodes == 200) {
                            let response2 = await axiosPost("Inbox/ReceivedMessage/", formdata)
                            console.log("New Mail Response:-", response2);
                            Toast.show(response1.message);
                            this.props.navigation.goBack("Inbox")
                        }
                    }
                    else {
                        Toast.show("Member Not Found")
                    }

                }
                else {
                    // Toast.show("To Field is Required")

                }

            } catch (error) {

            }
        }


        this.props.navigation.goBack()
        return true;
    }
    formatBytes(bytes) {
        var kb = 1024;
        var ndx = Math.floor(Math.log(bytes) / Math.log(kb));
        var fileSizeTypes = ["bytes", "kb", "mb", "gb", "tb", "pb", "eb", "zb", "yb"];

        return {
            size: +(bytes / kb / kb).toFixed(2),
            type: fileSizeTypes[ndx]
        };
    }
    selectFile = async () => {
        try {
            var res = await DocumentPickerHandle.pickMultiple({
                type: [DocumentPickerHandle.types.allFiles],
            });
            console.log(res);
            // var size = [];

            res.filter(async (e) => {
                await this.state.size.push(this.formatBytes(e.size))

            })
            var s = await this.state.size.reduce((a, b) =>
                a = a + b.size, 0
            )
            if (s <= 5.00) {
                res.filter(async (e) => {
                    Toast.show("File Uploaded.")
                    if (Platform.OS == 'ios') {
                        var data = await RNFS.readFile(e.uri, 'base64').then(ress => { return ress });
                        var s = [];
                        s.push({ res: "data:" + e.type + ";base64," + data })

                        // this.state.displayImg.push(s)
                        this.setState({ displayImg: s })
                        //  console.log(this.state.displayImg);
                        this.state.x.push({ uri: e.uri, type: e.type, name: e.name })

                        // var s = this.formatBytes(res.size)
                        // this.state.x.push({ File: { name: res.name, size: res.size, type: res.type } })
                        console.log(this.state.x);
                    } else {
                        var data = await RNFS.readFile("file://" + e.uri, 'base64').then(ress => { return ress });
                        var s = [];
                        s.push({ res: "data:" + e.type + ";base64," + data })

                        // this.state.displayImg.push(s)
                        this.setState({ displayImg: s })
                        //  console.log(this.state.displayImg);
                        this.state.x.push({ uri: e.uri, type: e.type, name: e.name })

                        // var s = this.formatBytes(res.size)
                        // this.state.x.push({ File: { name: res.name, size: res.size, type: res.type } })
                        console.log(this.state.x);
                    }
                    // var data = await RNFS.readFile("file://" + e.uri, 'base64').then(ress => { return ress });
                    // var s = [];
                    // s.push({ res: "data:" + e.type + ";base64," + data })

                    // // this.state.displayImg.push(s)
                    // this.setState({ displayImg: s })
                    // //  console.log(this.state.displayImg);
                    // this.state.x.push({ uri: e.uri, type: e.type, name: e.name })

                    // // var s = this.formatBytes(res.size)
                    // // this.state.x.push({ File: { name: res.name, size: res.size, type: res.type } })
                    // console.log(this.state.x);
                })
            }
            else {
                Toast.show("File Size must be less than 5 mb.")

            }
            console.log(s);


        } catch (error) {
            console.log(error);
        }
    }
    async SendData() {
        console.log(this.state.x);
        var values;
        var newTo = [];
        var newCC = [];
        var newBCC = [];

        await this.state.AllMemberList.filter(val => {
            this.state.selectedStateItems.filter(v => {
                if (v == val.emailaddress) {
                    newTo.push(val)
                }

            })
        })
        await this.state.AllMemberList.filter(val => {
            this.state.selectedCCItems.filter(v => {
                if (v == val.emailaddress) {
                    newCC.push(val)
                }

            })
        })
        await this.state.AllMemberList.filter(val => {
            this.state.selectedBCCItem.filter(v => {
                if (v == val.emailaddress) {
                    newBCC.push(val)
                }

            })
        })
        console.log("New To", newTo);

        await getItem('LoginDetails').then((data) => {
            values = data.memberId;
            this.setState({ id: values })
            // console.log("Member id:", data.memberId);
        })
        // console.log("Member id:", values);

        var params = {
            "parameter": "and spfemailid LIKE \"%" + this.state.to + "%\"",
            "parameter1": "",
            "pageSize": "100",
            "page": "1",
            "sortColumn": "u.member_spfid desc"
        }

        try {
            let response = await axiosPost("Member/MembersList", params)
            // console.log(response.data);
            var data = [];
            var sendToId = [];
            var status = true;
            // response.data.forEach(element => {
            //     if (element.spfemailid == this.state.to) {
            //         data.push({ emailaddress: element.spfemailid })
            //         sendToId.push({ id: element.member_id })
            //         status = true
            //     }

            // });

            var email = []
            var id = []
            var CCEmail = []
            var BCCEmail = []
            newTo.forEach(element => {
                email.push({ emailaddress: element.emailaddress })
                id.push({ id: element.id })

            });
            newCC.forEach(element => {
                CCEmail.push({ cc: element.emailaddress })
                id.push({ id: element.id })

            });
            newBCC.forEach(element => {
                BCCEmail.push({ bcc: element.emailaddress })
                id.push({ id: element.id })

            });
            console.log(email);
            console.log(CCEmail);
            console.log(BCCEmail);
            console.log(id);
            console.log(this.state.attachment);
            if (email.length != 0) {
                if (status == true) {
                    var formdata = new FormData()
                    this.state.x.forEach(element => {
                        formdata.append("Attachment", element)
                    });
                    console.log("Formdata=", formdata);
                    formdata.append("mailId", 0)
                    formdata.append("senderId", JSON.stringify(values))
                    formdata.append("sendTo", JSON.stringify(email))
                    formdata.append("subject", this.state.subject)
                    formdata.append("message", this.state.message)
                    // formdata.append("cc", JSON.stringify(CCEmail))
                    // formdata.append("bcc", JSON.stringify(BCCEmail))
                    formdata.append("sendCC", JSON.stringify(CCEmail))
                    formdata.append("sendBCC", JSON.stringify(BCCEmail))
                    formdata.append("sendToId", JSON.stringify(id))
                    formdata.append('draft', 0)
                    // console.log("Form Data===",formdata);
                    let response1 = await axiosPost("Inbox/SendMessage/", formdata)
                    console.log("New Mail Response:-", response1);
                    if (response1.responseCodes == 200) {
                        let response2 = await axiosPost("Inbox/ReceivedMessage/", formdata)
                        console.log("New Mail Response:-", response2);
                        Toast.show(response1.message);
                        this.props.navigation.goBack("Inbox")
                    }
                }
                else {
                    Toast.show("Member Not Found")
                }

            }
            else {
                Toast.show("To Field is Required")

            }

        } catch (error) {

        }

        // "Attachment": JSON.stringify(this.state.x),

    }
    onStateSelectedItemsChange = async (value, index) => {
        this.setState({ selectedStateItems: value });
        var x = [];
        // await this.state.data1.filter(e =>
        //     value.filter(v => (
        //        if(e.name !== v){

        //        } 
        //     )))
        // this.setState({ data1: this.state.data1 })
        console.log("Selcted Item:-", value);

    };
    onCCSelectedItemsChange = (value, index) => {
        // this.state.data1 = this.state.selectedStateItems.filter(e => e.name !== value)
        // this.setState({ data1: this.state.data1 })
        this.setState({ selectedCCItems: value });

        console.log("Selcted Item:-", value);


    };
    onBCCSelectedItemsChange = (value, index) => {
        this.setState({ selectedBCCItem: value });
        console.log("Selcted Item:-", value);

    };
    render() {
        return (
            <View style={{ flex: 1, }}>


                <SafeAreaView style={{ paddingTop: Platform.OS === "android" ? StatusBar.currentHeight : 0, backgroundColor: Colors.primary, flexDirection: 'row', width: '100%', height: "10%", justifyContent: 'flex-start', alignItems: 'center' }}>
                    <TouchableOpacity onPress={() => this.handleBackButtonClick()} style={{ marginTop: 10, alignItems: 'flex-start', marginLeft: 10 }}>
                        <Image source={Images.back}
                            style={{ height: 15, width: 22, tintColor: 'white', alignSelf: 'center' }} />
                    </TouchableOpacity>
                    <Text style={{ fontSize: 18, fontWeight: 'bold', color: Colors.white, marginLeft: 20, marginTop: 10 }}>New Mail</Text>
                    <TouchableOpacity
                        onPress={() => this.selectFile()}
                        style={{ marginLeft: 'auto' }}>
                        <Image
                            source={Images.pin}
                            style={{ marginRight: 20, tintColor: Colors.white }} />
                    </TouchableOpacity>
                    <TouchableOpacity
                        onPress={() => this.SendData()}
                        style={{ marginRight: 20 }}>
                        <Image

                            source={Images.send_icon}
                            style={{ marginLeft: 'auto', tintColor: Colors.white }}
                        />
                    </TouchableOpacity>
                </SafeAreaView>
                <ScrollView>
                    <View style={{ marginBottom: 20 }}>
                        {
                            this.state.data1 != null ?
                                (
                                    <View style={{ marginBottom: 20 }}>
                                        <View style={styles.to}>

                                            <SectionedMultiSelect
                                                // styles={search}
                                                // colors={sColor}
                                                items={this.state.data1}
                                                // single={true}
                                                searchPlaceholderText="Search"
                                                IconRenderer={Icon}
                                                uniqueKey="name"
                                                // subKey="id"
                                                selectText="To"
                                                showDropDowns={true}
                                                // readOnlyHeadings={true}
                                                onSelectedItemsChange={(value, index) => this.onStateSelectedItemsChange(value, index)}
                                                selectedItems={this.state.selectedStateItems}
                                                confirmText={"Select"}
                                            // hideConfirm={true}
                                            />
                                        </View>
                                        <View style={styles.to}>

                                            <SectionedMultiSelect
                                                // styles={search}
                                                // colors={sColor}
                                                items={this.state.data1}
                                                // single={true}
                                                searchPlaceholderText="Search"
                                                IconRenderer={Icon}
                                                uniqueKey="name"
                                                // subKey="id"
                                                selectText="CC"
                                                showDropDowns={true}
                                                // readOnlyHeadings={true}
                                                onSelectedItemsChange={(value, index) => this.onCCSelectedItemsChange(value, index)}
                                                selectedItems={this.state.selectedCCItems}
                                                confirmText={"Select"}
                                            // hideConfirm={true}
                                            />
                                        </View>
                                        <View style={styles.to}>

                                            <SectionedMultiSelect
                                                // styles={search}
                                                // colors={sColor}
                                                items={this.state.data1}
                                                // single={true}
                                                searchPlaceholderText="Search"
                                                IconRenderer={Icon}
                                                uniqueKey="name"
                                                // subKey="id"
                                                selectText="BCC"
                                                showDropDowns={true}
                                                // readOnlyHeadings={true}
                                                onSelectedItemsChange={(value, index) => this.onBCCSelectedItemsChange(value, index)}
                                                selectedItems={this.state.selectedBCCItem}
                                                confirmText={"Select"}
                                            // hideConfirm={true}
                                            />
                                        </View>
                                        <View style={styles.otpView}>
                                            <TextInput
                                                placeholder="Subject"
                                                placeholderTextColor={Colors.black}
                                                onChangeText={txt => this.setState({ subject: txt })}
                                                value={this.state.subject}
                                                style={{ fontSize: 18, color: Colors.black }}
                                            />
                                        </View>
                                        <View style={styles.messageView}>
                                            <TextInput
                                                placeholder="Message"
                                                placeholderTextColor={Colors.black}
                                                onChangeText={txt => this.setState({ message: txt })}
                                                value={this.state.message}
                                                multiline={true}
                                                style={{ fontSize: 18, color: Colors.black }}
                                            />
                                        </View>
                                    </View>
                                ) : null
                        }



                        <View style={{ marginLeft: 10 }}>
                            {console.log("Pin Data===", this.state?.x)}
                            <FlatList

                                // style={{ margin: 10, }}
                                data={this.state?.x}
                                renderItem={({ item }) =>
                                    <View>
                                        <View style={{ flexDirection: 'row', alignItems: 'center', marginTop: 30, marginLeft: 13 }}>
                                            <Image
                                                source={Images.pinGray}
                                                style={{ height: 35, width: 35 }} />
                                            <View style={{ marginLeft: 10, }}>
                                                <Text>{item.name}</Text>
                                            </View>
                                            {/* <Image
                                                source={Images.verticaldots}
                                                style={{}} /> */}
                                        </View>
                                    </View>
                                }
                                numColumns={1}
                                keyExtractor={item => item.No}
                                onEndReachedThreshold={0}
                            />
                        </View>
                    </View>
                </ScrollView>
                {/* <Text style={{ marginTop: 20, margin: 20, fontSize: 18 }}>Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.</Text> */}
            </View>
        );
    }
}
const sColor = {

    // text:'#FF5733',
    // primary:'#FF5733',
    // success:'#FF5733',
    // subText:'#FF5733',
    searchPlaceholderTextColor: '#FF5733',
    searchSelectionColor: '#FF5733',
    // itemBackground:'#FF5733',
    // chipColor:'#FF5733',
    // selectToggleTextColor:'#FF5733',
}
const search = {
    confirmText: {
        color: '#fff',
    },
    chipText: {
        color: '#FF5733',
        backgroundColor: '#FF5733',
        textDecorationColor: '#FF5733',
        textShadowColor: '#FF5733'


    },
    itemText: {
        color: '#FF5733',
        textShadowColor: '#FF5733',
        textDecorationColor: '#FF5733',

    },
    selectedItemText: {
        // color: 'blue',

    },
    subItemText: {
        color: '#FF5733',

    },
    confirmText: {
        backgroundColor: '#FF5733',
        color: '#FF5733',
        textDecorationColor: '#FF5733',
        textShadowColor: '#FF5733'

    },
    item: {
        paddingHorizontal: 10,
        textDecorationColor: '#FF5733',
        textShadowColor: '#FF5733'

    },
    subItem: {
        paddingHorizontal: 10
    },
    selectedItem: {
        // backgroundColor: '#FF5733'
    },
    selectedSubItem: {
        // backgroundColor: '#FF5733'
    },
    selectedSubItemText: {
        // color: 'blue',
    },

    selectToggleText: {
        color: '#FF5733',
        fontSize: 15
    },
    scrollView: { paddingHorizontal: 0 }
}
const styles = StyleSheet.create({
    otpView: {
        flexDirection: 'row',
        borderWidth: 1,
        height: "10%",
        paddingLeft: "2%",
        borderColor: '#C4C4C4',
        alignItems: 'center',
        margin: 13,
    },
    to: {
        borderWidth: 1,
        borderColor: '#C4C4C4',
        // alignItems: 'center',
        margin: 13,
    },
    messageView: {
        flexDirection: 'row',
        borderWidth: 1,
        height: "10%",
        paddingLeft: "2%",
        borderColor: '#C4C4C4',
        alignItems: 'center',
        margin: 13,
    },
})
export default connect(mapStateToProps)(NewMail)