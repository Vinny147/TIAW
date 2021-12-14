function carregaUsuario() { //pega o id do usuario logado que foi passado para a hash da url e entao acha o seu indice no array de usuarios
    let ObjDadosUsuario = JSON.parse(localStorage.getItem('db_usuarios'));
    function idParaIndice() {
        for(let i = 0; i < ObjDadosUsuario.usuarios.length; i++) {
            if (ObjDadosUsuario.usuarios[i].id === idUsuarioAtual) return i;
        }
    }
    indiceDbUsuarios = idParaIndice();
    document.getElementById('nomeUsuario').innerHTML = ObjDadosUsuario.usuarios[indiceDbUsuarios].nome;
    document.getElementById('emailUsuario').innerText = ObjDadosUsuario.usuarios[indiceDbUsuarios].email;
    let objDadosConfig = leDadosConfigAtual();
    if(objDadosConfig) if (objDadosConfig.imgPerfil) document.getElementById('imgPerfil').src = objDadosConfig.imgPerfil;
    document.getElementById('btnDashboard').addEventListener('click', () => {
        if (window.location.pathname === '/dashboard/dashboard.html#' + idUsuarioAtual) return;
        window.location.replace('/dashboard/dashboard.html#' + idUsuarioAtual);
    });
    document.getElementById('btnGrafico').addEventListener('click', () => {
        if (window.location.pathname === '/estatisticas/estatisticas.html#' + idUsuarioAtual) return;
        window.location.replace('/estatisticas/estatisticas.html#' + idUsuarioAtual);
    });
    document.getElementById('btnConfig').addEventListener('click', () => {
        if (window.location.pathname === '/config/config.html#' + idUsuarioAtual) return;
        window.location.replace('/config/config.html#' + idUsuarioAtual);
    });
    document.getElementById('btnSair').addEventListener('click', () => {
        window.location.replace('../login/login.html');
    });
}

function statusUpdate(obj, idData, bool) {
    let objDadosTarefas = lerTarefas(true);
    let index;
    for (let i = 0; i < objDadosTarefas.tarefas.length; i++) {
        if (objDadosTarefas.tarefas[i].data === idData) {
            tarefa = objDadosTarefas.tarefas[i];
            index = i;
            break;
        }
    }
    if (obj === 'check') {
        objDadosTarefas.tarefas[index].check = bool;
    } else {
        objDadosTarefas.tarefas[index].alarme = bool;
    }
    salvarDados(objDadosTarefas, 'dbTarefas');
}

function leDadosConfigAtual() {
    let objDadosConfig = {
        "idUsuario": idUsuarioAtual,
        "imgPerfil": '',
        "toqueAlarme": {
            "nome": '',
            "volume": '',
            "loop": ''
        }
    };
    if (localStorage.getItem('dbConfigs')) {
        objDadosConfig = JSON.parse(localStorage.getItem('dbConfigs'));
        objDadosConfig = objDadosConfig.find(obj => obj.idUsuario === idUsuarioAtual);
        if (objDadosConfig === undefined) {
            objDadosConfig = {
                "idUsuario": idUsuarioAtual,
                "imgPerfil": '',
                "toqueAlarme": {
                    "nome": '',
                    "volume": '',
                    "loop": ''
                }
            };
        }
    }
    return objDadosConfig;
}

function salvarDados (dados, db) {
    localStorage.setItem (db, JSON.stringify (dados));
}

function carregaAlarme() {
    let objDadosTarefas = lerTarefas(true);
    let tempoAtual = new Date();
    let tarefasAlarmeOn = objDadosTarefas.tarefas.filter(obj => obj.alarme === true && obj.check === false && (new Date(obj.data) - tempoAtual) > 0);
    if (tarefasAlarmeOn.length === 0) return;
    tarefasAlarmeOn.forEach(obj => {
        let tempoRestante = new Date(obj.data) - tempoAtual;
        console.log(tempoRestante);
        setTimeout(() => disparaAlarme(obj), tempoRestante);
    });
}

function disparaAlarme(obj) {
    let alarme = document.getElementById('alarme');
    let containerModalAlarme = document.getElementById('containerModalAlarme');
    let modalAlarme = document.getElementById('modalAlarme');
    let btnModalAlarme = document.getElementById('btnModalAlarme');
    let objDadosConfig = leDadosConfigAtual();
    modalAlarme.children[1].innerHTML = obj.nome;
    modalAlarme.children[2].innerHTML = obj.descricao;
    containerModalAlarme.style.opacity = '1';
    containerModalAlarme.style.pointerEvents = 'auto';
    alarme.muted = false;
    alarme.loop = true;
    alarme.volume = 0.3;
    if (objDadosConfig.toqueAlarme.nome) alarme.src = '../resources/' + objDadosConfig.toqueAlarme.nome + '.mp3';
    if (objDadosConfig.toqueAlarme.loop != '') alarme.loop = objDadosConfig.toqueAlarme.loop;
    if (objDadosConfig.toqueAlarme.volume != '') alarme.volume = objDadosConfig.toqueAlarme.volume;
    alarme.play();
    btnModalAlarme.addEventListener('click', () => {
        alarme.muted = true;
        alarme.loop = false;
        containerModalAlarme.style.opacity = '0';
        containerModalAlarme.style.pointerEvents = 'none';
        statusUpdate('check', obj.data, true);
        if (window.location.pathname === '/dashboard/dashboard.html#' + idUsuarioAtual)imprimirTarefas();
    });
}

let asideBody = document.getElementById('asideBody');

function toggleAside() {
    let menuToggle = document.getElementById('menuToggle');
    let calToggle = document.getElementById('calToggle');
    menuToggle.addEventListener('click', () => {
        if (asideBody.children[0].id === 'menu' && document.body.clientWidth > 920) return;
        if (asideBody.children[0].id === 'menu' && document.body.clientWidth <= 920) {
            if (asideBody.classList.contains('hide')) {
                asideBody.classList.remove('hide');
            } else {
                asideBody.classList.add('hide');
            }
            return;
        }
        asideBody.classList.remove('hide');
        asideBody.innerHTML = ` <div id="menu" class="menu">
                                    <ul>
                                        <li>
                                            <div id="btnDashboard">
                                                <i class="bi bi-columns-gap"></i>
                                                <h4>Dashboard</h4>
                                            </div>
                                        </li>
                                        <li>
                                            <div id="btnGrafico">
                                                <i class="bi bi-bar-chart"></i>
                                                <h4>Estatíticas</h4>
                                            </div>
                                        </li>
                                        <li>
                                            <div id="btnConfig">
                                                <i class="bi bi-gear"></i>
                                                <h4>Configurações</h4>
                                            </div>
                                        </li>
                                        <li>
                                            <a href="../login/login.html">
                                                <div id="btnSair">
                                                    <i class="bi bi-box-arrow-right"></i>
                                                    <h4>Sair</h4>
                                                </div>
                                            </a>
                                        </li>
                                    </ul>
                                </div>`;
        carregaUsuario();
    });

    calToggle.addEventListener('click', () => {
        if (asideBody.hasChildNodes) {
            if (asideBody.children[0].id === 'calendarioContainer' && document.body.clientWidth > 920) return;
            if (asideBody.children[0].id === 'calendarioContainer' && document.body.clientWidth <= 920) {
                if (asideBody.classList.contains('hide')) {
                    asideBody.classList.remove('hide');
                } else {
                    asideBody.classList.add('hide');
                }
                return;
            }
        }
        asideBody.classList.remove('hide');
        asideBody.innerHTML = ` <div id="calendarioContainer" class="calendario-container">
                                    <div id="calendario">                            
                                    </div>
                                    <h4>Notas</h4>
                                    <div id="containerNotas" class="container-notas">
                                    </div>
                                    <div id="containerInputNotas">
                                    </div>
                                </div>`;
        carregaCalendario();
        carregaBlocoDeNotas();
        carregaUsuario();
    });
}

function carregaCalendario() {
    let data = geraTempo(), calendarioHeaderHTML, calendarioBodyHTML = '';
    data.mes += qtdClicksTrocaMes;
    data.ano = new Date(new Date().getFullYear(), data.mes - 1).getFullYear();
    data.mes = new Date(new Date().getFullYear(), data.mes - 1).getMonth() + 1;
    /*if (data.mes > 12) {
        data.mes %= 12;
        if (data.mes % 12 === 0) data.mes = 12;
    }
    if (data.mes === 0) {
        data.mes = 12;
        //data.mes %= 12;
    }
    console.log(data.mes);*/
    let calendario = document.getElementById('calendario');
    calendarioHeaderHTML = `<h5 id="mesAno">${numMesParaNome(data.mes) + ' de ' + data.ano}</h5>
                            <i id="btnMesAnterior" class="bi bi-caret-left"></i>
                            <i id="btnMesPosterior" class="bi bi-caret-right"></i>
                            <h5 class="calDiaSem" style="grid-area: s1;">D</h5>
                            <h5 class="calDiaSem" style="grid-area: s2;">S</h5>
                            <h5 class="calDiaSem" style="grid-area: s3;">T</h5>
                            <h5 class="calDiaSem" style="grid-area: s4;">Q</h5>
                            <h5 class="calDiaSem" style="grid-area: s5;">Q</h5>
                            <h5 class="calDiaSem" style="grid-area: s6;">S</h5>
                            <h5 class="calDiaSem" style="grid-area: s7;">S</h5>`;
    for (let i = new Date(data.ano, (data.mes - 1), 1).getDay(), j = 1; j <= new Date(data.ano, (data.mes), 0).getDate(); i++, j++) {
        calendarioBodyHTML += `<span id="d${j}" class="circulo-calendario" style="grid-area: p${i};"><h5>${j}</h5></span>`;
    }
    calendario.innerHTML = calendarioHeaderHTML + calendarioBodyHTML;

    document.getElementById('btnMesPosterior').addEventListener('click', () => {
        qtdClicksTrocaMes++;
        carregaCalendario();
    })
    document.getElementById('btnMesAnterior').addEventListener('click', () => {
        qtdClicksTrocaMes--;
        carregaCalendario();
    })
}


function leDadosNotas() {
    let objDadosNotas = {
        "idUsuario": idUsuarioAtual,
        "nota": []
    };
    if (localStorage.getItem('dbNotas')) {
        objDadosNotas = JSON.parse(localStorage.getItem('dbNotas'));
        console.log(objDadosNotas);
        objDadosNotas = objDadosNotas.find(obj => obj.idUsuario === idUsuarioAtual);
        if (objDadosNotas === undefined) {
            objDadosNotas = {
                "idUsuario": idUsuarioAtual,
                "nota": []
            };
        }
        /*for (let i = 0; i < objDadosNotas.length; i++) {
            if (objDadosNotas[i].idUsuario === idUsuarioAtual) {
                indiceDbNotas = i;
                break;
            } else {
                indiceDbNotas = (objDadosNotas.length);
                objDadosNotas[indiceDbNotas] = {
                    idUsuario: idUsuarioAtual,
                    notas: []
                };
            }
        }*/
    }
    /*if (objDadosNotas[indiceDbNotas].nota.length != null) {
        objDadosNotas[indiceDbNotas].nota.sort((a, b) => {
            return a.data - b.data;
        });
    }*/
    return objDadosNotas;
}

function carregaBlocoDeNotas(indice) {
    let containerNotas = document.getElementById('containerNotas');
    let notasUsuario = leDadosNotas();
    if (notasUsuario.nota.length === 0) {
        containerNotas.innerHTML = `  <div id="semNotas">
                                        <h5>Você ainda não possui nenhuma nota, clique no botão para adicionar uma.</h5>
                                        <i id="addNota" class="bi bi-journal-plus"></i>
                                    </div>`;
        document.getElementById('addNota').addEventListener('click', cadastrarNota);
        return;
    }
    let dataTexto = new Date(notasUsuario.nota[notasUsuario.nota.length - 1].data).getDate() + '/' + 
    (new Date(notasUsuario.nota[notasUsuario.nota.length - 1].data).getMonth() + 1) + '/' +
    new Date(notasUsuario.nota[notasUsuario.nota.length - 1].data).getFullYear() + ' às ' +
    new Date(notasUsuario.nota[notasUsuario.nota.length - 1].data).getHours() + ':' +
    new Date(notasUsuario.nota[notasUsuario.nota.length - 1].data).getMinutes();
    if (indice) {
        let indiceNotaAtual;
        let dataNotaAtual = document.getElementById('containerNotas').children[2].children[0].id;
        for (let i = 0; i < notasUsuario.nota.length; i++) {
            if (notasUsuario.nota[i].data === dataNotaAtual) {
                indiceNotaAtual = i;
            }
        }
        if (notasUsuario.nota[indiceNotaAtual + indice] === undefined) return;
        dataTexto = new Date(notasUsuario.nota[indiceNotaAtual + indice].data).getDate() + '/' + 
        (new Date(notasUsuario.nota[indiceNotaAtual + indice].data).getMonth() + 1) + '/' +
        new Date(notasUsuario.nota[indiceNotaAtual + indice].data).getFullYear() + ' às ' +
        new Date(notasUsuario.nota[indiceNotaAtual + indice].data).getHours() + ':' +
        new Date(notasUsuario.nota[indiceNotaAtual + indice].data).getMinutes();
        containerNotas.innerHTML = `<div class="notas-header">
                                        <h5 id="tituloNota">${notasUsuario.nota[indiceNotaAtual + indice].titulo}</h5>
                                        <i id="btnNotaAnterior" class="bi bi-caret-left"></i>
                                        <i id="btnNotaPosterior" class="bi bi-caret-right"></i>
                                    </div>
                                    <div id="notasBody">${notasUsuario.nota[indiceNotaAtual + indice].descricao}</div>
                                    <div class="notas-footer">
                                        <small id="${notasUsuario.nota[indiceNotaAtual + indice].data}" class="dataNota">${dataTexto}</small>
                                        <i id="addNota" class="bi bi-journal-plus"></i>
                                        <i id="editarNota" class="bi bi-pencil-square"></i>
                                        <i id="excluirNota" class="bi bi-trash"></i>
                                    </div>`;
    } else containerNotas.innerHTML = ` <div class="notas-header">
                                            <h5 id="tituloNota">${notasUsuario.nota[notasUsuario.nota.length - 1].titulo}</h5>
                                            <i id="btnNotaAnterior" class="bi bi-caret-left"></i>
                                            <i id="btnNotaPosterior" class="bi bi-caret-right"></i>
                                        </div>
                                        <div id="notasBody">${notasUsuario.nota[notasUsuario.nota.length - 1].descricao}</div>
                                        <div class="notas-footer">
                                            <small id="${notasUsuario.nota[notasUsuario.nota.length - 1].data}" class="dataNota">${dataTexto}</small>
                                            <i id="addNota" class="bi bi-journal-plus"></i>
                                            <i id="editarNota" class="bi bi-pencil-square"></i>
                                            <i id="excluirNota" class="bi bi-trash"></i>
                                        </div>`;
    document.getElementById('btnNotaPosterior').addEventListener('click', () => {carregaBlocoDeNotas(1)});
    document.getElementById('btnNotaAnterior').addEventListener('click', () => {carregaBlocoDeNotas(-1)});
    document.getElementById('addNota').addEventListener('click', cadastrarNota);
    document.getElementById('editarNota').addEventListener('click', editarNota);
    document.getElementById('excluirNota').addEventListener('click', apagarNota);
}

/*function filtraNotas() {
    let aux = leDadosNotas();
    if (aux.length === undefined) {
        if (aux.idUsuario === idUsuarioAtual) return aux;
        let aux2 = [ aux, {
            "idUsuario": idUsuarioAtual,
            "nota": [/*{
                "data": '2021-12-11T22:35:20.398Z',
                "titulo": 'teste do segundo user',
                "descricao": 'bla bla bla bla bla bla bla bla bla bla bla bla bla bla bla bla bla bla bla bla'
            }]
        }];
        return aux2[1];
    } else {
        aux.find(obj => obj.idUsuario === idUsuarioAtual);
        if (aux[0].nota.length > 1) {
            console.log(aux);
            aux[0].nota.sort((a, b) => new Date(a.data) - new Date(b.data));
        }
        return aux[0];
    }
}*/

function salvaNotas(notasUsuario) {
    let notasTodosUsuarios = JSON.parse(localStorage.getItem('dbNotas'));
    if (notasTodosUsuarios === null) {
        //if (notasTodosUsuarios.idUsuario === idUsuarioAtual) {
            notasTodosUsuarios = new Array();
            notasTodosUsuarios.push(notasUsuario);
            salvarDados(notasTodosUsuarios, 'dbNotas');
        //}
    } else {
        notasTodosUsuarios = notasTodosUsuarios.filter(obj => obj.idUsuario != idUsuarioAtual);
        notasTodosUsuarios.push(notasUsuario);
        salvarDados(notasTodosUsuarios, 'dbNotas');
    }
}

function cadastrarNota() {
    document.getElementById('containerInputNotas').innerHTML = `<label for="titulo-nota">Título: *</label>
                                                                <input type="text" name="titulo-nota" id="iptTituloNota" maxlength="48" placeholder="Digite Algo (Max 48 Caracteres)">
                                                                <label for="bloco-de-notas">Descrição: *</label>
                                                                <textarea name="bloco-de-notas" id="blocoDeNotas" cols="30" rows="10" maxlength="300" placeholder="Digite Algo (Max 300 Caracteres)"></textarea>
                                                                <span id="avisoCal"></span>
                                                                <div class="input-notas-footer">
                                                                    <input type="button" value="Cancelar" id="btnCancelaNota">
                                                                    <input type="button" value="Salvar" id="btnSalvaNota">
                                                                </div>`;
    document.getElementById('containerInputNotas').scrollIntoView({ behavior: 'smooth', block: 'center' });
    let tituloNota =  document.getElementById('iptTituloNota');
    let textoNota = document.getElementById('blocoDeNotas');
    document.getElementById('btnCancelaNota').addEventListener('click', () => {
        tituloNota.value = '';
        textoNota.value = '';
        document.getElementById('containerInputNotas').innerHTML = '';
    });
    document.getElementById('btnSalvaNota').addEventListener('click', () => {
        if (tituloNota.value === '' && textoNota.value === '') {
            document.getElementById('avisoCal').innerText = '*Preencha os campos obrigatórios';
            document.getElementById('btnSalvaNota').scrollIntoView();
            return;
        }
        let notasUsuario = leDadosNotas();
        let novaNota = {
            "data": new Date().toJSON(),
            "titulo": tituloNota.value,
            "descricao": textoNota.value
        };
        notasUsuario.nota.push(novaNota);

        tituloNota.value = '';
        textoNota.value = '';
        document.getElementById('containerInputNotas').innerHTML = '';

        salvaNotas(notasUsuario);
        carregaBlocoDeNotas();
    });
}

function editarNota() {
    let notasUsuario = leDadosNotas();
    let idData = this.closest('.notas-footer').children[0].id
    let notaAtual = notasUsuario.nota.find(obj => obj.data === idData);
    document.getElementById('containerInputNotas').innerHTML = `<label for="titulo-nota">Título: *</label>
                                                                <input type="text" name="titulo-nota" id="iptTituloNota" maxlength="48" placeholder="Digite Algo (Max 48 Caracteres)" value="${notaAtual.titulo}">
                                                                <label for="bloco-de-notas">Descrição: *</label>
                                                                <textarea name="bloco-de-notas" id="blocoDeNotas" cols="30" rows="10" maxlength="300" placeholder="Digite Algo (Max 300 Caracteres)">${notaAtual.descricao}</textarea>
                                                                <span id="avisoCal"></span>
                                                                <div class="input-notas-footer">
                                                                    <input type="button" value="Cancelar" id="btnCancelaNota">
                                                                    <input type="button" value="Salvar" id="btnSalvaNota">
                                                                </div>`;
    document.getElementById('containerInputNotas').scrollIntoView({ behavior: 'smooth', block: 'center' });
    let tituloNota =  document.getElementById('iptTituloNota');
    let textoNota = document.getElementById('blocoDeNotas');
    document.getElementById('btnCancelaNota').addEventListener('click', () => {
        tituloNota.value = '';
        textoNota.value = '';
        document.getElementById('containerInputNotas').innerHTML = '';
    });
    document.getElementById('btnSalvaNota').addEventListener('click', () => {
        if (tituloNota.value === '' && textoNota.value === '') {
            document.getElementById('avisoCal').innerText = '*Preencha os campos obrigatórios';
            document.getElementById('btnSalvaNota').scrollIntoView();
            return;
        }
        notaAtual = {
            "data": new Date().toJSON(),
            "titulo": tituloNota.value,
            "descricao": textoNota.value
        };
        //notasUsuario.nota.push(novaNota);
        for (let i = 0; i < notasUsuario.nota.length; i++) {
            if (notasUsuario.nota[i].data === idData) {
                notasUsuario.nota[i] = notaAtual;
                break;
            }
        }

        tituloNota.value = '';
        textoNota.value = '';
        document.getElementById('containerInputNotas').innerHTML = '';

        salvaNotas(notasUsuario);
        carregaBlocoDeNotas();
    });
}

function apagarNota() {
    let idData = this.closest('.notas-footer').children[0].id;
    let notasUsuario = leDadosNotas();
    for (let i = 0; i < notasUsuario.nota.length; i++) {
        if (notasUsuario.nota[i].data === idData) {
            notasUsuario.nota.splice(i, 1);
        }
    }
    salvaNotas(notasUsuario);
    carregaBlocoDeNotas();
}

function lerTarefas(filtro) {
    let strTarefas = localStorage.getItem('dbTarefas');
    let  objDadosTarefas = {
        tarefas: [ // Mock de tarefas para teste
            /*{
                "nome": "Jogar Gwent",
                "data": "2021-11-18T14:00",
                "alarme": false,
                "check": true,
                "descricao": "Quando eu resgatar a minha recompensa do leshen vou até a taverna mas próxima jogar um pouco de Gwent com as pessoas da cidade"
            },
            {
                "nome": "Perguntar se há recompensas na cidade",
                "data": "2021-11-18T16:00",
                "alarme": false,
                "check": true,
                "descricao": ""
            },
            {
                "nome": "Viajar para Vizima",
                "data": "2021-12-01T10:00",
                "alarme": true,
                "check": false,
                "descricao": "Será uma longa viagem"
            }*/
        ]
    };
    if (strTarefas) {
        if (filtro) {
            let aux = JSON.parse(strTarefas), j = 0;
            /*if (objDadosTarefas.length != undefined) {
                for (let i = 0; i < objDadosTarefas.length; i++) {
                    if (objDadosTarefas[i].idUsuario === idUsuarioAtual) {
                        indiceDbTarefas = i;
                        break;
                    }
                        
                }
            } else {
                indiceDbTarefas = 1;
                objDadosTarefas = new Array(objDadosTarefas);
                objDadosTarefas.push({
                    idUsuario: idUsuarioAtual,
                    tarefas: []
                });
            }*/
            for (let i = 0; i < aux.tarefas.length; i++) {
                if (aux.tarefas[i].idUsuario === idUsuarioAtual) {
                    objDadosTarefas.tarefas[j] = aux.tarefas[i];
                    j++;
                }
            }
        } else objDadosTarefas = JSON.parse(strTarefas);
    }
    // Algoritimo para ordenar as tarefas por data e hora crescente
    let dataOrdenada = [], aux;
    // loop para criar um array com todas as datas e horas de cada tarefa 
    // porem retirando caracteres que nao sao numeros da string
    for (let i = 0; i < objDadosTarefas.tarefas.length; i++) {
        dataOrdenada[i] = '';
        dataOrdenada[i] += objDadosTarefas.tarefas[i].data.substr(0, 4);
        dataOrdenada[i] += objDadosTarefas.tarefas[i].data.substr(5, 2);
        dataOrdenada[i] += objDadosTarefas.tarefas[i].data.substr(8, 2);
        dataOrdenada[i] += objDadosTarefas.tarefas[i].data.substr(11, 2);
        dataOrdenada[i] += objDadosTarefas.tarefas[i].data.substr(14, 2);
    }
    dataOrdenada.sort((a, b) => { // coloca o array em ordem decrescente
        return a - b;
    });
    // reaplica os caracteres previamente retirados para depois compara-los com as datas e horas de cada tarefa
    for (let i = 0; i < dataOrdenada.length; i++) {
        dataOrdenada[i] = dataOrdenada[i].substr(0, 4) + '-' + dataOrdenada[i].substr(4, 2) + '-'
        + dataOrdenada[i].substr(6, 2) + 'T' + dataOrdenada[i].substr(8, 2) + ':' + dataOrdenada[i].substr(10, 2);
    }
    // compara o array com datas e horas ordenados com o array das tarefas para entao ordena-las
    for (let i = 0; i < dataOrdenada.length; i++) {
        for (let j = 0; j < objDadosTarefas.tarefas.length; j++) {
            if (dataOrdenada[i] === objDadosTarefas.tarefas[j].data) {
                aux = objDadosTarefas.tarefas[i];
                objDadosTarefas.tarefas[i] = objDadosTarefas.tarefas[j];
                objDadosTarefas.tarefas[j] = aux;
            }
        }
    }
        
    return objDadosTarefas;
}