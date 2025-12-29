/**
 * Tipos de unidades de medida suportadas
 */
export type ItemType = 'kg' | 'litros' | 'unidade' | 'gramas' | 'ml';

/**
 * Calculates the total value of an item based on quantity, type and unit price
 * 
 * @param quantity - Item quantity
 * @param type - Unit type (kg, litros, unidade, gramas, ml)
 * @param unitPrice - Item unit price
 * @returns Calculated total value
 */
export function calculateTotalValue(
  quantity: number,
  type: ItemType | string,
  unitPrice: number
): number {
  const normalizedType = type.toLowerCase() as ItemType;
  
  switch (normalizedType) {
    case 'kg':
    case 'litros':
    case 'unidade':
      // For kg, litros and unidades, calculation is direct: quantity * unit price
      return quantity * unitPrice;

    case 'gramas':
      // For gramas, convert to kg first (divide by 1000)
      // unitPrice is the price per kg
      const quantityInKg = quantity / 1000;
      return quantityInKg * unitPrice;

    case 'ml':
      // For ml, convert to litros first (divide by 1000)
      // unitPrice is the price per litro
      const quantityInLitros = quantity / 1000;
      return quantityInLitros * unitPrice;

    default:
      // For unknown types, assume direct calculation
      return quantity * unitPrice;
  }
}

/**
 * Gets the adjusted unit value based on type
 * Useful for displaying the value per unit when the item is in gramas or ml
 * 
 * @param type - Unit type
 * @param unitPrice - Original unit price (per kg or per litro)
 * @returns Adjusted unit value for the base unit
 */
export function getAdjustedUnitValue(
  type: ItemType | string,
  unitPrice: number
): number {
  const normalizedType = type.toLowerCase() as ItemType;
  
  switch (normalizedType) {
    case 'gramas':
      // Returns the value per grama (value per kg / 1000)
      return unitPrice / 1000;

    case 'ml':
      // Returns the value per ml (value per litro / 1000)
      return unitPrice / 1000;

    case 'kg':
    case 'litros':
    case 'unidade':
    default:
      return unitPrice;
  }
}

/**
 * Formats the total value for display in reais
 * 
 * @param value - Value to be formatted
 * @returns Formatted string (ex: "R$ 17,98")
 */
export function formatValue(value: number): string {
  return new Intl.NumberFormat('pt-BR', {
    style: 'currency',
    currency: 'BRL',
  }).format(value);
}

/**
 * Calculates the value increment when adding one unit
 * 
 * @param type - Unit type
 * @param unitPrice - Unit price
 * @returns Value to be incremented
 */
export function calculateIncrement(
  type: ItemType | string,
  unitPrice: number
): number {
  const normalizedType = type.toLowerCase() as ItemType;
  
  switch (normalizedType) {
    case 'gramas':
      // Increments 1g, so divides the value per kg by 1000
      return unitPrice / 1000;

    case 'ml':
      // Increments 1ml, so divides the value per litro by 1000
      return unitPrice / 1000;

    case 'kg':
    case 'litros':
    case 'unidade':
    default:
      return unitPrice;
  }
}

/**
 * Calculates the value decrement when removing one unit
 * Same logic as increment, just to make code more readable
 * 
 * @param type - Unit type
 * @param unitPrice - Unit price
 * @returns Value to be decremented
 */
export function calculateDecrement(
  type: ItemType | string,
  unitPrice: number
): number {
  return calculateIncrement(type, unitPrice);
}

