//--- ngambil dari kodingan haryo ---

const simpleEmailRegex = /^[a-z0-9._%+-]+@[a-z0-9.-]+\.[a-z]{2,}$/i;

function validateEmail(email) {
  // cek tipe email
  if (typeof email !== "string") return { ok: false, error: "invalid_format" };

  // normalize
  const raw = email.trim().toLowerCase();
  if (raw.length === 0) {
    return { ok: false, error: "invalid_format" };
  } else if (raw.length > 254) {
    return { ok: false, error: "invalid_format" };
  } else if (!simpleEmailRegex.test(raw)) {
    return { ok: false, error: "invalid_format" };
  }

  return { ok: true, value: raw };
}