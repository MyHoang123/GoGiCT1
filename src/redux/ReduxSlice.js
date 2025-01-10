import axios from "axios";
import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
export const ReduxSlice = createSlice({
    name:'products',
    initialState: {categoris: {Menu: [], Type: [], categori: [], detailType: []}, products: {product: [],page: 1},Loading: false, productCards: {product: [] ,Suggest: []}},
    reducers: {
        changePage: (state,action) => {
            state.products.page = action.payload
        },
        maxProduct: (state,action) => {
            const count = state.products.product.filter(item =>  item.Status === 'visible').length
            const newArr = state.products.product.splice(0,count)
            for (let i = 0; i < newArr.length - 1; i++) {
                for (let j = 0; j < newArr.length - 1 - i; j++) {
                  if (newArr[j].Price < newArr[j + 1].Price) {
                    let temp = newArr[j];
                    newArr[j] = newArr[j + 1];
                    newArr[j + 1] = temp;
                  }
                }
              }
              state.products.product = newArr
        },
        minProduct: (state,action) => {
            const count = state.products.product.filter(item =>  item.Status === 'visible').length
            const newArr = state.products.product.splice(0,count)
            for (let i = 0; i < newArr.length - 1; i++) {
                for (let j = 0; j < newArr.length - 1 - i; j++) {
                  if (newArr[j].Price > newArr[j + 1].Price) {
                    let temp = newArr[j];
                    newArr[j] = newArr[j + 1];
                    newArr[j + 1] = temp;
                  }
                }
              }
              state.products.product = newArr
        },
        newProduct: (state,action) => {
            const count = state.products.product.filter(item =>  item.Status === 'visible').length
            const newArr = state.products.product.splice(0,count)
            for (let i = 0; i < newArr.length - 1; i++) {
                for (let j = 0; j < newArr.length - 1 - i; j++) {
                    if (newArr[j].Id < newArr[j + 1].Id) {
                        // Hoán đổi vị trí hai phần tử nếu thứ tự sai
                        let temp = newArr[j];
                        newArr[j] = newArr[j + 1];
                        newArr[j + 1] = temp;
                    }
                }
            }
              state.products.product = newArr
        },
        randomProduct: (state,action) => {
            const count = state.products.product.filter(item =>  item.Status === 'visible').length
            const newArr = state.products.product.splice(0,count)
            for (let i = newArr.length - 1; i > 0; i--) {
              const j = Math.floor(Math.random() * (i + 1));
              [newArr[i], newArr[j]] = [newArr[j], newArr[i]];
            }
              state.products.product = newArr
        },
        resetData: (state,action) => {
              state.categoris = {Menu: [], Type: [], categori: [], detailType: []}
              state.products = {product: [],page: 1}
        },
    },
    extraReducers: builder => {
        builder.addCase(getProduct.pending, (state,action) => {
            state.Loading = false
            document.body.style.overflow = 'hidden'
        }).addCase(getProduct.fulfilled, (state,action) => {
            state.Loading = true
            state.products.product = action.payload[0]
            state.categoris.Menu = action.payload[3]
            state.categoris.Type = action.payload[2]
            state.categoris.categori = action.payload[1]
            state.categoris.detailType = action.payload[4]
            document.body.style.overflow = 'auto'
        }).addCase(filterCategoris.pending,(state, action) => {
            state.Loading = false
        }).addCase(filterCategoris.fulfilled,(state, action) => {
            state.Loading = true
            state.products.product = action.payload
            state.products.page = 1
        }).addCase(getProductCard.pending, (state,action) => {
            state.Loading = false
            document.body.style.overflow = 'hidden'
        }).addCase(getProductCard.fulfilled, (state,action) => {
            state.productCards.product = action.payload[0]
            // state.suggest = action.payload[1]
            state.categoris = {Menu: [], Type: [], categori: [], detailType: []}
            state.products = {product: [],page: 1}
            state.Loading = true
            document.body.style.overflow = 'auto'
        }).addCase(deleteProductCard.pending, (state,action) => {
            state.Loading = false
            document.body.style.overflow = 'hidden'
        }).addCase(deleteProductCard.fulfilled, (state,action) => {
            state.productCards.product = state.productCards.product.filter((product) => product.Id !== action.payload[1])
            state.Loading = true
            document.body.style.overflow = 'auto'
        })
        }
        })
export const getProduct = createAsyncThunk('getProduct',async () => {
   const resProduct = await axios.get(`${process.env.REACT_APP_CALL_API}/api/v12/showproduct`)
   const resCate  =  await axios.get(`${process.env.REACT_APP_CALL_API}/api/v12/showcategori`)
   const resTypes =  await axios.get(`${process.env.REACT_APP_CALL_API}/api/v12/showtype`)
   const resMenu   = await axios.get(`${process.env.REACT_APP_CALL_API}/api/v12/showmenu`)
   const resdeTailType = await axios.get(`${process.env.REACT_APP_CALL_API}/api/v12/showdetailtypes`)
    return [resProduct.data.data, resCate.data.data,resTypes.data.data, resMenu.data.data, resdeTailType.data.data]
})
export const filterCategoris = createAsyncThunk('filterCategoris',async (Filter) => {
    const resFilterCate = await axios.get(`${process.env.REACT_APP_CALL_API}/api/v12/filtercategori?IdType=${Filter.IdType}&IdCate=${Filter.IdCate}`);
    return resFilterCate.data.data
})
export const getProductCard = createAsyncThunk('getProductCard',async (token) => {
    const resCardProduct = await axios.get(`${process.env.REACT_APP_CALL_API}/api/v12/showcard?token=${token.token}`)
    const resSuggest = await axios.get(`${process.env.REACT_APP_CALL_API}/api/v12/recommendersystem?token=${token.token}`)
    return [resCardProduct.data.data,resSuggest.data.data]
})
export const deleteProductCard = createAsyncThunk('deleteProductCard',async (id) => {
    const response = await axios.post(`${process.env.REACT_APP_CALL_API}/api/v12/deletecard`, id)   
    return [response.data.massege,id.IdProduct]
})