
import BodySlice from '../components/Layout/DefaultLayout/Body/reduxBody/BodySlice'
import HeaderSlice from '../components/Layout/DefaultLayout/Header/reduxBody/HeaderSlice'
import CardProductSlice from '../components/Layout/CardLayout/reduxCard/CardSlice'
import PurchaseSlice from '../components/Layout/PurchaseLayout/reduxPurchase/PurchaseSlice'
import { configureStore } from "@reduxjs/toolkit";

const store = configureStore({
    reducer: {
        products: BodySlice.reducer,
        header: HeaderSlice.reducer,
        Card: CardProductSlice.reducer,
        Purchase: PurchaseSlice.reducer,
    },
})
export default store