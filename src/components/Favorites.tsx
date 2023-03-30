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
import "./styles.scss"


const Favorites = () => {

    const dispatch = useDispatch();
    const [price, setPrice] = useState(false);
    const [priceUp, setPriceUp] = useState(false);
    const [rating, setRating] = useState(true);
    const [ratingUp, setRatingUp] = useState(true);
    const [favHotels, setFavHotels] = useState<{
        hotelId: number,
        hotelName: string,
        priceFrom: number,
        stars: number,
        favorite: boolean
    }[]>([]);
    const [favorite, setFavorite] = useState(false)
    const [hotels, setHotels] = useState<{ hotelId: number, hotelName: string, priceFrom: number, stars: number, favorite: boolean }[]>([])
    const getNewList = useSelector(newHotels);
    const day = useSelector(days);
    const date = useSelector(checkIn)


    useEffect(() => {
        let storageHotels = localStorage.getItem('hotels');

        if (storageHotels !== null) {
            setHotels(JSON.parse(storageHotels));
            let sortedHotels = JSON.parse(storageHotels).filter((item: {
                hotelId: number,
                hotelName: string,
                priceFrom: number,
                stars: number,
                favorite: boolean
            }) => item.favorite === true);

            setFavHotels(sortedHotels)
        }
    }, [getNewList])


    const sortFavHotels = favHotels.filter((item: {
        hotelId: number,
        hotelName: string,
        priceFrom: number,
        stars: number,
        favorite: boolean
    }) => item.favorite === true);


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
                <Typography variant='h6' className='favTitle'>
                    Избранное
                </Typography>

                <Button
                    style={{marginRight: "10px", borderColor: rating ? 'black' : 'lightgrey'}}
                    onClick={() => {
                        setPrice(false);
                        setRating(true);
                        setRatingUp(!ratingUp)
                        setPriceUp(false)
                    }}
                    variant="outlined"
                    color='inherit'
                    endIcon={<div className='buttonIcon'><KeyboardArrowUpIcon
                        style={{color: (ratingUp && rating) ? 'black' : 'lightgray'}}/>
                        <KeyboardArrowDownIcon style={{color: (!ratingUp && rating) ? 'black' : 'lightgray'}}/></div>}>
                    Рейтинг
                </Button>
                <Button
                    style={{borderColor: price ? 'black' : 'lightgrey'}}
                    onClick={() => {
                        setRating(false);
                        setPrice(true);
                        setPriceUp(!priceUp)
                        setRatingUp(false)
                    }}
                    variant="outlined"
                    color='inherit'
                    endIcon={<div className='buttonIcon'><KeyboardArrowUpIcon
                        style={{color: (priceUp && price) ? 'black' : 'lightgray'}}/>
                        <KeyboardArrowDownIcon style={{color: (!priceUp && price) ? 'black' : 'lightgray'}}/></div>}>
                    Цена
                </Button>
                {sortFavHotels.length > 0 &&
                    <Table>
                        <TableBody>
                            {sortData.map((item) => {
                                return (
                                    <>
                                        <TableRow key={item.hotelId}>
                                            <TableCell scope="row">
                                                <div className='hotelList'>
                                                    <span>{item.hotelName}</span>
                                                    <Checkbox icon={<FavoriteBorder/>}
                                                              checkedIcon={<Favorite style={{color: 'red'}}/>}
                                                              checked={item.favorite}
                                                              value={favorite}
                                                              onClick={() => {
                                                                  setFavorite(!favorite)
                                                                  item.favorite = false;
                                                                  hotels?.map((hotel) => {
                                                                      if (hotel.hotelId === item.hotelId) hotel.favorite = false
                                                                  })
                                                                  localStorage.removeItem('hotels');
                                                                  localStorage.setItem('hotels', JSON.stringify(hotels));
                                                                  dispatch(getNewHotelList(!getNewList))
                                                              }}
                                                    />
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
                                        </TableRow>
                                    </>
                                )
                            })
                            }

                        </TableBody>
                    </Table>
                }

            </Paper>
        </>
    )
}

export default Favorites