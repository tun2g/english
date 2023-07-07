const routes = (app) => {
    app.use("/v1/volcab", require("./volcab.router"));
    app.use("/v1/user",require("./user.router"))
    app.use("/v1/auth",require("./auth.router"))
};

module.exports = routes;
