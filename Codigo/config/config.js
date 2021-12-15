var qtdClicksTrocaMes = 0, addAno = 1, idUsuarioAtual = window.location.hash.split('#')[1];

if (localStorage.getItem('db_usuarios') === null || idUsuarioAtual === undefined) {
    window.location.replace('../login/login.html');
}

window.onload = () => {
    carregaUsuario();
    carregaConfig();
    toggleAside();
    carregaAlarme();
    if (window.screen.width <= 920 || document.body.clientWidth <= 920) {
        asideBody.classList.add('hide');
    }
}

function carregaConfig() {
    let usuarioAtual = JSON.parse(localStorage.getItem('db_usuarios'));
    usuarioAtual = usuarioAtual.usuarios.find(obj => obj.id === idUsuarioAtual);
    let cfgLogin = document.getElementById('cfgLogin');
    let cfgNome = document.getElementById('cfgNome');
    let cfgEmail = document.getElementById('cfgEmail');
    let cfgToque = document.getElementById('cfgToque');
    let cfgVolume = document.getElementById('cfgVolume');
    let cfgLoop = document.getElementById('cfgLoop');
    let cfgImg = document.getElementById('cfgImg');
    let imgInput = document.querySelector('#imgInput');
    let btnTesteAlarmePlay = document.getElementById('btnTesteAlarmePlay');
    let btnTesteAlarmePause = document.getElementById('btnTesteAlarmePause');
    let btnSalvarConfig = document.getElementById('btnSalvarConfig');
    let novaImgSrc = '';
    let objDadosConfig = leDadosConfigAtual();
    cfgLogin.value = usuarioAtual.login;
    cfgEmail.value = usuarioAtual.email;
    cfgNome.value = usuarioAtual.nome;
    if (objDadosConfig.imgPerfil) cfgImg.src = objDadosConfig.imgPerfil;
    if (objDadosConfig.toqueAlarme.nome) cfgToque.value = objDadosConfig.toqueAlarme.nome;
    if (objDadosConfig.toqueAlarme.volume || objDadosConfig.toqueAlarme.volume === 0) {
        cfgVolume.value = (objDadosConfig.toqueAlarme.volume * 100);
        cfgVolume.previousElementSibling.value = parseInt(objDadosConfig.toqueAlarme.volume * 100);
    }
    if (objDadosConfig.toqueAlarme.checked || !objDadosConfig.toqueAlarme.checked) cfgLoop.checked = objDadosConfig.toqueAlarme.loop;
    
    let infoUsuarioAlterada = false;
    let configsUsuario = [cfgNovaSenha, cfgLogin, cfgNome, cfgEmail, imgInput];
    configsUsuario.forEach(obj => obj.addEventListener('change', () => {
        infoUsuarioAlterada = true;
    }));
    // async function to get dataURL
    imgInput.addEventListener('change', async function() {
        if (imgInput.files[0].type.substr(0, 5) != 'image') { 
            document.getElementById('cfgAviso1').innerText = '* Arquivo enviado não é uma imagem'; 
            document.getElementById('cfgAviso1').style.marginTop = '20px';
            document.getElementById('cfgAviso1').style.border = '1px solid #adb5bd;'
            document.getElementById('cfgAviso1').style.transition = 'opacity 3s ease-in';
            document.getElementById('cfgAviso1').style.opacity = 0;
            imgInput.value = '';
            setTimeout(() => {
            document.getElementById('cfgAviso1').innerText = '';
            document.getElementById('cfgAviso1').style.marginTop = '0';
            document.getElementById('cfgAviso1').style.opacity = 1;
            document.getElementById('cfgAviso1').style.transition = 'none';
            }, 3000);
            return;
        }
        let dataUrl = await new Promise(resolve => {
            let lerArquivo = new FileReader();
            lerArquivo.onload = () => resolve(lerArquivo.result);
            lerArquivo.readAsDataURL(imgInput.files[0]);
        });
        novaImgSrc = dataUrl;
    });
    btnTesteAlarmePlay.addEventListener('click', testeSomAlarmePlay);
    btnTesteAlarmePause.addEventListener('click', testeSomAlarmePause);
    btnSalvarConfig.addEventListener('click', () => {salvaConfig(novaImgSrc, infoUsuarioAlterada)});
    document.getElementById('btnResetConfig').addEventListener('click', carregaConfig);
}

function testeSomAlarmePlay() {
    let cfgToque = document.getElementById('cfgToque');
    let cfgVolume = document.getElementById('cfgVolume');
    let cfgLoop = document.getElementById('cfgLoop');
    let alarmeTeste = document.getElementById('alarmeTeste');
    alarmeTeste.muted = false;
    alarmeTeste.src = '../resources/' + cfgToque.value + '.mp3';
    alarmeTeste.volume = (cfgVolume.value / 100);
    alarmeTeste.loop = cfgLoop.checked;
    alarmeTeste.paused ? alarmeTeste.play() : alarmeTeste.pause();
}

function testeSomAlarmePause() {
    let alarmeTeste = document.getElementById('alarmeTeste');
    alarmeTeste.muted = true;
}

function salvaConfig(novaImgSrc, infoUsuarioAlterada) {
    let objDadosConfig = leDadosConfigAtual();
    let usuarioAtual = JSON.parse(localStorage.getItem('db_usuarios'));
    usuarioAtual = usuarioAtual.usuarios.find(obj => obj.id === idUsuarioAtual);
    let objDadosUsuario = JSON.parse(localStorage.getItem('db_usuarios'))
    objDadosUsuario = objDadosUsuario.usuarios.filter(obj => obj.id != idUsuarioAtual);
    let cfgSenha = document.getElementById('cfgSenha');
    let cfgLogin = document.getElementById('cfgLogin');
    let cfgNome = document.getElementById('cfgNome');
    let cfgEmail = document.getElementById('cfgEmail');
    let cfgToque = document.getElementById('cfgToque');
    let cfgVolume = document.getElementById('cfgVolume');
    let cfgLoop = document.getElementById('cfgLoop');
    let imgInput = document.querySelector('#imgInput');
    let cfgNovaSenha = document.getElementById('cfgNovaSenha');
    if (cfgSenha.value != usuarioAtual.senha && infoUsuarioAlterada) {
        document.getElementById('cfgAviso2').innerText = '* Senha Incorreta'; 
        document.getElementById('cfgAviso2').style.marginTop = '20px';
        document.getElementById('cfgAviso2').style.border = '1px solid #adb5bd;'
        document.getElementById('cfgAviso2').style.transition = 'opacity 3s ease-in';
        document.getElementById('cfgAviso2').style.opacity = 0;
        setTimeout(() => {
            document.getElementById('cfgAviso2').innerText = '';
            document.getElementById('cfgAviso2').style.marginTop = '0';
            document.getElementById('cfgAviso2').style.opacity = 1;
            document.getElementById('cfgAviso2').style.transition = 'none';
        }, 3000);
        cfgSenha.value = '';
        return;
    }
    cfgSenha.value = '';
    const validaEmail = (email) => {
        return String(email)
          .toLowerCase()
          .match(
            /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/
        );
    };
    if (cfgLogin.value) {
        if (!validaEmail(cfgEmail.value)) {
            document.getElementById('cfgAviso2').innerText = '* Email Inválido'; 
            document.getElementById('cfgAviso2').style.marginTop = '20px';
            document.getElementById('cfgAviso2').style.border = '1px solid #adb5bd;'
            document.getElementById('cfgAviso2').style.transition = 'opacity 3s ease-in';
            document.getElementById('cfgAviso2').style.opacity = 0;
            setTimeout(() => {
                document.getElementById('cfgAviso2').innerText = '';
                document.getElementById('cfgAviso2').style.marginTop = '0';
                document.getElementById('cfgAviso2').style.opacity = 1;
                document.getElementById('cfgAviso2').style.transition = 'none';
            }, 3000);
            return;
        }
        usuarioAtual.email = cfgEmail.value;
    }
    if (cfgLogin.value) {
        if (objDadosUsuario.find(obj => obj.login === cfgLogin.value)) {
            document.getElementById('cfgAviso2').innerText = '* Login Indisponível'; 
            document.getElementById('cfgAviso2').style.marginTop = '20px';
            document.getElementById('cfgAviso2').style.border = '1px solid #adb5bd;'
            document.getElementById('cfgAviso2').style.transition = 'opacity 3s ease-in';
            document.getElementById('cfgAviso2').style.opacity = 0;
            setTimeout(() => {
                document.getElementById('cfgAviso2').innerText = '';
                document.getElementById('cfgAviso2').style.marginTop = '0';
                document.getElementById('cfgAviso2').style.opacity = 1;
                document.getElementById('cfgAviso2').style.transition = 'none';
            }, 3000);
            return;
        }
        usuarioAtual.login = cfgLogin.value;
    }
    if (cfgNovaSenha.value) usuarioAtual.senha = cfgNovaSenha.value;
    cfgNovaSenha.value = '';
    if (cfgNome.value) usuarioAtual.nome = cfgNome.value;
    if (novaImgSrc) objDadosConfig.imgPerfil = novaImgSrc;
    imgInput.value = '';
    objDadosConfig.toqueAlarme.nome = cfgToque.value;
    objDadosConfig.toqueAlarme.volume = (cfgVolume.value / 100);
    objDadosConfig.toqueAlarme.loop = cfgLoop.checked;

    let dbUsuarios = JSON.parse(localStorage.getItem('db_usuarios'));
    objDadosUsuario.push(usuarioAtual);
    dbUsuarios.usuarios = objDadosUsuario;
    salvarDados(dbUsuarios, 'db_usuarios');
    if (localStorage.getItem('dbConfig')) {
        let dbConfig = JSON.parse(localStorage.getItem('dbConfig'));
        dbConfig = dbConfig.filter(obj => obj.idUsuario != idUsuarioAtual);
        dbConfig.push(objDadosConfig);
        salvarDados(dbConfig, 'dbConfigs');
    } else {
        let dbConfig = [
                objDadosConfig
        ];
        salvarDados(dbConfig, 'dbConfigs');
    }
    carregaConfig();
    carregaUsuario();
    carregaAlarme();
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