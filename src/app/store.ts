// import { configureStore, ThunkAction, Action } from '@reduxjs/toolkit';
// import pricesReducer from '../reducers/pricesSlice';
//
// export const store = configureStore({
//   reducer: {
//     pricer: pricesReducer,
//   },
// });
//
// export type AppDispatch = typeof store.dispatch;
// export type RootState = ReturnType<typeof store.getState>;
// export type AppThunk<ReturnType = void> = ThunkAction<
//   ReturnType,
//   RootState,
//   unknown,
//   Action<string>
// >;

import {configureStore} from '@reduxjs/toolkit';
import pricesReducer from '../reducers/pricesSlice';
import createSagaMiddleware from 'redux-saga'
import pricesWatcher from "../sagas/pricesSaga";


const sagaMiddleware = createSagaMiddleware();

export const store = configureStore({
  reducer: {
    prices: pricesReducer,
  },
  middleware: [sagaMiddleware]

});

sagaMiddleware.run(pricesWatcher)

