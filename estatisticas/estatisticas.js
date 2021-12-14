var qtdClicksTrocaMes = 0, addAno = 1, idUsuarioAtual = window.location.hash.split('#')[1];

if (localStorage.getItem('db_usuarios') === null || idUsuarioAtual === undefined) {
    window.location.replace('../login/login.html');
}

window.onload = () => {
    carregaUsuario();
    toggleAside();
    carregaAlarme();
    if (window.screen.width <= 920 || document.body.clientWidth <= 920) {
        asideBody.classList.add('hide');
    }
}

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