const errorResponse = (errorMessage) => {
    return { status: false, value: null, error: errorMessage };
};

const successResponse = (value) => {
    return { status: true, value };
};

exports.validateEmailFunction = (email, options = {}) => {
    // trim  and lowercase
    const trimAndLowercaseMail = email.trim().toLowerCase();
    if (trimAndLowercaseMail.length === 0) {
        return errorResponse("Value is empty");
    }

    // validate email length
    if (trimAndLowercaseMail.length >= 254) {
        return errorResponse("Value is too long");
    }

    // validate using regex
    const simpleEmailRegex = /^[a-z0-9._%+-]+@[a-z0-9.-]+\.[a-z]{2,}$/i;

    if (!simpleEmailRegex.test(trimAndLowercaseMail)) {
        return errorResponse("Invalid format");
    }

    if (
        Array.isArray(options.allowedDomains) &&
        options.allowedDomains.length > 0
    ) {
        const domain = trimAndLowercaseMail.split("@")[1].toLowerCase();
        const ok = options.allowedDomains.some((d) =>
            domain === d.toLowerCase()
        );
        if (!ok) return errorResponse("Domain not allowed");
    }

    return successResponse(email);
};
