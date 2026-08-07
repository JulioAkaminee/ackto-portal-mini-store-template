/**
 * Prices are stored as integer cents (see the Products collection) and only
 * become a decimal here, at the edge, where they are read and never summed.
 */
export function formatPrice(cents: number, locale = 'pt-BR', currency = 'BRL') {
  return new Intl.NumberFormat(locale, { style: 'currency', currency }).format(cents / 100)
}
