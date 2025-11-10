const carrinho = [];
const taxaEntrega = 5.00;

function atualizarCarrinho() {
    const itensDiv = document.getElementById('itensCarrinho');
    const subtotalEl = document.getElementById('subtotal');
    const totalEl = document.getElementById('total');

    itensDiv.innerHTML = '';
    let subtotal = 0;

    carrinho.forEach((item, i) => {
    subtotal += item.preco * item.qtd;
    itensDiv.innerHTML += `
        <div class="itemCarrinho">
        <p><b>${item.nome}</b> (x${item.qtd})</p>
        <p>R$ ${(item.preco * item.qtd).toFixed(2)}</p>
        <button class="botaoRemover" onclick="removerItem(${i})">Remover</button>
        </div>`;
    });

    subtotalEl.innerText = subtotal.toFixed(2);
    totalEl.innerText = (subtotal + taxaEntrega).toFixed(2);
}

function adicionarCarrinho(nome, preco) {
    const existente = carrinho.find(p => p.nome === nome);
    if (existente) {
    existente.qtd++;
    } else {
    carrinho.push({ nome, preco, qtd: 1 });
    }
    atualizarCarrinho();
}

function removerItem(index) {
    carrinho.splice(index, 1);
    atualizarCarrinho();
}

function finalizarPedido() {
    document.querySelector('.conteudoPrincipal').style.display = 'none';
    document.getElementById('statusPedido').style.display = 'block';
    atualizarStatus(0);
    setTimeout(() => atualizarStatus(1), 3000);
    setTimeout(() => atualizarStatus(2), 6000);
    setTimeout(() => atualizarStatus(3), 9000);
}

function atualizarStatus(etapa) {
    const etapas = document.querySelectorAll('.etapaPedido');
    etapas.forEach((e, i) => e.classList.toggle('ativa', i <= etapa));
}

function voltarInicio() {
    document.getElementById('statusPedido').style.display = 'none';
    document.querySelector('.conteudoPrincipal').style.display = 'flex';
    carrinho.length = 0;
    atualizarCarrinho();
}

atualizarCarrinho();