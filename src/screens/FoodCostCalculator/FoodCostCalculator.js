import React, { useState, useContext, useEffect } from 'react';
import { StyleSheet, View, Text, TouchableOpacity, ScrollView, Image, ActivityIndicator, TextInput, Picker } from 'react-native';
import { DataTable, Button } from 'react-native-paper';
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
    FormControl, InputLabel, MenuItem, Select, ToggleButton
} from '@mui/material'
import ToggleButtonGroup, {
    toggleButtonGroupClasses,
} from '@mui/material/ToggleButtonGroup'


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
    const [typeToggle, setTypeToggle] = useState('Food')
    const [selectedTypeWiseSales, setSelectedTypeWiseSales] = useState([])
    const [sortOption, setSortOption] = useState('quantitySold_descending')
    const [sortedTypeSales, setSortedTypeSales] = useState([]);
    const [sortedRecipeSales, setSortedRecipeSales] = useState([]);
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
        let filteredSales = [];
        if (typeToggle === 'Food') {
            filteredSales = typeWiseSales.filter(sale => sale.type === 'Food');
        } else if (typeToggle === 'Beverage') {
            filteredSales = typeWiseSales.filter(sale => sale.type === 'Beverage');
        } else {
            filteredSales = typeWiseSales;
        }
        setSelectedTypeWiseSales(filteredSales);
    }, [typeWiseSales, typeToggle]);

    useEffect(() => {
        const [sortBy, sortOrder] = sortOption.split('_');
        const sortedTypes = sortSalesReport(selectedTypeWiseSales, sortBy, sortOrder);
        const sortedRecipes = sortSalesReport(recipeWiseSales, sortBy, sortOrder);
        setSortedTypeSales(sortedTypes)
        setSortedRecipeSales(sortedRecipes)
    }, [selectedTypeWiseSales, recipeWiseSales, sortOption]);


    const handleStartDateChange = (date) => {
        setStartDate(date.format('YYYY-MM-DD'));
        console.log(date.format('YYYY-MM-DD'));
    };

    const handleEndDateChange = (date) => {
        setEndDate(date.format('YYYY-MM-DD'));
        console.log(date.format('YYYY-MM-DD'));
    };

    const handleTypesToggle = (subTypeName) => {
        setExpandedTypes((prevExpanded) =>
            prevExpanded.includes(subTypeName)
                ? prevExpanded.filter((subType) => subType !== subTypeName)
                : [...prevExpanded, subTypeName]
        );
    };

    const renderAccordionContent = (subTypeName, typeRowIndex) => {
        const typeWiseRecipes = sortedRecipeSales.filter((item) => item.subType === subTypeName);
        return (
            typeWiseRecipes.map((item, index) => {
                const recipeRowIndex = typeRowIndex + index + 1;
                return (
                    <DataTable.Row
                        key={index}
                        style={recipeRowIndex % 2 === 0 ? styles.whiteRow : styles.greyRow}
                    >
                        {/* <DataTable.Cell style={[styles.cell, { flex: 0.2 }]}></DataTable.Cell> */}
                        <DataTable.Cell style={[styles.cellLeft, { flex: 1.2 }]}><span style={{ fontFamily: 'roboto', fontSize: '14px', fontWeight: '400', color: '#1c1b1f', marginLeft: '27px' }}>{item.subType}</span></DataTable.Cell>
                        <DataTable.Cell style={[styles.cellLeft, { flex: 0.8 }]}>{item.name}</DataTable.Cell>
                        <DataTable.Cell style={styles.cellRight}>${(item.avgCost).toFixed(2)}</DataTable.Cell>
                        <DataTable.Cell style={styles.cellRight}>{item.quantitySold}</DataTable.Cell>
                        <DataTable.Cell style={styles.cellRight}>${(item.totalFoodCost).toFixed(2)}</DataTable.Cell>
                        <DataTable.Cell style={styles.cellRight}>${(item.totalSales).toFixed(2)}</DataTable.Cell>
                        <DataTable.Cell style={styles.cellRight}><span style={{ color: item.totalProfitWomc < 0 ? 'red' : '#1c1b1f', fontWeight: '400', fontSize: '14px', fontFamily: 'roboto' }}>${(item.totalProfitWomc).toFixed(2)}</span></DataTable.Cell>
                        <DataTable.Cell style={styles.cellLast}><span style={{ color: item.totalProfitWomc < 0 ? 'red' : '#1c1b1f', fontWeight: '400', fontSize: '14px', fontFamily: 'roboto' }}>{(item.theoreticalCostWomc).toFixed(2)}%</span></DataTable.Cell>
                    </DataTable.Row>
                )
            })
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
                            onChange={handleEndDateChange}
                            formatDensity="spacious"
                            slotProps={{
                                textField: {
                                    size: 'small',
                                }
                            }}
                            sx={{
                                "& .MuiOutlinedInput-root": {
                                    // "&:hover > fieldset": { borderColor: "#47bf93" },
                                    borderRadius: "12px",
                                    width: '220px'
                                },
                            }}
                        />
                    </View>

                    <View style={styles.rightTableButtons}>
                        <ToggleButtonGroup
                            color="success"
                            size='small'
                            value={typeToggle}
                            exclusive
                            onChange={() => setTypeToggle(prevToggleType => {
                                return prevToggleType === 'Food' ? 'Beverage' : 'Food';
                            })}
                            aria-label="Select"
                            sx={{
                                [`& .${toggleButtonGroupClasses.grouped}`]: {
                                    border: 1,
                                    borderRadius: '12px',
                                    height: '38px',
                                    marignTop: '10px'
                                },
                            }}
                        >
                            <ToggleButton value="Food">Food</ToggleButton>
                            <ToggleButton value="Beverage">Beverage</ToggleButton>
                        </ToggleButtonGroup>
                        <FormControl style={styles.picker}>
                            <Select
                                labelId="picker-label"
                                value={typeToggle}
                                onChange={(e) => setTypeToggle(e.target.value)}
                                style={{ color: '#ffffff', width: '100%', height: '100%', border: 'none', outline: 'none', borderRadius: '12px' }}
                                IconComponent={KeyboardArrowDown}
                                sx={{ '& .MuiSvgIcon-root': { color: '#ffffff' } }}
                            >
                                <MenuItem value="All">All</MenuItem>
                                <MenuItem value="Food">Food</MenuItem>
                                <MenuItem value="Beverage">Beverages</MenuItem>
                            </Select>
                        </FormControl>
                        <FormControl style={styles.picker}>
                            <Select
                                labelId="picker-label"
                                value={sortOption}
                                onChange={(e) => setSortOption(e.target.value)}
                                style={{ color: '#ffffff', width: '100%', height: '100%', border: 'none', outline: 'none', borderRadius: '12px' }}
                                IconComponent={KeyboardArrowDown}
                                sx={{ '& .MuiSvgIcon-root': { color: '#ffffff' } }}
                            >
                                <MenuItem value="quantitySold_descending">Highest Selling</MenuItem>
                                <MenuItem value="quantitySold_ascending">Lowest Selling</MenuItem>
                                <MenuItem value="totalSales_descending">Highest Sales</MenuItem>
                                <MenuItem value="totalSales_ascending">Lowest Sales</MenuItem>
                                <MenuItem value="totalProfitWomc_descending">Highest Profit</MenuItem>
                                <MenuItem value="totalProfitWomc_ascending">Lowest Profit</MenuItem>
                            </Select>
                        </FormControl>
                        {/* <Icon.Button
                            style={styles.tableNavBtnMidBlue}
                            name="print"
                            backgroundColor="transparent"
                            underlayColor="transparent"
                            iconStyle={{ fontSize: 18, paddingHorizontal: 0 }}
                            color={"white"}
                        >
                            <Text style={{ color: 'white', fontSize: 15, marginRight: 5, fontFamily: 'inherit' }}>Print Report</Text>
                        </Icon.Button> */}
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
            </View>
            <DataTable style={styles.dataTable}>
                <DataTable.Header style={styles.header}>
                    {/* <DataTable.Title style={[styles.headerCell, { flex: 0.2 }]}></DataTable.Title> */}
                    <DataTable.Title style={[styles.headerCellLeft, { flex: 1.2 }]}><span style={{ fontWeight: 'bold', fontSize: '14px', color: 'black' }}>Menu Item Type</span></DataTable.Title>
                    <DataTable.Title style={[styles.headerCellLeft, { flex: 0.8 }]}><span style={{ fontWeight: 'bold', fontSize: '14px', color: 'black' }}>Menu Item</span></DataTable.Title>
                    <DataTable.Title style={styles.headerCellRight}><span style={{ fontWeight: 'bold', fontSize: '14px', color: 'black' }}>Avg. Cost ($)</span></DataTable.Title>
                    <DataTable.Title style={styles.headerCellRight}><span style={{ fontWeight: 'bold', fontSize: '14px', color: 'black' }}>Items Sold</span></DataTable.Title>
                    <DataTable.Title style={styles.headerCellRight}><span style={{ fontWeight: 'bold', fontSize: '14px', color: 'black' }}>Total Cost ($)</span></DataTable.Title>
                    <DataTable.Title style={styles.headerCellRight}><span style={{ fontWeight: 'bold', fontSize: '14px', color: 'black' }}>Total Sales ($)</span></DataTable.Title>
                    <DataTable.Title style={styles.headerCellRight}><span style={{ fontWeight: 'bold', fontSize: '14px', color: 'black' }}>Gross Profit ($)</span></DataTable.Title>
                    <DataTable.Title style={styles.headerCellLast}><span style={{ fontWeight: 'bold', fontSize: '14px', color: 'black' }}>Theoretical Cost (%)</span></DataTable.Title>
                </DataTable.Header>
                <ScrollView style={{ maxHeight: '75vh' }} scrollIndicatorInsets={{ right: -5 }} showsVerticalScrollIndicator={false}>
                    {loading ? (
                        <ActivityIndicator size="large" color="#0000ff" style={{ marginTop: 10 }} />
                    ) : (
                        sortedTypeSales.map((item, index) => {
                            let totalSubRows = 0;
                            for (let i = 0; i <= index - 1; i++) {
                                if (expandedTypes.includes(sortedTypeSales[i].subType)) {
                                    totalSubRows += sortedTypeSales[i].count;
                                }
                            }
                            const typeRowIndex = totalSubRows + index + 1
                            return (
                                <React.Fragment key={index}>
                                    <DataTable.Row
                                        style={typeRowIndex % 2 === 0 ? styles.whiteRow : styles.greyRow}
                                        onPress={() => handleTypesToggle(item.subType)}
                                    >
                                        {/* <DataTable.Cell style={[styles.cell, { flex: 0.2 }]}> */}
                                        <DataTable.Cell style={[styles.cellLeft, { flex: 1.2 }]}>
                                            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'flex-start', padding: 0, margin: 0 }}>
                                                {expandedTypes.includes(item.subType) ? (
                                                    <ExpandLess sx={{ fontSize: '25px', marginRight: '3px', color: '#47bf93' }} />
                                                ) : (
                                                    <ExpandMore sx={{ fontSize: '25px', marginRight: '3px', color: '#47bf93' }} />
                                                )}
                                                <span style={{ fontFamily: 'roboto', fontSize: '14px', fontWeight: '600', color: '#1c1b1f', verticalAlign: 'middle', marginRight: '3px' }}>{item.subType}</span>
                                                <span style={{ fontFamily: 'roboto', fontSize: '14px', fontWeight: '600', color: '#1c1b1f', verticalAlign: 'middle' }}>({item.count})</span>
                                            </div>
                                        </DataTable.Cell>
                                        <DataTable.Cell style={[styles.cellLeft, { flex: 0.8 }]}></DataTable.Cell>
                                        <DataTable.Cell style={styles.cellRight}><span style={{ fontFamily: 'roboto', fontWeight: '600', fontSize: '14px', color: '#1c1b1f' }}>${(item.avgCost).toFixed(2)}</span></DataTable.Cell>
                                        <DataTable.Cell style={styles.cellRight}><span style={{ fontFamily: 'roboto', fontWeight: '600', fontSize: '14px', color: '#1c1b1f' }}>{item.quantitySold}</span></DataTable.Cell>
                                        <DataTable.Cell style={styles.cellRight}><span style={{ fontFamily: 'roboto', fontWeight: '600', fontSize: '14px', color: '#1c1b1f' }}>${(item.totalFoodCost).toFixed(2)}</span></DataTable.Cell>
                                        <DataTable.Cell style={styles.cellRight}><span style={{ fontFamily: 'roboto', fontWeight: '600', fontSize: '14px', color: '#1c1b1f' }}>${(item.totalSales).toFixed(2)}</span></DataTable.Cell>
                                        <DataTable.Cell style={styles.cellRight}><span style={{ fontFamily: 'roboto', fontWeight: '600', fontSize: '14px', color: item.totalProfitWomc < 0 ? 'red' : '#1c1b1f' }}>${(item.totalProfitWomc).toFixed(2)}</span></DataTable.Cell>
                                        <DataTable.Cell style={styles.cellLast}><span style={{ fontFamily: 'roboto', fontWeight: '600', fontSize: '14px', color: item.totalProfitWomc < 0 ? 'red' : '#1c1b1f' }}>{(item.theoreticalCostWomc).toFixed(2)}%</span></DataTable.Cell>
                                    </DataTable.Row>

                                    {expandedTypes.includes(item.subType) && renderAccordionContent(item.subType, typeRowIndex)}
                                </React.Fragment>
                            )
                        })
                    )
                    }
                </ScrollView>
            </DataTable>
        </View >
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
    dataTable: {
        // marginTop: 5,
    },
    header: {
        borderBottomWidth: 1,
        borderBottomColor: 'black',
        backgroundColor: 'white'
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
    cellLast: {
        justifyContent: 'flex-end',
    },
    whiteRow: {
        backgroundColor: '#ffffff',
    },
    greyRow: {
        backgroundColor: '#f2f0f0',
    },
})

export default FoodCostCalculator;