import React, { useState, useContext, useEffect } from 'react';
import { StyleSheet, View, Text, TouchableOpacity, ScrollView, Image, ActivityIndicator, TextInput, Picker } from 'react-native';
import { DataTable, Button } from 'react-native-paper';
import { useNavigate } from 'react-router'
import Icon from 'react-native-vector-icons/FontAwesome';
import RNPrint from 'react-native-print';
import { AuthContext } from '../../context/AuthContext.js'
import Header from '../../components/global/Header/index.js';
import client from '../../utils/ApiConfig'
import { sortSalesReport } from '../../helpers/sort.js'
import { DatePicker } from '@mui/x-date-pickers';
import { ExpandMore, ExpandLess, KeyboardArrowDown } from '@mui/icons-material'
import dayjs from 'dayjs';
import {
    FormControl, InputLabel, MenuItem, Select,
} from '@mui/material'
import io from 'socket.io-client'
import zIndex from '@mui/material/styles/zIndex.js';

const Ingredients = (props) => {
    const navigate = useNavigate({});
    const { userInfo, isLoading, logout } = useContext(AuthContext);
    const [loading, setLoading] = useState(false);
    const [allIngredients, setAllIngredients] = useState([])
    const [searchResults, setSearchResults] = useState([])
    const [searchTerm, setSearchTerm] = useState('')
    const [editingIndex, setEditingIndex] = useState('')
    const [newThreshold, setNewThreshold] = useState('')
    const [alerts, setAlerts] = useState([])

    useEffect(() => {
        props.setHeaderTitle('Ingredients')
    }, [])

    const getAllIngredients = async () => {
        try {
            setLoading(true)
            const data = {
                tenantId: userInfo.user.tenant,
            };
            const recipes = await client.post('/get-ingredients', data, {
                headers: { 'Content-Type': 'application/json' },
            })
            setAllIngredients(recipes.data.ingredients)
            setSearchResults(recipes.data.ingredients)
            setLoading(false)
        } catch (error) {
            console.log(`getting ingredients error ${error}`);
        }
    }

    useEffect(() => {
        getAllIngredients();
    }, []);

    const clearSearch = () => {
        setSearchTerm('')
        setSearchResults(allIngredients)
    };

    const handleIngredientSearch = (text) => {
        const results = allIngredients.filter(ingredient =>
            ingredient.name.toLowerCase().includes(text.toLowerCase())
        );
        setSearchResults(results);
        if (text.length == 0) {
            setSearchResults(allIngredients)
        }
    }

    const handleThresholdUpdate = async (ingredientId, newThreshold) => {
        try {
            if(newThreshold < 0) {
                alert("Threshold cannot be negative")
                return
            }
            setLoading(true)
            const data = {
                ingredientId: ingredientId,
                newThreshold: newThreshold,
            };
            const result = await client.post('/update-ingredient-threshold', data, {
                headers: { 'Content-Type': 'application/json' },
            })
            if (result.data.success) {
                getAllIngredients()
            } 
            setLoading(false)
        } catch (error) {
            console.log(`updating threshold error ${error}`);
        }
    };

    return (
        <View>
            <View style={styles.container}>
                <View style={styles.tableNav}>
                    <View style={styles.tableButtonContainer}>
                        <View style={styles.leftTableButtons}>
                            <Icon.Button
                                style={styles.tableNavBtnMidBlue}
                                name='plus'
                                onPress={() => { navigate('/add-invoice') }}
                                backgroundColor="transparent"
                                underlayColor="transparent"
                                iconStyle={{ fontSize: 15, paddingHorizontal: 0 }}
                                color={"white"}
                            >
                                <Text style={{ color: 'white', fontSize: 15, marginRight: 5, fontFamily: 'inherit' }}>Add Ingredients/Invoice</Text>
                            </Icon.Button>
                        </View>

                        <View style={styles.rightTableButtons}>
                            <Button
                                style={styles.tableNavBtnMidBlue}
                            >
                                <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                                    <Text style={{ color: 'white', fontSize: 15, marginRight: 5, fontFamily: 'inherit' }}>Export</Text>
                                    <Icon name="angle-down" size={18} color="white" />
                                </View>
                            </Button>
                        </View>
                    </View>
                    <View style={styles.searchContainer}>
                        <TextInput
                            style={styles.tableSearchBar}
                            placeholder='Search'
                            placeholderTextColor="gray"
                            selectTextOnFocus={false}
                            value={searchTerm}
                            onChangeText={(text) => {
                                setSearchTerm(text);
                                handleIngredientSearch(text);
                            }}
                        />
                        {searchTerm !== '' && (
                            <TouchableOpacity onPress={clearSearch} style={styles.clearSearchButton}>
                                <Icon name="times-circle" size={20} color="gray" />
                            </TouchableOpacity>
                        )}
                    </View>
                </View>
            </View>

            <DataTable style={styles.dataTable}>
                <DataTable.Header style={styles.header}>
                    <DataTable.Title style={styles.headerCellLeft}><span style={{ fontWeight: 'bold', fontSize: '14px', color: 'black' }}>Name</span></DataTable.Title>
                    <DataTable.Title style={styles.headerCellRight}><span style={{ fontWeight: 'bold', fontSize: '14px', color: 'black' }}>Inventory</span></DataTable.Title>
                    <DataTable.Title style={styles.headerCellRight}><span style={{ fontWeight: 'bold', fontSize: '14px', color: 'black' }}>Unit</span></DataTable.Title>
                    <DataTable.Title style={styles.headerCellRight}><span style={{ fontWeight: 'bold', fontSize: '14px', color: 'black' }}>Threshold (%)</span></DataTable.Title>
                    <DataTable.Title style={styles.headerCellRight}><span style={{ fontWeight: 'bold', fontSize: '14px', color: 'black' }}>Avg. Price ($)</span></DataTable.Title>
                    <DataTable.Title style={styles.headerCellRight}><span style={{ fontWeight: 'bold', fontSize: '14px', color: 'black' }}>Median Price ($)</span></DataTable.Title>
                    <DataTable.Title style={styles.headerCellLast}><span style={{ fontWeight: 'bold', fontSize: '14px', color: 'black' }}>Last Purchase Price ($)</span></DataTable.Title>
                </DataTable.Header>

                <ScrollView style={{ maxHeight: 'calc(100vh - 235px)' }} scrollIndicatorInsets={{ right: -5 }} showsVerticalScrollIndicator={false}>
                {loading ? (
                    <ActivityIndicator size="large" color="#0000ff" style={{ marginTop: 10 }} />
                ) : (
                    searchResults.length === 0 ? (
                        <Text style={{ textAlign: 'center', marginTop: 30 }}>No such ingredient found</Text>
                    ) : (
                        searchResults.map((item, index) => (
                            <DataTable.Row
                                style={index % 2 === 0 ? styles.greyRow : styles.whiteRow}
                            >
                                <DataTable.Cell style={styles.cellLeft}>{item.name}</DataTable.Cell>
                                <DataTable.Cell style={styles.cellRight}>{(item.inventory).toFixed(2)}</DataTable.Cell>
                                <DataTable.Cell style={[styles.cellRight]}>{item.invUnit}</DataTable.Cell>
                                {editingIndex === index ? (
                                    <DataTable.Cell style={styles.cellEditable}>
                                        <TextInput
                                            style={styles.editInput}
                                            value={newThreshold}
                                            maxLength={5}
                                            onChangeText={(threshold) => setNewThreshold(threshold)}
                                        />
                                        <TouchableOpacity onPress={() => { setEditingIndex(null); handleThresholdUpdate(item._id, newThreshold); }} style={styles.tickButton}>
                                            <Icon name="check" size={20} color="green" />
                                        </TouchableOpacity>
                                    </DataTable.Cell>
                                ) : (
                                    <DataTable.Cell style={styles.cellRight} onPress={() => { setEditingIndex(index); setNewThreshold(item.threshold) }}>{item.threshold}%</DataTable.Cell>
                                )}
                                <DataTable.Cell style={styles.cellRight}>${(item.avgCost).toFixed(2)}</DataTable.Cell>
                                <DataTable.Cell style={styles.cellRight}>${(item.medianPurchasePrice).toFixed(2)}</DataTable.Cell>
                                <DataTable.Cell style={styles.cellLast}>${(item.lastPurchasePrice).toFixed(2)}</DataTable.Cell>
                            </DataTable.Row>
                        ))
                    )
                )}
                </ScrollView>
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
        // position: 'sticky',
        // top: 62,
        // zIndex: 10,
    },
    tableNav: {
        width: '100%',
        flexDirection: 'column',
        justifyContent: 'space-between',
        padding: 10,
        backgroundColor: '#e8e8e8',
    },
    tableButtonContainer: {
        flexDirection: 'row',
        justifyContent: 'space-between',
    },
    leftTableButtons: {
        flexDirection: 'row',
        justifyContent: "center",
    },
    rightTableButtons: {
        flexDirection: 'row',
        justifyContent: "center",
    },
    datePicker: {
        height: 37,
        justifyContent: "center",
        fontFamily: 'inherit',
        margin: 3
    },
    tableNavBtnMidBlue: {
        position: "relative",
        height: 37,
        margin: 3,
        borderRadius: 12,
        backgroundColor: "#47bf93",
        justifyContent: "center"
    },
    tableNavBtnSky: {
        position: "relative",
        height: 40,
        margin: 3,
        borderRadius: 5,
        backgroundColor: "#72b8f2",
        justifyContent: "center"
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
    clearSearchButton: {
        position: 'absolute',
        right: 0,
        padding: 10,
    },
    dataTable: {
        // marginTop: 5,
    },
    header: {
        borderBottomWidth: 1,
        borderBottomColor: 'black',
        backgroundColor: 'white',
        // position: 'sticky',
        // top: 180,
        // zIndex: 5
    },
    headerCellLeft: {

    },
    headerCellRight: {
        justifyContent: 'flex-end',
        paddingRight: '10px',
    },
    headerCellLast: {
        justifyContent: 'flex-end',
    },
    cellLeft: {

    },
    cellRight: {
        justifyContent: 'flex-end',
        paddingRight: '10px',
        borderRightWidth: 1,
        borderRightColor: '#dedede',
    },
    cellEditable: {
        justifyContent: 'center',
        paddingRight: '10px',
        borderRightWidth: 1,
        borderRightColor: '#dedede',
    },
    cellLast: {
        justifyContent: 'flex-end',
    },
    whiteRow: {
        backgroundColor: '#ffffff',
    },
    greyRow: {
        backgroundColor: '#f2f0f0',
    },
    editContainer: {
        display: 'flex',
        flexDirection: 'row',
        // alignItems: 'center',
        // justifyContent: 'center'
    },
    editInput: {
        width: '70%',
        alignSelf: 'center',
        borderWidth: 1,
        borderColor: 'gray',
        borderRadius: 5,
        // paddingVertical: 5,
        // paddingHorizontal: 10,
        marginRight: 5,
        marginLeft: 15,
    },
    tickButton: {

    },
})

export default Ingredients;