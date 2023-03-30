import React, {useEffect} from "react";
import {useNavigate} from 'react-router-dom';
import "../App.css";
import Search from "../components/Search";
import Favorites from "../components/Favorites";
import Hotels from "../components/Hotels";
import {getPrices} from "../reducers/pricesSlice";
import {useDispatch} from "react-redux";
import logButton from './../assets/logOut.svg';
import "./styles.scss"


const HotelsPage = () => {

    const navigate = useNavigate();
    const dispatch = useDispatch();
    const user = localStorage.getItem('currentUser');


    useEffect(()=> {
        dispatch(getPrices());
    }, [])


    return (
        <div className='mainContainer'>
            <div
                className='logOut'
            onClick={()=> {
                if (user) {
                    localStorage.removeItem('currentUser');
                    navigate("/")
                }
                if(!user) navigate("/");
            }}>
                Выйти
                <img src={logButton}/>
            </div>
            <div className='innerContainer'>
                <div className='search'>
                    <Search/>
                    <Favorites/>
                </div>
                <Hotels/>
            </div>
        </div>
    )
}

export default HotelsPage