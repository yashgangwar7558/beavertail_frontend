import React, { useState, useContext, useEffect } from 'react';
import { StyleSheet, View, Text, TouchableOpacity, ScrollView, Image, ActivityIndicator, TextInput, Picker } from 'react-native';
import { Button, DataTable } from 'react-native-paper';
import { useNavigate } from 'react-router'
import LoadingScreen from '../../components/LoadingScreen';
import Modal from 'react-native-modal';
import Icon from 'react-native-vector-icons/FontAwesome';
import RNPrint from 'react-native-print';
import { AuthContext } from '../../context/AuthContext.js'
import Header from '../../components/global/Header/index.js';
import client from '../../utils/ApiConfig'
import { useDropzone } from 'react-dropzone';
import Box from '@mui/material/Box';
import LinearProgress from '@mui/material/LinearProgress';
import { DatePicker } from '@mui/x-date-pickers';
import dayjs from 'dayjs';

const InvoiceTable = () => {
    const navigate = useNavigate({});
    const { userInfo, isLoading, logout } = useContext(AuthContext);
    const [invoices, setInvoices] = useState([]);
    const [loading, setLoading] = useState(false);
    const [loadingScreen, setLoadingScreen] = useState(false);
    const [invoiceFiles, setInvoiceFiles] = useState(null)
    const [selectedInvoice, setSelectedInvoice] = useState(null);
    const [openModal, setOpenModal] = useState(false)
    const [startDate, setStartDate] = useState(null);
    const [endDate, setEndDate] = useState(null);
    const today = dayjs();

    const statusTypes = ['Pending', 'Paid']

    const getInvoices = async () => {
        try {
            setLoading(true)
            const data = {
                userId: userInfo.user.userId,
                startDate: startDate,
                endDate: endDate,
            };
            const result = await client.post('/get-invoices', data, {
                headers: { 'Content-Type': 'application/json' },
            })
            setInvoices(result.data.invoices)
            setLoading(false)
        } catch (error) {
            console.log(`getting invoices error ${error}`);
        }
    }

    useEffect(() => {
        getInvoices();
    }, [startDate, endDate]);

    const handleStartDateChange = (date) => {
        setStartDate(date.format('YYYY-MM-DD'));
    };

    const handleEndDateChange = (date) => {
        setEndDate(date.format('YYYY-MM-DD'));
    };

    const onDrop = (acceptedFiles) => {
        setInvoiceFiles(acceptedFiles);
    };

    const { getRootProps, getInputProps } = useDropzone({
        onDrop,
        accept: 'image/jpeg, image/png, application/pdf',
    });

    const handleAddInvoice = async () => {
        const data = new FormData();
        data.append('userId', userInfo.user.userId);
        let result
        if (invoiceFiles) {
            setLoadingScreen(true)
            for (const file of invoiceFiles) {
                data.append('invoiceFiles', file);
            }

            result = await client.post('/process-invoice', data, {
                headers: {
                    'content-type': 'multipart/form-data'
                },
            })
        } else {
            alert('No invoices added!')
        }

        if (result.data.success == true) {
            setLoadingScreen(false)
            setOpenModal(false)
            setInvoiceFiles(null)
            getInvoices()
        } else {
            alert(result.data.message)
            setInvoiceFiles(null)
            setLoadingScreen(false)
        }
    }

    const openInvoiceFile = (fileUrl) => {
        console.log(fileUrl);
        window.open(fileUrl, '_blank')
    }

    const handleInvoiceClick = (invoice) => {
        setSelectedInvoice(invoice);
    };

    const closeInvoiceDetails = () => {
        setSelectedInvoice(null);
    };

    const closeModal = () => {
        setOpenModal(false)
        setInvoiceFiles(null)
        setLoadingScreen(false)
    };

    return (
        <View>
            <View style={styles.container}>
                <View style={styles.tableNav}>
                    <View style={styles.tableButtonContainer}>
                        <View style={styles.leftTableButtons}>
                            <DatePicker
                                label="From"
                                defaultValue={today}
                                disableFuture
                                value={startDate}
                                onChange={handleStartDateChange}
                                formatDensity="spacious"
                                slotProps={{ textField: { size: 'small' } }}
                            />
                            <Text>  </Text>
                            <DatePicker
                                label="To"
                                defaultValue={today}
                                disableFuture
                                value={endDate}
                                onChange={handleEndDateChange}
                                formatDensity="spacious"
                                slotProps={{ textField: { size: 'small' } }}
                            />
                            <Icon.Button
                                style={styles.tableNavBtnBlue}
                                name="angle-down"
                                backgroundColor="transparent"
                                underlayColor="transparent"
                                iconStyle={{ fontSize: 22, paddingHorizontal: 5 }}
                                color={"white"}
                                onPress={() => { navigate('/add-invoice') }}
                            >
                                <Text style={{ color: 'white', fontSize: 15, marginRight: 5 }}>Add Invoice</Text>
                            </Icon.Button>
                            {/* <Icon.Button
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
                            </Icon.Button> */}
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

            <View style={styles.splitScreenContainer}>
                <View style={styles.tableContainer} horizontal={true}>
                    <DataTable style={styles.dataTable}>
                        <DataTable.Header style={styles.header}>
                            <DataTable.Title style={styles.headerCell}><span style={{ fontWeight: 'bold', fontSize: '14px', color: 'black' }}>Upload Date</span></DataTable.Title>
                            <DataTable.Title style={styles.headerCell}><span style={{ fontWeight: 'bold', fontSize: '14px', color: 'black' }}>Vendor</span></DataTable.Title>
                            <DataTable.Title style={styles.headerCell}><span style={{ fontWeight: 'bold', fontSize: '14px', color: 'black' }}>Invoice Number</span></DataTable.Title>
                            <DataTable.Title style={styles.headerCell}><span style={{ fontWeight: 'bold', fontSize: '14px', color: 'black' }}>Invoice Date</span></DataTable.Title>
                            <DataTable.Title style={styles.headerCell}><span style={{ fontWeight: 'bold', fontSize: '14px', color: 'black' }}>Payment</span></DataTable.Title>
                            <DataTable.Title style={styles.headerCell}><span style={{ fontWeight: 'bold', fontSize: '14px', color: 'black' }}>Status</span></DataTable.Title>
                            <DataTable.Title style={styles.headerCell}><span style={{ fontWeight: 'bold', fontSize: '14px', color: 'black' }}>Total</span></DataTable.Title>
                        </DataTable.Header>

                        {loading ? (
                            <ActivityIndicator size="large" color="#0000ff" style={{ marginTop: 10 }} />
                        ) : (
                            invoices.map((item, index) => (
                                <TouchableOpacity key={index} onPress={() => handleInvoiceClick(item)}>
                                    <DataTable.Row
                                        style={index % 2 === 0 ? styles.evenRow : styles.oddRow}
                                    >
                                        <DataTable.Cell style={styles.cell}>{item.uploadDate}</DataTable.Cell>
                                        <DataTable.Cell style={styles.cell}>{item.vendor}</DataTable.Cell>
                                        <DataTable.Cell style={styles.cell}>{item.invoiceNumber}</DataTable.Cell>
                                        <DataTable.Cell style={styles.cell}>{item.invoiceDate}</DataTable.Cell>
                                        <DataTable.Cell style={styles.cell}>{item.payment}</DataTable.Cell>
                                        <DataTable.Cell style={styles.cell}>
                                            {/* <Picker
                                                selectedValue={item.status}
                                                // onValueChange={(itemValue) => setInvoiceData({ ...invoiceData, payment: itemValue })}
                                            >
                                                <Picker.Item label="Select payment status..." value="" />
                                                {statusTypes.map((status, index) => (
                                                    <Picker.Item key={index} label={status} value={status} />
                                                ))}
                                            </Picker> */}
                                            {item.status}
                                        </DataTable.Cell>
                                        <DataTable.Cell style={styles.cell}>
                                            ${item.total}
                                            {/* <Icon.Button style={{ border: '2px solid #1f82d2', borderRadius: 30, paddingHorizontal: 7, paddingVertical: 4, marginLeft: 50 }}
                                                name="paypal"
                                                backgroundColor="transparent"
                                                underlayColor="transparent"
                                                color={"#1f82d2"}
                                                iconStyle={{ padding: 0, marginRight: 5, fontSize: 15 }}>
                                                <Text style={{ color: '#1f82d2', fontSize: 15, fontWeight: '700' }}>Pay</Text>
                                            </Icon.Button> */}
                                        </DataTable.Cell>
                                    </DataTable.Row>
                                </TouchableOpacity>
                            ))
                        )
                        }
                    </DataTable>
                </View>

                {selectedInvoice && (
                    <View style={styles.invoiceContainer}>
                        <View style={styles.invoiceDetailsNavbar}>
                            <Icon.Button
                                name="list-alt"
                                backgroundColor="transparent"
                                underlayColor="transparent"
                                iconStyle={{ fontSize: 20, marginRight: 5, padding: 0 }}
                                color={"white"}>
                                <Text style={[styles.uppercaseText, { fontWeight: '500', color: 'white', fontSize: '18px' }]}>{selectedInvoice.invoiceNumber}</Text>
                            </Icon.Button>
                            <Icon.Button
                                name="times"
                                onPress={closeInvoiceDetails}
                                backgroundColor="transparent"
                                underlayColor="transparent"
                                iconStyle={{ fontSize: 20, padding: 0, margin: 0 }}
                                color={"white"}>
                            </Icon.Button>
                        </View>
                        <ScrollView>
                            <View style={styles.invoiceDetailsContainer}>
                                <View style={styles.invoiceDetails}>
                                    <Text>Vendor: {selectedInvoice.vendor}</Text>
                                    <Text>Date: {selectedInvoice.invoiceDate}</Text>
                                    <Text>Amt. Payable: {selectedInvoice.total}</Text>
                                </View>
                                <DataTable>
                                    {
                                        selectedInvoice.ingredients.map((item, index) => (
                                            <DataTable.Row key={index}>
                                                <DataTable.Cell>{item.name}</DataTable.Cell>
                                                <DataTable.Cell>{item.quantity}</DataTable.Cell>
                                                <DataTable.Cell>{item.unit}</DataTable.Cell>
                                                <DataTable.Cell>{item.unitPrice}</DataTable.Cell>
                                            </DataTable.Row>
                                        ))
                                    }
                                </DataTable>
                                <Icon.Button
                                    style={styles.blueBtn}
                                    name="external-link"
                                    onPress={() => { openInvoiceFile(selectedInvoice.invoiceUrl) }}
                                    backgroundColor="transparent"
                                    underlayColor="transparent"
                                    iconStyle={{ fontSize: 18, padding: 0, margin: 0 }}
                                    color={"white"}>
                                    <Text style={[{ fontWeight: '500', color: 'white', fontSize: '15px', marginLeft: '3px' }]}>Open Invoice</Text>
                                </Icon.Button>
                            </View>
                        </ScrollView>
                    </View>
                )}
            </View>

            <Modal isVisible={openModal} onBackdropPress={() => closeModal()} style={styles.modal}>
                <View style={styles.modalContainer}>
                    <View style={{ margin: 50 }}>
                        <Text>Upload files...</Text>
                        <div {...getRootProps()} style={styles.dropzone}>
                            <input {...getInputProps()} />
                            <p>Drag 'n' drop your files here, or click to select</p>
                        </div>
                        {invoiceFiles && (
                            <Text style={{ color: '#2bb378' }}>Files Added Successfully!</Text>
                        )}
                        <Button onPress={() => closeModal()}>Cancel</Button>
                        <Button onPress={() => handleAddInvoice()}>Submit</Button>
                    </View>
                    {
                        loadingScreen &&
                        <Box sx={{ width: '100%' }}>
                            <LinearProgress />
                        </Box>
                    }
                </View>
            </Modal>
        </View>
    )
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: 'white',
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
    splitScreenContainer: {
        flex: 1,
        flexDirection: 'row',
    },
    tableContainer: {
        flex: 1.5,
        backgroundColor: 'white',
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
    invoiceContainer: {
        // width: '50%',
        // height: '100%',
        flex: 1,
        backgroundColor: '#fff',
        border: '3.5px solid #4697ce',
        borderRadius: 5,
        overflow: 'hidden',
    },
    invoiceDetailsNavbar: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        padding: 5,
        backgroundColor: '#4697ce',
        color: '#fff',
    },
    blueBtn: {
        position: "relative",
        width: 150,
        height: 35,
        margin: 8,
        paddingHorizontal: 5,
        paddingVertical: 3,
        borderRadius: 30,
        backgroundColor: "#0071cd",
        justifyContent: "center",
        alignSelf: 'center'
    },
    modal: {
        width: '100%',
        height: '100%',
    },
    modalContainer: {
        backgroundColor: 'white',
        // justifyContent: 'center',
        alignItems: 'center',
        // margin: 20,
        borderRadius: 5,
        width: '50%',
        // height: '60%',
        alignSelf: 'center',
    },
    dropzone: {
        border: '2px dashed #cccccc',
        borderRadius: '4px',
        padding: '20px',
        textAlign: 'center',
        cursor: 'pointer',
    },
})

export default InvoiceTable;