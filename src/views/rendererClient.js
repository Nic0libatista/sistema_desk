// Buscar CEP
function buscarCEP() {
    //console.log("teste do evento blur")
    //armazenar o cep digitado na variável
    let cep = document.getElementById('inputCEPClient').value
    //console.log(cep) //teste de recebimento do CEP
    //"consumir" a API do ViaCEP
    let urlAPI = `https://viacep.com.br/ws/${cep}/json/`
    //acessando o web service par abter os dados
    fetch(urlAPI)
        .then(response => response.json())
        .then(dados => {
        // extração dos dados
        document.getElementById('inputAddressClient').value =dados.logradouro
        document.getElementById('inputNeighboorhoodClient').value =dados.bairro
        document.getElementById('inputCityClient').value=dados.localidade
        document.getElementById('inputUFCliente').value =dados.uf
    })
    .catch(error => console.log(error))
}

//capturar o foco na busca pelo nome do cliente
// a constante foco obtem o elemento html (input) identificada como searchClient
const foco = document.getElementById('searchClient')

// iniciar a janela de clientes alterando as propriedades de alguns elementos
document.addEventListener('DOMContentLoaded', ()=> {
    //desabilitar os botões 
  btnUpdate.disabled = true
  btnDelete.disabled = true
  // foco na busca do cliente
  foco.focus()
})

//capturar dos dados  dos input do funcionario (passo 1: fluxo)
let frmCliente = document.getElementById('frmCliente')
let nameClient = document.getElementById('inputNameClient')
let cpfClient = document.getElementById('inputCPFClient')
let emailClient = document.getElementById('inputEmailClient')
let phoneClient = document.getElementById('inputPhoneClient')
let cepClient = document.getElementById('inputCEPClient')
let adressClient = document.getElementById('inputAddressClient')
let numberCliente = document.getElementById('inputNumberClient')
let complementClient = document.getElementById('inputComplementClient')
let neighborhoodClient = document.getElementById('inputNeighboorhoodClient')
let cityClient = document.getElementById('inputCityClient')
let ufClient = document.getElementById('inputUFClient')

//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
/// CRUD CREATE/UPDATE 


// evento associado ao botão submit (uso das validações do html)

frmCliente.addEventListener('submit', async (Event) => {
    // evitar o comportamento padrão do submit q é enviar os dados do formulario e reiniciar o documento html
    Event.preventDefault()
    // teste importante (recebimento dos dados)
    console.log(nameClient.value, cpfClient.value,  emailClient.value, phoneClient.value, cepClient.value, adressClient.value, numberCliente.value,complementClient.value, neighborhoodClient.value, cityClient.value,ufClient.value)


// criar um obj para armazenar os dados do cliente antes de enviar ao main
const client ={
    nameCli: nameClient.value,
    cpfCli: cpfClient.value,
    emailCli: emailClient.value,
    phoneCli: phoneClient.value,
    cepCli: cepClient.value,
    adressCli: adressClient.value,
    numberCli: numberCliente.value,
    complementCli: complementClient.value,
    neighborhoodCli: neighborhoodClient.value,
    cityCli: cityClient.value,
    ufCli: ufClient.value
}

    api.newClient(client)

    // cadastrar a estrutura de dados no banco de dados MongoDB

})

////////////////////////////////// fim /////////////////////////////////////////////////////