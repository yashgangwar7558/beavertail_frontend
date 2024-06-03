import React, { useState, useContext, useEffect } from 'react';
import { StyleSheet, View, Text, TouchableOpacity, ScrollView, Image, ActivityIndicator, TextInput, Picker } from 'react-native';
import { Button, DataTable } from 'react-native-paper';
import { SouthRounded, NorthRounded, ImportExportRounded, KeyboardArrowDown } from "@mui/icons-material"
import { useNavigate } from 'react-router'
import { useLocation } from 'react-router-dom';
import LoadingScreen from '../../components/LoadingScreen';
import Modal from 'react-native-modal';
import Icon from 'react-native-vector-icons/FontAwesome';
import RNPrint from 'react-native-print';
import { AuthContext } from '../../context/AuthContext.js'
import Header from '../../components/global/Header/index.js';
import client from '../../utils/ApiConfig'
import { sortInvoices } from '../../helpers/sort.js';
import { filterInvoices } from '../../helpers/filter.js';
import { useDropzone } from 'react-dropzone';
import Box from '@mui/material/Box';
import LinearProgress from '@mui/material/LinearProgress';
import { DatePicker } from '@mui/x-date-pickers';
import {
    FormControl, InputLabel, MenuItem, Select,
} from '@mui/material'
import dayjs from 'dayjs';

const InvoiceTable = (props) => {
    const navigate = useNavigate({});
    const location = useLocation();
    const [editingStatusRows, setEditingStatusRows] = useState([])
    const { userInfo, isLoading, logout } = useContext(AuthContext);
    const [invoices, setInvoices] = useState([]);
    const [vendors, setVendors] = useState([]);
    const [loading, setLoading] = useState(false);
    const [statusLoading, setStatusLoading] = useState(false);
    const [loadingScreen, setLoadingScreen] = useState(false);
    const [invoiceFiles, setInvoiceFiles] = useState(null)
    const [selectedInvoice, setSelectedInvoice] = useState(location.state?.selectedInvoice || null);
    const [openModal, setOpenModal] = useState(false)
    const [startDate, setStartDate] = useState(null);
    const [endDate, setEndDate] = useState(null);
    const [sortOption, setSortOption] = useState('invoiceDate_descending');
    const [filterByVendor, setFilterByVendor] = useState('All');
    const [filterByStatus, setFilterByStatus] = useState('All');
    const [filteredInvoices, setFilteredInvoices] = useState([]);
    const [showRejectionInputs, setShowRejectionInputs] = useState([]);
    const [invoiceRejectionReason, setInvoiceRejectionReason] = useState([]);
    const today = dayjs();
    const statusTypes = ['Pending Review', 'Pending Approval', 'Processed-PendingPayment', 'Processed-Paid', 'Review-Rejected', 'Approval-Rejected']

    useEffect(() => {
        props.setHeaderTitle('Invoices')
    }, [])

    const getInvoices = async () => {
        try {
            setLoading(true)
            const data = {
                tenantId: userInfo.user.tenant,
                startDate: startDate,
                endDate: endDate,
            };
            const result = await client.post('/get-invoices', data, {
                headers: { 'Content-Type': 'application/json' },
            })
            setInvoices(result.data.invoices)
            setVendors(Array.from(new Set(result.data.invoices.map((invoice) => invoice.vendor))))
            setLoading(false)
        } catch (error) {
            console.log(`getting invoices error ${error}`);
        }
    }


    useEffect(() => {
        getInvoices();
    }, [startDate, endDate]);

    useEffect(() => {
        const [sortBy, sortOrder] = sortOption.split('_');
        const sorted = sortInvoices(invoices, sortBy, sortOrder);
        const vendorFiltered = filterInvoices(sorted, 'vendor', filterByVendor);
        const statusFiltered = filterInvoices(vendorFiltered, 'status', filterByStatus);
        setFilteredInvoices(statusFiltered)
    }, [invoices, sortOption, filterByVendor, filterByStatus]);

    const toggleInvoiceSort = () => {
        const newSortOption = sortOption === 'invoiceDate_ascending' ? 'invoiceDate_descending' : 'invoiceDate_ascending';
        setSortOption(newSortOption);
    };

    const toggleTotalSort = () => {
        const newSortOption = sortOption === 'total_ascending' ? 'total_descending' : 'total_ascending';
        setSortOption(newSortOption);
    };

    const handleStartDateChange = (date) => {
        setStartDate(date);
        if (date.isAfter(endDate)) {
            setStartDate(date.format('YYYY-MM-DD'))
        }
        // setStartDate(date.format('YYYY-MM-DD'));
    };

    const handleEndDateChange = (date) => {
        setEndDate(date);
        if (date.isBefore(startDate)) {
            setEndDate(date.format('YYYY-MM-DD'))
        }
        // setEndDate(date.format('YYYY-MM-DD'));
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
        data.append('tenantId', userInfo.user.tenant);
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

    const setRejectionInputVisibility = (invoiceId, isVisible) => {
        setShowRejectionInputs((prev) => ({
            ...prev,
            [invoiceId]: isVisible,
        }));
    };
    const setRejectionReason = (invoiceId, reason) => {
        setInvoiceRejectionReason((prev) => ({
            ...prev,
            [invoiceId]: reason,
        }));
    };

    const updateInvoiceStatus = async (invoiceId, newStatus, newRemark) => {
        try {
            setStatusLoading(true)
            const data = {
                tenantId: userInfo.user.tenant,
                invoiceId: invoiceId,
                newStatus: newStatus,
                newRemark: newRemark
            };
            const result = await client.post('/update-invoice-status', data, {
                headers: { 'Content-Type': 'application/json' },
            })
            if (result.data.success) {
                closeInvoiceDetails()
                await getInvoices()
            }
            setRejectionInputVisibility(invoiceId, false)
            setStatusLoading(false)
        } catch (error) {
            console.log(`updating invoice status error ${error}`)
        }
    }

    const processInvoice = async (invoiceId) => {
        try {
            setStatusLoading(true)
            const data = {
                tenantId: userInfo.user.tenant,
                invoiceId: invoiceId,
            };
            const result = await client.post('/process-invoice', data, {
                headers: { 'Content-Type': 'application/json' },
            })
            if (result.data.success) {
                closeInvoiceDetails()
                await getInvoices()
            }
            setStatusLoading(false)
        } catch (error) {
            console.log(`processing invoice error ${error}`)
        }
    }

    const deleteInvoice = async (invoiceId) => {
        try {
            const id = { invoiceId }
            const result = await client.post('/delete-invoice', id, {
                headers: { 'Content-Type': 'application/json' },
            })
            if (result.data.success) {
                getInvoices()
                closeInvoiceDetails()
            }
        } catch (error) {
            console.log(`deleting recipes error ${error}`)
        }
    }

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
                                maxDate={endDate}
                                onChange={handleStartDateChange}
                                formatDensity="spacious"
                                slotProps={{ textField: { size: 'small' } }}
                                sx={{
                                    "& .MuiOutlinedInput-root": {
                                        // "&:hover > fieldset": { borderColor: "#47bf93" },
                                        borderRadius: "12px",
                                        width: '220px'
                                    },
                                }}
                            />
                            <Text>  </Text>
                            <DatePicker
                                label="To"
                                defaultValue={today}
                                disableFuture
                                value={endDate}
                                minDate={startDate}
                                onChange={handleEndDateChange}
                                formatDensity="spacious"
                                slotProps={{ textField: { size: 'small' } }}
                                sx={{
                                    "& .MuiOutlinedInput-root": {
                                        // "&:hover > fieldset": { borderColor: "#47bf93" },
                                        borderRadius: "12px",
                                        width: '220px'
                                    },
                                }}
                            />
                            {/* <Picker
                                style={styles.picker}
                                itemStyle={styles.pickerItem}
                                underlineColorAndroid="transparent"
                                selectedValue={sortOption}
                                onValueChange={(value) => setSortOption(value)}
                            >
                                <Picker.Item label="Total (High to Low)" value="total_descending" />
                                <Picker.Item label="Total (Low to High)" value="total_ascending" />
                                <Picker.Item label="Recent First" value="invoiceDate_descending" />
                                <Picker.Item label="Oldest First" value="invoiceDate_ascending" />
                            </Picker> */}
                        </View>
                        <View style={styles.rightTableButtons}>
                            <FormControl style={styles.picker}>
                                <Select
                                    labelId="picker-label"
                                    value={filterByVendor}
                                    onChange={(e) => setFilterByVendor(e.target.value)}
                                    style={{ color: '#ffffff', width: '100%', height: '100%', border: 'none', outline: 'none', borderRadius: '12px' }}
                                    IconComponent={KeyboardArrowDown}
                                    sx={{ '& .MuiSvgIcon-root': { color: '#ffffff' } }}
                                >
                                    <MenuItem value="All">Vendor: All</MenuItem>
                                    {vendors.map((vendor, index) => (
                                        <MenuItem key={index} value={vendor}>{vendor}</MenuItem>
                                    ))}
                                </Select>
                            </FormControl>

                            <FormControl style={styles.picker}>
                                <Select
                                    labelId="picker-label"
                                    value={filterByStatus}
                                    onChange={(e) => setFilterByStatus(e.target.value)}
                                    style={{ color: '#ffffff', width: '100%', height: '100%', border: 'none', outline: 'none', borderRadius: '12px' }}
                                    IconComponent={KeyboardArrowDown}
                                    sx={{ '& .MuiSvgIcon-root': { color: '#ffffff' } }}
                                >
                                    <MenuItem value="All">Status: All</MenuItem>
                                    {statusTypes.map((status, index) => (
                                        <MenuItem key={index} value={status}>{status}</MenuItem>
                                    ))}
                                </Select>
                            </FormControl>
                            <Icon.Button
                                style={styles.tableNavBtnBlue}
                                name="plus"
                                backgroundColor="transparent"
                                underlayColor="transparent"
                                iconStyle={{ fontSize: 15, paddingHorizontal: 0 }}
                                color={"white"}
                                onPress={() => { navigate('/add-invoice') }}
                            >
                                <Text style={{ color: 'white', fontSize: 15, marginRight: 5, fontFamily: 'inherit' }}>Add Invoice</Text>
                            </Icon.Button>
                        </View>
                    </View>
                    <View style={styles.searchContainer}>
                        <TextInput
                            style={styles.tableSearchBar}
                            placeholder='Search'
                            placeholderTextColor="gray"
                        />
                        {/* <View style={styles.searchIcon}>
                            <Icon name="search" size={20} color="gray" />
                        </View> */}
                    </View>
                </View>
            </View>

            <View style={styles.splitScreenContainer}>
                <View style={styles.tableContainer} horizontal={true}>
                    <DataTable style={styles.dataTable}>
                        <DataTable.Header style={styles.header}>
                            <DataTable.Title style={styles.headerCellFirst}><span style={{ fontWeight: 'bold', fontSize: '14px', color: 'black' }}>Upload Date</span></DataTable.Title>
                            <DataTable.Title style={styles.headerCell}><span style={{ fontWeight: 'bold', fontSize: '14px', color: 'black' }}>Vendor</span></DataTable.Title>
                            <DataTable.Title style={styles.headerCell}><span style={{ fontWeight: 'bold', fontSize: '14px', color: 'black' }}>Invoice Number</span></DataTable.Title>
                            <DataTable.Title style={styles.headerCell}>
                                <span
                                    style={{
                                        display: 'flex',
                                        alignItems: 'center',
                                        fontWeight: 'bold',
                                        fontSize: '14px',
                                        color: 'black',
                                        cursor: 'pointer',
                                    }}
                                    onClick={toggleInvoiceSort}
                                >
                                    Invoice Date
                                    {sortOption === 'invoiceDate_ascending' ? (
                                        <NorthRounded sx={{ color: 'grey', fontSize: '15px', stroke: "grey", strokeWidth: 1, marginLeft: '5px' }} />
                                    ) : sortOption === 'invoiceDate_descending' ? (
                                        <SouthRounded sx={{ color: 'grey', fontSize: '15px', stroke: "grey", strokeWidth: 1, marginLeft: '5px' }} />
                                    ) : (
                                        null
                                    )}
                                </span>
                            </DataTable.Title>
                            <DataTable.Title style={styles.headerCell}><span style={{ fontWeight: 'bold', fontSize: '14px', color: 'black' }}>Payment</span></DataTable.Title>
                            <DataTable.Title style={[styles.headerCell, { flex: 1.2 }]}><span style={{ fontWeight: 'bold', fontSize: '14px', color: 'black' }}>Status</span></DataTable.Title>
                            <DataTable.Title style={styles.headerCellRight}>
                                <span
                                    style={{
                                        display: 'flex',
                                        alignItems: 'center',
                                        fontWeight: 'bold',
                                        fontSize: '14px',
                                        color: 'black',
                                        cursor: 'pointer',
                                    }}
                                    onClick={toggleTotalSort}
                                >
                                    Total
                                    {sortOption === 'total_ascending' ? (
                                        <NorthRounded sx={{ color: 'grey', fontSize: '15px', stroke: "grey", strokeWidth: 1, marginLeft: '5px' }} />
                                    ) : sortOption === 'total_descending' ? (
                                        <SouthRounded sx={{ color: 'grey', fontSize: '15px', stroke: "grey", strokeWidth: 1, marginLeft: '5px' }} />
                                    ) : (
                                        null
                                    )}
                                </span>
                            </DataTable.Title>
                        </DataTable.Header>

                        <ScrollView style={{ maxHeight: 'calc(100vh - 230px)' }} scrollIndicatorInsets={{ right: -5 }} showsVerticalScrollIndicator={false}>
                            {loading ? (
                                <ActivityIndicator size="large" color="#0000ff" style={{ marginTop: 10 }} />
                            ) : (
                                filteredInvoices.map((item, index) => (
                                    <TouchableOpacity key={index} onPress={(event) => {
                                        if (event.target && event.target.tagName === 'SELECT') {
                                            return;
                                        }
                                        handleInvoiceClick(item);
                                    }}>
                                        <DataTable.Row
                                            style={[index % 2 === 0 ? styles.evenRow : styles.oddRow, selectedInvoice?._id === item._id && styles.selectedRow]}
                                        >
                                            <DataTable.Cell style={styles.cellFirst}>{item.uploadDate}</DataTable.Cell>
                                            <DataTable.Cell style={styles.cell}>{item.vendor}</DataTable.Cell>
                                            <DataTable.Cell style={styles.cell}>{item.invoiceNumber}</DataTable.Cell>
                                            <DataTable.Cell style={styles.cell}>{item.invoiceDate}</DataTable.Cell>
                                            <DataTable.Cell style={styles.cell}>{item.payment}</DataTable.Cell>
                                            <DataTable.Cell style={[styles.cell, { flex: 1.2 }]}>{item.status.type}</DataTable.Cell>
                                            <DataTable.Cell style={styles.cellRight}>
                                                ${item.total}
                                            </DataTable.Cell>
                                        </DataTable.Row>
                                    </TouchableOpacity>
                                ))
                            )
                            }
                        </ScrollView>
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
                                <Text style={[styles.uppercaseText, { fontWeight: '600', color: 'white', fontSize: '18px', fontFamily: 'inherit' }]}>{selectedInvoice.invoiceNumber}</Text>
                            </Icon.Button>
                            <Icon.Button
                                name="times"
                                onPress={() => { closeInvoiceDetails(), setRejectionInputVisibility(selectedInvoice._id, false) }}
                                backgroundColor="transparent"
                                underlayColor="transparent"
                                iconStyle={{ fontSize: 20, padding: 0, margin: 0 }}
                                color={"white"}>
                            </Icon.Button>
                        </View>
                        <ScrollView>
                            <View style={styles.invoiceDetailsContainer}>
                                <View style={styles.invoiceDetails}>
                                    <Text style={{ margin: '4px' }}><span style={{ fontWeight: 'bold' }}>Vendor:</span> {selectedInvoice.vendor}</Text>
                                    <Text style={{ margin: '4px' }}><span style={{ fontWeight: 'bold' }}>Date:</span> {selectedInvoice.invoiceDate}</Text>
                                    <Text style={{ margin: '4px' }}><span style={{ fontWeight: 'bold' }}>Amt. Payable:</span> ${selectedInvoice.total}</Text>
                                    <Text style={{ margin: '4px' }}><span style={{ fontWeight: 'bold' }}>Status:</span> {selectedInvoice.status.type}</Text>
                                </View>
                                <DataTable>
                                    <DataTable.Header style={styles.header}>
                                        <DataTable.Title><span style={{ fontWeight: 'bold', fontSize: '14px', color: 'black' }}>Name</span></DataTable.Title>
                                        <DataTable.Title><span style={{ fontWeight: 'bold', fontSize: '14px', color: 'black' }}>Quantity</span></DataTable.Title>
                                        <DataTable.Title><span style={{ fontWeight: 'bold', fontSize: '14px', color: 'black' }}>Unit</span></DataTable.Title>
                                        <DataTable.Title><span style={{ fontWeight: 'bold', fontSize: '14px', color: 'black' }}>Unit Price</span></DataTable.Title>
                                    </DataTable.Header>
                                    {
                                        selectedInvoice.ingredients.map((item, index) => (
                                            <DataTable.Row key={index}>
                                                <DataTable.Cell>{item.name}</DataTable.Cell>
                                                <DataTable.Cell>{item.quantity}</DataTable.Cell>
                                                <DataTable.Cell>{item.unit}</DataTable.Cell>
                                                <DataTable.Cell>${(item.unitPrice).toFixed(2)}</DataTable.Cell>
                                            </DataTable.Row>
                                        ))
                                    }
                                </DataTable>
                            </View>
                        </ScrollView>
                        <View style={styles.invoiceDetailsButtonsContainer}>
                            <View style={styles.invoiceDetailsButtonsLeft}>
                                <Icon.Button
                                    style={styles.blueTransparentBtn}
                                    name="external-link"
                                    onPress={() => { openInvoiceFile(selectedInvoice.invoiceUrl) }}
                                    backgroundColor="transparent"
                                    underlayColor="transparent"
                                    iconStyle={{ fontSize: 19, padding: 0, margin: 0 }}
                                    color={"#47bf93"}>
                                    <Text style={[{ color: '#47bf93', fontSize: 14, marginLeft: '4px', fontFamily: 'inherit' }]}>Open</Text>
                                </Icon.Button>
                            </View>
                            {selectedInvoice.status.type === 'Pending Review' ? (
                                <View style={styles.invoiceDetailsButtonsRight}>
                                    <Icon.Button
                                        style={styles.blueBtn}
                                        name="check-square-o"
                                        onPress={() => { updateInvoiceStatus(selectedInvoice._id, 'Pending Approval', '') }}
                                        backgroundColor="transparent"
                                        underlayColor="transparent"
                                        iconStyle={{ fontSize: 19, padding: 0, margin: 0 }}
                                        color={"white"}>
                                        <Text style={[{ color: 'white', fontSize: 14, marginLeft: '4px', fontFamily: 'inherit' }]}>Mark Reviewed</Text>
                                    </Icon.Button>
                                    <Icon.Button
                                        style={styles.blueBtn}
                                        name="edit"
                                        onPress={() => { navigate('/add-invoice', { state: { editInvoiceData: selectedInvoice } }), closeInvoiceDetails() }}
                                        backgroundColor="transparent"
                                        underlayColor="transparent"
                                        iconStyle={{ fontSize: 19, padding: 0, margin: 0 }}
                                        color={"white"}>
                                        <Text style={[{ color: 'white', fontSize: 14, marginLeft: '4px', fontFamily: 'inherit' }]}>Edit</Text>
                                    </Icon.Button>
                                    <Icon.Button
                                        style={styles.blueTransparentBtn}
                                        name="close"
                                        onPress={() => setRejectionInputVisibility(selectedInvoice._id, true)}
                                        backgroundColor="transparent"
                                        underlayColor="transparent"
                                        iconStyle={{ fontSize: 19, padding: 0, margin: 0 }}
                                        color={"#47bf93"}>
                                        <Text style={[{ color: '#47bf93', fontSize: 14, marginLeft: '4px', fontFamily: 'inherit' }]}>Reject</Text>
                                    </Icon.Button>
                                </View>
                            ) : selectedInvoice.status.type === 'Pending Approval' ? (
                                <View style={styles.invoiceDetailsButtonsRight}>
                                    <Icon.Button
                                        style={styles.blueBtn}
                                        name="check-square-o"
                                        onPress={() => { processInvoice(selectedInvoice._id) }}
                                        backgroundColor="transparent"
                                        underlayColor="transparent"
                                        iconStyle={{ fontSize: 19, padding: 0, margin: 0 }}
                                        color={"white"}>
                                        <Text style={[{ color: 'white', fontSize: 14, marginLeft: '4px', fontFamily: 'inherit' }]}>Mark Approved</Text>
                                    </Icon.Button>
                                    <Icon.Button
                                        style={styles.blueBtn}
                                        name="refresh"
                                        onPress={() => { updateInvoiceStatus(selectedInvoice._id, 'Pending Review', '') }}
                                        backgroundColor="transparent"
                                        underlayColor="transparent"
                                        iconStyle={{ fontSize: 19, padding: 0, margin: 0 }}
                                        color={"white"}>
                                        <Text style={[{ color: 'white', fontSize: 14, marginLeft: '4px', fontFamily: 'inherit' }]}>Send for Review</Text>
                                    </Icon.Button>
                                    <Icon.Button
                                        style={styles.blueTransparentBtn}
                                        name="close"
                                        onPress={() => setRejectionInputVisibility(selectedInvoice._id, true)}
                                        backgroundColor="transparent"
                                        underlayColor="transparent"
                                        iconStyle={{ fontSize: 19, padding: 0, margin: 0 }}
                                        color={"#47bf93"}>
                                        <Text style={[{ color: '#47bf93', fontSize: 14, marginLeft: '4px', fontFamily: 'inherit' }]}>Reject</Text>
                                    </Icon.Button>
                                </View>
                            ) : selectedInvoice.status.type === 'Review-Rejected' || selectedInvoice.status.type === 'Approval-Rejected' ? (
                                <View style={styles.invoiceDetailsButtonsRight}>
                                    <Text>Invoice rejected with reason:</Text>
                                    <Text>{selectedInvoice.status.remark}</Text>
                                </View>
                            ) : selectedInvoice.status.type === 'Processed-PendingPayment' ? (
                                <View style={styles.invoiceDetailsButtonsRight}>
                                    <Icon.Button
                                        style={styles.blueBtn}
                                        name="paypal"
                                        onPress={() => { updateInvoiceStatus(selectedInvoice._id, 'Processed-Paid', '') }}
                                        backgroundColor="transparent"
                                        underlayColor="transparent"
                                        iconStyle={{ fontSize: 19, padding: 0, margin: 0 }}
                                        color={"white"}>
                                        <Text style={[{ color: 'white', fontSize: 14, marginLeft: '4px', fontFamily: 'inherit' }]}>Pay Vendor</Text>
                                    </Icon.Button>
                                </View>
                            ) : (
                                <View style={styles.invoiceDetailsButtonsRight}>
                                    <Text>Invoice is processed and closed, changes can't be reverted back</Text>
                                </View>
                            )}
                        </View>
                        {showRejectionInputs[selectedInvoice._id] && (
                            <View style={styles.rejectionContainer}>
                                <TextInput
                                    style={[styles.rejectionInputField]}
                                    placeholder="Provide rejection reason"
                                    value={invoiceRejectionReason[selectedInvoice._id]}
                                    onChangeText={(text) => setRejectionReason(selectedInvoice._id, text)}
                                />
                                <Icon.Button
                                    style={styles.blueTransparentBtn}
                                    name="close"
                                    onPress={() => { setRejectionInputVisibility(selectedInvoice._id, false), setRejectionReason(selectedInvoice._id, '') }}
                                    backgroundColor="transparent"
                                    underlayColor="transparent"
                                    iconStyle={{ fontSize: 19, padding: 0, margin: 0 }}
                                    color={"#47bf93"}>
                                    <Text style={[{ color: '#47bf93', fontSize: 14, marginLeft: '4px', fontFamily: 'inherit' }]}>Cancel</Text>
                                </Icon.Button>
                                <Icon.Button
                                    style={styles.blueBtn}
                                    name="check"
                                    onPress={() => { updateInvoiceStatus(selectedInvoice._id, 'Approval-Rejected', invoiceRejectionReason[selectedInvoice._id]), setRejectionReason(selectedInvoice._id, '') }}
                                    backgroundColor="transparent"
                                    underlayColor="transparent"
                                    iconStyle={{ fontSize: 19, padding: 0, margin: 0 }}
                                    color={"white"}>
                                    <Text style={[{ color: 'white', fontSize: 14, marginLeft: '4px', fontFamily: 'inherit' }]}>Submit</Text>
                                </Icon.Button>
                            </View>
                        )}
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
        padding: 10,
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
        height: 37,
        margin: 3,
        borderRadius: 12,
        backgroundColor: "#47bf93",
        justifyContent: "center"
    },
    tableNavBtnSky: {
        position: "relative",
        height: 37,
        margin: 3,
        borderRadius: 5,
        backgroundColor: "#72b8f2",
        justifyContent: "center"
    },
    pickerContainer: {
        height: 40,
        margin: 3,
        borderRadius: 30,
        backgroundColor: "#0071cd",
        justifyContent: "center",
    },
    picker: {
        height: 37,
        margin: 3,
        borderRadius: 12,
        backgroundColor: "#47bf93",
        justifyContent: "center",
        color: '#ffffff',
        paddingHorizontal: 8,
        fontSize: 15,
        fontFamily: 'inherit'
    },
    pickerItem: {
        color: 'white',
        backgroundColor: "red",
        fontSize: 15
    },
    searchContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        marginTop: 10,
        marginBottom: 5
    },
    tableSearchBar: {
        flex: 1,
        height: 40,
        backgroundColor: '#fff',
        border: '1px solid gray',
        borderRadius: 12,
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
    headerCell: {
        paddingLeft: '10px'
    },
    headerCellFirst: {

    },
    headerCellRight: {
        paddingLeft: '10px'
    },
    cell: {
        paddingLeft: '10px',
        borderLeftWidth: 1,
        borderLeftColor: '#dedede',
    },
    cellFirst: {
        paddingLeft: '0px'
    },
    cellRight: {
        paddingLeft: '10px',
        justifyContent: 'flex-start',
        borderLeftWidth: 1,
        borderLeftColor: '#dedede',
    },
    evenRow: {
        backgroundColor: '#f2f0f0',
    },
    oddRow: {
        backgroundColor: '#fff',
    },
    selectedRow: {
        backgroundColor: '#cfe8de',
    },
    cellText: {
        flex: 1,
        justifyContent: 'center',
        overflow: 'hidden',
        textOverflow: 'ellipsis',
        whiteSpace: 'nowrap',
    },
    smallInput: {
        // flex: 1,
        borderColor: 'gray',
        borderWidth: 1,
        borderRadius: 3,
        paddingRight: 5,
        backgroundColor: '#fff',
    },
    invoiceContainer: {
        width: '80vh',
        height: 'calc(100vh - 190px)',
        // flex: 1,
        backgroundColor: '#fff',
        border: '3.5px solid #47bf93',
        borderRadius: 5,
        overflow: 'hidden',
        marginRight: '10px'
    },
    invoiceDetailsNavbar: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        padding: 5,
        backgroundColor: '#47bf93',
        color: '#fff',
    },
    invoiceDetails: {
        flexDirection: 'column',
        padding: 12,
    },
    invoiceDetailsButtonsContainer: {
        marginTop: 10,
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        padding: 10,
    },
    invoiceDetailsButtonsLeft: {
        flexDirection: 'row',
        justifyContent: 'space-between'
    },
    invoiceDetailsButtonsRight: {
        flexDirection: 'row',
        justifyContent: 'space-between'
    },
    blueBtn: {
        position: "relative",
        // width: 200,
        height: 37,
        marginRight: 5,
        paddingHorizontal: 10,
        paddingVertical: 4,
        borderRadius: 12,
        borderWidth: 2,
        borderColor: "#47bf93",
        backgroundColor: "#47bf93",
        justifyContent: "center"
    },
    blueTransparentBtn: {
        position: "relative",
        // width: 200,
        height: 35,
        marginRight: 5,
        paddingHorizontal: 10,
        paddingVertical: 4,
        borderRadius: 12,
        borderWidth: 2,
        borderColor: "#47bf93",
        // backgroundColor: "#0071cd",
        justifyContent: "center"
    },
    rejectionContainer: {
        margin: 5,
        flexDirection: 'row',
        alignItems: 'center',
        marginTop: 10,
    },
    rejectionInputField: {
        flex: 1,
        height: 40,
        borderColor: '#47bf93',
        borderWidth: 1,
        borderRadius: 5,
        paddingHorizontal: 10,
        marginRight: 10,
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