import { RZProduct } from "../types/RZ";

export function sellStatusToString(status: RZProduct['sell_status']) {
    switch (status) {
        case "available":
            return 'Є в наявності'
        case "limited":
            return 'Закінчується'
        case "out_of_stock":
            return 'Закінчився'
        default:
            return ''
    }
}
export function sellStatusToColor(status: RZProduct['sell_status']) {
    switch (status) {
        case "available":
            return 'success'
        case "limited":
            return 'warning'
        case "out_of_stock":
            return 'secondary'
        default:
            return ''
    }
}