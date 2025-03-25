// processo de renderização
//tela principal

console.log("processo de renderização ")

function cliente() {
   // console.log("teste do botão cliente")
    api.clientWindow()
}



function os() {
   // console.log("teste do botão os")
    api.osWindow()
}

// troca de icone do banco de dados
api.dbstatus((Event,message) => {
    console.log(message)
    if (message === "conectado") {
        document.getElementById('statusdb').src = "../public/img/dbon.png"
    } else {
        document.getElementById('statusdb').src = "../public/img/dboff.png"
    }
})