const validateEmail = require("../labs/input-validation/validateEmail.js");
const LONG_EMAIL =
    "sigma123456sigma123456sigma123456sigma123456sigma123456sigma123456sigma123456sigma123456sigma123456sigma123456sigma123456sigma123456sigma123456sigma123456sigma123456sigma123456sigma123456sigma123456sigma123456sigma123456sigma123456sigma123456sigma123456@gmail.com";

const EMAIL_WITHOUT_AT_SYMBOL = "sigmagmail.com";

const EMAIL_VALID = "sigma@gmail.com";

const INVALID_DOMAIN_EMAIL = "sigma@mail.com";

describe("Validate Email", () => {
    it("should return.status equals true if email valid", () => {
        const doValidate = validateEmail.validateEmailFunction(
            EMAIL_VALID,
            { allowedDomains: ["gmail.com", "yahoo.com"] },
        );

        expect(doValidate.status).toBe(true);
        expect(doValidate.value).toBe("sigma@gmail.com");
    });

    it("should return invalid format if @ is missing", () => {
        const doValidate = validateEmail.validateEmailFunction(
            EMAIL_WITHOUT_AT_SYMBOL,
            { allowedDomains: ["gmail.com", "yahoo.com"] },
        );

        expect(doValidate.status).toBe(false);
        expect(doValidate.value).toBe(null);
        expect(doValidate.error).toBe("Invalid format");
    });

    it("should return error empty if email is empty", () => {
        const doValidate = validateEmail.validateEmailFunction(
            "",
            { allowedDomains: ["gmail.com", "yahoo.com"] },
        );

        expect(doValidate.status).toBe(false);
        expect(doValidate.value).toBe(null);
        expect(doValidate.error).toBe("Value is empty");
    });

    it("should return error email is too long if email is too long", () => {
        const doValidate = validateEmail.validateEmailFunction(
            LONG_EMAIL,
            { allowedDomains: ["gmail.com", "yahoo.com"] },
        );

        expect(doValidate.status).toBe(false);
        expect(doValidate.value).toBe(null);
        expect(doValidate.error).toBe("Value is too long");
    });

    it("should return error domain not valid", () => {
        const doValidate = validateEmail.validateEmailFunction(
            INVALID_DOMAIN_EMAIL,
            { allowedDomains: ["gmail.com", "yahoo.com"] },
        );

        expect(doValidate.status).toBe(false);
        expect(doValidate.value).toBe(null);
        expect(doValidate.error).toBe("Domain not allowed");
    });
});
