import { ReduxSlice } from './ReduxSlice'
import { configureStore } from "@reduxjs/toolkit";

const store = configureStore({
    reducer: {
        products: ReduxSlice.reducer,
    }
})
export default store