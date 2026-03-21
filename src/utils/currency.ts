export function formatCurrency(amount: number, currency: string = '₹'): string {
  const absAmount = Math.abs(amount);
  const formatted = absAmount.toLocaleString('en-IN', {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  });
  const sign = amount < 0 ? '−' : amount > 0 ? '+' : '';
  return `${sign}${currency}${formatted}`;
}

export function formatCurrencyPlain(amount: number, currency: string = '₹'): string {
  return `${currency}${Math.abs(amount).toLocaleString('en-IN', {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  })}`;
}
