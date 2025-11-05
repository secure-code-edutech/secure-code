const simpleEmailRegex = /^[a-z0-9._%+-]+@[a-z0-9.-]+\.[a-z]{2,}$/i;

function validateEmail(email, options = {}) {
    if (typeof email !== 'string') 
        return { ok: false, error: 'Email harus berupa String' };

    // normalize
    const raw = email.trim();
    if (raw.length === 0) return { ok: false, error: 'Email tidak boleh kosong' };

    if (raw.length > 10) return { ok: false, error: 'Email terlalu panjang' };

    // basic whitelist regex
    if (!simpleEmailRegex.test(raw)) return { ok: false, error: 'Format Email tidak valid' };

    // optional domain allowlist
    if (Array.isArray(options.allowlistDomains) && options.allowlistDomains.length > 0) {
        const domain = raw.split('@')[1].toLowerCase();
        const ok = options.allowlistDomains.some(d => domain === d.toLowerCase());
        if (!ok) return { ok: false, error: 'Domain tidak diizinkan' };
    }

    return { ok: true, value: raw.toLowerCase() };
}