
import { GET_IMG, GET_INDEX, SET_IMG, UPDATE_IMG, GET_IMG_MINI, GET_IMG_BODY, GET_IMG_PAGENEW, UPDATE_LINK_YOUTUBE } from './constants'


//1: Init State
export const initState = {
    index: 3,
    img: {},
    imgs: [],
    imgsMini: [],
    imgBodys: [],
    imgPageNews: [],
}
//2: Reducer
const reducer = (state, action) => {
    switch (action.type) {
        case GET_IMG:
            return {
                img: action.payload[3],
                imgs: action.payload
            }
        case GET_IMG_MINI:
            return {
                ...state,
                imgsMini: action.payload
            }
        case GET_IMG_BODY:
            return {
                ...state,
                imgBodys: action.payload
            }
        case GET_IMG_PAGENEW:
            return {
                ...state,
                imgPageNews: action.payload
            }
        case SET_IMG:
            const newImg = {...state.img}
            newImg.img = action.payload
            return {
                ...state,
                img: newImg,
            }
        case GET_INDEX:
            return {
                ...state,
                index: action.payload,
            }
        case UPDATE_IMG:
            const newArr = [...state.imgs]
            newArr[action.payload[0]].img = action.payload[1]
            return {
                ...state,
                imgs: newArr
            }
        case UPDATE_LINK_YOUTUBE:
            const newLink = [...state.imgBodys]
            newLink[3].Img = action.payload
            return {
                ...state,
                imgBodys: newLink
            }
        default: 
                throw new Error('Invalid Action')
    }
}
export default reducer