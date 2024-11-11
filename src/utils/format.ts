export const formatCurrency = (
  value: number,
  currency: "USD" | "EUR" | "GBP" | "INR"
) => {
  const locale = currency === "INR" ? "en-IN" : "en-US";

  return new Intl.NumberFormat(locale, {
    style: "currency",
    currency,
    currencyDisplay: "symbol"
  }).format(value);
};

export const formatEnum = (str: string) => {
  const words = str.split("_");
  const formattedWords = words.map((word) => {
    return word.charAt(0) + word.slice(1).toLowerCase();
  });
  return formattedWords.join(" ");
};

export const truncateText = (str: string, n: number) => {
  return str.length > n ? str.substring(0, n - 1) + "..." : str;
};
