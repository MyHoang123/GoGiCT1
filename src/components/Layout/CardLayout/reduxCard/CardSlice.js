import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { Notice, CreateBill } from '../../../../hooks'
import axios from "axios";
const CardSlice = createSlice({
    name: 'cardProducts',
    initialState: { data: [], suggest: [], checkCard: [], voucher: 0 },
    reducers: {
        search: (state, action) => {
            if (!action.payload.trim()) {
                state.data.forEach((pduct) => {
                    pduct.Status = 'visible'
                })
            }
            else {
                state.data.forEach((pduct) => {
                    if (pduct.Name.toLowerCase().includes(action.payload.toLowerCase())) {
                        pduct.Status = 'visible'
                    }
                    else {
                        pduct.Status = 'hiden'
                    }
                })
            }
        },
        checkCard: (state, action) => {
            const productCard = state.checkCard.filter((card) => card.Id === action.payload.Id)
            if (productCard.length > 0) {
                const checkCard = state.checkCard.filter((card) => card.Id !== action.payload.Id)
                state.checkCard = checkCard
            }
            else {
                state.checkCard.push(action.payload)
            }
        },
        inCrease: (state, action) => {
            state.checkCard.forEach((product) => {
                if (product.Id === action.payload) {
                    product.Amount += 1
                }
            })
        },
        deCrease: (state, action) => {
            state.checkCard.forEach((product) => {
                if (product.Id === action.payload) {
                    if (product.Amount > 1) {
                        product.Amount -= 1
                    }
                }
            })
        },
        resetCard: (state, action) => {
            state.data = []
            state.suggest = []
            state.checkCard = []
            state.voucher = 0
        },
    },
    extraReducers: builder => {
        builder.addCase(getProductCard.pending, (state, action) => {
        }).addCase(getProductCard.fulfilled, (state, action) => {
            state.data = action.payload[0]
            state.suggest = action.payload[1]
        }).addCase(deleteProductCard.fulfilled, (state, action) => {
            if (action.payload[0] === 'Thanh cong') {
                const resuilt = state.data.filter((product) => product.Id !== action.payload[1])
                const resuilt1 = state.checkCard.filter((product) => product !== action.payload[1])
                state.data = resuilt
                state.checkCard = resuilt1
            }
        }).addCase(checkVoucher.fulfilled, (state, action) => {
            if (action.payload[1] === 'Thanh cong') {
                state.voucher = action.payload[0]
                Notice('success', 'Thành Công', `${-action.payload[0]}`, '')
            }
        }).addCase(checkVoucher.rejected, (state, action) => {
            state.voucher = 0
            Notice('error', 'Thất Bại', `Không Hợp Lệ !`, '')
        }).addCase(addCardCard.fulfilled, (state, action) => {
            if(action.payload[0] === 'Thanh cong') {
                state.suggest.forEach((product) => {
                    if(product.Id == action.payload[1]) {
                        const newProduct = {
                            Id: product.Id,
                            Name: product.Name,
                            Price: product.Price,
                            Img: product.Img,
                            Status: 'visible'
                        }
                        state.data.push(newProduct)
                    }
                })
                Notice('success', 'Thành công', `Thành công thêm mới một sản phẩm !`, '')
              }
              else {
                Notice('error', 'Thất Bại', `Sản phẩm đã tồn tại !`, '')
              }
        })
    }
})
export const getProductCard = createAsyncThunk('getProductCard', async (token) => {
    const resCardProduct = await axios.get(`${process.env.REACT_APP_CALL_API}/api/v12/showcard?token=${token}`)
    const resSuggest = await axios.get(`${process.env.REACT_APP_CALL_API}/api/v12/recommendersystem?token=${token}`)
    return [resCardProduct.data.data, resSuggest.data.data]
})
export const deleteProductCard = createAsyncThunk('deleteProductCard', async (Product) => {
    const response = await axios.delete(`${process.env.REACT_APP_CALL_API}/api/v12/deletecard?IdProduct=${Product.IdProduct}&token=${Product.token}`)
    return [response.data.massege, Product.IdProduct]
})
export const checkVoucher = createAsyncThunk('checkVoucher', async (Voucher) => {
    const response = await axios.post(`${process.env.REACT_APP_CALL_API}/api/v12/checkvoucher`, Voucher)
    return [response.data.data[0].PriceVoucher, response.data.massege]
})
export const createBill = createAsyncThunk('createBill', async (Bill) => {
    const { socket } = Bill
    delete Bill.socket
    const response = await axios.post(`${process.env.REACT_APP_CALL_API}/api/v12/createbill`, Bill)
    return CreateBill(response, socket)
})
export const addCardCard = createAsyncThunk('addCardCard', async (Product) => {
    const resAddCard = await axios.post(`${process.env.REACT_APP_CALL_API}/api/v12/addcard`,{IdProduct: Product.IdProduct,token: Product.token});
    return [resAddCard.data.massege,Product.IdProduct]
  })
export default CardSlice
export const { search, checkCard, inCrease, deCrease, resetCard } = CardSlice.actions 