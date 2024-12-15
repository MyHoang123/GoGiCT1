import { createSelector } from "@reduxjs/toolkit";
const productsSelector = (state) => state.products.products
const categorisSelector = (state) => state.products.categoris
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