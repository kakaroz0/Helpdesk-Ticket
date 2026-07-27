import path from "node:path";
import { fileURLToPath } from "node:url";
import { createApp } from "./app.js";
import { JsonTicketRepository } from "./persistence/jsonTicketRepository.js";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const port = process.env.PORT || 4000;
const dataFile = process.env.DATA_FILE || path.join(__dirname, "..", "data", "tickets.json");

const app = createApp(new JsonTicketRepository(dataFile));

app.listen(port, () => {
  console.log(`Helpdesk API listening on http://localhost:${port}`);
});
