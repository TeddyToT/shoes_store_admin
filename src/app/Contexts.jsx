"use client";
import { createContext, useState, useEffect } from "react";
import axios from "axios";

export const Contexts = createContext({})

export const AppProvider = ({ children }) => {
    // const[email, setEmail] = useState("")
    const [users, setUsers] = useState([]);
    const [products, setProducts] = useState([]);
    const [categories, setCategories] = useState([]);
    const [manufacturers, setManufacturers] = useState([]);
    const [orders, setOrders] = useState([]);
    const [feedbacks, setFeedbacks] = useState([]);
    const [carts, setCarts] = useState([]);
    const [shop, setShop] = useState([]);
    const [banners, setBanners] = useState([]);
    
    

    const fetchProducts = () => {
        axios.get("http://localhost/be-shopbangiay/api/product.php")
            .then((res) => {
                
                setProducts(res.data);
            })
            .catch((err) => {
                console.log(err);
            });
    };
    
    const fetchCategories = () => {
        axios.get("http://localhost/be-shopbangiay/api/category.php")
            .then((res) => {
               
                setCategories(res.data);
            })
            .catch((err) => {
                console.log(err);
            });
    };
    const fetchUsers = () => {
        axios.get("http://localhost/be-shopbangiay/api/user.php")
            .then((res) => {
                
                setUsers(res.data);
            })
            .catch((err) => {
                console.log(err);
            });
    };

    const fetchOrders = () => {
        axios.get("http://localhost/be-shopbangiay/api/invoice.php")
            .then((res) => {
                
                setOrders(res.data);
            })
            .catch((err) => {
                console.log(err);
            });
    };
    const fetchManufacturers = () => {
        axios.get("http://localhost/be-shopbangiay/api/manufacturer.php")
            .then((res) => {
                
                setManufacturers(res.data);
            })
            .catch((err) => {
                console.log(err);
            });
    };

    
   
    const fetchFeedbacks= () => {
        axios.get("http://localhost/be-shopbangiay/api/feedback.php")
            .then((res) => {
                
                setFeedbacks(res.data);
            })
            .catch((err) => {
                console.log(err);
            });
    };
    const fetchCarts= () => {
        axios.get("http://localhost/be-shopbangiay/api/cart.php")
            .then((res) => {
                
                setCarts(res.data);
            })
            .catch((err) => {
                console.log(err);
            });
    };
    const fetchShop= () => {
        axios.get("http://localhost/be-shopbangiay/api/shop.php")
            .then((res) => {
                
                setShop(res.data);
            })
            .catch((err) => {
                console.log(err);
            });
    };
    const fetchBanners= () => {
        axios.get("http://localhost/be-shopbangiay/api/banner.php")
            .then((res) => {
                
                setBanners(res.data);
            })
            .catch((err) => {
                console.log(err);
            });
    };

    useEffect(() => {
        fetchProducts();
        fetchCategories();
        fetchUsers();
        fetchManufacturers();
        fetchOrders();
        fetchShop();
        fetchBanners();
    }, []);
    
    return (
        <Contexts.Provider value={{
            products, setProducts, fetchProducts,
            categories, setCategories, fetchCategories, 
            users, setUsers, fetchUsers,
            manufacturers, setManufacturers, fetchManufacturers,
            orders, setOrders, fetchOrders,
            feedbacks, setFeedbacks, fetchFeedbacks,
            carts, setCarts, fetchCarts,
            shop, setShop, fetchShop,
            banners, setBanners, fetchBanners
            

        }}>
            {children}
        </Contexts.Provider>
    );
};
