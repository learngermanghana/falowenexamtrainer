const sanitizeName = (name) => {
  const fallback = "student";
  if (!name) return fallback;
  const cleaned = name.toString().trim().replace(/[^a-zA-Z]/g, "");
  return cleaned || fallback;
};

const generateRandomDigits = (length = 3) => {
  let output = "";
  for (let index = 0; index < length; index += 1) {
    output += Math.floor(Math.random() * 10).toString();
  }
  return output;
};

export const generateStudentCode = ({ firstName }) => {
  const safeName = sanitizeName(firstName);
  const suffix = generateRandomDigits(3);
  return `${safeName}-${suffix}`;
};
