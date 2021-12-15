var idUsuarioAtual = window.location.hash.split('#')[1];
const msDia = 86400000;

if (localStorage.getItem('db_usuarios') === null || idUsuarioAtual === undefined) {
    window.location.replace('../login/login.html');
}

window.onload = () => {
    carregaUsuario();
    toggleAside();
    carregaAlarme();
    carregaDadosSem();
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

/*function carregaGraficoAtual() {
    switch(graficoAtual) {
        case 1:
            carregaDadosSem();
            break;
        case 2:
            carregaDadosMes();
            break;
        case 3:
            carregaDadosAno();
            break;
        default:
            carregaDadosSem();
    }
}*/

let qtdConcluidoSem = [], qtdNaoConcluidoSem = [], qtdAConcluirSem = [];

function carregaDadosSem() {
    let objTarefasUsuario = lerTarefas(true);
    if (objTarefasUsuario.tarefas === null) {
        return;
    }
    document.getElementById('nomeGrafico').innerText = 'Gráfico Semanal';
    document.getElementById('graficoContainer').innerHTML = `<canvas id="canvas"></canvas>`;

    let tarefasConcluidas = objTarefasUsuario.tarefas.filter(obj => obj.check === true);
    let tarefasNaoConcluidas = objTarefasUsuario.tarefas.filter(obj => obj.check != true && (new Date() > new Date(obj.data)));
    let tarefasAConcluir = objTarefasUsuario.tarefas.filter(obj => obj.check != true && (new Date() < new Date(obj.data)));
    for (let i = 0; i < 7; i++) {
        qtdConcluidoSem[i] = tarefasConcluidas.filter(obj => new Date(obj.data).getDate() === ((new Date().getDate() - new Date().getDay()) + i)).length;
        qtdNaoConcluidoSem[i] = tarefasNaoConcluidas.filter(obj => new Date(obj.data).getDate() === ((new Date().getDate() - new Date().getDay()) + i)).length;
        qtdAConcluirSem[i] = tarefasAConcluir.filter(obj => new Date(obj.data).getDate() === ((new Date().getDate() - new Date().getDay()) + i)).length;
    }

    imprimeGraficoSem();
}

function imprimeGraficoSem() {
    let canvas = document.getElementById('canvas');

    let configGraficoSem = {
        type: 'bar',
        data: {
            labels: [
                'Domingo',
                'Segunda',
                'Terça',
                'Quarta',
                'Quinta',
                'Sexta',
                'Sábado'
            ],
            datasets: [
                {
                    label: 'Tarefas concluídas',
                    data: qtdConcluidoSem,
                    backgroundColor: [ '#4146A6', '#4146A6', '#4146A6', '#4146A6', '#4146A6', '#4146A6', '#4146A6'],
                    borderRadius: 10
                },
                {
                    label: 'Tarefas a concluir',
                    data: qtdAConcluirSem,
                    backgroundColor: [ '#f0da5e', '#f0da5e', '#f0da5e', '#f0da5e', '#f0da5e', '#f0da5e', '#f0da5e'],
                    borderRadius: 10
                },
                {
                    label: 'Tarefas não concluídas',
                    data: qtdNaoConcluidoSem,
                    backgroundColor: [ '#fd0532', '#fd0532', '#fd0532', '#fd0532', '#fd0532', '#fd0532', '#fd0532'],
                    borderRadius: 10
                }
            ]
        },
        options: {
            scales: {
                y: {
                    beginAtZero: true,
                    grace: '1%',
                    ticks: {
                        stepSize: 1
                    }
                }
            }
        }
    };

    let graficoSem = new Chart(canvas, configGraficoSem);

    document.getElementById('btnGraficoSem').addEventListener('click', () => {
        let aux = document.getElementsByClassName('btn-ativo');
        aux[0].classList.remove('btn-ativo');
        document.getElementById('btnGraficoSem').classList.add('btn-ativo');
        graficoSem.destroy();
        carregaDadosSem();
    });
    document.getElementById('btnGraficoMes').addEventListener('click', () => {
        let aux = document.getElementsByClassName('btn-ativo');
        aux[0].classList.remove('btn-ativo');
        document.getElementById('btnGraficoMes').classList.add('btn-ativo');
        graficoSem.destroy();
        carregaDadosMes();
    });
    document.getElementById('btnGraficoAno').addEventListener('click', () => {
        let aux = document.getElementsByClassName('btn-ativo');
        aux[0].classList.remove('btn-ativo');
        document.getElementById('btnGraficoAno').classList.add('btn-ativo');
        graficoSem.destroy();
        carregaDadosAno();
    });
}

let qtdConcluidoMes = [], qtdNaoConcluidoMes = [], qtdAConcluirMes = [];

function carregaDadosMes() {
    let objTarefasUsuario = lerTarefas(true);
    if (objTarefasUsuario.tarefas === null) {
        return;
    }
    document.getElementById('nomeGrafico').innerText = 'Gráfico Mensal';
    document.getElementById('graficoContainer').innerHTML = `<canvas id="canvas"></canvas>`;

    let tarefasConcluidas = objTarefasUsuario.tarefas.filter(obj => obj.check === true);
    let tarefasNaoConcluidas = objTarefasUsuario.tarefas.filter(obj => obj.check != true && (new Date() > new Date(obj.data)));
    let tarefasAConcluir = objTarefasUsuario.tarefas.filter(obj => obj.check != true && (new Date() < new Date(obj.data)));
    
    for (let i = 0, j = 0; i < 5; i++, j += 7) {
        if (j > new Date(new Date().getFullYear(), new Date().getMonth() + 1, 0).getDate()) 
            j = new Date(new Date().getFullYear(), new Date().getMonth() + 1, 0).getDate();
        qtdConcluidoMes[i] = tarefasConcluidas.filter(function (obj) {
            if (new Date(obj.data).getMonth() === new Date().getMonth())
                if (new Date(obj.data).getDate() >= 1 + j)
                    if (new Date(obj.data).getDate() <= 7 + j) return obj;
        }).length;
        qtdAConcluirMes[i] = tarefasAConcluir.filter(function (obj) {
            if (new Date(obj.data).getMonth() === new Date().getMonth())
                if (new Date(obj.data).getDate() >= 1 + j)
                    if (new Date(obj.data).getDate() <= 7 + j) return obj;
        }).length;
        qtdNaoConcluidoMes[i] = tarefasNaoConcluidas.filter(function (obj) {
            if (new Date(obj.data).getMonth() === new Date().getMonth())
                if (new Date(obj.data).getDate() >= 1 + j)
                    if (new Date(obj.data).getDate() <= 7 + j) return obj;
        }).length;
    }
    imprimeGraficoMes();
}

function imprimeGraficoMes() {

    let canvas = document.getElementById('canvas');

    let configGraficoMes = {
        type: 'bar',
        data: {
            labels: [
                '1 - 7',
                '8 - 14',
                '15 - 21',
                '22 - 28',
                '29 - 31'
            ],
            datasets: [
                {
                    label: 'Tarefas concluídas',
                    data: qtdConcluidoMes,
                    backgroundColor: [ '#4146A6', '#4146A6', '#4146A6', '#4146A6', '#4146A6'],
                    borderRadius: 16
                },
                {
                    label: 'Tarefas a concluir',
                    data: qtdAConcluirMes,
                    backgroundColor: [ '#f0da5e', '#f0da5e', '#f0da5e', '#f0da5e', '#f0da5e'],
                    borderRadius: 16
                },
                {
                    label: 'Tarefas não concluídas',
                    data: qtdNaoConcluidoMes,
                    backgroundColor: [ '#fd0532', '#fd0532', '#fd0532', '#fd0532', '#fd0532'],
                    borderRadius: 16
                }
            ]
        },
        options: {
            scales: {
                y: {
                    beginAtZero: true,
                    grace: '1%',
                    ticks: {
                        stepSize: 1
                    }
                }
            }
        }
    };

    let graficoMes = new Chart(canvas, configGraficoMes);

    document.getElementById('btnGraficoSem').addEventListener('click', () => {
        let aux = document.getElementsByClassName('btn-ativo');
        aux[0].classList.remove('btn-ativo');
        document.getElementById('btnGraficoSem').classList.add('btn-ativo');
        graficoMes.destroy();
        carregaDadosSem();
    });
    document.getElementById('btnGraficoMes').addEventListener('click', () => {
        let aux = document.getElementsByClassName('btn-ativo');
        aux[0].classList.remove('btn-ativo');
        document.getElementById('btnGraficoMes').classList.add('btn-ativo');
        graficoMes.destroy();
        carregaDadosMes();
    });
    document.getElementById('btnGraficoAno').addEventListener('click', () => {
        let aux = document.getElementsByClassName('btn-ativo');
        aux[0].classList.remove('btn-ativo');
        document.getElementById('btnGraficoAno').classList.add('btn-ativo');
        graficoMes.destroy();
        carregaDadosAno();
    });
}

let qtdConcluidoAno = [], qtdNaoConcluidoAno = [], qtdAConcluirAno = [];

function carregaDadosAno() {
    let objTarefasUsuario = lerTarefas(true);
    if (objTarefasUsuario.tarefas === null) {
        return;
    }
    document.getElementById('nomeGrafico').innerText = 'Gráfico Anual';
    document.getElementById('graficoContainer').innerHTML = `<canvas id="canvas"></canvas>`;

    let tarefasConcluidas = objTarefasUsuario.tarefas.filter(obj => obj.check === true);
    let tarefasNaoConcluidas = objTarefasUsuario.tarefas.filter(obj => obj.check != true && (new Date() > new Date(obj.data)));
    let tarefasAConcluir = objTarefasUsuario.tarefas.filter(obj => obj.check != true && (new Date() < new Date(obj.data)));
    
    for (let i = 0; i < 12; i++) {
        /*if (j > new Date(new Date().getFullYear(), new Date().getMonth() + 1, 0).getDate()) 
            j = new Date(new Date().getFullYear(), new Date().getMonth() + 1, 0).getDate();*/
        qtdConcluidoAno[i] = tarefasConcluidas.filter(function (obj) {
            if (new Date(obj.data).getFullYear() === new Date().getFullYear())
                if (new Date(obj.data).getMonth() === i) return obj;
        }).length;
        qtdAConcluirAno[i] = tarefasAConcluir.filter(function (obj) {
            if (new Date(obj.data).getFullYear() === new Date().getFullYear())
                if (new Date(obj.data).getMonth() === i) return obj;
        }).length;
        qtdNaoConcluidoAno[i] = tarefasNaoConcluidas.filter(function (obj) {
            if (new Date(obj.data).getFullYear() === new Date().getFullYear())
                if (new Date(obj.data).getMonth() === i) return obj;
        }).length;
    }
    imprimeGraficoAno();
}

function imprimeGraficoAno() {

    let canvas = document.getElementById('canvas');

    let configGraficoMes = {
        type: 'bar',
        data: {
            labels: [
                'Jan',
                'Fev',
                'Mar',
                'Abr',
                'Mai',
                'Jun',
                'Jul',
                'Ago',
                'Set',
                'Out',
                'Nov',
                'Dez'
            ],
            datasets: [
                {
                    label: 'Tarefas concluídas',
                    data: qtdConcluidoAno,
                    backgroundColor: [ '#4146A6', '#4146A6', '#4146A6', '#4146A6', '#4146A6', '#4146A6', '#4146A6', '#4146A6', '#4146A6', '#4146A6', '#4146A6'],
                    borderRadius: 10
                },
                {
                    label: 'Tarefas a concluir',
                    data: qtdAConcluirAno,
                    backgroundColor: [ '#f0da5e', '#f0da5e', '#f0da5e', '#f0da5e', '#f0da5e', '#f0da5e', '#f0da5e', '#f0da5e', '#f0da5e', '#f0da5e', '#f0da5e', '#f0da5e'],
                    borderRadius: 10
                },
                {
                    label: 'Tarefas não concluídas',
                    data: qtdNaoConcluidoAno,
                    backgroundColor: [ '#fd0532', '#fd0532', '#fd0532', '#fd0532', '#fd0532', '#fd0532', '#fd0532', '#fd0532', '#fd0532', '#fd0532', '#fd0532', '#fd0532'],
                    borderRadius: 10
                }
            ]
        },
        options: {
            scales: {
                y: {
                    beginAtZero: true,
                    grace: '1%',
                    ticks: {
                        stepSize: 1
                    }
                }
            }
        }
    };

    let graficoAno = new Chart(canvas, configGraficoMes);

    document.getElementById('btnGraficoSem').addEventListener('click', () => {
        let aux = document.getElementsByClassName('btn-ativo');
        aux[0].classList.remove('btn-ativo');
        document.getElementById('btnGraficoSem').classList.add('btn-ativo');
        graficoAno.destroy();
        carregaDadosSem();
    });
    document.getElementById('btnGraficoMes').addEventListener('click', () => {
        let aux = document.getElementsByClassName('btn-ativo');
        aux[0].classList.remove('btn-ativo');
        document.getElementById('btnGraficoMes').classList.add('btn-ativo');
        graficoAno.destroy();
        carregaDadosMes();
    });
    document.getElementById('btnGraficoAno').addEventListener('click', () => {
        let aux = document.getElementsByClassName('btn-ativo');
        aux[0].classList.remove('btn-ativo');
        document.getElementById('btnGraficoAno').classList.add('btn-ativo');
        graficoAno.destroy();
        carregaDadosAno();
    });
}