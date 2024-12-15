import { createSelector } from "@reduxjs/toolkit";
const cardSelector = (state) => state.productCards.data
const suggestSelector = (state) => state.productCards.suggest
export const listProductCard = createSelector(cardSelector, (listProductCard) => {
    return listProductCard
})
export const listProductSuggest = createSelector(suggestSelector, (listProductSuggest) => {
    return listProductSuggest
})