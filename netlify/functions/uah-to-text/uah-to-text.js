function numberToUkrainianText(number) {
  const ones = ["", "один", "два", "три", "чотири", "п'ять", "шість", "сім", "вісім", "дев'ять"];
  const onesFeminine = ["", "одна", "дві", "три", "чотири", "п'ять", "шість", "сім", "вісім", "дев'ять"];
  const teens = ["десять", "одинадцять", "дванадцять", "тринадцять", "чотирнадцять", "п'ятнадцять", "шістнадцять", "сімнадцять", "вісімнадцять", "дев'ятнадцять"];
  const tens = ["", "десять", "двадцять", "тридцять", "сорок", "п'ятдесят", "шістдесят", "сімдесят", "вісімдесят", "дев'яносто"];
  const hundreds = ["", "сто", "двісті", "триста", "чотириста", "п'ятсот", "шістсот", "сімсот", "вісімсот", "дев'ятсот"];
  const thousands = ["тисяча", "тисячі", "тисяч"];
  const millions = ["мільйон", "мільйони", "мільйонів"];

  function pluralForm(n, singular, dual, plural) {
      if (n % 10 === 1 && n % 100 !== 11) return singular;
      else if (n % 10 >= 2 && n % 10 <= 4 && (n % 100 < 10 || n % 100 >= 20)) return dual;
      else return plural;
  }

  function convertBelowHundred(n, isFeminine = false) {
      if (n < 10) return isFeminine ? onesFeminine[n] : ones[n];
      if (n >= 10 && n < 20) return teens[n - 10];
      let tenPart = tens[Math.floor(n / 10)];
      let onePart = isFeminine ? onesFeminine[n % 10] : ones[n % 10];
      return `${tenPart} ${onePart}`.trim();
  }

  function convertBelowThousand(n, isFeminine = false) {
      let hundredPart = hundreds[Math.floor(n / 100)];
      let rest = n % 100;
      let restText = convertBelowHundred(rest, isFeminine);
      return `${hundredPart} ${restText}`.trim();
  }

  function convertNumber(n, isFeminine = false) {
      if (n < 100) return convertBelowHundred(n, isFeminine);
      if (n < 1000) return convertBelowThousand(n, isFeminine);
      let millionPart = Math.floor(n / 1000000);
      let thousandPart = Math.floor((n % 1000000) / 1000);
      let rest = n % 1000;
      let millionText = millionPart > 0 ? `${convertNumber(millionPart)} ${pluralForm(millionPart, "мільйон", "мільйони", "мільйонів")}` : "";
      let thousandText = thousandPart > 0 ? `${convertNumber(thousandPart, true)} ${pluralForm(thousandPart, "тисяча", "тисячі", "тисяч")}` : "";
      let restText = convertNumber(rest, thousandPart === 0 && rest < 100);
      return `${millionText} ${thousandText} ${restText}`.trim().replace(/\s+/g, ' ');
  }

  let integerPart = Math.floor(number);
  let decimalPart = Math.round((number - integerPart) * 100);

  if (decimalPart === 100) {
      decimalPart = 0;
      integerPart += 1;
  }

  let integerText = integerPart > 0 ? convertNumber(integerPart) : "нуль";
  
  // Determine the correct form for 'гривня'
  let units = integerPart % 10;
  let tensPlace = Math.floor((integerPart % 100) / 10);

  if (units === 1 && tensPlace !== 1) {
      integerText = integerText.replace(/один$/, "одна");
      integerText = integerPart === 1 ? "одна" : integerText;
  } else if (units === 2 && tensPlace !== 1) {
      integerText = integerText.replace(/два$/, "дві");
      integerText = integerPart === 1 ? "дві" : integerText;
  } else if (units >= 2 && units <= 4 && tensPlace !== 1) {
      integerText = convertNumber(integerPart, true);
  }

  let currencyText = "грн";
  return `${integerText} ${currencyText} ${decimalPart.toString().padStart(2, '0')} коп.`.trim();
}

/* const handler = async (event) => {
  try {
    const number = event.queryStringParameters.number || 1
    return {
      statusCode: 200,
      body: JSON.stringify({ result: numberToUkrainianText(number) }),

    }
  } catch (error) {
    return { statusCode: 500, body: error.toString() }
  }
} */

const handler = async (event) => {
  try {
    const number = event.body
    return {
      statusCode: 200,
      body: JSON.stringify({ result: body }),

    }
  } catch (error) {
    return { statusCode: 500, body: error.toString() }
  }
}

module.exports = { handler }
