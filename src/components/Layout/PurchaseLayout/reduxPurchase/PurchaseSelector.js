import { createSelector } from "@reduxjs/toolkit";
const billSelector = (state) => state.Purchase.bill
const detailBillSelector = (state) => state.Purchase.detailBill
const CommentSelectoer = (state) => state.Purchase.Comment

export const listBillSelector = createSelector(billSelector, (billSelector) => {
    let CheckBill = true
    const lengthBill = billSelector.length
    let count = 0
    billSelector.forEach(element => {
        if(element.Filter === 'hiden') {
            count +=1
        }
    })
    lengthBill === count ? CheckBill = false :  CheckBill = true
    return [billSelector,CheckBill]
})
export const listDetailBill = createSelector(detailBillSelector, (detailBillSelector) => {
    return detailBillSelector
})
export const listComment = createSelector(CommentSelectoer, (CommentSelectoer) => {
    return CommentSelectoer
})
