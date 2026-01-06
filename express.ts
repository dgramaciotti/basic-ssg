import express from "express";

const app = express();

app.use(express.static("dist-site", { extensions: ["html"] }));

app.listen(3000, () => console.log("listening on http://localhost:3000"));
