function mostrarGrafico(valor) {
    const grafico1 = document.getElementsByClassName('grafico1')[0]
    const grafico2 = document.getElementsByClassName('grafico2')[0]
    const grafico3 = document.getElementsByClassName('grafico3')[0]
    const button = document.getElementsByClassName('button-grafico')
    switch (valor) {
        case 1: 
            grafico1.style.display = "flex";
            grafico2.style.display = "none";
            grafico3.style.display = "none";

            button[0].classList.add("button-grafico-selecionado")
            button[1].classList.remove("button-grafico-selecionado")
            button[2].classList.remove("button-grafico-selecionado")
            break;
        case 2:
            grafico1.style.display = "none";
            grafico2.style.display = "flex";
            grafico3.style.display = "none";

            button[0].classList.remove("button-grafico-selecionado")
            button[1].classList.add("button-grafico-selecionado")
            button[2].classList.remove("button-grafico-selecionado")
            break;
        case 3:
            grafico1.style.display = "none";
            grafico2.style.display = "none";
            grafico3.style.display = "flex";

            button[0].classList.remove("button-grafico-selecionado")
            button[1].classList.remove("button-grafico-selecionado")
            button[2].classList.add("button-grafico-selecionado")
            break;
    }
}