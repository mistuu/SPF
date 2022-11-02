import React, { Component } from 'react'
import { FlatList, ScrollView, StyleSheet, Text, View } from 'react-native'
import Colors from '../../Assets/Colors'
import { Header } from '../CusComponent'
import CalendarPicker from 'react-native-calendar-picker';
import { COLORS } from '../../Assets';
import { Calendar, CalendarList, Agenda } from 'react-native-calendars';
import { getItem } from '../../utility/AsyncConfig';
import { axiosAuthGet, axiosPost } from '../../utility/apiConnection';
import moment from 'moment';
import Modal from 'react-native-modal';


export default class Calender extends Component {
    constructor(props) {
        super(props)
        this.state = {
            selectedStartDate: null,
            data: null,
            modalVisible: false,
            startEvent: null,
            endEvent: null,
            eventList: null,
            oldMonth: true,
        };
        this.onDateChange = this.onDateChange.bind(this);
    }
    async componentDidMount() {
        this.getData();
        // var values;
        // await getItem('LoginDetails').then((data) => {
        //     values = data.memberId;
        //     // this.setState({ memberId: values })
        //     // console.log("Member id:", data.memberId);
        // })
        // console.log("Member id:", values);

        // try {
        //     let response = await axiosAuthGet("Program/GetCalender/2021-11-01/2021-11-30/" + values)
        //     console.log(response);
        //     var data = []
        //     response = response.filter(val => {
        //         data.push(moment(val.calenderDate).format("YYYY-MM-DD"))
        //     })
        //     console.log(data);
        //     // this.setState({ data: data })
        //     var customMarkedDates = {};
        //     var startDates = {};

        //     data.map((day) => {
        //         customMarkedDates[day] = {
        //             marked: true, dotColor: Colors.primary,
        //         };
        //     });
        //     data.map((day) => {
        //         startDates[day] = {
        //             startingDay: true, color: Colors.primary
        //         };
        //     });
        //     this.setState({ startEvent: startDates })

        //     this.setState({ data: customMarkedDates })

        // } catch (error) {

        // }
    }

    monthChange = (month) => {
        console.log(month);
        var date = new Date();
        date = moment(date).format("MM")
        console.log(date);
        if (date <= month.month) {
            console.log("true");
            this.setState({ oldMonth: true })
        }
        else {
            this.setState({ oldMonth: false })

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
            "parameter": "",
            "parameter1": values.toString(),
            "pageSize": "100",
            "page": "1",
            "sortColumn": "pro_id desc"
        }
        try {
            let response = await axiosPost("ProgramEventActivity/List", params)
            var date = new Date();
            date = moment(date).format("YYYY-MM-DD")
            console.log(response);
            console.log(date);
            var d = [];
            await response.filter(val => {
                if (moment(val.eventEndDate).format("YYYY-MM-DD") >= date) {
                    console.log("data=====", val);
                    d.push(val)
                }
            })
            this.setState({ eventList: d })
            var customMarkedDates = {};
            var startDates = {};

            var startDate = []
            var endDate = []
            await d.filter(val => {
                startDate.push(moment(val.eventStartDate).format("YYYY-MM-DD"))
                endDate.push(moment(val.eventEndDate).format("YYYY-MM-DD"))

            })
            console.log("startDaye:-", startDate);
            console.log("endDay:-", endDate);

            startDate.map((day) => {
                customMarkedDates[day] = {
                    selected: true, startingDay: true, endingDay: true, color: Colors.primary
                };
            });
            endDate.map((day) => {
                startDates[day] = {
                    selected: true, color: Colors.tempGreen, startingDay: true, endingDay: true,
                };
            });
            this.setState({ endEvent: startDates })

            this.setState({ startEvent: customMarkedDates })

            // this.setState({ data: d })
            console.log("All Data:=", d);
        } catch (error) {

        }
    }
    onDateChange(date) {
        this.setState({
            selectedStartDate: date,
        });
    }
    setModalVisible = async (visible, date) => {
        this.setState({ modalVisible: visible });
    }
    render() {
        const { selectedStartDate } = this.state;
        const startDate = selectedStartDate ? selectedStartDate.toString() : '';

        return (
            <View style={{ flex: 1, }}>
                <Header title={"Calender"} navigation={this.props.navigation} />
                <View style={{ backgroundColor: Colors.white, margin: 10, padding: 10, borderRadius: 13 }}>

                    <Calendar
                        enableSwipeMonths={true}
                        markingType={'period'}
                        style={{ borderColor: Colors.primary, }}
                        markedDates={this.state.startEvent}
                        onMonthChange={(month) => this.monthChange(month)}
                        // onDayPress={(day) => this.setModalVisible(true, day)}

                    />
                    <View style={{ justifyContent: 'center', alignItems: 'center', marginTop: 10 }}>
                        <Text style={{ fontSize: 24, fontWeight: 'bold' }}>Events List</Text>
                    </View>
                    {
                        this.state.oldMonth == true ? (
                            <FlatList
                                style={{ margin: 10 }}
                                data={this.state.eventList}
                                renderItem={({ item }) =>
                                    <View style={{ justifyContent: 'center', alignItems: 'center', marginTop: 10, }}>

                                        <Text style={{ color: Colors.black, fontSize: 20, marginTop: 10 }}>{item.eventName} : {moment(item.eventStartDate).format("DD-MM-YYYY")} To {moment(item.eventEndDate).format("DD-MM-YYYY")}</Text>

                                    </View>
                                }
                                numColumns={1}
                            />
                        ) : (
                            <View style={{ alignItems: 'center', marginTop: 20 }}>
                                <Text>No Event Available</Text>
                            </View>
                        )
                    }

                </View>
                <Modal
                    isVisible={this.state.modalVisible}
                    onBackdropPress={() => this.setModalVisible(false)}
                    onSwipeComplete={() => this.setModalVisible(false)}
                    swipeDirection="left"
                    onBackButtonPress={() => this.setModalVisible(false)}
                // style={{ backgroundColor:'transparent', }}
                >
                    <View style={{ padding: 20, borderRadius: 8, backgroundColor: Colors.white, alignItems: 'center', justifyContent: 'center' }}>
                        <ScrollView>
                            <Text style={styles.Alert_Title}>Events</Text>

                            <View style={{ width: '70%', height: 2, backgroundColor: Colors.black }} />
                            {/* <View style={{ marginTop: 20, flexDirection: 'row', }}>
                                <Text style={{ fontSize: 18, width: Dimensions.get('window').width / 2.9, color: Colors.primary, fontWeight: 'bold' }}>Activity Name</Text>
                                <Text style={{ fontSize: 18, width: Dimensions.get('window').width / 2.5 }}>: {this.state.activityName}</Text>
                            </View> */}
                            <View style={{ width: '100%', height: 1, backgroundColor: Colors.graye00 }} />
                        </ScrollView>
                    </View>
                </Modal>
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
    Alert_Title: {
        fontSize: 25,
        color: Colors.black,
        textAlign: 'center',
        padding: 10,
    },
    listTitle: {
        color: Colors.black,
        fontSize: 24,
        marginTop: 32,
        textAlign: 'left',
        fontWeight: 'bold',
        marginLeft: 20,
        alignItems: 'flex-start'
    },
})

