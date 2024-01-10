import React, { useState, useContext, useEffect } from 'react';
import { StyleSheet, View, Text, TouchableOpacity, ScrollView, Image, ActivityIndicator, TextInput } from 'react-native';
import { Button, DataTable } from 'react-native-paper';
import Modal from 'react-native-modal';
import Icon from 'react-native-vector-icons/FontAwesome';
import RNPrint from 'react-native-print';
import { useNavigation } from '@react-navigation/native';
import { AuthContext } from '../../context/AuthContext.js'
import Header from '../../components/Header/index.js';
import client from '../../utils/ApiConfig/index.js'

const InvoiceTable = () => {
    const navigation = useNavigation();
    const { userInfo, isLoading, logout } = useContext(AuthContext);
    const [invoices, setInvoices] = useState([]);
    const [loading, setLoading] = useState(false);

    const getInvoices = async () => {
        try {
            setLoading(true)
            const user = { userId: userInfo.user.userId };
            const result = await client.post('/get-invoices', user, {
                headers: { 'Content-Type': 'application/json' },
            })
            console.log(result.data.invoices);
            setInvoices(result.data.invoices)
            setLoading(false)
        } catch (error) {
            console.log(`getting invoices error ${error}`);
        }
    }

    useEffect(() => {
        getInvoices();
    }, []);

    return (
        <View>
            <View>
                <Header heading="Invoices" />
            </View>
            <View style={styles.container}>
                <View style={styles.tableNav}>
                    <View style={styles.tableButtonContainer}>
                        <View style={styles.leftTableButtons}>
                            <Icon.Button
                                style={styles.tableNavBtnBlue}
                                name="angle-down"
                                backgroundColor="transparent"
                                underlayColor="transparent"
                                iconStyle={{ fontSize: 22, paddingHorizontal: 5 }}
                                color={"white"}
                            >
                                <Text style={{ color: 'white', fontSize: 15, marginRight: 5 }}>Add Invoice</Text>
                            </Icon.Button>
                            <Icon.Button
                                style={styles.tableNavBtnSky}
                                name="angle-down"
                                backgroundColor="transparent"
                                underlayColor="transparent"
                                iconStyle={{ fontSize: 22, paddingHorizontal: 5 }}
                                color={"white"}
                            >
                                <Text style={{ color: 'white', fontSize: 15, marginRight: 5 }}>Include All Orders</Text>
                            </Icon.Button>
                            <Icon.Button
                                style={styles.tableNavBtnBlue}
                                name="angle-down"
                                backgroundColor="transparent"
                                underlayColor="transparent"
                                iconStyle={{ fontSize: 22, paddingHorizontal: 5 }}
                                color={"white"}
                            >
                                <Text style={{ color: 'white', fontSize: 15, marginRight: 5 }}>Invoice Date: All Time</Text>
                            </Icon.Button>
                            <Icon.Button
                                style={styles.tableNavBtnSky}
                                name="angle-down"
                                backgroundColor="transparent"
                                underlayColor="transparent"
                                iconStyle={{ fontSize: 22, paddingHorizontal: 5 }}
                                color={"white"}
                            >
                                <Text style={{ color: 'white', fontSize: 15, marginRight: 5 }}>All Vendors</Text>
                            </Icon.Button>
                        </View>
                        <View style={styles.rightTableButtons}>
                            <Icon.Button
                                style={styles.tableNavBtnBlue}
                                name="angle-down"
                                backgroundColor="transparent"
                                underlayColor="transparent"
                                iconStyle={{ fontSize: 22, paddingHorizontal: 5 }}
                                color={"white"}
                            >
                                <Text style={{ color: 'white', fontSize: 15, marginRight: 5 }}>Export As</Text>
                            </Icon.Button>
                        </View>
                    </View>
                    <View style={styles.searchContainer}>
                        <TextInput
                            style={styles.tableSearchBar}
                            placeholder='Search'
                            placeholderTextColor="gray"
                        />
                        <View style={styles.searchIcon}>
                            <Icon name="search" size={20} color="gray" />
                        </View>
                    </View>
                </View>
            </View>

            <DataTable style={styles.dataTable}>
                <DataTable.Header style={styles.header}>
                    <DataTable.Title style={styles.headerCell}><span style={{fontWeight: 'bold', fontSize: '14px', color: 'black'}}>Upload Date</span></DataTable.Title>
                    <DataTable.Title style={styles.headerCell}><span style={{fontWeight: 'bold', fontSize: '14px', color: 'black'}}>Vendor</span></DataTable.Title>
                    <DataTable.Title style={styles.headerCell}><span style={{fontWeight: 'bold', fontSize: '14px', color: 'black'}}>Invoice Number</span></DataTable.Title>
                    <DataTable.Title style={styles.headerCell}><span style={{fontWeight: 'bold', fontSize: '14px', color: 'black'}}>Invoice Number</span></DataTable.Title>
                    <DataTable.Title style={styles.headerCell}><span style={{fontWeight: 'bold', fontSize: '14px', color: 'black'}}>Payment</span></DataTable.Title>
                    <DataTable.Title style={styles.headerCell}><span style={{fontWeight: 'bold', fontSize: '14px', color: 'black'}}>Status</span></DataTable.Title>
                    <DataTable.Title style={styles.headerCell}><span style={{fontWeight: 'bold', fontSize: '14px', color: 'black'}}>Total</span></DataTable.Title>
                </DataTable.Header>

                {loading ? (
                    <ActivityIndicator size="large" color="#0000ff" style={{ marginTop: 10 }} />
                ) : (
                    invoices.map((item, index) => (
                        <DataTable.Row
                            key={index}
                            style={index % 2 === 0 ? styles.evenRow : styles.oddRow}
                        >
                            <DataTable.Cell style={styles.cell}>{item.uploadDate}</DataTable.Cell>
                            <DataTable.Cell style={styles.cell}>{item.vendor}</DataTable.Cell>
                            <DataTable.Cell style={styles.cell}>{item.invoiceNumber}</DataTable.Cell>
                            <DataTable.Cell style={styles.cell}>{item.invoiceDate}</DataTable.Cell>
                            <DataTable.Cell style={styles.cell}>{item.payment}</DataTable.Cell>
                            <DataTable.Cell style={styles.cell}>{item.status}</DataTable.Cell>
                            <DataTable.Cell style={styles.cell}>
                                ${item.total}
                                <Icon.Button style={{border: '2px solid #1f82d2', borderRadius: 30, paddingHorizontal: 7, paddingVertical: 4, marginLeft: 50}}
                                    name="paypal"
                                    backgroundColor="transparent"
                                    underlayColor="transparent"
                                    color={"#1f82d2"}
                                    iconStyle={{padding: 0, marginRight: 5, fontSize: 15}}>
                                    <Text style={{ color: '#1f82d2', fontSize: 15, fontWeight: '700'}}>Pay</Text>
                                </Icon.Button>
                            </DataTable.Cell>
                        </DataTable.Row>
                    ))
                )
                }
            </DataTable>
        </View>
    )
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: 'white',
        marginTop: 60,
    },
    tableNav: {
        width: '100%',
        flexDirection: 'column',
        padding: 12,
        backgroundColor: '#e8e8e8',
    },
    tableButtonContainer: {
        flexDirection: 'row',
        justifyContent: 'space-between',
    },
    leftTableButtons: {
        flexDirection: 'row'
    },
    rightTableButtons: {
        flexDirection: 'row'
    },
    tableNavBtnBlue: {
        position: "relative",
        height: 40,
        margin: 3,
        borderRadius: 30,
        backgroundColor: "#0071cd",
        justifyContent: "center"
    },
    tableNavBtnSky: {
        position: "relative",
        height: 40,
        margin: 3,
        borderRadius: 30,
        backgroundColor: "#72b8f2",
        justifyContent: "center"
    },
    searchContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        marginTop: 10,
        marginBottom: 10
    },
    tableSearchBar: {
        flex: 1,
        height: 40,
        backgroundColor: '#fff',
        border: '1px solid gray',
        borderRadius: 5,
        paddingHorizontal: 10,
    },
    searchIcon: {
        marginLeft: 10,
    },
    dataTable: {
        // marginTop: 5,
    },
    header: {
        borderBottomWidth: 1,
        borderBottomColor: 'black',
        backgroundColor: 'white'
    },
    cell: {
        // paddingLeft: 10,
    },
    evenRow: {
        backgroundColor: '#f2f0f0',
    },
    oddRow: {
        backgroundColor: '#fff',
    },
})

export default InvoiceTable;