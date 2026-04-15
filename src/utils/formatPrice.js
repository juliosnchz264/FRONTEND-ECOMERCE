/**
 * Formats a price value as Euros using European locale (Spanish).
 * Output examples: "10,00 €", "1.299,99 €"
 */
export const formatPrice = (price) => {
    if (price === undefined || price === null || isNaN(price)) return '—'
    return Number(price).toLocaleString('es-ES', {
        style: 'currency',
        currency: 'EUR',
        minimumFractionDigits: 2,
        maximumFractionDigits: 2,
    })
}
