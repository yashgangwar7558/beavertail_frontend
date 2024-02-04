import React, { useContext, useState, useEffect } from 'react';
import { ScrollView, View, Text, TextInput, Button, StyleSheet, FlatList, TouchableOpacity, Picker } from 'react-native';
import { useLocation } from 'react-router-dom';
import { useNavigate } from 'react-router'
import Icon from 'react-native-vector-icons/FontAwesome';
import { useDropzone } from 'react-dropzone';
import client from '../../utils/ApiConfig'
import { AuthContext } from '../../context/AuthContext.js'
import LoadingScreen from '../../components/LoadingScreen';

const AddInvoice = () => {
    const navigate = useNavigate({});
    const location = useLocation();
    const { userInfo, isLoading, logout } = useContext(AuthContext);
    const [loading, setLoading] = useState(false);
    const [ingredients, setIngredients] = useState([]);
    const [invoiceData, setInvoiceData] = useState({
        userId: userInfo.user.userId,
        invoiceNumber: '',
        vendor: '',
        invoiceDate: '',
        invoiceFile: null,
        ingredients: [],
        payment: '',
        status: '',
        total: '',
    });

    const statusTypes = ['Pending', 'Paid']

    const getIngredients = async () => {
        try {
            const user = { userId: userInfo.user.userId };
            const result = await client.post('/get-ingredients', user, {
                headers: { 'Content-Type': 'application/json' },
            })
            setIngredients(result.data.ingredients)
        } catch (error) {
            console.log(`getting recipes error ${error}`);
        }
    }

    useEffect(() => {
        getIngredients()
    }, [])

    const onDrop = (acceptedFiles) => {
        setInvoiceData({ ...invoiceData, invoiceFile: acceptedFiles[0] })
    };

    const { getRootProps, getInputProps } = useDropzone({
        onDrop,
        accept: 'image/jpeg, image/png, application/pdf',
    });

    const handleSubmit = async () => {
        try {
            setLoading(true)
            const data = new FormData();

            const result = await client.post('/process-invoice', data, {
                headers: {
                    'content-type': 'multipart/form-data'
                },
            })

            if (result.data.success) {
                setInvoiceData({
                    userId: userInfo.user.userId,
                    invoiceNumber: '',
                    vendor: '',
                    invoiceDate: '',
                    invoiceFile: null,
                    ingredients: [{name: '', quantity: '', unit: '', unitPrice: '', total: ''}],
                    payment: '',
                    status: '',
                    total: '',
                });
                navigate('/invoices');
                setLoading(false)
            } else {
                setLoading(false)
                alert(result.data.message)
            }
        } catch (error) {
            console.log(`error adding invoice: ${error}`);
            setLoading(false)
        }
    }

    return (
        <View>Add invoice...</View>
    )
}

export default AddInvoice