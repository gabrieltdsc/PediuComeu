const express = require('express');
const cors = require('cors');
const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.json());
app.use(cors());

const routes = require('./routes/app');
app.use(routes);

app.get("/", (req, res) => {
    res.redirect("/view/login.html");
});

app.listen(PORT, () => {
    console.log(`Servidor rodando na porta ${PORT}`);
});