const crypto = require("crypto");

module.exports = (err, req, res, next) => {
    // VULNERABLE: sending stack to client
    // res.status(500).send(`<pre>${err.stack}</pre>`);
    const token = crypto.randomBytes(16).toString("hex");
    res.status(500).send(
        `<h1>Oops, an error occured, please call our System Support</h1><br /><span>ID: ${token}</span><br/><span>Access time: ${
            new Date().toString()
        }
        }</span>`,
    );

    console.log(
        `An error occured on errorHandler \nID: ${token} \nStack:${
            JSON.stringify(err.stack)
        }\n${new Date().toString()} `,
    );
};
