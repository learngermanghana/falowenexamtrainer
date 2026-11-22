import { canonicalPhone, canonicalEmail, canonicalName } from "./signupIdentity";

describe("signup identity normalization", () => {
  test("Ghana local and international phone formats compare equally", () => {
    expect(canonicalPhone("024 123 4567")).toBe("233241234567");
    expect(canonicalPhone("+233241234567")).toBe("233241234567");
    expect(canonicalPhone("00233241234567")).toBe("233241234567");
    expect(canonicalPhone("1234")).toBe("");
  });

  test("Gmail aliases match while other domains preserve dots and plus labels", () => {
    expect(canonicalEmail("A.ma+second@googlemail.com")).toBe("ama@gmail.com");
    expect(canonicalEmail("Ama+second@school.edu")).toBe("ama+second@school.edu");
  });

  test("name comparison tolerates spacing, accents and surname order", () => {
    expect(canonicalName(" Ofori,  Ama ")).toBe("ama ofori");
    expect(canonicalName("Ama Ofori")).toBe("ama ofori");
    expect(canonicalName("Ama")).toBe("");
  });
});
