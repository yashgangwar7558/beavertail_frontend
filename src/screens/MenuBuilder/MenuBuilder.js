import React, { useContext, useState, useEffect } from 'react';
import { ScrollView, View, Text, TextInput, Button, StyleSheet, FlatList, TouchableOpacity, Picker } from 'react-native';
import { useLocation } from 'react-router-dom';
import { useNavigate } from 'react-router'
import Icon from 'react-native-vector-icons/FontAwesome';
import { useDropzone } from 'react-dropzone';
import client from '../../utils/ApiConfig'
import { AuthContext } from '../../context/AuthContext.js'
import LoadingScreen from '../../components/LoadingScreen';

const MenuBuilder = () => {
    const navigate = useNavigate({});
    const location = useLocation();
    const { userInfo, isLoading, logout } = useContext(AuthContext);
    const [loading, setLoading] = useState(false);
    const [isFocused, setIsFocused] = useState(false);
    const [searchTerm, setSearchTerm] = useState('');
    const [searchResults, setSearchResults] = useState([]);
    const [categories, setCategories] = useState([]);
    const [ingredients, setIngredient] = useState([]);
    const [selectedIngredient, setSelectedIngredient] = useState({});
    const [currentCost, setCurrentCost] = useState();
    const [unitMaps, setUnitMaps] = useState([]);
    const [editMode, setEditMode] = useState(location.state ? true : false);
    const [recipeData, setRecipeData] = useState({
        tenantId: userInfo.user.tenant,
        name: '',
        category: '',
        yields: [{ quantity: '', unit: '' }],
        photo: null,
        methodPrep: '',
        ingredients: [], // { ingredient_id: '', name: '', category: '', quantity: '', unit: '', notes: '' }
        modifierCost: '',
        menuPrice: '',
        menuType: '',
    });

    const menuTypes = ['Special', 'Breads', 'Breakfast', 'MainCourse', 'Starters', 'Chefs Special', 'Shakes'];
    const yieldUnits = ['Each', 'Serving'];

    const editRecipeData = location.state?.editRecipeData || null;

    const getCategories = async () => {
        try {
            const tenant = { tenantId: userInfo.user.tenant };
            const result = await client.post('/get-types', tenant, {
                headers: { 'Content-Type': 'application/json' },
            })
            const extractedCategories = result.data.types.map((item) => item.type)
            setCategories(extractedCategories)
        } catch (error) {
            console.log(`getting categories error ${error}`);
        }
    }
    
    const getIngredients = async () => {
        try {
            const tenant = { tenantId: userInfo.user.tenant };
            const result = await client.post('/get-ingredients', tenant, {
                headers: { 'Content-Type': 'application/json' },
            })
            setIngredient(result.data.ingredients)
        } catch (error) {
            console.log(`getting ingredients error ${error}`);
        }
    }
    const getUnitMaps = async () => {
        try {
            const tenant = { tenantId: userInfo.user.tenant };
            const result = await client.post('/get-unitmaps', tenant, {
                headers: { 'Content-Type': 'application/json' },
            })
            setUnitMaps(result.data.unitMaps)
        } catch (error) {
            console.log(`getting unitmaps error ${error}`);
        }
    }
    const costEstimation = async () => {
        let totalCost = 0;
        for (const ingredient of recipeData.ingredients) {

            const matchingIngredient = ingredients.find(
                (allIngredient) => allIngredient._id.toString() === ingredient.ingredient_id
            );

            if (matchingIngredient && ingredient.quantity !== '' && ingredient.unit !== '') {
                const unitMap = unitMaps.find(
                    (unitMap) => unitMap.ingredient_id.toString() === ingredient.ingredient_id
                );
                const toUnit = unitMap ? unitMap.toUnit : ingredient.unit;
                const convertedQuantity = ingredient.quantity * getConversionFactor(ingredient.unit, toUnit, unitMap.fromUnit);
                const costPerUnit = matchingIngredient.avgCost / getConversionFactor(matchingIngredient.invUnit, toUnit, unitMap.fromUnit) || 0;
                totalCost += costPerUnit * convertedQuantity;
            }
        }

        setCurrentCost(totalCost);
    }

    const getConversionFactor = (fromUnit, toUnit, fromUnitArray) => {
        const conversionObject = fromUnitArray.find((unit) => unit.unit === fromUnit);
        return conversionObject ? conversionObject.conversion : 1;
    };

    useEffect(() => {
        getCategories();
        getIngredients();
        getUnitMaps();
        costEstimation();
        if (editMode) {
            setRecipeData({
                tenantId: userInfo.user.tenant,
                name: editRecipeData.name,
                category: editRecipeData.category,
                yields: editRecipeData.yields || [{ quantity: '', unit: '' }],
                photo: editRecipeData.photo || null,
                methodPrep: editRecipeData.methodPrep || '',
                ingredients: editRecipeData.ingredients || [],
                modifierCost: editRecipeData.modifierCost || '',
                menuPrice: editRecipeData.menuPrice || '',
                menuType: editRecipeData.menuType || '',
            });
            setCurrentCost(editRecipeData.cost)
            setEditMode(false)
        }
    }, [recipeData]);


    const handleYieldsChange = (index, field, value) => {
        const updatedYields = [...recipeData.yields];
        updatedYields[index][field] = value;
        setRecipeData({ ...recipeData, yields: updatedYields });
    };

    const handleIngredientSearch = (text) => {
        // Filter ingredients based on search term  
        const results = ingredients.filter(ingredient =>
            ingredient.name.toLowerCase().includes(text.toLowerCase())
        );
        setSearchResults(results);
        if (text.length == 0) {
            setSearchResults([])
        }
    };

    const handleAddIngredient = (ingredient) => {
        setSelectedIngredient({ ingredient });
        setRecipeData({
            ...recipeData,
            ingredients: [...recipeData.ingredients, {
                ingredient_id: ingredient._id,
                name: ingredient.name,
                category: ingredient.category,
                quantity: '',
                unit: '',
                notes: '',
            }],
        });
        setSearchTerm('');
        setSearchResults([]);
    };

    const handleIngredientsChange = (index, field, value) => {
        const updatedIngredients = [...recipeData.ingredients];
        updatedIngredients[index][field] = value;
        setRecipeData({ ...recipeData, ingredients: updatedIngredients });
    };

    const handleAddItem = (arrayName) => {
        setRecipeData({
            ...recipeData,
            [arrayName]: [...recipeData[arrayName], {}],
        });
    };

    const handleDeleteIngredient = (index) => {
        const updatedIngredients = [...recipeData.ingredients];
        updatedIngredients.splice(index, 1);
        setRecipeData({ ...recipeData, ingredients: updatedIngredients });
    };

    const handleDeleteYield = (index) => {
        const updatedYields = [...recipeData.yields];
        updatedYields.splice(index, 1);
        setRecipeData({ ...recipeData, yields: updatedYields });
    };

    const onDrop = (acceptedFiles) => {
        setRecipeData({ ...recipeData, photo: acceptedFiles[0] });
    };

    const { getRootProps, getInputProps } = useDropzone({
        onDrop,
        accept: 'image/*',
    });

    const handleSubmit = async () => {
        try {
            setLoading(true)
            const data = new FormData();
            data.append('tenantId', recipeData.tenantId);
            data.append('name', recipeData.name);
            data.append('category', recipeData.category);
            data.append('yields', JSON.stringify(recipeData.yields));
            data.append('photo', recipeData.photo);
            data.append('methodPrep', recipeData.methodPrep);
            data.append('ingredients', JSON.stringify(recipeData.ingredients));
            data.append('modifierCost', recipeData.modifierCost);
            data.append('menuPrice', recipeData.menuPrice);
            data.append('menuType', recipeData.menuType);

            let result;

            if (editRecipeData && editRecipeData._id) {
                data.append('recipeId', editRecipeData._id);
                data.append('imageUrl', editRecipeData.imageUrl);
                result = await client.post('/update-recipe', data, {
                    headers: {
                        'content-type': 'multipart/form-data'
                    },
                })
            } else {
                result = await client.post('/create-recipe', data, {
                    headers: {
                        'content-type': 'multipart/form-data'
                    },
                })
            }

            if (result.data.success) {
                setRecipeData({
                    tenantId: userInfo.user.tenant,
                    name: '',
                    category: '',
                    yields: [{ quantity: '', unit: '' }],
                    photo: null,
                    methodPrep: '',
                    ingredients: [{ ingredient_id: '', name: '', category: '', quantity: '', unit: '', notes: '' }],
                    modifierCost: '',
                    menuPrice: '',
                    menuType: '',
                });
                navigate('/menu');
                setLoading(false)
            } else {
                setLoading(false)
                alert(result.data.message)
            }
        } catch (error) {
            console.log(`create recipe error ${error}`);
            setLoading(false)
        }
    };

    // <==================================================================================================================================>

    return (
        <View style={{ flex: 1 }}>
            <ScrollView
                style={styles.formContainer}
            >
                <View style={styles.inputContainer}>
                    <Text style={styles.label}>Name</Text>
                    <TextInput
                        style={[styles.input]}
                        value={recipeData.name}
                        onChangeText={(text) => setRecipeData({ ...recipeData, name: text })}
                    />
                </View>

                <View style={styles.inputContainer}>
                    <Text style={styles.label}>Type</Text>
                    <Picker
                        style={styles.input}
                        selectedValue={recipeData.category}
                        onValueChange={(itemValue) => setRecipeData({ ...recipeData, category: itemValue })}
                    >
                        <Picker.Item label="Select a Recipe Type..." value="" />
                        {categories.map((category, index) => (
                            <Picker.Item key={index} label={category} value={category} />
                        ))}
                    </Picker>
                </View>

                <View style={styles.inputContainer}>
                    <Text style={styles.label}>Yields<span>  </span>
                        <Icon.Button style={styles.greenBtn}
                            name="plus-circle"
                            backgroundColor="transparent"
                            underlayColor="transparent"
                            color={"#47bf93"}
                            onPress={() => handleAddItem('yields')}>
                            <Text style={{ color: '#47bf93', fontSize: 15, fontFamily: 'inherit' }}>Add Yields</Text>
                        </Icon.Button>
                    </Text>
                    {recipeData.yields.map((yieldItem, index) => (
                        <View key={index} style={styles.rowContainer}>
                            <TextInput
                                style={styles.smallInput}
                                keyboardType='numeric'
                                placeholder="Enter a quantity"
                                placeholderTextColor="gray"
                                value={yieldItem.quantity ? yieldItem.quantity.toString() : ''}
                                onChangeText={(text) => handleYieldsChange(index, 'quantity', parseFloat(text))}
                            />
                            <Picker
                                style={styles.smallInput}
                                selectedValue={yieldItem.unit}
                                onValueChange={(itemValue) => handleYieldsChange(index, 'unit', itemValue)}
                            >
                                <Picker.Item label="Select a unit..." value="" />
                                {yieldUnits.map((unit, index) => (
                                    <Picker.Item key={index} label={unit} value={unit} />
                                ))}
                            </Picker>
                            <Icon.Button style={styles.crossBtn}
                                name="times-circle-o"
                                onPress={() => handleDeleteYield(index)}
                                backgroundColor="transparent"
                                underlayColor="transparent"
                                iconStyle={{ margin: 0, padding: 0, fontSize: 25, fontFamily: 'inherit' }}
                                color={"gray"}>
                            </Icon.Button>
                        </View>
                    ))}
                </View>

                <View style={styles.inputContainer}>
                    <Text style={styles.label}>Media<span>  </span>
                        <Icon.Button style={styles.greenBtn}
                            name="camera"
                            backgroundColor="transparent"
                            underlayColor="transparent"
                            iconStyle={{ fontSize: 18 }}
                            color={"#47bf93"}>
                            <Text style={{ color: '#47bf93', fontSize: 15, fontFamily: 'inherit' }}>Add Media</Text>
                        </Icon.Button>
                    </Text>
                    <div {...getRootProps()} style={styles.dropzone}>
                        <input {...getInputProps()} />
                        <p style={{fontFamily: 'inherit'}}>Drag 'n' drop your media here, or click to select one</p>
                    </div>
                    {recipeData.photo && (
                        <Text style={{ color: '#47bf93' }}>Files Added Successfully! <span style={{ color: 'blue', cursor: 'pointer' }} onClick={() => setRecipeData({ ...recipeData, photo: null })}>Reset</span></Text>
                    )}
                </View>

                <View style={styles.inputContainer}>
                    <Text style={styles.label}>Method of Preparation</Text>
                    <TextInput
                        style={[styles.input, styles.multilineInput]}
                        placeholder='Type your recipe steps'
                        placeholderTextColor="gray"
                        multiline
                        numberOfLines={4}
                        value={recipeData.methodPrep}
                        onChangeText={(text) => setRecipeData({ ...recipeData, methodPrep: text })}
                    />
                </View>

                <View style={styles.inputContainer}>
                    <Text style={styles.label}>Ingredients<span>  </span>
                        <Icon.Button style={styles.greenBtn}
                            name="plus-circle"
                            backgroundColor="transparent"
                            underlayColor="transparent"
                            color={"#47bf93"}>
                            <Text style={{ color: '#47bf93', fontSize: 15, fontFamily: 'inherit' }}>Add Food</Text>
                        </Icon.Button><span>   </span>
                        <Icon.Button style={styles.greenBtn}
                            name="plus-circle"
                            backgroundColor="transparent"
                            underlayColor="transparent"
                            color={"#47bf93"}>
                            <Text style={{ color: '#47bf93', fontSize: 15, fontFamily: 'inherit' }}>Add Non-Alcoholic Beverage</Text>
                        </Icon.Button><span>   </span>
                        <Icon.Button style={styles.greenBtn}
                            name="plus-circle"
                            backgroundColor="transparent"
                            underlayColor="transparent"
                            color={"#47bf93"}>
                            <Text style={{ color: '#47bf93', fontSize: 15, fontFamily: 'inherit' }}>Add Alcohol</Text>
                        </Icon.Button><span>   </span>
                        <Icon.Button style={styles.greenBtn}
                            name="plus-circle"
                            backgroundColor="transparent"
                            underlayColor="transparent"
                            color={"#47bf93"}>
                            <Text style={{ color: '#47bf93', fontSize: 15, fontFamily: 'inherit' }}>Add Recipe</Text>
                        </Icon.Button><span>   </span>
                        <Icon.Button style={styles.redBtn}
                            name="times"
                            backgroundColor="transparent"
                            underlayColor="transparent"
                            color={"#ff3131"}>
                            <Text style={{ color: '#ff3131', fontSize: 15, fontFamily: 'inherit' }}>Delete Ingredient</Text>
                        </Icon.Button>
                    </Text>
                    {/* Search Input */}
                    <View style={styles.searchBarContainer}>
                        <Icon name="search" size={20} color="gray" style={styles.searchIcon} />
                        <TextInput
                            style={styles.searchBar}
                            placeholder="Search Ingredient"
                            placeholderTextColor="gray"
                            selectTextOnFocus={false}
                            value={searchTerm}
                            onChangeText={(text) => {
                                setSearchTerm(text);
                                handleIngredientSearch(text);
                            }}
                        />
                    </View>
                    {/* Search Results */}
                    {searchResults.length > 0 && (
                        <FlatList
                            style={styles.dropdownMenu}
                            data={searchResults}
                            keyExtractor={(item) => item._id}
                            renderItem={({ item }) => (
                                <TouchableOpacity
                                    style={styles.dropdownItem}
                                    onPress={() => handleAddIngredient(item)}
                                >
                                    <Text>{item.name}</Text>
                                </TouchableOpacity>
                            )}
                        />
                    )}
                    {/* Ingredient Inputs */}
                    {recipeData.ingredients.map((ingredient, index) => (
                        <View key={index} style={styles.rowContainer}>
                            <TextInput
                                style={styles.smallInputNonEditable}
                                placeholder="Name"
                                placeholderTextColor="gray"
                                value={ingredient.name}
                                editable={false}
                                onChangeText={(text) => handleIngredientsChange(index, 'name', text)}
                            />
                            <TextInput
                                style={styles.smallInputNonEditable}
                                placeholder="Category"
                                placeholderTextColor="gray"
                                value={ingredient.category}
                                editable={false}
                                onChangeText={(text) => handleIngredientsChange(index, 'category', text)}
                            />
                            <TextInput
                                style={styles.smallInput}
                                placeholder="Enter a Quantity"
                                placeholderTextColor="gray"
                                value={ingredient.quantity ? ingredient.quantity.toString() : ''}
                                onChangeText={(text) => handleIngredientsChange(index, 'quantity', parseFloat(text))}
                            />
                            <Picker
                                style={styles.smallInput}
                                selectedValue={ingredient.unit}
                                onValueChange={(itemValue) => handleIngredientsChange(index, 'unit', itemValue)}
                            >
                                <Picker.Item label="Select a Unit..." value="" />
                                {
                                    unitMaps.find(map => map.ingredient_id === ingredient.ingredient_id)?.fromUnit.map((unit, index) => (
                                        <Picker.Item key={index} label={unit.unit} value={unit.unit} />
                                    ))
                                }
                            </Picker>
                            <TextInput
                                style={styles.smallInput}
                                placeholder="Notes"
                                placeholderTextColor="gray"
                                value={ingredient.notes}
                                onChangeText={(text) => handleIngredientsChange(index, 'notes', text)}
                            />
                            <Icon.Button style={styles.crossBtn}
                                name="times-circle-o"
                                onPress={() => handleDeleteIngredient(index)}
                                backgroundColor="transparent"
                                underlayColor="transparent"
                                iconStyle={{ margin: 0, padding: 0, fontSize: 25 }}
                                color={"gray"}>
                            </Icon.Button>
                        </View>
                    ))}
                    <Text style={{ fontSize: '15px', fontWeight: 'bold' }}>Estimated Cost: <span style={{ color: '#2bb378' }}>${currentCost ? currentCost.toFixed(2) : '0'}</span></Text>
                </View>

                <View style={styles.inputContainer}>
                    <Text style={styles.label}>Additional Cost</Text>
                    <TextInput
                        style={styles.input}
                        keyboardType='numeric'
                        value={recipeData.modifierCost ? recipeData.modifierCost.toString() : ''}
                        onChangeText={(text) => setRecipeData({ ...recipeData, modifierCost: parseFloat(text) })}
                    />
                </View>

                <View style={styles.inputContainer}>
                    <Text style={styles.label}>Menu Price</Text>
                    <TextInput
                        style={styles.input}
                        keyboardType='numeric'
                        value={recipeData.menuPrice ? recipeData.menuPrice.toString() : ''}
                        onChangeText={(text) => setRecipeData({ ...recipeData, menuPrice: parseFloat(text) })}
                    />
                </View>

                <View style={styles.inputContainer}>
                    <Text style={styles.label}>Menu Type</Text>
                    <Picker
                        style={styles.input}
                        selectedValue={recipeData.menuType}
                        onValueChange={(itemValue) => setRecipeData({ ...recipeData, menuType: itemValue })}
                    >
                        <Picker.Item label="Select a Menu Type..." value="" />
                        {menuTypes.map((type, index) => (
                            <Picker.Item key={index} label={type} value={type} />
                        ))}
                    </Picker>
                </View>

                <Icon.Button
                    style={styles.createBtn}
                    onPress={handleSubmit}
                    name="cutlery"
                    backgroundColor="transparent"
                    underlayColor="transparent"
                    iconStyle={{ fontSize: 19 }}
                    color={"white"}
                >
                    <Text style={{ color: 'white', fontSize: 20, fontFamily: 'inherit' }}>{editRecipeData ? 'Update Recipe' : 'Create Recipe'}</Text>
                </Icon.Button>

            </ScrollView>
            {loading && <LoadingScreen />}
        </View>
    );
};

const styles = {
    formContainer: {
        marginTop: 20,
        paddingBottom: 30,
        paddingHorizontal: 15,
        backgroundColor: 'white'
    },
    heading: {
        fontSize: 24,
        fontWeight: 'bold',
        marginBottom: 20,
    },
    inputContainer: {
        marginBottom: 20,
    },
    label: {
        fontSize: 16,
        marginBottom: 8,
        fontWeight: 'bold',
        fontFamily: 'inherit',
        fontSize: 16,
    },
    input: {
        height: 40,
        backgroundColor: '#fff',
        borderColor: 'gray',
        borderWidth: 1,
        paddingHorizontal: 10,
        marginBottom: 12,
        borderRadius: 3,
    },
    multilineInput: {
        height: 120,
        borderRadius: 3,
        backgroundColor: '#fff',
        padding: 10,
    },
    rowContainer: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginBottom: 5,
        borderWidth: 1,
        borderColor: 'gray',
        borderRadius: 3,
        padding: 5,
        backgroundColor: '#f2f2f2'
    },
    smallInput: {
        flex: 1,
        height: 40,
        borderColor: 'gray',
        borderWidth: 1,
        borderRadius: 3,
        paddingHorizontal: 10,
        marginRight: 8,
        backgroundColor: '#fff',
    },
    smallInputNonEditable: {
        flex: 1,
        height: 40,
        borderColor: 'gray',
        borderWidth: 1,
        borderRadius: 3,
        paddingHorizontal: 10,
        marginRight: 8,
        backgroundColor: '#e4e1e6'
    },
    searchBarContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: '#fff',
        borderColor: 'gray',
        borderWidth: 1,
        borderRadius: 30,
        paddingHorizontal: 10,
        marginBottom: 8
    },
    searchIcon: {
        marginRight: 10,
    },
    searchBar: {
        flex: 1,
        height: 40,
        color: 'black',
        paddingHorizontal: 5,
        border: 'none'
    },
    dropdownMenu: {
        zIndex: 1,
        borderWidth: 1,
        borderRadius: 5,
        backgroundColor: '#fff',
        marginBottom: 8,
    },
    dropdownItem: {
        padding: 10,
        borderBottomWidth: 1,
        borderColor: '#ccc',
    },
    dropzone: {
        border: '2px dashed #cccccc',
        borderRadius: '4px',
        padding: '20px',
        textAlign: 'center',
        cursor: 'pointer',
    },
    mobileButton: {
        backgroundColor: '#e0e0e0',
        padding: 10,
        alignItems: 'center',
        borderRadius: 5,
        marginTop: 10,
    },
    deleteBtn: {
        backgroundColor: 'red',
        padding: 8,
        borderRadius: 5,
        justifyContent: 'center',
        alignItems: 'center',
    },
    crossBtn: {
        // justifyContent: 'center',
        // alignItems: 'center',
        // padding: 0
        // margin: 0
    },
    greenBtn: {
        borderRadius: 12,
        borderWidth: 2,
        borderColor: "#47bf93",
        padding: 6,
        justifyContent: "center"
    },
    redBtn: {
        borderRadius: 12,
        borderWidth: 2,
        borderColor: "#ff3131",
        padding: 6,
        justifyContent: "center"
    },
    createBtn: {
        position: "relative",
        // width: 185,
        // height: 45,
        marginRight: 5,
        paddingHorizontal: 10,
        paddingVertical: 5,
        borderRadius: 12,
        borderWidth: 2,
        borderColor: "#47bf93",
        backgroundColor: "#47bf93",
        justifyContent: "center",
        alignSelf: "center"
    },
    imagePreview: {
        width: 200,
        height: 200,
        marginTop: 10,
    },
};

export default MenuBuilder;