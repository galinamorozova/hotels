import {createSlice} from '@reduxjs/toolkit'
import moment from "moment";

interface BookingState {
        location: string,
        checkIn: string,
        checkOut: string,
        days: number,
        newHotels: boolean,
        currentUser: number
};
export const initialState: BookingState = {

    location: "MOSCOW",
    checkIn: moment(Date.now()).format('YYYY-MM-DD'),
    checkOut: moment(Date.now()+86400000).format('YYYY-MM-DD'),
    days: 1,
    newHotels: false,
    currentUser: 1
}

export const pricesSlice = createSlice({
    name: 'prices',
    initialState,
    reducers: {
        getPricesSuccess: (state, action) => {
            localStorage.removeItem('hotels');
            let buffer = action.payload;
            //добавляем поле "избранное" в каждый элемент списка отелей
            buffer.map((item: { [x: string]: boolean; }) => {
                    item["favorite"] = false});

             localStorage.setItem('hotels', JSON.stringify(buffer));
            state.newHotels = !state.newHotels;


        },
        getPrices: (state) => {
        },
        getNewCheckIn: (state, action) => {
            state.checkIn = action.payload;
        },
        getNewCheckOut: (state, action) => {
            const today = new Date(state.checkIn).getTime();
            const daysInMs = action.payload*86400000 + today;
            const checkOut = new Date(daysInMs);
            state.days = action.payload;
            state.checkOut = moment(checkOut).format("YYYY-MM-DD");
        },
        getNewLocation: (state, action) => {
            state.location = action.payload;
        },
        getNewHotelList: (state, action) => {
            state.newHotels = action.payload;
        },
    },
})

export const { getPrices, getPricesSuccess,  getNewCheckIn, getNewCheckOut, getNewLocation, getNewHotelList } = pricesSlice.actions;

export default pricesSlice.reducer;