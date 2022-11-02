import React, { Component } from 'react';
import { StyleSheet, Text, View, FlatList, Alert, Image, TouchableOpacity } from 'react-native'
import { connect } from 'react-redux';
import { mapStateToProps } from '../../../../Reducers/ApiClass';
import Modal from 'react-native-modal';
import Colors from '../../../../Assets/Colors';
import {IMAGEURL} from '../../../../utility/util'
class ProImages extends Component {
    constructor(props) {
        super(props);
        this.state = {
            data: null,
            id: '',
            modalVisible: false,
            imgpath: ""
        };
    }
    componentDidMount() {
        console.log("Documents", this.props.documentsDetailss);
        var data = this.props.documentsDetailss;
        data = data.filter(element => {
            return element.docType == 5
        });
        console.log(data);
        this.setState({ data: data })

    }
    setModalVisible = (visible) => {
        this.setState({ modalVisible: visible });
    }
    GetGridViewItem = (item, visible) => {
        this.setState({ imgpath: item })
        this.setState({ modalVisible: visible });

        // Alert.alert( );
        console.log("Images:", item);


    }
    EmptyListMessage = () => {
        return (
            // Flat List Item
            <View style={styles.emptyListStyle}>
                <Text style={styles.emptyMessageStyle}>Gallery is empty</Text>
            </View>
        );
    }
    render() {
        return (
            <View>
                <View style={{}}>

                    <View style={styles.cardView}>
                        <FlatList
                            // style={{ margin: 10 }}
                            data={this.state.data}
                            renderItem={({ item }) =>
                                <View style={styles.GridViewBlockStyle}>
                                    {/* <View> */}
                                    <TouchableOpacity onPress={() => this.GetGridViewItem(item.docUrl, true)}>
                                        <Image
                                            style={styles.GridImageStyle}
                                            source={{ uri: IMAGEURL + item.docUrl }}
                                        />
                                    </TouchableOpacity>
                                    {/* </View> */}

                                </View>

                            }
                            numColumns={3}
                            // ListEmptyComponent={this.EmptyListMessage()}
                            keyExtractor={item => item.fileName}
                        />

                    </View>
                </View>
                <Modal
                    isVisible={this.state.modalVisible}
                    onBackdropPress={() => this.setModalVisible(false)}
                    onSwipeComplete={() => this.setModalVisible(false)}
                    swipeDirection="left"
                    onBackButtonPress={() => this.setModalVisible(false)}
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
        alignItems: 'center',
        justifyContent: 'flex-start',
        backgroundColor: Colors.primary
    },
    galleryTitle: {
        color: Colors.black,
        fontSize: 24,
        marginTop: 32,
        textAlign: 'left',
        marginLeft: 20,
        alignItems: 'flex-start'
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
    cardView: {
        backgroundColor: Colors.white,
        borderRadius: 13,
        // margin: 20,
        // padding:20,
        marginBottom: 50
    },
    GridViewBlockStyle: {

        // justifyContent: 'center',
        // flex: 1,
        // flexDirection: 'column',
        // alignItems: 'center',
        // height: 100,
        margin: 3,
        // width:"100%",
        // flex:1,
        backgroundColor: COLORS.white

    }
    ,
    image: {
        flex: 1,
        // width: '100%',
        // height: '100%',
        borderRadius: 10,
    },
    GridImageStyle: {
        height: 200,
        width: 120,

    },
    GridViewInsideTextItemStyle: {

        color: Colors.primary,
        fontSize: 18,
        justifyContent: 'center',

    },
    picsStyle: {
        fontSize: 16,
        color: "#ADADAD"
    }
})
export default connect(mapStateToProps)(ProImages)
