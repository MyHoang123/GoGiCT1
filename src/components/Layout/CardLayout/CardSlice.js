import axios from "axios";
import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
const CardSlice = createSlice({
    name:'cardProducts',
    initialState: {data: [], suggest: []},
    extraReducers: builder => {
        builder.addCase(getProductCard.pending, (state,action) => {
        }).addCase(getProductCard.fulfilled, (state,action) => {
            state.data = action.payload[0]
            state.suggest = action.payload[1]
        })
    }
})
export const getProductCard = createAsyncThunk('getProductCard',async (token) => {
    const resCardProduct = await axios.get(`https://severgogi.onrender.com/api/v12/showcard?token=${token.token}`)
    const resSuggest = await axios.get(`https://severgogi.onrender.com/api/v12/recommendersystem?token=${token.token}`)
    return [resCardProduct.data.data,resSuggest.data.data]
})
export default CardSlice