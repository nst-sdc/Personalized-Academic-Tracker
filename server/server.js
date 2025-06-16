const express = require("express");

const cors = require("cors");

const app = express();
const port = 5000;


app.use(cors());


app.get('/api', (req, res) => {
  res.json({ message: "Hello from Express!" });
});

app.listen(port, () => {
  console.log(`Server is listening at http://localhost:${port}`);
});
