import React, {useEffect, useState} from "react";
import {useDispatch, useSelector} from "react-redux";
import {Autocomplete, Box, Button, Paper, svgIconClasses, TextField, Typography} from "@mui/material";
import {DatePicker, LocalizationProvider} from "@mui/x-date-pickers";
import dayjs, {Dayjs} from "dayjs";
import {AdapterDayjs} from "@mui/x-date-pickers/AdapterDayjs";
import {location} from "../selectors";
import "../App.css";
import {
    getNewCheckIn,
    getNewCheckOut,
    getNewLocation,
    getPrices,
} from "../reducers/pricesSlice";
import moment from "moment";
import {data} from '../assets/IATAdata';
import "./styles.scss"


const Search = () => {
    const today = moment(Date.now()).format('YYYY-MM-DD')
    const [checkIn, setCheckIn] = useState<Dayjs | null>(dayjs(today));
    const [dayAmountInfo, setDayAmountInfo] = useState<number>(1);
    const dispatch = useDispatch();
    let checkOutInfo: string;
    let checkInInfo: string;

    useEffect(() => {
        if (checkIn) {
            checkInInfo = checkIn.format("YYYY-MM-DD");
            const date = new Date(checkInInfo).getTime();
            const daysInMs = dayAmountInfo * 86400000 + date;
            checkOutInfo = moment(new Date(daysInMs)).format("YYYY-MM-DD");
        }
    }, [dayAmountInfo, checkIn]);

    const options: string[] = [];
    data.map((city) => options.push(city.name));
    const [inputValue, setInputValue] = React.useState('');
    const [locationInfo, setLocationInfo] = React.useState<string | null>(options[0]);

    const disableDates = (date: dayjs.Dayjs) => {
        const today = Date.now() - 86400000;
        dayjs(today);
        return date.isBefore(dayjs(today))
    }

    return <>
        <Paper elevation={2} style={{padding: '20px'}}>
            <Box
                component="form"
                noValidate
                autoComplete="off"
                className='searchContainer'
            >
                <h3 className='titles'>
                    Локация
                </h3>
                <Autocomplete
                    value={locationInfo}
                    onChange={(event: any, newValue: string | null) => {
                        if (newValue) setLocationInfo(newValue);
                        const iataCode = data.filter((city) => city.name === newValue)
                        dispatch(getNewLocation(iataCode[0]?.code))
                    }}
                    inputValue={inputValue}
                    onInputChange={(event, newInputValue) => {
                        setInputValue(newInputValue);
                    }}
                    id="controllable-states-demo"
                    options={options}
                    renderInput={(params) => <TextField style={{color: 'rgba(0, 0, 0, 0.87)'}} {...params} label=""/>}
                />
                <h3 className='titles' style={{margin: '10px 0'}}>
                    Дата заселения
                </h3>
                <LocalizationProvider dateAdapter={AdapterDayjs}>
                    <DatePicker value={checkIn}
                                shouldDisableDate={disableDates}
                                onChange={(newValue) => {
                                    if (newValue) {
                                        setCheckIn(newValue)
                                        dispatch(getNewCheckIn(newValue?.format('YYYY-MM-DD')))
                                        dispatch(getNewCheckOut(dayAmountInfo))
                                    }
                                }}
                    />
                </LocalizationProvider>
                <h3 className='titles'>
                    Количество дней
                </h3>
                <TextField
                    id="outlined-number"
                    label=""
                    type="number"
                    InputLabelProps={{
                        shrink: true,
                    }}
                    value={dayAmountInfo}
                    onChange={(newValue) => {
                        setDayAmountInfo(parseInt(newValue.currentTarget.value));
                        dispatch(getNewCheckOut(parseInt(newValue.currentTarget.value)));
                    }}
                    style={{width: '100%', opacity: '50%'}}
                />
            </Box>
            <div className='findContainer'>
                <button
                    onClick={() => {
                        dispatch(getPrices());
                    }}
                    className='find'
                    disabled={!locationInfo}>
                    Найти</button>
            </div>
        </Paper>
    </>
}

export default Search