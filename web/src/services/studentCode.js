const LETTERS = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";

const sanitizeName = (name) => {
  const fallback = "student";
  if (!name) return fallback;
  const cleaned = name.toString().trim().replace(/[^a-zA-Z]/g, "");
  return cleaned || fallback;
};

const generateRandomLetters = (length = 3) => {
  let output = "";
  for (let index = 0; index < length; index += 1) {
    const randomIndex = Math.floor(Math.random() * LETTERS.length);
    output += LETTERS[randomIndex];
  }
  return output;
};

export const generateStudentCode = ({ firstName, level }) => {
  const safeName = sanitizeName(firstName);
  const levelCode = (level || "").toString().trim().toUpperCase() || "LVL";
  const suffix = generateRandomLetters(3);
  return `${safeName}-${levelCode}-${suffix}`;
};
