// uuid do bate papo 
const UUID = "18654374-5869-4fd7-b88c-c33eee25cfdf";

// variável global
let usuario = "";
let msg = [];

// Perguntar o nome do usuário e mandar para o servidor
function nomeUsuario() {
    usuario = prompt("Para entrar, digite o seu nome:");
    
    const userName = { name: usuario };

    const promessaUsuario = axios.post(`https://mock-api.driven.com.br/api/v6/uol/participants/${UUID}`, userName);
    promessaUsuario.then(buscarNome);
    promessaUsuario.catch(nomeExiste);

    setInterval(manterOnline, 5000);
}
    nomeUsuario();

// Verificar se o nome já existe
function nomeExiste(erro) {
    if (erro.response.status === 400) {
        alert("Esse nome já foi usado! Tente outro.");
        nomeUsuario();
    }
}

// Manter a conexão no bate-papo
function manterOnline() {
    const userName = { name: usuario };

    const conexao = axios.post(`https://mock-api.driven.com.br/api/v6/uol/status/${UUID}`, userName);

    conexao.then(verificarConexao);
    conexao.catch(erroConexao);
}

// Verificar conexão
function verificarConexao() {
    console.log("Estabelecendo conexão...");
}

// Caso de erro na conexão
function erroConexao(resposta) {
    console.log('Erro');
    console.log(resposta);
}

// Buscar mensagens e atualizar o array `msg`
function pegmensagem() {
    const promessaMsg = axios.get(`https://mock-api.driven.com.br/api/v6/uol/messages/${UUID}`);
    promessaMsg.then(response => {
        msg = response.data;  // Atualiza o array msg com as mensagens recebidas
        iniciarChat();
    });
}

// Atualizar mensagens periodicamente
setInterval(pegmensagem, 3000);

// Enviar mensagens e limpar o campo de entrada
function enviarMensagem() {
    let mensagem = document.querySelector('input').value;
    const data = { from: usuario, to: "Todos", text: mensagem, type: 'message' };

    const promessaEnvio = axios.post(`https://mock-api.driven.com.br/api/v6/uol/messages/${UUID}`, data);
    promessaEnvio.then(() => {
        pegmensagem();  // Atualizar as mensagens após o envio
        document.querySelector('input').value = '';  // Limpa o campo de entrada
    });
}

// Buscar todos os nomes no chat
function buscarNome() {
    promessaNome = axios.get(`https://mock-api.driven.com.br/api/v6/uol/participants/${UUID}`)
    promessaNome.then(reinderizarNomes);

    
}

setInterval(buscarNome,3000);

function reinderizarNomes(resposta) {
    let contatos = document.querySelector(".participantes");
    contatos.innerHTML = "";  // Limpa os contatos antes de renderizar novamente

    resposta.data.forEach(participante => {
        contatos.innerHTML += `
            <div class="icone pessoa">
                <button class="t1">
                    <ion-icon name="person-circle"></ion-icon>
                    <p>${participante.name}</p>
                </button>
                <div class="check escondido">
                    <ion-icon name="checkmark-sharp"></ion-icon>
                </div>
            </div>`;
    });
}


// Abrir o sidebar
function abrirSidebar() {
    let sideBar = document.querySelector('.sidebar');
    sideBar.classList.toggle("escondido");
}

// Função para iniciar o bate-papo (renderiza mensagens e rola até a última mensagem)
function iniciarChat() {
    const chat = document.querySelector(".container");
    chat.innerHTML = "";  
    msg.forEach(mensagens => {
        if (mensagens.type === 'status') {
            chat.innerHTML += `
                <div class="mensagem entraSai">
                    <div class="texto">
                        <time datetime="">${mensagens.time}</time> 
                        <span class="bold">${mensagens.from}</span> entra na sala...
                    </div>
                </div>`;
        } else if (mensagens.type === 'message') {  // Mensagem pública
            chat.innerHTML += `
                <div class="mensagem">
                    <div class="texto">
                        <time datetime="">${mensagens.time}</time> 
                        <span class="nome bold">${mensagens.from}</span> 
                        para <span class="bold">${mensagens.to}:</span> 
                        ${mensagens.text}
                    </div>
                </div>`;
        } else if (mensagens.type === 'private_message' && mensagens.to === usuario) {  // Mensagem privada
            chat.innerHTML += `
                <div class="mensagem privado">
                    <div class="texto">
                        <time datetime="">${mensagens.time}</time> 
                        <span class="nome bold">${mensagens.from}</span> 
                        para <span class="bold">${mensagens.to}:</span> 
                        ${mensagens.text}
                    </div>
                </div>`;
        }
    });

    // Rolagem automática para a última mensagem
    const ultimaMensagem = document.querySelector('.container .mensagem:last-child');
    if (ultimaMensagem) {
        ultimaMensagem.scrollIntoView();
    }
}


buscarNome()