import React, {useEffect, useState} from "react";
import {useDispatch, useSelector,} from "react-redux";
import {Box, Checkbox, Paper, Rating, Table, TableBody, TableCell, TableRow, Typography} from "@mui/material";
import hotelPic from './../assets/img.png';
import hotelPic1 from './../assets/img_1.png';
import hotelPic2 from './../assets/img_2.png';
import hotelPic3 from './../assets/img_1.png';
import KeyboardArrowRightIcon from '@mui/icons-material/KeyboardArrowRight';
import FavoriteBorder from "@mui/icons-material/FavoriteBorder";
import Favorite from "@mui/icons-material/Favorite";
import HomeIcon from '@mui/icons-material/Home';
import {getNewHotelList} from "../reducers/pricesSlice";
import {newHotels, days, checkIn, location} from "../selectors";
import "./styles.scss"
import moment from "moment";


const Hotels = () => {

    const [favorite, setFavorite] = useState(false)
    const [hotels, setHotels] = useState<{ hotelId: number, hotelName: string, priceFrom: number, stars: number, favorite: boolean }[]>([])
    const dispatch = useDispatch();
    const getNewList = useSelector(newHotels);
    const day = useSelector(days);
    const date = useSelector(checkIn);
    const city = useSelector(location)

    useEffect(() => {
        let rawDataHotels;
        rawDataHotels = localStorage.getItem('hotels');
        if (rawDataHotels) setHotels(JSON.parse(rawDataHotels))
    }, [getNewList]);


    return (
        <>
            <Paper elevation={2} className='hotelsContainer'>
                <div className='title'>
                    <Typography variant='h4' className='hotelsTitle'>
                        Отели
                        <KeyboardArrowRightIcon className='arrow' style={{fontSize: "45px",
                        color: "lightgrey"}}/>
                        {city}
                    </Typography>
                    <p>{moment(date).format('LL')}</p>
                </div>
                <Box className='picContainer'>
                    <img src={hotelPic} className='hotelPic'/>
                    <img src={hotelPic1} className='hotelPic'/>
                    <img src={hotelPic2} className='hotelPic'/>
                    <img src={hotelPic3} className='hotelPic'/>
                </Box>

                <Typography className='fav'>
                    {/*Добавлено в избранное: {initialState.favorites.length}*/}
                </Typography>
                <Table>
                    <TableBody>
                        {hotels.map((item) => {
                            return (
                                <>
                                    <TableRow key={item.hotelId}>
                                        <TableCell scope="row" style={{width: '8%'}}>
                                            <div className='homeIcon'>
                                                <HomeIcon style={{color: 'rgba(65, 82, 46, 1)'}}/>
                                            </div>
                                        </TableCell>
                                        <TableCell scope="row">
                                            <div className='hotelList'>
                                                <span>{item.hotelName}</span>
                                                <Checkbox icon={<FavoriteBorder/>}
                                                          checkedIcon={<Favorite style={{color: 'red'}}/>}
                                                          checked={item.favorite}
                                                          value={favorite}
                                                          onClick={() => {
                                                              item['favorite'] = !item['favorite']
                                                              setFavorite(!favorite)
                                                              localStorage.removeItem('hotels');
                                                              localStorage.setItem('hotels', JSON.stringify(hotels))
                                                              dispatch(getNewHotelList(!getNewList))
                                                          }}
                                                />
                                            </div>
                                            <p>{date} - {day} день </p>
                                            <div className='hotelList'>
                                                <Rating name="read-only" value={item.stars} readOnly/>
                                                <div>
                                                    <span className='price'>Price</span>
                                                    <span className='rub'>{item.priceFrom} ₽</span>
                                                </div>
                                            </div>
                                        </TableCell>
                                    </TableRow>
                                </>
                            )
                        })
                        }

                    </TableBody>
                </Table>
            </Paper>
        </>
    )
}

export default Hotels