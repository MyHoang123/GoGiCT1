import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import axios from "axios";
const CardSlice = createSlice({
    name: 'cardProducts',
    initialState: { bill: [], detailBill: [], Comment: [] },
    reducers: {
        filterStatus: (state, action) => {
            state.bill.forEach((b) => {
                if (b.Status === action.payload || action.payload === null) {
                    b.Filter = 'visible'
                }
                else {
                    b.Filter = 'hiden'
                }
            })
        },
        filterAll: (state, action) => {
            state.bill.forEach((b) => {
                b.Status = 'visible'
            })
        },
        updateBill: (state, action) => {
            state.bill.forEach((b) => {
              if(b.Id === action.payload[0]) {
                b.Status = action.payload[1]
              }
            })
            if(state.detailBill.length > 0) {
                state.detailBill[0].Status = action.payload[1]
            }
        },
        resetComment: (state, action) => {
            state.Comment = []
        },
        resetPurchase: (state, action) => {
            state.Comment = []
            state.bill = []
            state.detailBill = []
        },
    },

    extraReducers: builder => {
        builder.addCase(getBill.fulfilled, (state, action) => {
            if(action.payload[0] === 'Thanh cong') {
                state.bill = action.payload[1]
            }
        }).addCase(getBillDetail.fulfilled, (state, action) => {
            if (action.payload.massege === 'Thanh cong') {
                state.detailBill = action.payload.data
            }
            else {
                state.detailBill = []
            }
        }).addCase(getComment.fulfilled, (state, action) => {
            if(action.payload[0] === 'Thanh cong') {
                state.Comment = action.payload[1]
            }
        }).addCase(commentAction.fulfilled, (state, action) => {
            if(action.payload[0] === 'Thanh cong') {
                state.bill.forEach((element) => {
                    if(element.Id === action.payload[1].IdBill) {
                        element.Status = 4
                    }
                })
                if(state.Comment.length > 0) {
                    const newArr = {
                        Containt: action.payload[1].Containt,
                        Star: action.payload[1].Star,
                        IdProduct: action.payload[1].IdProduct
                    }
                    state.Comment[action.payload[1].i] = newArr
                }
                if(state.detailBill.length > 0) {
                    state.detailBill.forEach((element) => {
                        if(element.Id === action.payload[1].IdProduct) {
                            element.Status = 4
                        }
                    })
                }
            }
        })
    }
})
export const getBill = createAsyncThunk('getBill', async (token) => {
    const response = await axios.get(`${process.env.REACT_APP_CALL_API}/api/v12/showbill?token=${token}`)
        return [response.data.massege,response.data.data]
})
export const getBillDetail = createAsyncThunk('getBillDetail', async (Bill) => {
    const response = await axios.get(`${process.env.REACT_APP_CALL_API}/api/v12/getbill?token=${Bill.token}&idbill=${Bill.IdBill}`)
    return response.data
})
export const getComment = createAsyncThunk('getCommentUser', async (User) => {
    const response = await axios.get(`${process.env.REACT_APP_CALL_API}/api/v12/showcommentuser?token=${User.token}&IdBill=${User.IdBill}`)
    return [response.data.massege,response.data.data]
})
export const commentAction = createAsyncThunk('comment', async (Comment) => {
    const response = await axios.post(`${process.env.REACT_APP_CALL_API}/api/v12/createcomment`,Comment)
    return [response.data.massege,Comment]
})
export default CardSlice
export const { filterStatus, filterAll, updateBill, resetComment, resetPurchase } = CardSlice.actions 