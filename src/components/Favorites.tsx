import React, {useEffect, useState} from "react";
import {useDispatch, useSelector} from "react-redux";
import {
    Button,
    Checkbox,
    Paper,
    Rating, svgIconClasses,
    Table,
    TableBody,
    TableCell,
    TableRow,
    Typography
} from "@mui/material";
import KeyboardArrowUpIcon from '@mui/icons-material/KeyboardArrowUp';
import KeyboardArrowDownIcon from '@mui/icons-material/KeyboardArrowDown';
import FavoriteBorder from '@mui/icons-material/FavoriteBorder';
import Favorite from '@mui/icons-material/Favorite';
import {newHotels, days, checkIn} from "../selectors";
import {getNewHotelList} from "../reducers/pricesSlice";
import "./styles.scss";

export interface HotelItem {
    hotelId: number,
    hotelName: string,
    priceFrom: number,
    stars: number,
    favorite: boolean
}

const Favorites = () => {

    const dispatch = useDispatch();
    const [price, setPrice] = useState(false);
    const [priceUp, setPriceUp] = useState(false);
    const [rating, setRating] = useState(true);
    const [ratingUp, setRatingUp] = useState(true);
    const [favHotels, setFavHotels] = useState<HotelItem[]>([]);
    const [favorite, setFavorite] = useState(false)
    const [hotels, setHotels] = useState<HotelItem[]>([])
    const getNewList = useSelector(newHotels);
    const day = useSelector(days);
    const date = useSelector(checkIn);


    useEffect(() => {
        let storageHotels = localStorage.getItem('hotels');
        if (storageHotels !== null) {
            setHotels(JSON.parse(storageHotels));
            //получаем из общего списка отелей - избранные
            let sortedHotels = JSON.parse(storageHotels).filter((item: HotelItem) => item.favorite);
            //получаем старый сохраненный список избранных
            let favoriteHotelsList: string | null = localStorage.getItem('fav');
            if (favoriteHotelsList) {
                let prevFav = JSON.parse(favoriteHotelsList);
                if (prevFav.length > 0) {
                    //проверяем совпадение отелей в старом сохраненном и новом списке избранных
                    let hotelList = prevFav.filter((item: HotelItem) => {
                        let res = sortedHotels.some((j: HotelItem) => {
                            return item.hotelId === j.hotelId;
                        });
                        if (!res) return item
                    })
                    //добавляем в новый список те избранные, что дополнительно есть в старом
                    sortedHotels.push(...hotelList);
                }
            }
            //если нет ранее сохраненных избранных
            setFavHotels(sortedHotels);
        }
    }, [getNewList]);

    const heartCheckedToLocalStorage = (htl: HotelItem) => {
        localStorage.removeItem('hotels');
        localStorage.setItem('hotels', JSON.stringify(hotels));
        let favoriteHtls: string | null = localStorage.getItem('fav');
        if (favoriteHtls) {
            let prevFavorite: HotelItem[] = JSON.parse(favoriteHtls);
            //удаление из избранных
            if (!htl.favorite && prevFavorite.length > 0) {
                //удаление из списка сохраненных избранных конкретного элемента
                let newFav = prevFavorite.filter((hotel: HotelItem) => hotel.hotelId !== htl.hotelId);
                localStorage.removeItem('fav');
                localStorage.setItem('fav', JSON.stringify(newFav));
            }
        }
    }


    const sortFavHotels = favHotels.filter((item: HotelItem) => item.favorite);


    const sortData =
        rating ?
            ratingUp ? favHotels.sort((a, b) => a.stars > b.stars ? 1 : -1)
                :
                favHotels.sort((a, b) => a.stars < b.stars ? 1 : -1)
            :
            priceUp ?
                favHotels.sort((a, b) => a.priceFrom > b.priceFrom ? 1 : -1)
                :
                favHotels.sort((a, b) => a.priceFrom < b.priceFrom ? 1 : -1)


    return (
        <>
            <Paper elevation={2} className='favoritesContainer'>
                <h2 className='favTitle'>
                    Избранное
                </h2>

                <Button
                    style={{marginRight: "10px",
                        fontSize: '14px',
                        borderColor: rating ? '#41522E' : 'lightgrey',
                        color: rating ? '#41522E' : 'lightgrey',
                        textTransform: 'unset'}}
                    onClick={() => {
                        setPrice(false);
                        setRating(true);
                        setRatingUp(!ratingUp)
                        setPriceUp(false)
                    }}
                    variant="outlined"
                    color='inherit'
                    endIcon={<div className='buttonIcon'><KeyboardArrowUpIcon
                        style={{color: (ratingUp && rating) ? '#41522E' : 'lightgray'}}/>
                        <KeyboardArrowDownIcon style={{color: (!ratingUp && rating) ? '#41522E' : 'lightgray'}}/></div>}>
                    Рейтинг
                </Button>
                <Button
                    style={{borderColor: price ? '#41522E' : 'lightgrey',  color: price ? '#41522E' : 'lightgrey', textTransform: 'unset'}}
                    onClick={() => {
                        setRating(false);
                        setPrice(true);
                        setPriceUp(!priceUp)
                        setRatingUp(false)
                    }}
                    variant="outlined"
                    color='inherit'
                    endIcon={<div className='buttonIcon'><KeyboardArrowUpIcon
                        style={{color: (priceUp && price) ? '#41522E' : 'lightgray'}}/>
                        <KeyboardArrowDownIcon style={{color: (!priceUp && price) ? '#41522E' : 'lightgray'}}/></div>}>
                    Цена
                </Button>
                {sortFavHotels.length > 0 &&
                    <Table>
                        <TableBody>
                            {sortData.map((item) => {
                                return (
                                        <TableRow key={item.hotelId}>
                                            <TableCell scope="row">
                                                <div className='hotelList'>
                                                    <span>{item.hotelName}</span>
                                                    <Checkbox icon={<FavoriteBorder/>}
                                                              checkedIcon={<Favorite style={{color: 'red'}}/>}
                                                              checked={item.favorite}
                                                              value={favorite}
                                                              onClick={() => {
                                                                  setFavorite(!favorite);
                                                                  item.favorite = false;
                                                                  hotels?.map((hotel) => {
                                                                      if (hotel.hotelId === item.hotelId) hotel.favorite = false
                                                                  });
                                                                  heartCheckedToLocalStorage(item);
                                                                  dispatch(getNewHotelList(!getNewList))
                                                              }}/>
                                                </div>
                                                <p> {date} - {day} дней</p>
                                                <div className='stars'>
                                                    <Rating name="read-only" value={item.stars} readOnly/>
                                                    <div>
                                                        <span className='price'>Price</span>
                                                        <span className='rub'>{item.priceFrom} ₽</span>
                                                    </div>
                                                </div>
                                            </TableCell>
                                        </TableRow>)})}
                        </TableBody>
                    </Table>
                }
            </Paper>
        </>)
}

export default Favorites