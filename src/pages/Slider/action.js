import { GET_IMG, GET_INDEX, SET_IMG, UPDATE_IMG, GET_IMG_MINI, GET_IMG_BODY, GET_IMG_PAGENEW, UPDATE_LINK_YOUTUBE } from './constants'

export const getImg = payload => {
    return {
        type: GET_IMG,
        payload
    }
}
export const getIndex = payload => {
    return {
        type: GET_INDEX,
        payload
    }
}
export const setImg = payload => {
    return {
        type: SET_IMG,
        payload
    }
}

export const updateImg = payload => {
    return {
        type: UPDATE_IMG,
        payload
    }
}
export const getImgMini = payload => {
    return {
        type: GET_IMG_MINI,
        payload
    }
}
export const getImgBody = payload => {
    return {
        type: GET_IMG_BODY,
        payload
    }
}
export const getImgPagenew = payload => {
    return {
        type: GET_IMG_PAGENEW,
        payload
    }
}
export const updateLinkYoutube = payload => {
    return {
        type: UPDATE_LINK_YOUTUBE,
        payload
    }
}