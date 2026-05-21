import dotenv from "dotenv";
import path from "path";
// dotenv.config({ path: path.resolve(__dirname, '../.env') })
if (!process.env.CI) {
    dotenv.config({ path: path.resolve(__dirname, "../.env") });
}
