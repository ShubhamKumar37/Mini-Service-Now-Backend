import app from "./config/server.js";
import { PORT } from "./config/dotenv.js";
import erorrHandler from "./middlewares/errorHandlerMiddleware.js";


app.use("/", async (req, res) => {
    res.send("Hello World and we are working on the project");
})
app.use(erorrHandler);

app.listen(PORT, () => {
    console.log(`Server is running on port http://localhost:${PORT}`);
});