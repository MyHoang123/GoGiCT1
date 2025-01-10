import { createSelector } from "@reduxjs/toolkit";
const cardSelector = (state) => state.products.productCards.product
const suggestSelector = (state) => state.products.productCards.Suggest
export const listProductCard = createSelector(cardSelector, (listProductCard) => {
    return listProductCard
})
export const listProductSuggest = createSelector(suggestSelector, (listProductSuggest) => {
    return listProductSuggest
})