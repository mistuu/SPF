import React, { Component } from 'react';
import { View, Text, BackHandler, StyleSheet, Dimensions, TouchableOpacity, Image, ScrollView, FlatList, Linking, SafeAreaView, Platform, StatusBar } from 'react-native';
import { connect } from 'react-redux';
import Colors from '../../../Assets/Colors';
import Images from '../../../Assets/Images';
import { mapStateToProps, mapDispatchToProps } from '../../../Reducers/ApiClass';
import { axiosAuthGet } from '../../../utility/apiConnection';
import { getItem } from '../../../utility/AsyncConfig';
import Toast from 'react-native-simple-toast'
import { WebView } from 'react-native-webview';
import HTMLView from 'react-native-htmlview';
import { IMAGEURL } from '../../../utility/util'

const { width, height } = Dimensions.get('window');

class OtherProgramDescription extends Component {
    constructor(props) {
        super(props);
        this.handleBackButtonClick = this.handleBackButtonClick.bind(this)

        this.state = {
            data: null,
            imageHead: '',
            title: '',
            description: '',
            heading: '',
            content: null,
            document: null,
            doc: false,

        };
    }

    async componentDidMount() {
        BackHandler.addEventListener('hardwareBackPress', this.handleBackButtonClick);

        // console.log(this.props.programIdValue);
        try {
            var values;
            await getItem('LoginDetails').then((data) => {
                values = data.memberId;
                this.setState({ id: values })
                // console.log("Member id:", data.memberId);
            })
            console.log("Member id:", this.props.programIdValue);

            let response = await axiosAuthGet('Program/ProramDetailsList/' + this.props.programIdValue + "/" + values);

            this.setState({ data: response.data })
            console.log("Form", this.state.data);
            var formlist = null;
            var formConent = null;
            var document = null;
            await this.state.data.forEach(element => {
                formlist = element.programForm;
                formConent = element.content;
                document = element.documents;
                this.setState({ title: element.programDetailsTitle, description: element.programDetailsDescription, heading: element.title, imageHead: element.programDetailsImage })
            });

            console.log("Description=======", formConent);
            this.setState({ content: formConent })
            this.setState({ document: document })
            if (document.length != 0) {
                this.props.documentsDetails(document)
                this.setState({ doc: true })
            }
            console.log("Friend==", document.length);

            var formData = [];
            formlist.forEach(element => {
                formData.push({ programName: element.programFormName, ProgramId: element.programFormId });
            });
            this.props.programDetaisl(formData);
            // console.log(formData);
        } catch (error) {
            console.log(error);
        }

    }
    documentUi = () => {
        return (
            <View style={{ margin: 20 }}>
                <View style={styles.cardView}>
                    <Text style={{ color: Colors.white, fontSize: 18 }}>Yoga</Text>
                </View>
                <View style={{
                    backgroundColor: Colors.white,
                    borderBottomLeftRadius: 13,
                    borderBottomRightRadius: 13,
                    width: width / 1.1,
                    alignItems: 'center',
                }}>
                    <View style={{ flexDirection: 'row', margin: 10, }}
                    >
                        <TouchableOpacity onPress={() => this.props.navigation.navigate('document')}>
                            <View style={{ elevation: 5, backgroundColor: Colors.white, padding: 15, borderRadius: 13, justifyContent: 'center', alignItems: 'center' }}>
                                <Image
                                    source={Images.youtube}
                                    style={{ height: 50, width: 50, borderRadius: 8 }}
                                />
                            </View>
                        </TouchableOpacity>
                        <TouchableOpacity>
                            <View style={{ elevation: 5, marginLeft: 20, backgroundColor: Colors.white, padding: 15, borderRadius: 13, justifyContent: 'center', alignItems: 'center' }}>
                                <Image
                                    source={Images.song}
                                    style={{ height: 50, width: 50, }}
                                />
                            </View>
                        </TouchableOpacity>
                        <TouchableOpacity>
                            <View style={{ elevation: 5, marginLeft: 20, backgroundColor: Colors.white, padding: 15, borderRadius: 13, justifyContent: 'center', alignItems: 'center' }}>
                                <Image
                                    source={Images.lib}
                                    style={{ resizeMode: 'stretch', height: 50, width: 50 }}
                                />
                            </View>
                        </TouchableOpacity>
                    </View>
                </View>
            </View>
        )
    }
    componentWillUnmount() {
        BackHandler.removeEventListener('hardwareBackPress', this.handleBackButtonClick);

    }
    handleBackButtonClick() {
        this.props.navigation.goBack()
        return true;
    }
    reDirect = (url) => {
        Linking.openURL(url).catch(err => console.error("Couldn't load page", err));

    }
    render() {
        return (
            <View style={styles.container}>
                {/* <Text style={{ fontWeight: 'bold', margin: 10 }}> Other Program  </Text> */}
                <SafeAreaView style={{ paddingTop: Platform.OS === "android" ? StatusBar.currentHeight : 0, backgroundColor: Colors.primary, flexDirection: 'row', width: '100%', height: "10%", justifyContent: 'flex-start', alignItems: 'center' }}>
                    <TouchableOpacity onPress={() => this.handleBackButtonClick()} style={{ marginTop: 10, alignItems: 'flex-start', marginLeft: 10 }}>
                        <Image source={IMAGES.back}
                            style={{ height: 15, width: 22, tintColor: 'white', alignSelf: 'center' }} />
                    </TouchableOpacity>
                    <Text style={{ fontSize: 18, fontWeight: 'bold', color: Colors.white, marginLeft: 20, marginTop: 10 }}>{this.state.heading}</Text>
                </SafeAreaView>
                <View style={{ flex: 1, height: height / 2, alignItems: 'center', marginTop: 20, marginLeft: 20, marginRight: 20 }}>
                    <ScrollView contentContainerStyle={{ alignItems: 'center' }}>
                        <Image
                            source={{ uri: IMAGEURL + this.state.imageHead }}
                            style={{ width: width / 4.6, resizeMode: 'stretch', height: 90 }} />
                        <Text style={{ fontWeight: 'bold', fontSize: 24, marginTop: 10 }}>{this.state.title}</Text>
                        <HTMLView
                            value={this.state.description}
                        // stylesheet={htmlStyleSheet}
                        />
                        {/* <Text style={{ margin: 20 }}>{this.state.description}</Text> */}
                    </ScrollView>
                </View>
                <View style={{ height: height / 2, }}>
                    <ScrollView>
                        <View>
                            <FlatList
                                style={{ margin: 10 }}
                                data={this.state.content}

                                renderItem={({ item }) =>
                                    <View style={{ margin: 10 }}>
                                        <View style={styles.cardView}>
                                            <Text style={{ color: Colors.white, fontSize: 18 }}>{item.contentName}</Text>
                                        </View>

                                        <View style={{
                                            backgroundColor: Colors.white,
                                            borderBottomLeftRadius: 13,
                                            borderBottomRightRadius: 13,
                                            // width: width / 1.1,
                                            padding: 10,
                                            alignItems: 'center',
                                        }}>
                                            {/* <WebView
                                              originWhitelist={['*']}
                                              
                                              source={{html:item.contentDescription}} /> */}
                                            <HTMLView
                                                value={item.contentDescription}
                                            // stylesheet={htmlStyleSheet}
                                            />
                                            {
                                                item?.contentLink != '' ? (
                                                    <TouchableOpacity onPress={() => this.reDirect(item.contentLink)}>
                                                        <Text style={{ color: Colors.blue81 }}>Download</Text>
                                                    </TouchableOpacity>
                                                ) : null
                                            }
                                        </View>
                                    </View>
                                }
                                numColumns={1}
                                keyExtractor={item => item.programId}
                            />
                        </View>
                        {
                            console.log("doc==", this.state.doc),
                            this.state.doc === true &&
                            <View style={{ marginLeft: 20, marginRight: 20, marginBottom: 20 }}>
                                <TouchableOpacity
                                    onPress={() => this.props.navigation.navigate('document')}>
                                    <View style={styles.cardView}>
                                        <Text style={{ color: Colors.white, fontSize: 18 }}>Documents</Text>
                                    </View>
                                    <View style={{
                                        backgroundColor: Colors.white,
                                        borderBottomLeftRadius: 13,
                                        borderBottomRightRadius: 13,
                                        width: width / 1.1,
                                        alignItems: 'center',
                                    }}>
                                        <View style={{ flexDirection: 'row', margin: 10, }}
                                        >

                                            <View style={{ elevation: 5, backgroundColor: Colors.white, padding: 15, borderRadius: 13, justifyContent: 'center', alignItems: 'center' }}>
                                                <Image
                                                    source={Images.youtube}
                                                    style={{ height: 50, width: 50, borderRadius: 8 }}
                                                />
                                            </View>
                                            {/* </TouchableOpacity>
                                    <TouchableOpacity onPress={() => this.props.navigation.navigate('AudioScreen')}> */}
                                            <View style={{ elevation: 5, marginLeft: 20, backgroundColor: Colors.white, padding: 15, borderRadius: 13, justifyContent: 'center', alignItems: 'center' }}>
                                                <Image
                                                    source={Images.song}
                                                    style={{ height: 50, width: 50, }}
                                                />
                                            </View>
                                            {/* </TouchableOpacity>
                                    <TouchableOpacity onPress={() => this.props.navigation.navigate('BookScreen')}> */}
                                            <View style={{ elevation: 5, marginLeft: 20, backgroundColor: Colors.white, padding: 15, borderRadius: 13, justifyContent: 'center', alignItems: 'center' }}>
                                                <Image
                                                    source={Images.lib}
                                                    style={{ resizeMode: 'stretch', height: 50, width: 50 }}
                                                />
                                            </View>
                                        </View>
                                    </View>
                                </TouchableOpacity>
                            </View>
                        }


                    </ScrollView>

                </View>
                <View style={{
                    // flexDirection: 'row',
                    position: 'absolute',
                    alignItems: 'center',
                    justifyContent: 'center',
                    bottom: 30,
                    alignSelf: 'center',
                    alignContent: 'center'
                }}>
                    {/* <TouchableOpacity onPress={() => alert('Under Construction...')}>
                        <View style={{
                            // width: Dimensions.get('window').width / 2,
                            paddingLeft: 20,
                            paddingRight: 20,
                            paddingTop: 5,
                            borderRadius: 8,
                            paddingBottom: 5,
                            alignItems: 'center',
                            backgroundColor: Colors.primary,
                        }}><Text style={{ color: Colors.white }}>SOP</Text></View>
                    </TouchableOpacity> */}
                    <TouchableOpacity onPress={() => this.props.navigation.navigate('ApplicationForm')}>
                        <View style={{
                            // width: Dimensions.get('window').width / 2,
                            paddingLeft: 50,
                            paddingRight: 50,
                            paddingTop: 5,
                            borderRadius: 8,
                            paddingBottom: 5,
                            // alignItems: 'center',
                            marginLeft: 20,
                            backgroundColor: Colors.primary,
                        }}><Text style={{ color: Colors.white }}>Apply to enroll</Text></View>
                    </TouchableOpacity>

                </View>

            </View >
        );
    }
}
const styles = StyleSheet.create({

    container: {
        flex: 1,
        flexDirection: 'column',
        justifyContent: 'space-between',
    },
    cardView: {
        backgroundColor: Colors.primary,
        borderTopLeftRadius: 13,
        borderTopRightRadius: 13,
        width: width / 1.1,
        // margin: 5,
        alignItems: 'center',
        // padding: 10,
        paddingBottom: 5,
        paddingTop: 5

    },
})
export default connect(mapStateToProps, mapDispatchToProps)(OtherProgramDescription);