const { validatorEmail } = require("./validateEmail");

describe("fungsi validateEmail", () => {
  test("Valid email", () => {
    expect(validatorEmail("User@Example.com")).toEqual({
      ok: true,
      value: "user@example.com",
    });
  });

  test("Tanpa '@'", () => {
    expect(validatorEmail("UserExample.com")).toEqual({
      ok: false,
      value: "invalid_format",
    });
  });

  test("Kosong", () => {
    expect(validatorEmail("   ")).toEqual({
      ok: false,
      value: "empty_input",
    });
  });

  test("Terlalu panjang", () => {
    const longEmail = "a".repeat(255) + "@example.com";
    expect(validatorEmail(longEmail)).toEqual({
      ok: false,
      value: "too_long",
    });
  });

  test("Domain tidak valid", () => {
    expect(validatorEmail("user@example.xyz")).toEqual({
      ok: false,
      value: "invalid_domain",
    });
  });
});