import React, { useState, useContext, useEffect } from 'react';
import { StyleSheet, View, Text, TouchableOpacity, ScrollView, Image, ActivityIndicator, TextInput } from 'react-native';
import { Button, DataTable } from 'react-native-paper';
import Icon from 'react-native-vector-icons/FontAwesome';
// import Icon from 'react-native-vector-icons/AntDesign';
import RNPrint from 'react-native-print';
import { useNavigation } from '@react-navigation/native';
import { AuthContext } from '../../context/AuthContext.js'
import Header from '../../components/global/Header/index.js';
import client from '../../utils/ApiConfig'
import { useNavigate } from 'react-router'

const MenuItems = (props) => {
    const navigate = useNavigate({});
    const { userInfo, isLoading, logout } = useContext(AuthContext);
    const [recipes, setRecipes] = useState([
        // {
        //   "tenantId": "tenant_id_1",
        //   "name": "Spaghetti Bolognese",
        //   "category": "Pasta",
        //   "yields": [
        //     { "quantity": 4, "unit": "servings" }
        //   ],
        //   "imageUrl": "https://images.unsplash.com/photo-1621996346565-e3dbc646d9a9?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8NHx8cGFzdGF8ZW58MHx8MHx8fDA%3D",
        //   "methodPrep": "Cook spaghetti according to package instructions. In a separate pan, brown ground beef and onions. Add tomato sauce and simmer. Serve over cooked spaghetti.",
        //   "ingredients": [
        //     { "ingredient_id": "ingredient_id_1", "name": "Spaghetti", "quantity": 8, "unit": "ounces" },
        //     { "ingredient_id": "ingredient_id_2", "name": "Ground Beef", "quantity": 1, "unit": "pound" },
        //     { "ingredient_id": "ingredient_id_3", "name": "Onion", "quantity": 1, "unit": "medium" },
        //     { "ingredient_id": "ingredient_id_4", "name": "Tomato Sauce", "quantity": 15, "unit": "ounces" }
        //   ],
        //   "cost": 7.5,
        //   "modifierCost": 2,
        //   "menuPrice": 30,
        //   "menuType": "Regular",
        //   "inventory": true
        // },
        // {
        //   "tenantId": "tenant_id_1",
        //   "name": "Chicken Alfredo",
        //   "category": "Pasta",
        //   "yields": [
        //     { "quantity": 4, "unit": "servings" }
        //   ],
        //   "imageUrl": "https://example.com/chicken_alfredo.jpg",
        //   "methodPrep": "Cook fettuccine according to package instructions. In a separate pan, cook chicken until no longer pink. Add Alfredo sauce and simmer. Serve over cooked fettuccine.",
        //   "ingredients": [
        //     { "ingredient_id": "ingredient_id_1", "name": "Fettuccine", "quantity": 8, "unit": "ounces" },
        //     { "ingredient_id": "ingredient_id_5", "name": "Chicken Breast", "quantity": 1, "unit": "pound" },
        //     { "ingredient_id": "ingredient_id_6", "name": "Alfredo Sauce", "quantity": 15, "unit": "ounces" }
        //   ],
        //   "cost": 9.75,
        //   "modifierCost": 2.25,
        //   "menuPrice": 39,
        //   "menuType": "Regular",
        //   "inventory": true
        // },
        // {
        //   "tenantId": "tenant_id_1",
        //   "name": "Margherita Pizza",
        //   "category": "Pizza",
        //   "yields": [
        //     { "quantity": 1, "unit": "pizza" }
        //   ],
        //   "imageUrl": "https://example.com/margherita_pizza.jpg",
        //   "methodPrep": "Roll out pizza dough and spread tomato sauce. Add sliced mozzarella cheese and fresh basil leaves. Bake in a preheated oven until crust is golden brown.",
        //   "ingredients": [
        //     { "ingredient_id": "ingredient_id_7", "name": "Pizza Dough", "quantity": 1, "unit": "portion" },
        //     { "ingredient_id": "ingredient_id_8", "name": "Tomato Sauce", "quantity": 6, "unit": "ounces" },
        //     { "ingredient_id": "ingredient_id_9", "name": "Mozzarella Cheese", "quantity": 4, "unit": "ounces" },
        //     { "ingredient_id": "ingredient_id_10", "name": "Fresh Basil Leaves", "quantity": 4, "unit": "leaves" }
        //   ],
        //   "cost": 4.5,
        //   "modifierCost": 1.25,
        //   "menuPrice": 20,
        //   "menuType": "Regular",
        //   "inventory": true
        // },
        // {
        //   "tenantId": "tenant_id_1",
        //   "name": "Classic Caesar Salad",
        //   "category": "Salad",
        //   "yields": [
        //     { "quantity": 2, "unit": "servings" }
        //   ],
        //   "imageUrl": "https://example.com/classic_caesar_salad.jpg",
        //   "methodPrep": "Tear lettuce leaves into bite-sized pieces. In a bowl, combine lettuce, croutons, and Caesar dressing. Toss until well coated. Serve immediately.",
        //   "ingredients": [
        //     { "ingredient_id": "ingredient_id_11", "name": "Romaine Lettuce", "quantity": 6, "unit": "ounces" },
        //     { "ingredient_id": "ingredient_id_12", "name": "Croutons", "quantity": 1, "unit": "cup" },
        //     { "ingredient_id": "ingredient_id_13", "name": "Caesar Dressing", "quantity": 4, "unit": "tablespoons" }
        //   ],
        //   "cost": 2.5,
        //   "modifierCost": 0.75,
        //   "menuPrice": 12,
        //   "menuType": "Regular",
        //   "inventory": true
        // },
        // {
        //   "tenantId": "tenant_id_1",
        //   "name": "Grilled Salmon",
        //   "category": "Seafood",
        //   "yields": [
        //     { "quantity": 2, "unit": "servings" }
        //   ],
        //   "imageUrl": "https://example.com/grilled_salmon.jpg",
        //   "methodPrep": "Season salmon fillets with salt, pepper, and lemon juice. Grill over medium heat until cooked through. Serve with steamed vegetables.",
        //   "ingredients": [
        //     { "ingredient_id": "ingredient_id_14", "name": "Salmon Fillets", "quantity": 2, "unit": "pieces" },
        //     { "ingredient_id": "ingredient_id_15", "name": "Salt", "quantity": 1, "unit": "teaspoon" },
        //     { "ingredient_id": "ingredient_id_16", "name": "Black Pepper", "quantity": 1, "unit": "teaspoon" },
        //     { "ingredient_id": "ingredient_id_17", "name": "Lemon Juice", "quantity": 2, "unit": "tablespoons" }
        //   ],
        //   "cost": 10,
        //   "modifierCost": 2.5,
        //   "menuPrice": 40,
        //   "menuType": "Regular",
        //   "inventory": true
        // }
    ]
    );
    const [selectedRecipe, setSelectedRecipe] = useState(null);
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        props.setHeaderTitle('Recipe Book')
    }, [])

    const getRecipes = async () => {
        try {
            setLoading(true)
            const tenant = { tenantId: userInfo.user.tenant };
            const result = await client.post('/get-recipes', tenant, {
                headers: { 'Content-Type': 'application/json' },
            })
            setRecipes(result.data.recipes)
            setLoading(false)
        } catch (error) {
            console.log(`getting recipes error ${error}`);
        }
    }

    useEffect(() => {
        getRecipes();
    }, []);

    const handleRecipeClick = (recipe) => {
        setSelectedRecipe(recipe);
    };

    const closeRecipeDetails = () => {
        setSelectedRecipe(null);
    };

    const deleteRecipe = async (recipeId) => {
        try {
            const id = { recipeId }
            const result = await client.post('/delete-recipe', id, {
                headers: { 'Content-Type': 'application/json' },
            })
            if (result.data.success) {
                getRecipes();
                closeRecipeDetails();
            }
        } catch (error) {
            console.log(`deleting recipes error ${error}`);
        }
    }

    // const closeModal = () => {
    //     setSelectedRecipe(null);
    // };

    return (
        <View>
            <View style={styles.container}>
                <View style={styles.tableNav}>
                    <View style={styles.tableButtonContainer}>
                        <View style={styles.leftTableButtons}>
                            <Icon.Button
                                style={styles.tableNavBtn}
                                name='plus'
                                onPress={() => { navigate('/menubuilder') }}
                                backgroundColor="transparent"
                                underlayColor="transparent"
                                iconStyle={{ fontSize: 15, paddingHorizontal: 0 }}
                                color={"white"}
                            >
                                <Text style={{ color: 'white', fontSize: 15, marginRight: 5, fontFamily: 'inherit' }}>Add New Recipe</Text>
                            </Icon.Button>
                        </View>
                        <View style={styles.rightTableButtons}>
                            <Button
                                style={styles.tableNavBtn}
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
                        />
                    </View>
                </View>

                <View style={styles.splitScreenContainer}>
                    <View style={styles.tableContainer}>
                        {/* Table */}
                        <DataTable style={styles.dataTable}>
                            <DataTable.Header style={styles.header}>
                                <DataTable.Title style={styles.headerCellLeft}><span style={{ fontWeight: 'bold', fontSize: '14px', color: 'black' }}>Name</span></DataTable.Title>
                                <DataTable.Title style={[styles.headerCellLeft, { flex: 0.8 }]}><span style={{ fontWeight: 'bold', fontSize: '14px', color: 'black' }}>Type</span></DataTable.Title>
                                <DataTable.Title style={styles.headerCellRight}><span style={{ fontWeight: 'bold', fontSize: '14px', color: 'black' }}>On Inventory</span></DataTable.Title>
                                <DataTable.Title style={styles.headerCellRight}><span style={{ fontWeight: 'bold', fontSize: '14px', color: 'black' }}>Cost ($)</span></DataTable.Title>
                                <DataTable.Title style={styles.headerCellRight}><span style={{ fontWeight: 'bold', fontSize: '14px', color: 'black' }}>Menu Price ($)</span></DataTable.Title>
                                <DataTable.Title style={styles.headerCellRight}><span style={{ fontWeight: 'bold', fontSize: '14px', color: 'black' }}>Gross Profit ($)</span></DataTable.Title>
                                <DataTable.Title style={styles.headerCellLast}><span style={{ fontWeight: 'bold', fontSize: '14px', color: 'black', textAlign: 'right' }}>Cost (%)</span></DataTable.Title>
                            </DataTable.Header>

                            {loading ? (
                                <ActivityIndicator size="large" color="#0000ff" style={{ marginTop: 10 }} />
                            ) : (
                                recipes.map((item, index) => (
                                    <TouchableOpacity key={index} onPress={() => handleRecipeClick(item)}>
                                        <DataTable.Row
                                            style={index % 2 === 0 ? styles.evenRow : styles.oddRow}
                                        >
                                            <DataTable.Cell style={styles.cellLeft}>{item.name}</DataTable.Cell>
                                            <DataTable.Cell style={[styles.cellLeft, { flex: 0.8 }]}>{item.subCategory}</DataTable.Cell>
                                            <DataTable.Cell style={styles.cellRight}>{item.inventory ? 'Yes' : 'No'}</DataTable.Cell>
                                            <DataTable.Cell style={styles.cellRight}>${(item.cost).toFixed(2)}</DataTable.Cell>
                                            <DataTable.Cell style={styles.cellRight}>${(item.menuPrice).toFixed(2)}</DataTable.Cell>
                                            <DataTable.Cell style={styles.cellRight}><span style={{ color: item.menuPrice - item.cost < 0 ? 'red' : '#1c1b1f', fontWeight: '400', fontSize: '14px', fontFamily: 'roboto' }}>${(Math.abs(item.menuPrice - item.cost)).toFixed(2)}</span></DataTable.Cell>
                                            <DataTable.Cell style={styles.cellLast}><span style={{ color: item.menuPrice - item.cost < 0 ? 'red' : '#1c1b1f', fontWeight: '400', fontSize: '14px', fontFamily: 'roboto' }}>{((item.cost / item.menuPrice) * 100).toFixed(2)}%</span></DataTable.Cell>
                                        </DataTable.Row>
                                    </TouchableOpacity>
                                ))
                            )
                            }
                        </DataTable>
                    </View>

                    {selectedRecipe && (
                        <View style={styles.recipeContainer}>
                            <View style={styles.recipeNameNavbar}>
                                <Icon.Button
                                    name="list-alt"
                                    backgroundColor="transparent"
                                    underlayColor="transparent"
                                    iconStyle={{ fontSize: 20, marginRight: 5, padding: 0 }}
                                    color={"white"}>
                                    <Text style={[styles.uppercaseText, { fontWeight: '600', color: 'white', fontSize: '18px', fontFamily: 'inherit' }]}>{selectedRecipe.name}</Text>
                                </Icon.Button>
                                <Icon.Button
                                    name="times"
                                    // onPress={closeModal}
                                    onPress={closeRecipeDetails}
                                    backgroundColor="transparent"
                                    underlayColor="transparent"
                                    iconStyle={{ fontSize: 20, padding: 0, margin: 0, fontFamily: 'inherit' }}
                                    color={"white"}>
                                </Icon.Button>
                            </View>
                            <ScrollView>
                                <View style={styles.recipeDetails}>
                                    <View style={styles.detailsContainer}>
                                        <Text style={{ fontsize: '10px', marginBottom: '10px' }}><span style={styles.boldText}>Type:</span> {selectedRecipe.category}</Text>
                                        <Text style={{ fontsize: '10px', marginBottom: '10px' }}><span style={styles.boldText}>Inventory:</span> {selectedRecipe.inventory ? 'Yes' : 'No'}</Text>
                                        <Text style={{ fontsize: '10px', marginBottom: '10px' }}><span style={styles.boldText}>Yields:</span> {selectedRecipe.yields[0].quantity} {selectedRecipe.yields[0].unit}</Text>
                                        <Text style={{ fontsize: '10px', marginBottom: '10px' }}><span style={styles.boldText}>Shelf Life:</span> 1 Day</Text>
                                        <Text style={{ fontsize: '10px', marginBottom: '10px' }}><span style={styles.boldText}>Method of Preparation:</span></Text>
                                        <Text style={{ fontsize: '10px', marginBottom: '10px' }}>{selectedRecipe.methodPrep}</Text>
                                    </View>
                                    <View style={styles.imageContainer}>
                                        <Image source={{ uri: selectedRecipe.imageUrl }} style={styles.recipeImage} />
                                    </View>
                                </View>
                            </ScrollView>
                            <View style={styles.recipeButtons}>
                                <View style={styles.leftButtonsContainer}>
                                    <Icon.Button
                                        style={styles.blueBtn}
                                        name="edit"
                                        onPress={() => { navigate('/menubuilder', { state: { editRecipeData: selectedRecipe } }), closeModal(); }}
                                        backgroundColor="transparent"
                                        underlayColor="transparent"
                                        iconStyle={{ fontSize: 19 }}
                                        color={"white"}
                                    >
                                        <Text style={{ color: 'white', fontSize: 14, fontFamily: 'inherit' }}>Edit Recipe</Text>
                                    </Icon.Button>
                                    <Icon.Button
                                        style={styles.blueBtn}
                                        name="trash"
                                        onPress={() => { deleteRecipe(selectedRecipe._id) }}
                                        backgroundColor="transparent"
                                        underlayColor="transparent"
                                        iconStyle={{ fontSize: 19 }}
                                        color={"white"}
                                    >
                                        <Text style={{ color: 'white', fontSize: 14, fontFamily: 'inherit' }}>Delete Recipe</Text>
                                    </Icon.Button>
                                    <Icon.Button
                                        style={styles.blueBtn}
                                        name="print"
                                        backgroundColor="transparent"
                                        underlayColor="transparent"
                                        iconStyle={{ fontSize: 19 }}
                                        color={"white"}
                                    >
                                        <Text style={{ color: 'white', fontSize: 14, fontFamily: 'inherit' }}>Print</Text>
                                    </Icon.Button>
                                </View>
                                <View style={styles.rightButtonsContainer}>
                                    <Icon.Button
                                        style={styles.blueTransparentBtn}
                                        name="line-chart"
                                        backgroundColor="transparent"
                                        underlayColor="transparent"
                                        iconStyle={{ fontSize: 19 }}
                                        color={"#47bf93"}
                                    >
                                        <Text style={{ color: '#47bf93', fontSize: 14, fontFamily: 'inherit' }}>Recipe Cost History</Text>
                                    </Icon.Button>
                                    {/* <Icon.Button
                                        style={styles.blueTransparentBtn}
                                        name="history"
                                        backgroundColor="transparent"
                                        underlayColor="transparent"
                                        iconStyle={{ fontSize: 19 }}
                                        color={"#0071cd"}
                                    >
                                        <Text style={{ color: '#0071cd', fontSize: 14 }}>History</Text>
                                    </Icon.Button> */}
                                </View>
                            </View>
                        </View>
                    )}
                </View>
            </View>


            {/* Hover Screen */}
            {/* <Modal isVisible={selectedRecipe !== null} onBackdropPress={closeModal}> */}
            {/* <View style={styles.modalContainer}>
                    {selectedRecipe && (
                        <View style={styles.recipeContainer}>
                            <View style={styles.recipeNameNavbar}>
                                <Icon.Button
                                    name="list-alt"
                                    backgroundColor="transparent"
                                    iconStyle={{ fontSize: 20, marginRight: 5, padding: 0 }}
                                    color={"white"}>
                                    <Text style={[styles.uppercaseText, { fontWeight: '500', color: 'white', fontSize: '18px' }]}>{selectedRecipe.name}</Text>
                                </Icon.Button>
                                <Icon.Button
                                    name="times"
                                    onPress={closeModal}
                                    backgroundColor="transparent"
                                    iconStyle={{ fontSize: 20, padding: 0, margin: 0 }}
                                    color={"white"}>
                                </Icon.Button>
                            </View>
                            <ScrollView>
                                <View style={styles.recipeDetails}>
                                    <View style={styles.detailsContainer}>
                                        <Text style={{ fontsize: '10px', marginBottom: '10px' }}><span style={styles.boldText}>Type:</span> {selectedRecipe.category}</Text>
                                        <Text style={{ fontsize: '10px', marginBottom: '10px' }}><span style={styles.boldText}>Inventory:</span> {selectedRecipe.inventory ? 'Yes' : 'No'}</Text>
                                        <Text style={{ fontsize: '10px', marginBottom: '10px' }}><span style={styles.boldText}>Yields:</span> {selectedRecipe.yields[0].quantity} {selectedRecipe.yields[0].unit}</Text>
                                        <Text style={{ fontsize: '10px', marginBottom: '10px' }}><span style={styles.boldText}>Shelf Life:</span> 1 Day</Text>
                                        <Text style={{ fontsize: '10px', marginBottom: '10px' }}><span style={styles.boldText}>Method of Preparation:</span></Text>
                                        <Text style={{ fontsize: '10px', marginBottom: '10px' }}>{selectedRecipe.methodPrep}</Text>
                                    </View>
                                    <View style={styles.imageContainer}>
                                        <Image source={{ uri: `data:${selectedRecipe.photo.img.contentType};base64,${ImageBase64.encode(selectedRecipe.photo.img.data.data)}` }} style={styles.recipeImage} />
                                        <Image source={{ uri: `https://images.unsplash.com/photo-1565299624946-b28f40a0ae38?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MTF8fGZvb2R8ZW58MHx8MHx8fDA%3D` }} style={styles.recipeImage} />
                                    </View>
                                </View>
                            </ScrollView>
                            <View style={styles.recipeButtons}>
                                <View style={styles.leftButtonsContainer}>
                                    <Icon.Button
                                        style={styles.blueBtn}
                                        name="edit"
                                        onPress={() => { navigation.navigate('MenuBuilder', { editRecipeData: selectedRecipe }), closeModal(); }}
                                        backgroundColor="transparent"
                                        iconStyle={{ fontSize: 19 }}
                                        color={"white"}
                                    >
                                        <Text style={{ color: 'white', fontSize: 14 }}>Edit Recipe</Text>
                                    </Icon.Button>
                                    <Icon.Button
                                        style={styles.blueBtn}
                                        name="trash"
                                        onPress={() => { deleteRecipe(selectedRecipe._id) }}
                                        backgroundColor="transparent"
                                        iconStyle={{ fontSize: 19 }}
                                        color={"white"}
                                    >
                                        <Text style={{ color: 'white', fontSize: 14 }}>Delete Recipe</Text>
                                    </Icon.Button>
                                    <Icon.Button
                                        style={styles.blueBtn}
                                        name="print"
                                        backgroundColor="transparent"
                                        iconStyle={{ fontSize: 19 }}
                                        color={"white"}
                                    >
                                        <Text style={{ color: 'white', fontSize: 14 }}>Print</Text>
                                    </Icon.Button>
                                </View>
                                <View style={styles.rightButtonsContainer}>
                                    <Icon.Button
                                        style={styles.blueTransparentBtn}
                                        name="line-chart"
                                        backgroundColor="transparent"
                                        iconStyle={{ fontSize: 19 }}
                                        color={"#0071cd"}
                                    >
                                        <Text style={{ color: '#0071cd', fontSize: 14 }}>Recipe Cost History</Text>
                                    </Icon.Button>
                                    <Icon.Button
                                        style={styles.blueTransparentBtn}
                                        name="history"
                                        backgroundColor="transparent"
                                        iconStyle={{ fontSize: 19 }}
                                        color={"#0071cd"}
                                    >
                                        <Text style={{ color: '#0071cd', fontSize: 14 }}>History</Text>
                                    </Icon.Button>
                                </View>
                            </View>
                        </View>
                    )}
                </View> */}
            {/* </Modal> */}
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        // alignItems: 'center',
        // justifyContent: 'center',
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
    tableNavBtn: {
        position: "relative",
        height: 35,
        margin: 3,
        borderRadius: 12,
        backgroundColor: "#47bf93",
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
        borderRadius: 12,
        paddingHorizontal: 10,
    },
    searchIcon: {
        marginLeft: 10,
    },
    splitScreenContainer: {
        flex: 1,
        flexDirection: 'row',
        // marginTop: 10,
    },
    tableContainer: {
        flex: 1,
        backgroundColor: 'white',
    },
    dataTable: {
        // marginTop: 5,
    },
    header: {
        borderBottomWidth: 1,
        borderBottomColor: 'black',
        backgroundColor: 'white',
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
    evenRow: {
        backgroundColor: '#f2f0f0',
    },
    oddRow: {
        backgroundColor: '#fff',
    },
    modalContainer: {
        flex: 1,
        backgroundColor: 'rgba(0, 0, 0, 0.5)',
        justifyContent: 'center',
        alignItems: 'center',
        margin: 20,
        borderRadius: 5,
        maxHeight: '80%',
        width: '70%',
        alignSelf: 'center',
    },
    recipeContainer: {
        // width: '100%',
        // height: '100%',
        flex: 1,
        backgroundColor: '#fff',
        border: '3.5px solid #47bf93',
        borderRadius: 5,
        overflow: 'hidden',
        marginRight: '10px'
    },
    recipeNameNavbar: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        padding: 5,
        backgroundColor: '#47bf93',
        color: '#fff',
    },
    uppercaseText: {
        textTransform: 'uppercase',
    },
    recipeDetails: {
        flexDirection: 'row',
        padding: 20,
    },
    detailsContainer: {
        flex: 1,
        paddingRight: 20,
    },
    boldText: {
        fontWeight: 'bold',
    },
    imageContainer: {
        flex: 1,
        justifyContent: 'centre',
        alignItems: 'center',
    },
    recipeImage: {
        width: '70%',
        height: 250,
        borderRadius: 5,
        resizeMode: 'cover',
    },
    recipeButtons: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        padding: 10,
    },
    leftButtonsContainer: {
        flexDirection: 'row',
    },
    rightButtonsContainer: {
        flexDirection: 'row',
    },
    blueBtn: {
        position: "relative",
        // width: 200,
        height: 35,
        marginRight: 5,
        paddingHorizontal: 10,
        paddingVertical: 5,
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
        paddingVertical: 5,
        borderRadius: 12,
        borderWidth: 2,
        borderColor: "#47bf93",
        // backgroundColor: "#0071cd",
        justifyContent: "center"
    }
});

export default MenuItems;
