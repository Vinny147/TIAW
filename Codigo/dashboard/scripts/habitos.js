let barra_habitos = {
    
    habitos : [

        {
            "id" : "1",
            "desc" : "Ler",
            "check" : "false"
        },

        {
            "id" : "1",
            "desc" : "Água",
            "check" : "false" 
        },

        {
            "id" : "1",
            "desc" : "Estudar",
            "check" : "false"
        },

        {
            "id" : "1",
            "desc" : "Exercitar",
            "check" : "false"
        },

        {
            "id" : "1",
            "desc" : "Meditar",
            "check" : "false"
        },

    ]
    
};

function adiciona_info_barra_habito(){

    if(localStorage.getItem("DB_Habitos") == null){
        localStorage.setItem("DB_Habitos", JSON.stringify(barra_habitos));
    }

    for(let i = 0; i < barra_habitos.habitos.length ; i++){

        let id_inicial = "barra_habito_";
        let texto = (i+1).toString();
        let id_passar = id_inicial + texto;

        define_barra_habito(id_passar, i);

    }

}

function define_barra_habito(id,indice){

    let barra_habito_definir = document.getElementById(id);

    let bd_habitos = localStorage.getItem("DB_Habitos");

    let json_bd = JSON.parse(bd_habitos);

    let desc_add = json_bd.habitos[indice].desc;

    barra_habito_definir.innerHTML = desc_add;

}

function atualiza_circulo_barra_habito(id, indice){

    let circulo_barra_habito = document.getElementById(id);
    
    let bd_habitos = localStorage.getItem("DB_Habitos");
    let json_bd = JSON.parse(bd_habitos);
    
    if(circulo_barra_habito.style.display == 'none'){
        circulo_barra_habito.style.display = 'block';
        
        json_bd.habitos[indice].check = "true";

    }else{
        circulo_barra_habito.style.display = 'none';
        json_bd.habitos[indice].check = "false";
    }

    localStorage.setItem("DB_Habitos", JSON.stringify(json_bd));

}

function inicia_barra_habito_circulos(){

    for(let i = 0; barra_habitos.habitos.length; i++){

        let id_inicial = "icon_check_";
        let texto = (i+1).toString();
        let id_passar = id_inicial + texto;

        let bd_habitos = localStorage.getItem("DB_Habitos");
        let json_bd = JSON.parse(bd_habitos);

        if(json_bd.habitos[i].check == "true"){

            document.getElementById(id_passar).style.display = "block";

        }else{
            document.getElementById(id_passar).style.display = "none";
        }

        

    }


}

function editar_habito(novo_valor){

    let objeto = get_clique_temp();

    let habito_editar = document.getElementById(objeto.id);

    let bd_habitos = localStorage.getItem("DB_Habitos");
    let json_bd = JSON.parse(bd_habitos);

    json_bd.habitos[objeto.indice].desc = novo_valor;
    
    localStorage.setItem("DB_Habitos", JSON.stringify(json_bd));

    habito_editar.innerHTML = novo_valor;

}
function armazena_clique_temp(id, indice){

    let temp_habito = {

        "id" : id,
        "indice" : indice
    };

    localStorage.setItem('DB_temp', JSON.stringify(temp_habito));


    
}

function get_clique_temp(){

    return JSON.parse(localStorage.getItem('DB_temp'));
    
}

function adicionar_habito(novo_valor){

    let bd_habitos = localStorage.getItem("DB_Habitos");
    let json_bd = JSON.parse(bd_habitos);

    let tamanho_bd = json_bd.habitos.length;

    let nova_div = "barra_habito_" + (tamanho_bd+1).toString();
    let indice_nova_div = tamanho_bd;
    let icon_nova_div = "icon_check_" + tamanho_bd.toString();
    let circulo_nova_barra = "circulo_" + nova_div;

    /*
        <div class="habito r2 habito_novo">
            <div id= circulo_nova_barra>
                <div class="circulo_barra" onclick="atualiza_circulo_barra_habito(icon_nova_div, indice_nova_div)">
                    <img src="resources/icon_check.svg" alt="icon_check" id=icon_nova_div>
                </div>
            </div>
                <h5>
                    <label id= nova_div class="barra_habito_elementos"
                    data-toggle="modal" data-target="#meuModal"
                    onclick="armazena_clique_temp(nova_div,indice_nova_div)">
                </h5>
        </div>
   
    */ 

    let novo_habito = {
        "id" : "1",
        "desc" : novo_valor,
        "check" : "false"
    };

    json_bd.habitos.push(novo_habito);

    localStorage.setItem("DB_Habitos", JSON.stringify(json_bd));
    
}