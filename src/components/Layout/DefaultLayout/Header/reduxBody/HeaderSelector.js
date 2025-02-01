import { createSelector } from "@reduxjs/toolkit";
const productsSelector = (state) => state.header.products
const userSelector = (state) => state.header.user
const NotiListSelector = (state) => state.header.Noti
const AmountSelector = (state) => state.header.Amount


export const listBestSeller = createSelector(productsSelector, (listBestSeller) => {
    return listBestSeller
})
export const infoUser = createSelector(userSelector, (userSelector) => {
    return userSelector
})

export const showNoti = createSelector(NotiListSelector,AmountSelector, (NotiListSelector,AmountSelector) => {
    return [AmountSelector,NotiListSelector]
})