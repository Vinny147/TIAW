
// ESTA BUGADO

let bellOn = document.getElementsByClassName('toggleBellOff'),
    bellOff = document.getElementsByClassName('toggleBellOn'),
    checkOn = document.getElementsByClassName('toggleCheckOff'),
    checkOff = document.getElementsByClassName('toggleCheckOn'),
    ddTarefasOn = document.getElementsByClassName('toggleDdTarefasOn'),
    ddTarefasOff = document.getElementsByClassName('toggleDdTarefasOff'),
    btnsEditarTarefa = document.getElementsByClassName('btnEditarTarefa'),
    btnsApagarTarefa = document.getElementsByClassName('btnApagarTarefa');

function eventListenerList() {
    loadEventListener(bellOn, toggleBell);
    loadEventListener(bellOff, toggleBell);
    loadEventListener(checkOn, toggleCheck);
    loadEventListener(checkOff, toggleCheck);
    loadEventListener(ddTarefasOn, toggleDdTarefasOn);
    loadEventListener(ddTarefasOff, toggleDdTarefasOff);
    loadEventListener(btnsEditarTarefa, editarTarefa);
    loadEventListener(btnsApagarTarefa, apagarTarefa);
    abrirModalTarefas();
    fecharModalTarefas();
}

function loadEventListener(el, func) {

    if (el.length != undefined) {
        for (let i = 0 ; i < el.length; i++) {
            el[i].addEventListener('click', func);
        }
    } else el.addEventListener('click', func);

}

function toggleDdTarefasOn() {
    let divFuncoes = this.closest('.funcoes');
    let ddTarefa = this.closest('.tarefa');
    let divDesc = ddTarefa.children[1];
    let check = `<i class="bi bi-square toggleCheckOn"></i>`;
    let sino = `<i class="bi bi-bell-slash toggleBellOn"></i>`;

    if (divFuncoes.children[0].classList.contains('toggleCheckOff')) 
        check = `<i class="bi bi-check2-square toggleCheckOff"></i>`;

    if (divFuncoes.children[1].classList.contains('toggleBellOff')) 
        sino = `<i class="bi bi-bell toggleBellOff"></i>`;

    divFuncoes.innerHTML = `<i class="bi bi-chevron-up toggleDdTarefasOff"></i>`+
    `${check + sino}`+`<i class="bi bi-pencil-square btnEditarTarefa"></i>
    <i class="bi bi-trash btnApagarTarefa"></i>`;

    divFuncoes.style.flexDirection = 'column';
    divFuncoes.style.width = '48px';
    divFuncoes.style.margin = '0';

    divDesc.style.width = '75%';

    ddTarefa.style.justifyContent = 'spaceBetween';
    ddTarefa.style.paddingRight = '30px';

    ddTarefa.children[1].style.height = 'auto';
    ddTarefa.children[1].children[0].style.whiteSpace = 'normal';
    ddTarefa.children[1].children[0].style.minHeight = 'fit-content';
    ddTarefa.children[1].children[1].style.whiteSpace = 'normal';
    ddTarefa.children[1].children[1].style.maxHeight = '80%';
    ddTarefa.children[1].children[0].style.marginBottom = '10px';
    ddTarefa.children[1].children[1].style.minHeight = 'fit-content';
    
    /*divDesc.classList.add('descricao-active');
    divFuncoes.classList.add('funcoes-active');
    ddTarefa.classList.add('tarefa-active');*/

    ddTarefa.classList.add('tarefa-active');
    //.style.maxHeight = 'auto';//`${ddTarefa.clientHeight * 3}px`;

    eventListenerList();
}

function toggleDdTarefasOff() {
    let divFuncoes = this.closest('.funcoes');
    let ddTarefa = this.closest('.tarefa');
    let divDesc = ddTarefa.children[1];
    let check = `<i class="bi bi-square toggleCheckOn"></i>`;
    let sino = `<i class="bi bi-bell-slash toggleBellOn"></i>`;

    if (divFuncoes.children[1].classList.contains('toggleCheckOff')) 
        check = `<i class="bi bi-check2-square toggleCheckOff"></i>`;

    if (divFuncoes.children[2].classList.contains('toggleBellOff')) 
        sino = `<i class="bi bi-bell toggleBellOff"></i>`;

    divFuncoes.innerHTML = `${check + sino} <i class="bi bi-chevron-down toggleDdTarefasOn"></i>`;

    divFuncoes.style.flexDirection = 'row';
    divFuncoes.style.width = '25%';
    divFuncoes.style.margin = '0 18px 0 0';

    divDesc.style.width = '55%';

    ddTarefa.style.justifyContent = '';
    ddTarefa.style.paddingRight = '0';
    
    /*divDesc.classList.remove('descricao-active');
    divFuncoes.classList.remove('funcoes-active');
    ddTarefa.classList.remove('tarefa-active');*/

    ddTarefa.children[1].style.height = '72px';
    ddTarefa.children[1].children[0].style.minHeight = '38px';
    ddTarefa.children[1].children[0].style.whiteSpace = 'nowrap'
    ddTarefa.children[1].children[0].style.marginBottom = '0';
    ddTarefa.children[1].children[1].style.whiteSpace = 'nowrap';
    ddTarefa.children[1].children[1].style.maxHeight = '65%';
    ddTarefa.children[1].children[1].style.minHeight = '30px';

    ddTarefa.classList.remove('tarefa-active');
    //ddTarefa.style.Height = `${ddTarefa.clientHeight / 3}px`;

    eventListenerList();
}

function toggleBell() {
    let classe = this.classList;
    let idTarefa;
    let bool;
    if (classe.contains('toggleBellOn')) {
        classe.remove('toggleBellOn');
        classe.remove('bi-bell-slash');
        classe.toggle('toggleBellOff');
        classe.toggle('bi-bell');
        bool = true;
    } else {
        classe.remove('toggleBellOff');
        classe.remove('bi-bell');
        classe.toggle('toggleBellOn');
        classe.toggle('bi-bell-slash');
        bool = false;
    }
    if (this.id != 'sinoModal') {
        idTarefa = this.closest('.tarefa').id;
        statusUpdate('bell', idTarefa, bool);
    }
    carregaAlarme();
}

function toggleCheck() {
    let classe = this.classList;
    let idTarefa = this.closest('.tarefa').id;
    if (classe.contains('toggleCheckOn')) {
        classe.remove('toggleCheckOn');
        classe.remove('bi-square');
        classe.toggle('toggleCheckOff');
        classe.toggle('bi-check2-square');
        statusUpdate('check', idTarefa, true);
    } else {
        classe.remove('toggleCheckOff');
        classe.remove('bi-check2-square');
        classe.toggle('toggleCheckOn');
        classe.toggle('bi-square');
        statusUpdate('check', idTarefa, false);
    }
    carregaAlarme();
}

function fecharModalTarefas() {
    let modalContainer = document.getElementById('modal-container');
    let modal = document.querySelector('.adc-tarefas');
    let xModal = document.getElementById('xModal');

    let nomeTarefa = document.getElementById('nomeTarefa');
    let dataTarefa = document.getElementById('dataTarefa');
    let descricaoTarefa = document.getElementById('descricaoTarefa');
    let aviso = document.getElementById('aviso');

    // fecha o modal ao clickar fora ps.: tirei pois estava atrapalhando ao editar uma tarefa 
    /*modalContainer.addEventListener('click', () => {
        modalContainer.style.opacity = 0;
        modalContainer.style.pointerEvents = 'none';
        nomeTarefa.value = '';
        dataTarefa.value = '';
        //horaTarefa.value = '';
        descricaoTarefa.value = '';
        aviso.innerText = '';
    });*/

    xModal.addEventListener('click', () => {
        modalContainer.style.opacity = 0;
        modalContainer.style.pointerEvents = 'none';
        nomeTarefa.value = '';
        dataTarefa.value = '';
        //horaTarefa.value = '';
        descricaoTarefa.value = '';
        aviso.innerText = '';
    });

    modal.addEventListener('click', (e) => {
        //e.preventDefault(); // bloqueia o date picker do navegador
        e.stopPropagation();
        e.stopImmediatePropagation();
        return;
    });
}

function abrirModalTarefas() {
    let modalContainer = document.getElementById('modal-container');
    let modalAdd = document.getElementsByClassName('modalAdc');
    for (let i = 0; i < modalAdd.length; i++) {
        modalAdd[i].addEventListener('click', () => {
            modalContainer.style.opacity = 1;
            modalContainer.style.pointerEvents = 'auto';
        });
    }
}

function salvarTarefas() {
    //console.log(objDadosTarefas);
    let nomeTarefa = document.getElementById('nomeTarefa');
    let dataTarefa = document.getElementById('dataTarefa');
    //let horaTarefa = document.getElementById('horaTarefa');
    let aviso = document.getElementById('aviso');
    let descricaoTarefa = document.getElementById('descricaoTarefa');

    let modalContainer = document.getElementById('modal-container');
    let botaoSalvarNovaTarefa = document.getElementById('salvarNovaTarefa');

    botaoSalvarNovaTarefa.addEventListener('click', () => {
        let objDadosTarefas = lerTarefas(true);
        if (nomeTarefa.value == '' || dataTarefa.value == '' /*|| horaTarefa.value == ''*/) {
            aviso.innerText = '* Preencha os campos obrigatórios';
            return;
        } else {
            for(let i = 0; i < objDadosTarefas.tarefas.length; i++) {
                if (dataTarefa.value == objDadosTarefas.tarefas[i].data) {
                    aviso.innerText = '* A data e hora selecionada já está em uso';
                    return;
                }
            }
        }
        let boolAlarme;

        if (document.getElementById('sinoModal').classList.contains('toggleBellOff'))
            boolAlarme = true;
        else
            boolAlarme = false;

        let novaTarefa = {
            idUsuario: idUsuarioAtual,
            nome: nomeTarefa.value,
            data: dataTarefa.value,
            alarme: boolAlarme,
            check : false,
            descricao: descricaoTarefa.value
        };

        let aux = lerTarefas();
        aux.tarefas.push(novaTarefa);
        // Salvar os dados no localStorage novamente
        salvarDados(aux, 'dbTarefas');

        modalContainer.style.opacity = 0;
        modalContainer.style.pointerEvents = 'none';
        nomeTarefa.value = '';
        dataTarefa.value = '';
        descricaoTarefa.value = '';
        aviso.innerText = '';
        
        imprimirTarefas();
    });
}

function editarTarefa() {
    let idData = this.closest('.tarefa').id;
    let objDadosTarefas = lerTarefas(true);
    let modalContainer = document.getElementById('modal-container');
    let tarefa;
    let index;
    for (let i = 0; i < objDadosTarefas.tarefas.length; i++) {
        if (objDadosTarefas.tarefas[i].data === idData) {
            tarefa = objDadosTarefas.tarefas[i];
            index = i;
            break;
        }
    }
    document.getElementById('tituloModal').innerHTML = 'Editar Tarefa';
    document.getElementById('divBtnModal').innerHTML = `<span id="aviso"></span>
    <button id="editarTarefa">Salvar</button>`;

    let nomeTarefa = document.getElementById('nomeTarefa');
    let dataTarefa = document.getElementById('dataTarefa');
    let sinoModal = document.getElementById('sinoModal');
    let descricaoTarefa = document.getElementById('descricaoTarefa');
    let aviso = document.getElementById('aviso');

    if (tarefa.alarme) {
        sinoModal.classList.remove('bi-bell-slash');
        sinoModal.classList.remove('toggleBellOn');
        sinoModal.classList.add('bi-bell');
        sinoModal.classList.add('toggleBellOff');
    } else {
        sinoModal.classList.add('bi-bell-slash');
        sinoModal.classList.add('toggleBellOn');
        sinoModal.classList.remove('bi-bell');
        sinoModal.classList.remove('toggleBellOff');
    }

    nomeTarefa.value = tarefa.nome;
    dataTarefa.value = tarefa.data;
    descricaoTarefa.value = tarefa.descricao;

    modalContainer.style.opacity = 1;
    modalContainer.style.pointerEvents = 'auto';

    eventListenerList();

    document.getElementById('editarTarefa').addEventListener('click', () => {
        // realize a validação dos valores inseridos 
        if (nomeTarefa.value == '' || dataTarefa.value == '' /*|| horaTarefa.value == ''*/) {
            aviso.innerText = '* Preencha os campos obrigatórios';
            return;
        } else {
            for(let i = 0; i < objDadosTarefas.tarefas.length; i++) {
                if (dataTarefa.value === objDadosTarefas.tarefas[i].data && dataTarefa.value != tarefa.data) {
                    aviso.innerText = '* A data e hora selecionada já está em uso';
                    return;
                }
            }
        }
    
        let boolAlarme;

        if (sinoModal.classList.contains('toggleBellOff'))
            boolAlarme = true;
        else
            boolAlarme = false;

        let tarefaAlterada = {
            idUsuario: idUsuarioAtual,
            nome: nomeTarefa.value,
            data: dataTarefa.value,
            alarme: boolAlarme,
            check: tarefa.check,
            descricao: descricaoTarefa.value
        };

        objDadosTarefas.tarefas[index] = tarefaAlterada;

        // Salvar os dados no localStorage novamente
        salvarDados(objDadosTarefas, 'dbTarefas');

        modalContainer.style.opacity = 0;
        modalContainer.style.pointerEvents = 'none';
        nomeTarefa.value = '';
        dataTarefa.value = '';
        descricaoTarefa.value = '';
        aviso.innerText = '';
        document.getElementById('tituloModal').innerHTML = 'Criar Tarefa';
        document.getElementById('divBtnModal').innerHTML = `<span id="aviso"></span>
        <button id="salvarNovaTarefa">Salvar</button>`;
        imprimirTarefas();
    });
}
    

function apagarTarefa() {
    let idData = this.closest('.tarefa').id;
    let objDadosTarefas = lerTarefas(true);
    for (let i = 0; i < objDadosTarefas.tarefas.length; i++) {
        if (objDadosTarefas.tarefas[i].data === idData) {
            objDadosTarefas.tarefas.splice(i, 1);
        }
    }
    salvarDados(objDadosTarefas, 'dbTarefas');

    imprimirTarefas();
}

function converteDatas() {
    let objDadosTarefas = lerTarefas(true); // coleta os dados das tarefas
    let nomeDia = [];
    let mesNome = [];
    let ano = [];
    let mes = [];
    let dia = [];
    for (let i = 0; i < objDadosTarefas.tarefas.length; i++) { // loop para coletar as informacoes da data e guardar em arrays do seu tipo
        if(!dia.includes(parseInt(objDadosTarefas.tarefas[i].data.substr(8, 2)))) { // verifica se o dia informado ainda nao foi coletado
            ano[i] = parseInt(objDadosTarefas.tarefas[i].data.substr(0, 4));
            mes[i] = parseInt(objDadosTarefas.tarefas[i].data.substr(5, 2));
            dia[i] = parseInt(objDadosTarefas.tarefas[i].data.substr(8, 2));
        } else continue;
        //let hora = obj.tarefa[index].data.substr(0, 4);
        mesNome[i] = numMesParaNome(mes[i]);
        nomeDia.push(dia[i] + ' de ' + mesNome[i] + ', ' + ano[i]);
    }
    return nomeDia;
}

function imprimirTarefas() {
    let objDadosTarefas = lerTarefas(true); // coleta os dados das tarefas do usuario
    let qtdTarefas = objDadosTarefas.tarefas.length;
    /*if (objDadosTarefas.tarefas.length === undefined) {
        qtdTarefas = 1;
    }
    console.log(qtdTarefas);*/
    let containerTarefas = document.getElementById('containerTarefas');
    if (qtdTarefas === 0 /*|| qtdTarefas == undefined*/) { // detecta se nao ha alguma tarefa no local storage sendo assim imprimindo um aviso
        containerTarefas.innerHTML = `  <div id="semTarefas">
                                            <i id="btnAdcTarefa" class="bi bi-plus-circle modalAdc"></i>
                                            <h2> Você ainda não possui nenhuma tarefa,<br>
                                            clique no botão para adicionar uma.</h2>
                                        </div>`;
        //document.getElementById('semTarefas').style.display = 'flex';
        eventListenerList();
        return;
    }
    let idData = [], idTarefa = [], horario = [], nome = [], desc = [], alarme = [], check = [], subLinha = [];
    for (let i = 0; i < qtdTarefas; i++) { // loop para colocar cada informacao da tarefa em um array do seu tipo
        idTarefa.push(objDadosTarefas.tarefas[i].data);
        horario.push(objDadosTarefas.tarefas[i].data.substr(11, 15));
        nome.push(objDadosTarefas.tarefas[i].nome);
        desc.push(objDadosTarefas.tarefas[i].descricao);
        alarme.push(objDadosTarefas.tarefas[i].alarme);
        check.push(objDadosTarefas.tarefas[i].check);
        if (!idData.includes(objDadosTarefas.tarefas[i].data.substr(0, 10))) { // verifica se o dia informado ainda nao foi coletado
            idData.push(objDadosTarefas.tarefas[i].data.substr(0, 10));
        }
    }
    let nomeDia = converteDatas(); // funcao que interpreta a data e a transforma em texto
    // popula o array das linhas que dividem as tarefas de um mesmo dia
    for (let i = 0; i < idTarefa.length - 1; i++) {
        subLinha[i] = `<span class="sub-linha"></span>`;
        // pega apenas a parte da string que determina o dia da tarefa e a compara com a proxima 
        // se a proxima tarefa for em outro dia a linha que divide tarefas nao sera aplicada
        if (idTarefa[i+1].substr(0,10) != idTarefa[i].substr(0,10)) {
            subLinha[i] = ``;
        }
    }
    subLinha[idTarefa.length - 1] = ``; // popula o ultimo item do array que deve ter tamanho igual a quantidade de tarefas
    containerTarefas.innerHTML = ''; // limpa o innerHTML pois para a impressao ele deve estar vazio
    for (let i = 0; i < nomeDia.length; i++) {
        containerTarefas.innerHTML += criaDia(idData[i], nomeDia[i]); // acrescenta o HTML dos dias  
    }
    let diaCorpo = document.getElementsByClassName('dia_corpo');
    for (let j = 0; j < qtdTarefas; j++) { // loop para interpretar os valores booleanos das tarefas
        check[j] = converteValorParaIcone('check', check[j]);
        alarme[j] = converteValorParaIcone('alarme', alarme[j]);
    }
    for (let i = 0; i < nomeDia.length; i++) { // loops para colocar cada tarefa no seu respectivo dia
            diaCorpo[i].innerHTML = '';
        for (let j = 0; j < qtdTarefas; j++) {
            if (objDadosTarefas.tarefas[j].data.substr(0, 10) === idData[i]) { // verifica se as data das tarefas sao iguais aos dos dias
                diaCorpo[i].innerHTML += criaTarefa(idTarefa[j], horario[j], nome[j], desc[j], check[j], alarme[j], subLinha[j]);
            }
        }
    }
    // recarrega os event listeners
    eventListenerList();
    carregaAlarme();
}

function converteValorParaIcone(tipo, bool) {
    let htmlIcone;
    switch (tipo) {
        case 'check':
            if (bool === true) {
                htmlIcone = `bi bi-check2-square toggleCheckOff`;
            } else {
                htmlIcone = `bi bi-square toggleCheckOn`;
            }
            break;
        case 'alarme':
            if (bool === true) {
                htmlIcone = `bi bi-bell toggleBellOff`;
            } else {
                htmlIcone = `bi bi-bell-slash toggleBellOn`;
            }
            break;
    }
    return htmlIcone;
}

function criaDia(data, nomeDia) {
    let novoDia = ` <div id="${data}" class="dia">
                        <div class="dia_cabecalho">
                            <h2>${nomeDia}</h2>
                            <div class="adc">
                                <a href="#">
                                    <i class="bi bi-plus-circle modalAdc"></i>
                                </a>
                            </div>
                        </div>
                        <span class="linha"></span>
                        <div class="dia_corpo">
                        </div>
                        <span class="linha"></span>
                    </div>
    `;
    return novoDia;
}

function criaTarefa(dataId, horario, nome, desc, checkbox, sino, subLinha) {
    let novaTarefa = `  <div id="${dataId}" class="tarefa">
                            <div class="horario">
                                <h3>${horario}</h3>
                            </div>
                            <div class="descricao">
                                <h2>${nome}</h2>
                                <h4>${desc}</h4>
                            </div>
                            <div class="funcoes">
                                <i class="${checkbox}"></i>
                                <i class="${sino}"></i>
                                <i class="bi bi-chevron-down toggleDdTarefasOn"></i>
                            </div>
                        </div>
                        ${subLinha}
    `;
    return novaTarefa;
}