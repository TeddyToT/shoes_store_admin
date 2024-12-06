"use client";
import { createContext, useState, useEffect } from "react";
import axios from "axios";

export const Contexts = createContext({})

export const AppProvider = ({ children }) => {
    // const[email, setEmail] = useState("")
    const [users, setUsers] = useState([]);
    const [products, setProducts] = useState([]);
    const [categories, setCategories] = useState([]);
    const [vouchers, setVouchers] = useState([]);
    const [orders, setOrders] = useState([]);
    
    
    

    const fetchProducts = () => {
        axios.get("http://localhost:8081/v1/api/user/products")
            .then((res) => {
                
                setProducts(res.data);
            })
            .catch((err) => {
                console.log(err);
            });
    };
    const fetchCategories = () => {
        axios.get("http://localhost:8081/v1/api/user/categories")
            .then((res) => {
               
                setCategories(res.data);
            })
            .catch((err) => {
                console.log(err);
            });
    };
    const fetchUsers = () => {
        axios.get("http://localhost:8081/v1/api/user/users")
            .then((res) => {
                
                setUsers(res.data);
            })
            .catch((err) => {
                console.log(err);
            });
    };
    const fetchVouchers = () => {
        axios.get("http://localhost:8081/v1/api/user/vouchers")
            .then((res) => {
                
                setVouchers(res.data);
            })
            .catch((err) => {
                console.log(err);
            });
    };
    const fetchOrders = () => {
        axios.get("http://localhost:8081/v1/api/user/orders")
            .then((res) => {
                
                setOrders(res.data);
            })
            .catch((err) => {
                console.log(err);
            });
    };

    useEffect(() => {
        fetchProducts();
        fetchCategories();
        fetchUsers();
        fetchVouchers();
        fetchOrders();
    }, []);
    
    return (
        <Contexts.Provider value={{
            products, setProducts, fetchProducts,
            categories, setCategories, fetchCategories, 
            users, setUsers, fetchUsers,
            vouchers, setVouchers, fetchVouchers,
            orders, setOrders, fetchOrders
            
        }}>
            {children}
        </Contexts.Provider>
    );
};
