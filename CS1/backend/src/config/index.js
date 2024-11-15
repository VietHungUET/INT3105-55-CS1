require('dotenv').config();
const dotEnv = require("dotenv");

if (process.env.NODE_ENV !== "prod") {
    const configFile = `../../.env.${process.env.NODE_ENV}`;
    dotEnv.config({ path: configFile });
} else {
    dotEnv.config();
}
console.log("Loaded PORT:", process.env.PORT);

module.exports = {
    PORT: process.env.PORT || 3001,
    APP_SECRET: process.env.APP_SECRET,
};
