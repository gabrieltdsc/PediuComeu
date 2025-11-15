// Pra iniciar o servidor tem que rodar node app.js
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
app.use(express.static(path.join(__dirname, "view")));
app.use(
  session({
    secret: "admin123",
    resave: false,
    saveUninitialized: false,
    cookie: { maxAge: 3600000 }
  })
);

function adminOnly(req, res, next) {
    if (!req.session.user || req.session.user.role !== "admin") {
        return res.redirect("/user.html");
    }
    next();
}

app.post("/alterar-usuario", async (req, res) => {
    const { idUsuario, novaFuncao } = req.body;
    const usuarioLogado = req.session.user?.username;

    try {
        const usuario = users.find(u => u.username === idUsuario);
        if (!usuario) {
            return res.status(404).send("Usuário não encontrado!");
        }

        usuario.role = novaFuncao;
        salvarUsuarios();

        if (idUsuario === usuarioLogado) {
            req.session.user.role = novaFuncao;
        }

        res.send("Função alterada com sucesso!");
    } catch (err) {
        console.error(err);
        res.status(500).send("Erro ao alterar função.");
    }
});

app.get("/admin.html", adminOnly, (req, res) => {
    res.sendFile(path.join(__dirname, "view/admin.html"));
});

let users = [
  { username: "admin", password: "123", role: "admin" },
  { username: "joao", password: "123", role: "usuario" },
  { username: "maria", password: "123", role: "usuario" }
];

function salvarUsuarios() {
  console.log("Alterações feitas em memória:", users);
}

function autenticar(req, res, next) {
  if (req.session.user) {
    next();
  } else {
    res.redirect("/login.html");
  }
}

app.post("/login", (req, res) => {
  const { username, password } = req.body;
  const user = users.find(u => u.username === username && u.password === password);

  if (user) {
    req.session.user = { username: user.username, role: user.role };
    res.redirect("/main.html");
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

app.get("/usuarios", autenticar, adminOnly, (req, res) => {
  res.json(users);
});

app.post("/alterar-papel", autenticar, adminOnly, (req, res) => {
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

app.listen(PORT, () => console.log(`Servidor rodando em http://localhost:${PORT}/login.html`));
