function validatorEmail(input) {
  const value = input.trim().toLowerCase();

  if (value.length === 0) {
    return { ok: false, value: "empty_input" };
  }

  if (value.length > 254) {
    return { ok: false, value: "too_long" };
  }

  const emailRegex = /^[a-z0-9._%+-]+@[a-z0-9.-]+\.[a-z]{2,}$/i;
  if (!emailRegex.test(value)) {
    return { ok: false, value: "invalid_format" };
  }

  const validTldRegex = /\.(com)$/i;
  if (!validTldRegex.test(value)) {
    return { ok: false, value: "invalid_domain" };
  }
  return { ok: true, value };
}

module.exports = { validatorEmail };