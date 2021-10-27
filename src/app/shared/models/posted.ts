export interface IPosted {
    fields: IPostedFields;
    OriginalPmtDiscPossible: number
}

export interface IPostedFields {
    Amount: number,
    AmountIncludingVAT: number,
    AppliestoDocNo: string,
    BilltoCustomerNo: string,
    BilltoName: string,
    DueDate: string,
    LocationCode: string,
    No: string,
    OrderNo: string,
    PostingDate: string,
    PreAssignedNo: string,
    SelltoAddress: string,
    SelltoCity: string
}