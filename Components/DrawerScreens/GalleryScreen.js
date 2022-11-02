import React, { Component, useState } from 'react'
import { StyleSheet, Text, View, FlatList, Alert, Image, TouchableOpacity } from 'react-native'
import Colors from '../../Assets/Colors'
import { Header } from '../CusComponent'
import Images from '../../Assets/Testimages/index';
import { COLORS, IMAGES } from '../../Assets';
import { axiosAuthGet } from '../../utility/apiConnection';
import { getItem } from '../../utility/AsyncConfig';
import { connect } from 'react-redux';
import {IMAGEURL} from '../../utility/util'
import { mapDispatchToProps, mapStateToProps } from '../../Reducers/ApiClass';
import Modal from 'react-native-modal';
import GridList from 'react-native-grid-list';
import { FlatGrid } from 'react-native-super-grid';
import MasonryList from "react-native-masonry-list";

class GalleryScreen extends Component {
    constructor(props) {
        super(props);
        this.state = {
            data: null,
            id: '',
            modalVisible: false,
            imgpath: ""
        }
    }
    async componentDidMount() {
        var values;
        // console.log("xss",this.props.LoginDetails);
        await getItem('LoginDetails').then((data) => {
            values = data.anchalId;
            this.setState({ id: values })
            console.log("All Saved Data:", data.anchalId);
        })
        console.log("Hello", this.values);
        try {
            let response = await axiosAuthGet('Gallery/Image/' + values);
            this.setState({ data: response })
            console.log(this.state.data);

        } catch (error) {
            console.log(error);
        }
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
    renderView = (prop) => {
        return (
            <View key={prop.id} style={{
                margin: 2,
                borderRadius: 2,
                backgroundColor: prop.color,
                flex: 1,
                alignItems: 'center',
                justifyContent: 'center',
            }} >
                <Text style={{ color: 'white' }}>{prop.name}</Text>
            </View>
        )
    }
    EmptyListMessage = () => {
        return (
            // Flat List Item
            <View style={styles.emptyListStyle}>
                <Text style={styles.emptyMessageStyle}>Gallery is empty</Text>
            </View>
        );
    }
    renderItem = ({ item, index }) => {
        { console.log("Hello", item) }
        <Image style={styles.image} source={{ uri: IMAGEURL + item.filePath }} />
    };
    render() {
        const { modalVisible } = this.state;

        return (
            <View style={styles.container}>
                <Header title={"Gallery"} navigation={this.props.navigation} />
                <View style={{}}>

                    <View style={styles.cardView}>
                        <FlatList
                            // style={{ margin: 10 }}
                            data={this.state.data}
                            renderItem={({ item }) =>
                                <View style={styles.GridViewBlockStyle}>
                                    {/* <View> */}
                                    <TouchableOpacity onPress={() => this.GetGridViewItem(item.filePath, true)}>
                                        <Image
                                            style={styles.GridImageStyle}
                                            source={{ uri: IMAGEURL + item.filePath }}
                                        />
                                    </TouchableOpacity>
                                    {/* </View> */}

                                </View>

                            }
                            numColumns={3}
                            ListEmptyComponent={this.EmptyListMessage()}
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
        )
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
        textAlignVertical:'center'

    },
    emptyMessageStyle: {
        textAlign: 'center',
        justifyContent: 'center',
        alignItems: 'center',
        textAlignVertical:'center'

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
export default connect(mapStateToProps, mapDispatchToProps)(GalleryScreen);