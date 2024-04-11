import React, { useState, useContext, useEffect } from 'react';
import { StyleSheet, View, Text, TouchableOpacity, ScrollView, Image, ActivityIndicator, TextInput, Picker } from 'react-native';
import { Button, DataTable } from 'react-native-paper';
import Icon from 'react-native-vector-icons/FontAwesome';
import RNPrint from 'react-native-print';
import { AuthContext } from '../../context/AuthContext.js'
import Header from '../../components/global/Header/index.js';
import client from '../../utils/ApiConfig'
import { sortSalesReport } from '../../helpers/sort.js'
import { DatePicker } from '@mui/x-date-pickers';
import dayjs from 'dayjs';
import { TextField } from '@mui/material';

const FoodCostCalculator = () => {
    const { userInfo, isLoading, logout } = useContext(AuthContext);
    const [typeWiseSales, setTypeWiseSales] = useState([
        // {
        //   "type": "Pasta",
        //   "_id": "example_id_pasta",
        //   "imageUrl": "https://example.com/pasta.jpg",
        //   "count": 2,
        //   "avgCost": 8.5,
        //   "quantitySold": 90,
        //   "totalFoodCost": 765,
        //   "totalModifierCost": 190,
        //   "totalSales": 2760,
        //   "totalProfitWomc": 1995,
        //   "totalProfitWmc": 1805,
        //   "theoreticalCostWomc": 27.72,
        //   "theoreticalCostWmc": 39.625
        // },
        // {
        //   "type": "Pizza",
        //   "_id": "example_id_pizza",
        //   "imageUrl": "https://example.com/pizza.jpg",
        //   "count": 1,
        //   "avgCost": 4.5,
        //   "quantitySold": 60,
        //   "totalFoodCost": 270,
        //   "totalModifierCost": 75,
        //   "totalSales": 1200,
        //   "totalProfitWomc": 930,
        //   "totalProfitWmc": 825,
        //   "theoreticalCostWomc": 22.5,
        //   "theoreticalCostWmc": 21.25
        // },
        // {
        //   "type": "Salad",
        //   "_id": "example_id_salad",
        //   "imageUrl": "https://example.com/salad.jpg",
        //   "count": 1,
        //   "avgCost": 2.5,
        //   "quantitySold": 80,
        //   "totalFoodCost": 200,
        //   "totalModifierCost": 60,
        //   "totalSales": 960,
        //   "totalProfitWomc": 760,
        //   "totalProfitWmc": 700,
        //   "theoreticalCostWomc": 20.83,
        //   "theoreticalCostWmc": 19.17
        // },
        // {
        //   "type": "Seafood",
        //   "_id": "example_id_seafood",
        //   "imageUrl": "https://example.com/seafood.jpg",
        //   "count": 1,
        //   "avgCost": 10,
        //   "quantitySold": 30,
        //   "totalFoodCost": 300,
        //   "totalModifierCost": 75,
        //   "totalSales": 1200,
        //   "totalProfitWomc": 900,
        //   "totalProfitWmc": 825,
        //   "theoreticalCostWomc": 25.0,
        //   "theoreticalCostWmc": 21.25
        // }
      ]
      );
    const [recipeWiseSales, setRecipeWiseSales] = useState([
        // {
        //   "recipeId": "recipe_id_1",
        //   "name": "Spaghetti",
        //   "type": "Pasta",
        //   "imageUrl": "https://example.com/spaghetti_bolognese.jpg",
        //   "avgCost": 7.5,
        //   "modifierCost": 2,
        //   "quantitySold": 50,
        //   "totalFoodCost": 375,
        //   "totalModifierCost": 100,
        //   "totalSales": 1200,
        //   "totalProfitWomc": 825,
        //   "totalProfitWmc": 700,
        //   "theoreticalCostWomc": 31.25,
        //   "theoreticalCostWmc": 58.33
        // },
        // {
        //   "recipeId": "recipe_id_2",
        //   "name": "Chicken Alfredo",
        //   "type": "Pasta",
        //   "imageUrl": "https://example.com/chicken_alfredo.jpg",
        //   "avgCost": 9.75,
        //   "modifierCost": 2.25,
        //   "quantitySold": 40,
        //   "totalFoodCost": 390,
        //   "totalModifierCost": 90,
        //   "totalSales": 1560,
        //   "totalProfitWomc": 1170,
        //   "totalProfitWmc": 1080,
        //   "theoreticalCostWomc": 25.0,
        //   "theoreticalCostWmc": 20.92
        // },
        // {
        //   "recipeId": "recipe_id_3",
        //   "name": "Margherita Pizza",
        //   "type": "Pizza",
        //   "imageUrl": "https://example.com/margherita_pizza.jpg",
        //   "avgCost": 4.5,
        //   "modifierCost": 1.25,
        //   "quantitySold": 60,
        //   "totalFoodCost": 270,
        //   "totalModifierCost": 75,
        //   "totalSales": 1200,
        //   "totalProfitWomc": 930,
        //   "totalProfitWmc": 825,
        //   "theoreticalCostWomc": 22.5,
        //   "theoreticalCostWmc": 21.25
        // },
        // {
        //   "recipeId": "recipe_id_4",
        //   "name": "Classic Caesar ",
        //   "type": "Salad",
        //   "imageUrl": "https://example.com/classic_caesar_salad.jpg",
        //   "avgCost": 2.5,
        //   "modifierCost": 0.75,
        //   "quantitySold": 80,
        //   "totalFoodCost": 200,
        //   "totalModifierCost": 60,
        //   "totalSales": 960,
        //   "totalProfitWomc": 760,
        //   "totalProfitWmc": 700,
        //   "theoreticalCostWomc": 20.83,
        //   "theoreticalCostWmc": 19.17
        // },
        // {
        //   "recipeId": "recipe_id_5",
        //   "name": "Grilled Salmon",
        //   "type": "Seafood",
        //   "imageUrl": "https://example.com/grilled_salmon.jpg",
        //   "avgCost": 10,
        //   "modifierCost": 2.5,
        //   "quantitySold": 30,
        //   "totalFoodCost": 300,
        //   "totalModifierCost": 75,
        //   "totalSales": 1200,
        //   "totalProfitWomc": 900,
        //   "totalProfitWmc": 825,
        //   "theoreticalCostWomc": 25.0,
        //   "theoreticalCostWmc": 21.25
        // }
      ]);
    const [expandedTypes, setExpandedTypes] = useState([]);
    const [loading, setLoading] = useState(false);
    const [startDate, setStartDate] = useState(null);
    const [endDate, setEndDate] = useState(null);
    const [sortedTypeSales, setSortedTypeSales] = useState([]);
    const [sortedRecipeSales, setSortedRecipeSales] = useState([]);
    const [sortOption, setSortOption] = useState('quantitySold_descending')
    const today = dayjs();

    const getRecipesSalesData = async () => {
        try {
            setLoading(true)
            const data = {
                tenantId: userInfo.user.tenant,
                startDate: startDate,
                endDate: endDate,
            };
            const recipes = await client.post('/get-recipewise-sales', data, {
                headers: { 'Content-Type': 'application/json' },
            })
            const types = await client.post('/get-typewise-sales', data, {
                headers: { 'Content-Type': 'application/json' },
            })
            setRecipeWiseSales(recipes.data.allRecipesSalesData)
            setTypeWiseSales(types.data.allTypesSalesData)
            setLoading(false)
        } catch (error) {
            console.log(`getting recipe sales data error ${error}`);
        }
    }

    useEffect(() => {
        getRecipesSalesData();
    }, [startDate, endDate]);

    useEffect(() => {
        const [sortBy, sortOrder] = sortOption.split('_');
        const sortedTypes = sortSalesReport(typeWiseSales, sortBy, sortOrder);
        const sortedRecipes = sortSalesReport(recipeWiseSales, sortBy, sortOrder);
        setSortedTypeSales(sortedTypes)
        setSortedRecipeSales(sortedRecipes)
    }, [typeWiseSales, recipeWiseSales, sortOption]);

    const handleStartDateChange = (date) => {
        setStartDate(date.format('YYYY-MM-DD'));
        console.log(date.format('YYYY-MM-DD'));
    };

    const handleEndDateChange = (date) => {
        setEndDate(date.format('YYYY-MM-DD'));
        console.log(date.format('YYYY-MM-DD'));
    };

    const handleTypesToggle = (typeName) => {
        setExpandedTypes((prevExpanded) =>
            prevExpanded.includes(typeName)
                ? prevExpanded.filter((type) => type !== typeName)
                : [...prevExpanded, typeName]
        );
    };

    const renderAccordionContent = (typeName) => {
        const typeWiseRecipes = sortedRecipeSales.filter((item) => item.type === typeName);
        return (
            typeWiseRecipes.map((item, index) => (
                <DataTable.Row
                    key={index}
                    style={{ backgroundColor: 'white' }}
                >
                    <DataTable.Cell style={[styles.cell, { flex: 0.2 }]}></DataTable.Cell>
                    <DataTable.Cell style={styles.cell}>{item.type}</DataTable.Cell>
                    <DataTable.Cell style={styles.cell}>{item.name}</DataTable.Cell>
                    <DataTable.Cell style={styles.cell}>${(item.avgCost).toFixed(2)}</DataTable.Cell>
                    <DataTable.Cell style={styles.cell}>{item.quantitySold}</DataTable.Cell>
                    <DataTable.Cell style={styles.cell}>${(item.totalFoodCost).toFixed(2)}</DataTable.Cell>
                    <DataTable.Cell style={styles.cell}>${(item.totalSales).toFixed(2)}</DataTable.Cell>
                    <DataTable.Cell style={styles.cell}>${(item.totalProfitWomc).toFixed(2)}</DataTable.Cell>
                    <DataTable.Cell style={styles.cell}>{(item.theoreticalCostWomc).toFixed(2)}%</DataTable.Cell>
                </DataTable.Row>
            ))
        )
    };

    return (
        <View>
            <View style={styles.container}>
                <View style={styles.tableNav}>
                    <View style={styles.leftTableButtons}>
                        <DatePicker
                            label="From"
                            defaultValue={today}
                            disableFuture
                            value={startDate}
                            onChange={handleStartDateChange}
                            formatDensity="spacious"
                            slotProps={{
                                textField: {
                                    size: 'small',
                                }
                            }}
                        />
                        <Text>  </Text>
                        <DatePicker
                            label="To"
                            defaultValue={today}
                            disableFuture
                            value={endDate}
                            onChange={handleEndDateChange}
                            formatDensity="spacious"
                            slotProps={{
                                textField: {
                                    size: 'small',
                                }
                            }}
                        />
                        <Picker
                            style={styles.picker}
                            itemStyle={styles.pickerItem}
                            underlineColorAndroid="transparent"
                            selectedValue={sortOption}
                            onValueChange={(value) => setSortOption(value)}
                        >
                            <Picker.Item label="Highest Selling" value="quantitySold_descending" />
                            <Picker.Item label="Lowest Selling" value="quantitySold_ascending" />
                            <Picker.Item label="Highest Sales" value="totalSales_descending" />
                            <Picker.Item label="Lowest Sales" value="totalSales_ascending" />
                            <Picker.Item label="Highest Profit" value="totalProfitWomc_descending" />
                            <Picker.Item label="Lowest Profit" value="totalProfitWomc_ascending" />
                        </Picker>
                    </View>

                    <View style={styles.rightTableButtons}>
                        <Icon.Button
                            style={styles.tableNavBtnMidBlue}
                            name="print"
                            backgroundColor="transparent"
                            underlayColor="transparent"
                            iconStyle={{ fontSize: 22, paddingHorizontal: 5 }}
                            color={"white"}
                        >
                            <Text style={{ color: 'white', fontSize: 15, marginRight: 5 }}>Print Report</Text>
                        </Icon.Button>
                        <Icon.Button
                            style={styles.tableNavBtnMidBlue}
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
            </View>

            <DataTable style={styles.dataTable}>
                <DataTable.Header style={styles.header}>
                    <DataTable.Title style={[styles.headerCell, { flex: 0.2 }]}></DataTable.Title>
                    <DataTable.Title style={styles.headerCell}><span style={{ fontWeight: 'bold', fontSize: '14px', color: 'black' }}>Menu Item Type</span></DataTable.Title>
                    <DataTable.Title style={styles.headerCell}><span style={{ fontWeight: 'bold', fontSize: '14px', color: 'black' }}>Menu Item</span></DataTable.Title>
                    <DataTable.Title style={styles.headerCell}><span style={{ fontWeight: 'bold', fontSize: '14px', color: 'black' }}>Avg. Cost</span></DataTable.Title>
                    <DataTable.Title style={styles.headerCell}><span style={{ fontWeight: 'bold', fontSize: '14px', color: 'black' }}>Items Sold</span></DataTable.Title>
                    <DataTable.Title style={styles.headerCell}><span style={{ fontWeight: 'bold', fontSize: '14px', color: 'black' }}>Total Cost</span></DataTable.Title>
                    <DataTable.Title style={styles.headerCell}><span style={{ fontWeight: 'bold', fontSize: '14px', color: 'black' }}>Total Sales</span></DataTable.Title>
                    <DataTable.Title style={styles.headerCell}><span style={{ fontWeight: 'bold', fontSize: '14px', color: 'black' }}>Gross Profit</span></DataTable.Title>
                    <DataTable.Title style={styles.headerCell}><span style={{ fontWeight: 'bold', fontSize: '14px', color: 'black' }}>Theoretical Cost</span></DataTable.Title>
                </DataTable.Header>

                {loading ? (
                    <ActivityIndicator size="large" color="#0000ff" style={{ marginTop: 10 }} />
                ) : (
                    sortedTypeSales.map((item, index) => (
                        <React.Fragment key={index}>
                            <DataTable.Row
                                style={index % 2 === 0 ? styles.evenRow : styles.oddRow}
                                onPress={() => handleTypesToggle(item.type)}
                            >
                                <DataTable.Cell style={[styles.cell, { flex: 0.2 }]}>
                                    <Icon.Button style={{}}
                                        name={expandedTypes.includes(item.type) ? 'minus-square' : 'plus-square'}
                                        onPress={() => handleTypesToggle(item.type)}
                                        backgroundColor="transparent"
                                        underlayColor="transparent"
                                        color={"#1f82d2"}
                                        iconStyle={{ padding: 0, marginRight: 0, fontSize: 15 }}>
                                    </Icon.Button>
                                </DataTable.Cell>
                                <DataTable.Cell style={[styles.cell, { flex: 1 }]}>
                                    <span style={{ fontWeight: '700' }}>{item.type}</span>
                                    <span style={{ fontWeight: '700' }}> ({item.count})</span>
                                </DataTable.Cell>
                                <DataTable.Cell style={styles.cell}></DataTable.Cell>
                                <DataTable.Cell style={styles.cell}><span style={{ fontWeight: '700', color: 'black' }}>${(item.avgCost).toFixed(2)}</span></DataTable.Cell>
                                <DataTable.Cell style={styles.cell}><span style={{ fontWeight: '700', color: 'black' }}>{item.quantitySold}</span></DataTable.Cell>
                                <DataTable.Cell style={styles.cell}><span style={{ fontWeight: '700', color: 'black' }}>${(item.totalFoodCost).toFixed(2)}</span></DataTable.Cell>
                                <DataTable.Cell style={styles.cell}><span style={{ fontWeight: '700', color: 'black' }}>${(item.totalSales).toFixed(2)}</span></DataTable.Cell>
                                <DataTable.Cell style={styles.cell}><span style={{ fontWeight: '700', color: item.totalProfitWomc < 0 ? 'red' : 'green' }}>${(Math.abs(item.totalProfitWomc)).toFixed(2)}</span></DataTable.Cell>
                                <DataTable.Cell style={styles.cell}><span style={{ fontWeight: '700', color: item.theoreticalCostWomc < 0 ? 'red' : 'green' }}>{(Math.abs(item.theoreticalCostWomc)).toFixed(2)}%</span></DataTable.Cell>
                            </DataTable.Row>

                            {expandedTypes.includes(item.type) && renderAccordionContent(item.type)}
                        </React.Fragment>
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
    },
    tableNav: {
        width: '100%',
        flexDirection: 'row',
        justifyContent: 'space-between',
        padding: 12,
        backgroundColor: '#e8e8e8',
    },
    leftTableButtons: {
        flexDirection: 'row',
    },
    rightTableButtons: {
        flexDirection: 'row'
    },
    tableNavBtnMidBlue: {
        position: "relative",
        height: 40,
        margin: 3,
        borderRadius: 5,
        backgroundColor: "#4496cd",
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
    pickerContainer: {
        height: 40,
        margin: 3,
        borderRadius: 30,
        backgroundColor: "#0071cd",
        justifyContent: "center",
    },
    picker: {
        height: 40,
        margin: 3,
        borderRadius: 10,
        backgroundColor: "#0071cd",
        justifyContent: "center",
        color: 'white',
        paddingHorizontal: 8,
        fontSize: 15
    },
    pickerItem: {
        color: 'white',
        backgroundColor: "red",
        fontSize: 15
    },
    dataTable: {
        // marginTop: 5,
    },
    header: {
        borderBottomWidth: 1,
        borderBottomColor: 'black',
        backgroundColor: 'white'
    },
})

export default FoodCostCalculator;