import { createSelector } from "@reduxjs/toolkit";
const cardSelector = (state) => state.Card.data
const suggestSelector = (state) => state.Card.suggest
const yourCardSelector = (state) => state.Card.checkCard
const voucherSelector = (state) => state.Card.voucher
const distanceSelector = (state) => state.Card.distance
export const listProductCard = createSelector(cardSelector, (listProductCard) => {
    return listProductCard
})
export const listProductSuggest = createSelector(suggestSelector, (listProductSuggest) => {
    return listProductSuggest
})
export const listYourCard = createSelector(yourCardSelector,cardSelector, (listYourCard) => {
    return listYourCard
})
export const listCheckCard = createSelector(yourCardSelector, (listCheckCard) => {
    return listCheckCard
})
export const voucher = createSelector(voucherSelector, (voucher) => {
    return voucher
})
export const distance = createSelector(distanceSelector, (distance) => {
    return distance
})