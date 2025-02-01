import { createSelector } from "@reduxjs/toolkit";
const productsSelector = (state) => state.products.products
const categorisSelector = (state) => state.products.categoris.categori
const listTypeSelector = (state) => state.products.categoris.Type
const getCommentSelector = (state) => state.products.comment
const lenghtCardSelector = (state) => state.products.lenghtCard
export const listProductSelectorAll = createSelector(productsSelector, (listProducts) => {
    const count = listProducts.product.filter(item =>  item.Status === 'visible').length
    let trang = Math.ceil(count / 8)
    let from = (listProducts.page - 1) * 8;
    let to = from + 7;
    let productPage = [];
    for (let i = from; i <= to; i++) {
        if (!listProducts.product[i]) {
            break
        }
        productPage.push(listProducts.product[i])
    }
    return [productPage,trang,listProducts.page]
})
export const listCategoris = createSelector(categorisSelector, (listCategoris) => {
    return listCategoris
})
export const listTypes = createSelector(listTypeSelector, (listTypeSelector) => {
    return listTypeSelector
})
export const listComment = createSelector(getCommentSelector, (listComment) => {
    return listComment
})
export const lenghtCard = createSelector(lenghtCardSelector, (lenghtCardSelector) => {
    return lenghtCardSelector
})