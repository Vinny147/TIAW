var indiceDbUsuarios, indiceDbTarefas = 0, indiceDbNotas = 0, tempoMin = calculaTempoMin(), qtdClicksTrocaMes = 0, addAno = 1,
    idUsuarioAtual = window.location.hash.split('#')[1];

const objUsuario = function() {
    let dbUsuarios = JSON.parse(localStorage.getItem('db_usuarios'));
    let usuario = dbUsuarios.usuarios.find(obj => obj.id === idUsuarioAtual);
    return usuario;
}

if (localStorage.lengh && localStorage.getItem('db_usuarios') === null) {
    window.location.replace('../login/login.html');
} else if (!objUsuario()) window.location.replace('../login/login.html');

$.when( // função para carregar demais scripts
    $.getScript('../aside/aside.js'),
    $.getScript('./scripts/tasks.js'),
    $.getScript('./scripts/habitos.js'),
    $.Deferred(function( deferred ){
        $( deferred.resolve );
    })
).done(function(){   
    window.onload = () => {
        //carregaMainContent();
        carregaUsuario();
        lerTarefas();
        salvarDados(lerTarefas(), 'dbTarefas');
        salvarTarefas();
        imprimirTarefas();
        eventListenerList();
        filtraTarefasPorDiaSemana();
        atualizaBarraSemana();
        carregaAlarme();
        adiciona_info_barra_habito();
        inicia_barra_habito_circulos();
        setInterval(atualizaBarraSemana, tempoMin);
        toggleAside();
        if (window.screen.width <= 920 || document.body.clientWidth <= 920) {
            asideBody.classList.add('hide');
        }
    }
});

/*function checkPage() {
    
    switch(window.location.pathname) {
        case '/dashboard/dashboard.html':
            document.getElementById('btnDashboard').classList.add('pagina_ativa');
            break;
    }
}*/

/*setInterval(() => {
    tempoAtual = geraTempo();
}, 1000);*/

/*function toggleDropdownMenu() {
    
}
let menuDd = document.getElementById('menuToggle');
window.addEventListener('resize', () => {
    if (window.innerWidth <= 920 && !objMenu.classList.contains('hide')) {
        objMenu.classList.add('hide');
    }
});

menuDd.addEventListener('click', toggleDropdownMenu);
*/

function formatTime(time) {
    if (time < 10) {
        return '0' + time;
    }
    return time;
}

function geraTempo() {
    let tempoAtual = new Date();
    let objTempoAtual = {
        "ano": tempoAtual.getFullYear(),
        "mes": formatTime((tempoAtual.getMonth() + 1)),
        "diaMes": formatTime(tempoAtual.getDate()),
        "diaSemana": tempoAtual.getDay(),
        "hora": formatTime(tempoAtual.getHours()),
        "minuto": formatTime(tempoAtual.getMinutes()),
        "segundo": formatTime(tempoAtual.getSeconds()),
        "milisegundo":tempoAtual.getMilliseconds()
    };
    return objTempoAtual;
}

function numMesParaNome(numMes) {
    let mesNome;
    if (numMes > 12) numMes %= 12;
    switch (numMes) { // switch case para passar o valor do mes para texto
        case 1:
            mesNome = 'Janeiro';
            break;
        case 2:
            mesNome = 'Fevereiro';
            break;
        case 3:
            mesNome = 'Março';
            break;
        case 4:
            mesNome = 'Abril';
            break;
        case 5:
            mesNome = 'Maio';
            break;
        case 6:
            mesNome = 'Junho';
            break;
        case 7:
            mesNome = 'Julho';
            break;
        case 8:
            mesNome = 'Agosto';
            break;
        case 9:
            mesNome = 'Setembro';
            break;
        case 10:
            mesNome = 'Outubro';
            break;
        case 11:
            mesNome = 'Novembro';
            break;
        case 12:
            mesNome = 'Dezembro';
            break;
        default:
            mesNome = '';
    }
    return mesNome;
}

function calculaTempoMin() {
    let data = geraTempo();
    // retorna a quantidade de milisegundos nescessarios para o proximo dia
    let = amanha = new Date(data.ano, data.mes, (data.diaMes + 1)).getTime();
    return amanha - (new Date().getTime());
}

function atualizaBarraSemana() {
    let data = geraTempo();
    document.getElementById('intervaloSemana').innerText = 
    (data.diaMes - data.diaSemana) + ' - ' + formatTime(parseInt(data.diaMes) + (6 - data.diaSemana)) + ' ' + numMesParaNome(data.mes).substr(0, 3);
}

let listaDiasSemana = document.getElementById('listaDiasSemana');

function filtraTarefasPorDiaSemana() {
    let data = geraTempo();
    let containerTarefas = document.getElementById('containerTarefas');
    for (let i = 0; i < listaDiasSemana.children.length; i++) {
        listaDiasSemana.children[i].addEventListener('click', () => {
            for (let j = 0; j < containerTarefas.children.length; j++) {
                if (containerTarefas.children[j].id === (data.ano + '-' + data.mes + '-' + formatTime((data.diaMes - data.diaSemana) + i))) {
                    containerTarefas.children[j].scrollIntoView();
                }
            }
            for (let k = 0; k < listaDiasSemana.children.length; k++)
                listaDiasSemana.children[k].classList.remove('dia_atual');
            listaDiasSemana.children[i].classList.add('dia_atual');
        });
    }
    for (let i = 0; i < listaDiasSemana.children.length; i++) {
        if (listaDiasSemana.children[i].classList.contains('dia_atual'))
        return;
    }
    listaDiasSemana.children[data.diaSemana].classList.add('dia_atual');
    for (let i = 0; i < containerTarefas.children.length; i++) {
        if (containerTarefas.children[i].id === (data.ano + '-' + data.mes + '-' + data.diaMes)) {
            containerTarefas.children[i].scrollIntoView();
        }
    }
}
