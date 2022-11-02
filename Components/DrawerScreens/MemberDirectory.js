import React, { Component } from 'react';
import { View, Text, StyleSheet, TextInput, TouchableOpacity } from 'react-native';
import Colors from '../../Assets/Colors';
import { Header } from '../CusComponent';
import SectionedMultiSelect from 'react-native-sectioned-multi-select';
import Toast from 'react-native-simple-toast';
import Icon from 'react-native-vector-icons/MaterialIcons';
import { axiosPost } from '../../utility/apiConnection';
import { connect } from 'react-redux';
import { mapDispatchToProps, mapStateToProps } from '../../Reducers/ApiClass';

class MemberDirectory extends Component {
    constructor(props) {
        super(props);
        this.state = {
            selectedItems: '',
            data: null,
            MID: '',
            Name: '',
            Surname: '',
            FatherName: '',
            Mob: '',
            City: '',
            Anchal: '',

        };
    }
    async componentDidMount() {
        const params = {
            "parameter": "",
            "parameter1": "",
            "pageSize": "1000",
            "page": "1",
            "sortColumn": "br.branch_id"
        }
        try {
            let response = await axiosPost("Branch/List", params);
            console.log(response);

            var branchTitle = []
            response.forEach(element => {
                branchTitle.push({ name: element.branchTitle, id: element.branchId })
            });
            this.setState({ data: branchTitle })
            console.log(this.state.data);

        } catch (error) {
            console.log(error);
        }
    }
    onSelectedItemsChange = async (value) => {
        var id = ''
        await this.state.data.filter(e => {
            if (e.name == value) {
                id = e.id
            }
        })

        this.setState({ selectedItems: value, Anchal: id });
        console.log("Selcted Item:-", id);
    };
    async searchData() {
        var params = {
            MID: this.state.MID,
            Name: this.state.Name,
            Surname: this.state.Surname,
            FatherName: this.state.FatherName,
            Mob: this.state.Mob,
            City: this.state.City,
            Anchal: this.state.Anchal,
        }
        if (params.MID != '' || params.Name != '' || params.Surname != '' || params.FatherName != '' || params.Mob != '' || params.City != '' || params.Anchal != '') {
            await this.props.MemberDetails(params);
            // console.log(this.props.MemberDetailss);
            this.props.navigation.navigate('MemberDirectoryList');
            this.setState({
                MID: '',
                Name: '',
                Surname: '',
                FatherName: '',
                Mob: '',
                City: '',
                Anchal: '',
                selectedItems:''
            })

        }
        else {
            // console.log("Failed");
            Toast.show("Please Select at list one Field  ")
        }
    }
    render() {
        return (
            <View style={{ flex: 1 }}>
                <Header title={"Member Directory"} navigation={this.props.navigation} />
                <View style={{ marginLeft: 20, marginRight: 20 }}>

                    <View style={styles.otpView}>
                        <TextInput
                            style={{
                                flex: 1, fontSize: 18, color: Colors.primary, marginTop: 20
                            }}
                            onChangeText={(txt) => this.setState({ MID: txt })}
                            value={this.state.MID}
                            underlineColorAndroid="transparent"
                            placeholder={"MID"}
                            keyboardType={'phone-pad'}
                            placeholderTextColor={Colors.primary}
                        />
                    </View>
                    <View style={styles.otpView}>
                        <TextInput
                            style={{
                                flex: 1, fontSize: 18, color: Colors.primary, marginTop: 20
                            }}
                            onChangeText={(txt) => this.setState({ Name: txt })}
                            value={this.state.Name}
                            underlineColorAndroid="transparent"
                            placeholder={"Name"}
                            placeholderTextColor={Colors.primary}
                        />
                    </View>
                    <View style={styles.otpView}>
                        <TextInput
                            style={{
                                flex: 1, fontSize: 18, color: Colors.primary, marginTop: 20
                            }}
                            onChangeText={(txt) => this.setState({ Surname: txt })}
                            value={this.state.Surname}
                            underlineColorAndroid="transparent"
                            placeholder={"Surname"}
                            placeholderTextColor={Colors.primary}
                        />
                    </View>
                    <View style={styles.otpView}>
                        <TextInput
                            style={{
                                flex: 1, fontSize: 18, color: Colors.primary, marginTop: 20
                            }}
                            onChangeText={(txt) => this.setState({ FatherName: txt })}
                            value={this.state.FatherName}
                            underlineColorAndroid="transparent"
                            placeholder={"Father Name"}
                            placeholderTextColor={Colors.primary}
                        />
                    </View>
                    <View style={styles.otpView}>
                        <TextInput
                            style={{
                                flex: 1, fontSize: 18, color: Colors.primary, marginTop: 20
                            }}
                            onChangeText={(txt) => this.setState({ Mob: txt })}
                            value={this.state.Mob}
                            underlineColorAndroid="transparent"
                            placeholder={"Mobile No"}
                            keyboardType={'phone-pad'}
                            maxLength={10}
                            placeholderTextColor={Colors.primary}
                        />
                    </View>
                    <View style={styles.otpView}>
                        <TextInput
                            style={{
                                flex: 1, fontSize: 18, color: Colors.primary, marginTop: 20
                            }}
                            onChangeText={(txt) => this.setState({ City: txt })}
                            value={this.state.City}
                            underlineColorAndroid="transparent"
                            placeholder={"City"}
                            placeholderTextColor={Colors.primary}
                        />
                    </View>
                </View>
                <View style={{ marginLeft: 12, marginTop: 17 }}>
                    <SectionedMultiSelect
                        styles={{
                            chipText: {
                                color: Colors.primary,
                                backgroundColor: Colors.primary,
                                textDecorationColor: Colors.primary,
                                textShadowColor: Colors.primary


                            },
                            itemText: {
                                color: Colors.primary,
                                textShadowColor: Colors.primary,
                                textDecorationColor: Colors.primary,

                            },
                            selectedItemText: {
                                // color: 'blue',

                            },
                            subItemText: {
                                color: Colors.primary,

                            },
                            confirmText: {
                                backgroundColor: Colors.primary,
                                color: Colors.primary,
                                textDecorationColor: Colors.primary,
                                textShadowColor: Colors.primary

                            },
                            item: {
                                paddingHorizontal: 10,
                                textDecorationColor: Colors.primary,
                                textShadowColor: Colors.primary

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
                                color: Colors.primary,
                                fontSize: 18
                            },
                            scrollView: { paddingHorizontal: 0 }
                        }}
                        colors={{
                            // text:'#FF5733',
                            // primary:'#FF5733',
                            // success:'#FF5733',
                            // subText:'#FF5733',
                            searchPlaceholderTextColor: Colors.primary,
                            searchSelectionColor: Colors.primary,
                            // itemBackground:'#FF5733',
                            // chipColor:'#FF5733',
                            // selectToggleTextColor:'#FF5733',
                        }}
                        items={this.state.data}
                        single={true}
                        IconRenderer={Icon}
                        uniqueKey="name"
                        searchPlaceholderText="Search Member"
                        // subKey="children"
                        selectText="Anchal"
                        showDropDowns={true}
                        // readOnlyHeadings={true}
                        onSelectedItemsChange={(value, id) => this.onSelectedItemsChange(value, id)}
                        selectedItems={this.state.selectedItems}
                        // confirmText={false}
                        hideConfirm={true}
                    />
                    <View style={{
                        borderBottomWidth: 1,
                        borderBottomColor: Colors.primary,
                        marginLeft: 10,
                        marginRight: 20,
                        alignItems: 'center'
                    }} />
                </View>

                <View style={{ alignItems: 'center' }}>
                    <TouchableOpacity
                        style={styles.submitButton}
                        onPress={() => this.searchData()}
                    ><Text style={styles.submitText}> Search </Text>
                    </TouchableOpacity>
                </View>

            </View>
        );
    }
}
const styles = StyleSheet.create({
    container: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: Colors.backgroundscreencolor
    },
    internalItems: {
        marginTop: 30,
        margin: 30,
    },
    listTitle: {
        fontSize: 13,
        color: Colors.primary
    },
    otpView: {
        flexDirection: 'row',
        borderBottomWidth: 1,
        borderBottomColor: Colors.primary,
        alignItems: 'center',
    },
    GrievancesTitle: {
        color: Colors.black,
        fontSize: 24,
        marginTop: 32,
        textAlign: 'left',
        marginLeft: 20,
        alignItems: 'flex-start'
    },
    cardView: {
        backgroundColor: Colors.white,
        borderRadius: 13,
        margin: 20,
        marginBottom: "30%"
    },
    GridViewInsideTextItemStyle: {

        color: "#ADADAD",
        fontSize: 10
        ,
        justifyContent: 'center',

    },
    submitButton: {
        backgroundColor: Colors.primary,
        marginTop: 30,
        borderRadius: 8,
        // justifyContent: 'center',
        // textAlign: 'center',
        // alignItems: 'center'
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
export default connect(mapStateToProps, mapDispatchToProps)(MemberDirectory);