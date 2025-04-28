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

// vetor global q será usado na manipulação dos dados
let arrayClient=[]
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

// função para manipular o evento da tecla enter
function teclaEnter(event){
    // se a tecla enter for pressionada
    if(event.key ==="Enter"){
        event.preventDefault() // Ignorar o comportamento padrão 

        // associar o enter a busca pelo cliente
        buscarCliente()
    }
}

// fim da função da tecla enter ////////////////////////////////////////////

// função para restaurar o padrão da tecla enter (submit) /////////////////////
function restaurarEnter(){
    frmCliente.removeEventListener('keydown', teclaEnter)
}

// esculta do evento tecla enter
// frmCliente.addEventListener('keydown', teclaEnter)


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

// captura do ID do cliente (usado no delete e no update)
let id = document.getElementById('idClient')

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



//////////////////////////////////////////// reset form ///////////////////////////////////////
function resetForm() {
    //limpar os campos e resetar o formulario com as configuraçoes pré definidas
    
    location.reload()
}

api.resetForm((args) => {
    resetForm()
})

/////////////////////////////////////////// crud read ////////////////////////////////////////////////

function buscarCliente(){
    let name=document.getElementById('searchClient').value
    console.log(name)

    //validação de campo obrigatorio
    // se o campo de Busca nn foi preenchido
    if(name ===""){
        //enviar um alerta para o usuario
        api.validateSearch()
        foco.focus()
    } else {
        // enviar ao main um pedido para alertar o usuário
        //enviar um alerta para o usuario

        api.searchName(name)
    //recebimento dos dados do cliente
    api.renderClient((event,dataClient) => {
        // console.log(dataClient) // teste
        const dadosCliente=JSON.parse(dataClient)
        arrayClient =dadosCliente

        arrayClient.forEach((c) =>{
            id.value = c._id,
            nameClient.value=c.nomeCliente,
            cpfClient.value=c.cpfCliente,
            emailClient.value=c.emailCliene,
            phoneClient.value=c.foneCliente,
            cepClient.value=c.cepCliente,
             adressClient.value=c.logradouroCliente,
             numberCliente.value=c.numeroCliente,
             complementClient.value=c.complementoCliente,
             neighborhoodClient.value=c.bairroCliente,
             cityClient.value=c.cidadeCliente
          // bloqueio do botão adicionar
          btnCreate.disabled = true
          // desbloqueio dos botões
          btnUpdate.disabled = false
          btnDelete.disabled = false
      });
  });
};
}

api.setClient((args)=>{
  let campoBusca = document.getElementById('searchClient').value
  nameClient.focus()
  foco.value =""
  nameClient.value = campoBusca
})

function excluirCliente(){
    console.log(id.value) // passo 1 (receber do form o id)
    api.deleteClient(id.value)
}