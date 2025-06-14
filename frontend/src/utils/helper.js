export function validateEmail(email) {
  const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return regex.test(email);
}

export function addThousandsSeparator(number) {
  if (number === null || isNaN(number)) return "";

  const [integerPart, fractionalPart] = number.toString().split(".");

  const formattedInteger = integerPart
    .toString()
    .replace(/\B(?=(\d{3})+(?!\d))/g, ",");

  return fractionalPart
    ? `${formattedInteger}.${fractionalPart}`
    : formattedInteger;
}
