let express = require("express");
let app = express();
// Sets an initial port. We"ll use this later in our listener
let PORT = process.env.PORT || 8080;
// Sets up the Express app to handle data parsing
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
//routers
app.use(express.static("public"));
app.use(express.static("db"));
require("./routes/apiRoutes.js")(app);
require("./routes/htmlRoutes.js")(app);
//listener
app.listen(PORT, function() {
    console.log("App listening on PORT: " + PORT);
});