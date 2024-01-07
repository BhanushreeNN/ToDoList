import express from "express";
import bodyParser from "body-parser";
import pg from "pg";
import 'dotenv/config';

const app = express();
const port = 3000;

const db = new pg.Client({
  user: process.env.user_name,
  host: process.env.host_name,
  database: process.env.database_name,
  password: process.env.pw,
  port: 5432,
});
db.connect();

app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static("public"));



app.get("/", async (req, res) => {
  const result = await db.query("SELECT * FROM tasks ORDER BY id;");
  let items = [];
  result.rows.forEach((line)=>{items.push(line);
  });
  console.log(items);
  res.render("index.ejs", {
    listItems: items,
  });
});

app.post("/add", async(req, res) => {
  const item = req.body.newItem;
  const newline = await db.query("INSERT INTO tasks (task) VALUES ($1) RETURNING *;",[item]);
  res.redirect("/");
});

app.post("/edit", async (req, res) => {
const itemID = req.body.updatedItemId;
const itemTask = req.body.updatedItemTitle;
const altereditem = await db.query("UPDATE tasks SET task = $1 WHERE id = $2 ;",[itemTask, itemID]);
console.log(altereditem.rows[0]);
res.redirect("/");
});

app.post("/delete", async (req, res) => {
const itemDeleteID = req.body.deleteItemId;
const deletedItem = await db.query("DELETE FROM tasks WHERE ID = $1 RETURNING *;",[itemDeleteID]);
console.log(deletedItem.rows);
res.redirect("/");
});

app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});
