import { put, takeEvery, call, select } from 'redux-saga/effects';
import {location, checkIn, checkOut} from './../selectors/index';
import {getPricesSuccess} from "../reducers/pricesSlice";


function* pricesWorker() {
    let locationData = yield select(location);
    let checkInData = yield select(checkIn);
    let checkOutData = yield select(checkOut);
    // const data = yield call(fetch, 'https://engine.hotellook.com/api/v2/cache.json?location=Moscow&currency=rub&checkIn=2023-12-10&checkOut=2023-12-12&limit=10', { method: 'GET', referer: 'https://main--startling-druid-b9d701.netlify.app/hotels'});

    const data = yield call(fetch, 'https://engine.hotellook.com/api/v2/cache.json?' +'location=' + `${locationData}`
        + '&currency=rub&' + 'checkIn=' + `${checkInData}` + '&checkOut=' + `${checkOutData}` + '&limit=5', { method: 'GET', referer: 'https://main--startling-druid-b9d701.netlify.app/hotels'});
    const formattedData = yield data.json();
    yield put(getPricesSuccess(formattedData));
}

function* pricesWatcher() {
    yield takeEvery('prices/getPrices', pricesWorker)
}

export default pricesWatcher
