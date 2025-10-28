const express = require("express");
const session = require("express-session");
const bodyParser = require("body-parser");
const path = require("path");
const fs = require("fs");

const app = express();
const PORT = 3000;

app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.json());
app.use(express.static(path.join(__dirname, "public")));
app.use(
  session({
    secret: "admin123",
    resave: false,
    saveUninitialized: false,
    cookie: { maxAge: 3600000 } // 1h
  })
);

// let users = JSON.parse(fs.readFileSync("./users.json"));

function salvarUsuarios() {
  fs.writeFileSync("./users.json", JSON.stringify(users, null, 2));
}

function autenticar(req, res, next) {
  if (req.session.user) {
    next();
  } else {
    res.redirect("/login.html");
  }
}

function apenasAdmin(req, res, next) {
  if (req.session.user && req.session.user.role === "admin") {
    next();
  } else {
    res.status(403).send("Acesso negado! Apenas administradores podem ver esta página.");
  }
}


app.post("/login", (req, res) => {
  const { username, password } = req.body;
  const user = users.find(u => u.username === username && u.password === password);

  if (user) {
    req.session.user = { username: user.username, role: user.role };
    res.redirect("/principal.html");
  } else {
    res.send("Usuário ou senha inválidos. <a href='/login.html'>Tentar novamente</a>");
  }
});

app.get("/logout", (req, res) => {
  req.session.destroy();
  res.redirect("/login.html");
});

app.get("/dados", (req, res) => {
  if (req.session.user) {
    res.json({
      logado: true,
      username: req.session.user.username,
      role: req.session.user.role
    });
  } else {
    res.json({ logado: false });
  }
});

app.get("/usuarios", autenticar, apenasAdmin, (req, res) => {
  res.json(users);
});

app.post("/alterar-papel", autenticar, apenasAdmin, (req, res) => {
  const { username, role } = req.body;
  const user = users.find(u => u.username === username);
  if (user) {
    user.role = role;
    salvarUsuarios();
    res.send("Papel alterado com sucesso!");
  } else {
    res.status(404).send("Usuário não encontrado!");
  }
});

app.listen(PORT, () => console.log(`Servidor rodando em http://localhost:${PORT}`));
