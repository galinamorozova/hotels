import { put, takeEvery, call, select } from 'redux-saga/effects';
import {location, checkIn, checkOut} from './../selectors/index';
import {getPricesSuccess} from "../reducers/pricesSlice";


function* pricesWorker() {
    let locationData = yield select(location);
    let checkInData = yield select(checkIn);
    let checkOutData = yield select(checkOut);
    const data = yield call(fetch, 'http://engine.hotellook.com/api/v2/cache.json:splat?' +'location=' + `Moscow`
        + '&currency=rub&' + 'checkIn=' + `${checkInData}` + '&checkOut=' + `${checkOutData}` + '&limit=5', { method: 'GET'});

    // const data = yield call(fetch, 'http://engine.hotellook.com/api/v2/cache.json:splat?' +'location=' + `${locationData}`
    //     + '&currency=rub&' + 'checkIn=' + `${checkInData}` + '&checkOut=' + `${checkOutData}` + '&limit=5', { method: 'GET'});
    const formattedData = yield data.json();
    yield put(getPricesSuccess(formattedData));
}

function* pricesWatcher() {
    yield takeEvery('prices/getPrices', pricesWorker)
}

export default pricesWatcher
