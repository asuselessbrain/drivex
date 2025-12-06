import { Pool } from "pg";
import { config } from "../config";

const pool = new Pool({
    connectionString: `${config.connectionString as string}`
})

export default pool;