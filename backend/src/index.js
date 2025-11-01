import express from "express";
import cors from "cors";
import dotenv from "dotenv";

import countryRoutes from "./routes/country.routes.js";
import packageRoutes from "./routes/package.routes.js";
import midtransRoutes from "./routes/midtrans.routes.js";

dotenv.config();

const app = express();
const PORT = process.env.PORT || 4000;

app.use(cors());
app.use(express.json());

// Routes
app.use("/api/countries", countryRoutes);
app.use("/api/packages", packageRoutes);
app.use("/api/midtrans", midtransRoutes);

app.listen(PORT, () => {
    console.log(`✅ Server running on http://localhost:${PORT}`);
});
