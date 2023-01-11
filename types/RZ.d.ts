interface RZGroup {
    "id": number
    "is_group_primary": number
    "href": unknown
}

interface RZCategory {
    "id": number
    "title": string
    "href": string
    "use_group_links": boolean
    "root_id": number
}

interface RZBrand {
    "id": number
    "title": string
    "name": string
    "logo": string
}

type RZImage = {
    "original": string
    "big_tile": string
    "preview": string
}

type RZPrice = {
    "old": number
    "current": number
    "pcs": string
}

export interface RZProduct {
    "id": number,
    "mpath": string,
    "href": string,
    "group": RZGroup,
    "category": RZCategory,
    "title": string,
    "brand": RZBrand,
    "comments": {
        "amount": number,
        "mark": number
    },
    "docket": string,
    "images": RZImage[],
    "loyalty": {
        "pl_bonus_charge_pcs": number,
        "pl_use_instant_bonus": number
    },
    "price": RZPrice,
    "status": string,
    "status_inherited": string,
    "sell_status": 'limited' | 'available' | 'out_of_stock',
    "merchant_id": number,
    "seller_id": number,
    "state": string,
    "tag": unknown,
    "premium_program": boolean,
    "sla_id": number
}
export interface RZCharacteristic {
    id: number
    order: number
    same: boolean
    title: string
    values: [string][]
    numValues: number[]
}