import React, {useEffect, useState} from "react";
import {useDispatch, useSelector,} from "react-redux";
import {Box, Checkbox, Paper, Rating, Table, TableBody, TableCell, TableRow, Typography} from "@mui/material";
import hotelPic from './../assets/img.png';
import hotelPic1 from './../assets/img_1.png';
import hotelPic3 from './../assets/img_1.png';
import hotelPic2 from './../assets/img_2.png';
import KeyboardArrowRightIcon from '@mui/icons-material/KeyboardArrowRight';
import FavoriteBorder from "@mui/icons-material/FavoriteBorder";
import Favorite from "@mui/icons-material/Favorite";
import HomeIcon from '@mui/icons-material/Home';
import {getNewHotelList} from "../reducers/pricesSlice";
import {checkIn, days, location, newHotels} from "../selectors";
import "./styles.scss"
import {HotelItem} from "./Favorites";
import {data} from '../assets/IATAdata';


const Hotels = () => {

    const [favorite, setFavorite] = useState(false)
    const [hotels, setHotels] = useState<HotelItem[]>([])
    const dispatch = useDispatch();
    const getNewList = useSelector(newHotels);
    const day = useSelector(days);
    const date = useSelector(checkIn);
    const city = useSelector(location)
    let favoriteHotels: string | null = localStorage.getItem('fav');
    let rawDataHotels = localStorage.getItem('hotels');

    useEffect(() => {

        if (rawDataHotels) {
            setHotels(JSON.parse(rawDataHotels));
        }

        if (favoriteHotels && rawDataHotels) {
            let favoriteHtls: HotelItem[] = JSON.parse(favoriteHotels);
            if (favoriteHtls.length > 0) {
                let buffer: HotelItem[] = [];
                //отели, которые есть и в списке отелей, и в списки избранных
                let shareHotelList = JSON.parse(rawDataHotels).filter((item: HotelItem) => {
                    let res = favoriteHtls.some((j: HotelItem) => {
                        return item.hotelId === j.hotelId;
                    })
                    if (res) return item
                });
                //отели, которые есть в списке отелей, но не в списке избранных
                let hotelList = JSON.parse(rawDataHotels).filter((item: HotelItem) => {
                    let res = favoriteHtls.some((j: HotelItem) => {
                        return item.hotelId === j.hotelId;
                    });
                    if (!res) return item
                })
                // преобразуем графу favorite в shareHotelList на true
                let changedShareHotelList = shareHotelList.map((item: HotelItem) => item = {...item, favorite: true});
                //формируем общий список отелей с учетом избранных для отображения
                buffer.push(...changedShareHotelList, ...hotelList);
                setHotels(buffer);
            }
        }
    }, [getNewList]);

    const heartCheckedToLocalStorage = (htl: HotelItem) => {
        localStorage.removeItem('hotels');
        localStorage.setItem('hotels', JSON.stringify(hotels));
        //добавление в избранные
        if (favoriteHotels !== null && htl.favorite) {
            let favoriteHtls = JSON.parse(favoriteHotels);
            localStorage.removeItem('fav');
            let newFav: HotelItem[] = [];
            // получаем новый список избранных отелей из общего списка отелей
            newFav = hotels.filter((item: HotelItem) => item.favorite);
            // сличаем сохраненный список избранных и новый список избранных -
            // чтобы добавить в localStorage новый избранный элемент
            let hotelList: HotelItem[] = favoriteHtls.filter((item: HotelItem) => {
                let res = newFav.some((j: HotelItem) => {
                    return item.hotelId === j.hotelId;
                });
                if (!res) return item;
            });
            newFav.push(...hotelList);
            localStorage.setItem('fav', JSON.stringify(newFav));
            // удаление элемента из избранных
        } else if (favoriteHotels !== null && !htl.favorite) {
            let favoriteHtls = JSON.parse(favoriteHotels);
            localStorage.removeItem('fav');
            let newFav: HotelItem[] = [];
            newFav = favoriteHtls.filter((hotel: HotelItem) => hotel.hotelId !== htl.hotelId);
            localStorage.setItem('fav', JSON.stringify(newFav));
            //если список избранных отсутствует
        } else if (!favoriteHotels) {
            let newFav: HotelItem[] = [];
            localStorage.removeItem('fav');
            newFav = hotels.filter((item: HotelItem) => item.favorite);
            localStorage.setItem('fav', JSON.stringify(newFav))
        }
    };


    const declination = (int: number, array: string[]) => {
        return (array) &&
            array[(int % 100 > 4 && int % 100 < 20) ? 2
                : [2, 0, 1, 1, 1, 2][(int % 10 < 5) ? int % 10
                    : 5]];
    }

    const dateFormat = (dateToFormat: string) => {
        const monthNames = ["Января", "Февраля", "Марта", "Апреля", "Мая", "Июня",
            "Июля", "Августа", "Сентября", "Октября", "Ноября", "Декабря"
        ];
        const date = new Date(dateToFormat);
        const day = date.getDate();
        const year = date.getFullYear();
        const month = date.getMonth();
        return day + ' ' + monthNames[month] + ' ' + year;
    }

    const place = data.filter((item) => item.code === city)


    return (
        <>
            <Paper elevation={2} className='hotelsContainer'>
                <div className='title'>
                    <h2 className='hotelsTitle'>
                        Отели
                        <KeyboardArrowRightIcon className='arrow' style={{
                            fontSize: "32px",
                            color: "#A7A7A7"
                        }}/>
                        {place[0].name[0] + (place[0].name).slice(1).toLocaleLowerCase()}
                    </h2>
                    <p style={{color: '#41522E', fontSize: '24px'}}>{dateFormat(date)}</p>
                </div>
                <Box className='picContainer'>
                    <img src={hotelPic} className='hotelPic' alt=''/>
                    <img src={hotelPic1} className='hotelPic' alt=''/>
                    <img src={hotelPic2} className='hotelPic' alt=''/>
                    <img src={hotelPic3} className='hotelPic' alt=''/>
                </Box>
                <p className='fav'>
                    {"Добавлено в избранное:" + ' ' + `${favoriteHotels ? JSON.parse(favoriteHotels).length : 0}` + ' ' +
                        `${favoriteHotels ?
                            declination(JSON.parse(favoriteHotels).length, ['отель', 'отеля', 'отелей'])
                            : declination(0, ['отель', 'отеля', 'отелей'])}`
                    }
                </p>
                <Table>
                    <TableBody style={{color: '#424242'}}>
                        {hotels.map((item) => {
                            return (
                                <TableRow key={item.hotelId}>
                                    <TableCell scope="row" style={{width: '8%'}}>
                                        <div className='homeIcon'>
                                            <HomeIcon style={{color: 'rgba(65, 82, 46, 1)', fontSize: '42px'}}/>
                                        </div>
                                    </TableCell>
                                    <TableCell scope="row">
                                        <div className='hotelList'>
                                            <span>{item.hotelName}</span>
                                            <Checkbox icon={<FavoriteBorder style={{color: '#C4C4C4'}}/>}
                                                      checkedIcon={<Favorite style={{color: 'red'}}/>}
                                                      checked={item.favorite}
                                                      value={favorite}
                                                      onClick={() => {
                                                          item['favorite'] = !item['favorite'];
                                                          setFavorite(!favorite);
                                                          heartCheckedToLocalStorage(item);
                                                          dispatch(getNewHotelList(!getNewList));
                                                      }}/>
                                        </div>
                                        <p style={{fontSize: '14px', }}>{date} - {day} {declination(day, ['день', 'дня', 'дней'])} </p>
                                        <div className='hotelList'>
                                            <Rating name="read-only" value={item.stars} readOnly/>
                                            <div>
                                                <span className='price'>Price</span>
                                                <span>{item.priceFrom} ₽</span>
                                            </div>
                                        </div>
                                    </TableCell>
                                </TableRow>
                            )
                        })}
                    </TableBody>
                </Table>
            </Paper>
        </>)
}

export default Hotels