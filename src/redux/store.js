import BodySlice from '../components/Layout/DefaultLayout/Body/BodySlice'
import CardProductSlice from '../components/Layout/CardLayout/CardSlice'
import { configureStore } from "@reduxjs/toolkit";

const store = configureStore({
    reducer: {
        products: BodySlice.reducer,
        productCards: CardProductSlice.reducer
    }
})
export default store