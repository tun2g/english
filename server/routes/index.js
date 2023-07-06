const routes = (app) => {
    app.use("/volcab", require("./volcab.router"));
};

module.exports = routes;
