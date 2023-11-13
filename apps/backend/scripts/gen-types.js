require("dotenv").config({ path: `${__dirname}/../.env.local` });
const execSync = require("node:child_process").execSync;

execSync(
  `supabase gen types typescript --db-url ${process.env.DB_URL} > ${__dirname}/../src/types/supabase.ts`,
);
