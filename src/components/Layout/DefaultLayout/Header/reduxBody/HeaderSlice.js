import axios from "axios";
import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { Notice } from '../../../../../hooks'
const HeaderSlice = createSlice({
  name: 'productsBestseller',
  initialState: {products: [],user: {}, Amount: 0, Noti: []},
  reducers: {
    logout: (state, action) => {
      state.user = {}
      window.location.href = '/'
    },
    resetHeader: (state, action) => {
      state.products = []
    },
  },
  extraReducers: builder => {
    builder.addCase(getBestSeller.pending,(state, action) => {
    }).addCase(getBestSeller.fulfilled, (state, action) => {
      state.products = action.payload
    }).addCase(getUser.fulfilled, (state, action) => {
      state.user = action.payload[0]
    }).addCase(updateAvt.fulfilled, (state, action) => {
      if(action.payload[0] === 'Thanh cong') {
        state.user.Avt = action.payload[1]
        Notice('sucess','Thành công',`Đổi hình ảnh thành công !`,'')
      }else {
        Notice('error','Error',`Có lõi xảy ra vui lòng thử lại !`,'')
      }
    }).addCase(updateInfo.fulfilled, (state, action) => {
      if(action.payload[0] === 'Thanh cong') {
        Notice('sucess','Thành công',`Đổi thông tin thành công !`,'')
        state.user.UserName = action.payload[1].UserName
        state.user.Sdt = action.payload[1].PhoneNumber
        state.user.Birthday = action.payload[1].Birthday
        state.user.Email = action.payload[1].Email
      }
      else {
        Notice('error','Error',`Vui lòng đảm bảo đúng định dạng !`,'')
      }
    }).addCase(getNoti.fulfilled, (state, action) => {
      if(action.payload !== null) {
        state.Amount = action.payload.length
        state.Noti = action.payload
      }
    })
  }
})
export const getBestSeller = createAsyncThunk('getBestSeller', async () => {
  const resBestSeller = await axios.get(`${process.env.REACT_APP_CALL_API}/api/v12/showbestellerCategoris`);
  return resBestSeller.data.data
})
export const filterCategoris = createAsyncThunk('filterCategoris', async (Filter) => {
  const resFilterCate = await axios.get(`${process.env.REACT_APP_CALL_API}/api/v12/filtercategori?IdType=${Filter.IdType}&IdCate=${Filter.IdCate}`);
  return resFilterCate.data.data
})
export const getUser = createAsyncThunk('getUser', async (Token) => {
  const response = await axios.get(`${process.env.REACT_APP_CALL_API}/api/v12/getuserlogin?token=${Token}`);
  const responseNoti = await axios.get(`${process.env.REACT_APP_CALL_API}/api/v12/shownotifi?token=${Token}`);
  return [response.data.data,responseNoti.data.data]
})
export const getNoti = createAsyncThunk('getNoti', async (Token) => {
  const responseNoti = await axios.get(`${process.env.REACT_APP_CALL_API}/api/v12/shownotifi?token=${Token}`);
  return responseNoti.data.data
})
export const updateAvt = createAsyncThunk('updateAvt', async (file) => {
  const formData = new FormData();
  formData.append('file', file.file, `${file.file.name}_avt`)
  const response = await axios.post(`${process.env.REACT_APP_CALL_API}/api/v12/updateavt`, formData, {
    headers: {
      'Content-Type': 'multipart/form-data',
      'Authorization': file.token
    }
  });
  return [response.data.message,response.data.fileName]
})
export const updateInfo = createAsyncThunk('updateInfo', async (User) => {
  const response = await axios.put(`${process.env.REACT_APP_CALL_API}/api/v12/updateinfo`,User)
  return [response.data.massege,User]
})
export const sendNoti = createAsyncThunk('sendNoti', async (Token) => {
  axios.get(`${process.env.REACT_APP_CALL_API}/api/v12/sendnoti?token=${Token}`)
})
export const { logout, resetHeader } = HeaderSlice.actions
export default HeaderSlice