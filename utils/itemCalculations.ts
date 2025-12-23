/**
 * Tipos de unidades de medida suportadas
 */
export type ItemType = 'kg' | 'litros' | 'unidade' | 'gramas' | 'ml';

/**
 * Calcula o valor total de um item baseado na quantidade, tipo e valor unitário
 * 
 * @param quantidade - Quantidade do item
 * @param tipo - Tipo de unidade (kg, litros, unidade, gramas, ml)
 * @param valorUnitario - Valor unitário do item
 * @returns Valor total calculado
 */
export function calcularValorTotal(
  quantidade: number,
  tipo: ItemType | string,
  valorUnitario: number
): number {
  const tipoNormalizado = tipo.toLowerCase() as ItemType;
  
  switch (tipoNormalizado) {
    case 'kg':
    case 'litros':
    case 'unidade':
      // Para kg, litros e unidades, o cálculo é direto: quantidade * valor unitário
      return quantidade * valorUnitario;

    case 'gramas':
      // Para gramas, converte para kg primeiro (divide por 1000)
      // valorUnitario é o preço por kg
      const quantidadeEmKg = quantidade / 1000;
      return quantidadeEmKg * valorUnitario;

    case 'ml':
      // Para ml, converte para litros primeiro (divide por 1000)
      // valorUnitario é o preço por litro
      const quantidadeEmLitros = quantidade / 1000;
      return quantidadeEmLitros * valorUnitario;

    default:
      // Para tipos desconhecidos, assume cálculo direto
      return quantidade * valorUnitario;
  }
}

/**
 * Calcula o valor unitário ajustado baseado no tipo
 * Útil para exibir o valor por unidade quando o item está em gramas ou ml
 * 
 * @param tipo - Tipo de unidade
 * @param valorUnitario - Valor unitário original (por kg ou por litro)
 * @returns Valor unitário ajustado para a unidade base
 */
export function obterValorUnitarioAjustado(
  tipo: ItemType | string,
  valorUnitario: number
): number {
  const tipoNormalizado = tipo.toLowerCase() as ItemType;
  
  switch (tipoNormalizado) {
    case 'gramas':
      // Retorna o valor por grama (valor por kg / 1000)
      return valorUnitario / 1000;

    case 'ml':
      // Retorna o valor por ml (valor por litro / 1000)
      return valorUnitario / 1000;

    case 'kg':
    case 'litros':
    case 'unidade':
    default:
      return valorUnitario;
  }
}

/**
 * Formata o valor total para exibição em reais
 * 
 * @param valor - Valor a ser formatado
 * @returns String formatada (ex: "R$ 17,98")
 */
export function formatarValor(valor: number): string {
  return new Intl.NumberFormat('pt-BR', {
    style: 'currency',
    currency: 'BRL',
  }).format(valor);
}

/**
 * Calcula o incremento de valor ao adicionar uma unidade
 * 
 * @param tipo - Tipo de unidade
 * @param valorUnitario - Valor unitário
 * @returns Valor a ser incrementado
 */
export function calcularIncremento(
  tipo: ItemType | string,
  valorUnitario: number
): number {
  const tipoNormalizado = tipo.toLowerCase() as ItemType;
  
  switch (tipoNormalizado) {
    case 'gramas':
      // Incrementa 1g, então divide o valor por kg por 1000
      return valorUnitario / 1000;

    case 'ml':
      // Incrementa 1ml, então divide o valor por litro por 1000
      return valorUnitario / 1000;

    case 'kg':
    case 'litros':
    case 'unidade':
    default:
      return valorUnitario;
  }
}

/**
 * Calcula o decremento de valor ao remover uma unidade
 * Mesma lógica do incremento, apenas para facilitar a leitura do código
 * 
 * @param tipo - Tipo de unidade
 * @param valorUnitario - Valor unitário
 * @returns Valor a ser decrementado
 */
export function calcularDecremento(
  tipo: ItemType | string,
  valorUnitario: number
): number {
  return calcularIncremento(tipo, valorUnitario);
}

