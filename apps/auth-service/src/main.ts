import express from "express";
import cors from "cors";
import { errorMiddleware } from "../../../packages/error-handler/error-middleware";
import cookieParser from "cookie-parser";

const app = express();

app.use(
  cors({
    origin: ["http://localhost:3000"],
    credentials: true,
    allowedHeaders: ["Content-Type", "Authorization"],
  })
);
app.use(express.json({ limit: "100mb" }));
app.use(cookieParser());

app.get("/", (req, res) => {
  res.send({ message: "Hello API" });
});

app.use(errorMiddleware);

const port = process.env.PORT || 6001;
const server = app.listen(port, () => {
  console.log(`[ Auth Service is running at: ] http://localhost:${port}`);
});

server.on("error", (err) => {
  console.error("Server Error:", err);
});
