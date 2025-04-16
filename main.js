console.log("Processo principal")

const { app, BrowserWindow, nativeTheme, Menu, ipcMain, dialog, shell } = require('electron')

//linha relacionada ao preload.js
const path = require('node:path')

// importação dos modulo de conectar e desconectar (modulo de conexão)
const {conectar, desconectar} = require('./database.js')

// importação do schema clientes da camada model
const clientModel = require ('./src/models/cliente.js')
const { title } = require('node:process')
const {jspdf, default: jsPDF} = require('jspdf')


//importação da biblioteca fs (nativa js) p manipulação de arquivos (no caso, uso do pdf)
const fs = require('fs')

// Janela principal
let win
const createWindow = () => {
    // a linha abaixo define o tema (claro ou escuro)
    nativeTheme.themeSource = 'light' //(dark ou light)
    win = new BrowserWindow({
        width: 800,
        height: 700,
        //autoHideMenuBar: true,
        //minimizable: false,
        resizable: false,
        // ativar preload.js
        webPreferences: {
            preload: path.join(__dirname, 'preload.js')
        }
    })



    // menu personalizado
    Menu.setApplicationMenu(Menu.buildFromTemplate(template))

    win.loadFile('./src/views/index.html')
    //recebimento dos pedidos do renderizador para abertura de janelas

}

    ipcMain.on('client-Window',() => {
        clientWindow()
    })

    ipcMain.on('os-Window',() => {
        osWindow()
    })


// Janela sobre
function aboutWindow() {
    nativeTheme.themeSource = 'light'
    // a linha abaixo obtém a janela principal
    const main = BrowserWindow.getFocusedWindow()
    let about
    // Estabelecer uma relação hierárquica entre janelas
    if (main) {
        // Criar a janela sobre
        about = new BrowserWindow({
            width: 360,
            height: 220,
            autoHideMenuBar: true,
            resizable: false,
            minimizable: false,
            parent: main,
            modal: true
        })
    }
    //carregar o documento html na janela
    about.loadFile('./src/views/sobre.html')
}

// Janela clientes
let client
function clientWindow() {
    nativeTheme.themeSource = 'dark'
    const main = BrowserWindow.getFocusedWindow()
    if(main) {
        client = new BrowserWindow({
            width: 900,
            height: 850,
            //autoHideMenuBar: true,
            resizable: false,
            parent: main,
            modal: true,
            // ativar preload.js
        webPreferences: {
            preload: path.join(__dirname, 'preload.js')
        }
         })
        
    }
    client.loadFile('./src/views/cliente.html')  
    client.center() // iniciar no centro da tela
}


// Janela OS
let os
function osWindow() {
    nativeTheme.themeSource = 'dark'
    const main = BrowserWindow.getFocusedWindow()
    if(main) {
        os = new BrowserWindow({
            width: 1010,
            height: 720,
          //  autoHideMenuBar: true,
            resizable: false,
            parent: main,
            modal: true
        })
    }
    os.loadFile('./src/views/os.html')   
    os.center() //iniciar no centro da tela
}

// Iniciar a aplicação
app.whenReady().then(() => {
    createWindow()

    app.on('activate', () => {
        if (BrowserWindow.getAllWindows().length === 0) {
            createWindow()
        }
    })
})

app.on('window-all-closed', () => {
    if (process.platform !== 'darwin') {
        app.quit()
    }
})

//reduzir logs não críticos
app.commandLine.appendSwitch('log-level', '3')

// iniciar a conexão com banco de dados (pedido direto do preload)
ipcMain.on('db-connect',async (Event) => {
    let conectado = await conectar()
// se coenctado for igual a true 
    if (conectado) {
    // enviar uma mensagem para o renderizador trocar o icone
    // criar delay de 5s para sincronizar a nuvem
    setTimeout(()=> { 
    Event.reply('db-status', "conectado")
    }, 500); //500ms
    
}
})


// !!! desconectar quando a aplicação for encerrada
app.on('before-quit', () => {
    desconectar() 
})

// template do menu
const template = [
    {
        label: 'Cadastro',
        submenu: [
            {
                label: 'Clientes',
                click: () => clientWindow()
            },
            {
                label: 'OS',
                click: () => osWindow()
            },
            {
                type: 'separator'
            },
            {
                label: 'Sair',
                click: () => app.quit(),
                accelerator: 'Alt+F4'
            }
        ]
    },
    {
        label: 'Relatórios',
        submenu: [
            {
                label: 'Clientes',
                click: () => relatorioClientes()
            },
            {
                label: 'OS abertas'
            },
            {
                label: 'OS concluídas'
            }
        ]
    },
    {
        label: 'Ferramentas',
        submenu: [
            {
                label: 'Aplicar zoom',
                role: 'zoomIn'
            },
            {
                label: 'Reduzir',
                role: 'zoomOut'
            },
            {
                label: 'Restaurar o zoom padrão',
                role: 'resetZoom'
            },
            {
                type: 'separator'
            },
            {
                label: 'Recarregar',
                role: 'reload'
            },
            {
                label: 'Ferramentas do desenvolvedor',
                role: 'toggleDevTools'
            }
        ]
    },
    {
        label: 'Ajuda',
        submenu: [
            {
                label: 'Sobre',
                click: () => aboutWindow()
            }
        ]
    }
]

//clientes -- crud create
ipcMain.on('new-client', async (event,client) => {
    // !!! teste de recebimento dos dados do cliente
    console.log(client)

    try {

        //criar nova estrutura de dados usando a class modelo. !!! os atributos precisam ser identicos ao modelo de dados cliente.js
        // e os valores são definidos pelo conteúdo de objeto cliente
        const newClient = new clientModel({
            nomeCliente: client.nameCli,
            cpfCliente: client.cpfCli,
            emailCliente: client.emailCli,
            foneCliente: client. phoneCli,
            cepCliente: client.cepCli,
            logradouroCliente: client.adressCli,
            numeroCliente: client.numberCli,
            complementoCliente: client.complementCli,
            bairroCliente: client.neighborhoodCli,
            cidadeCliente: client.cityCli,
            ufCliente: client.ufCli
        })

        //salvar os dados do cliente no banco de dados
        await newClient.save()
        // mensagem de confirmação
        dialog.showMessageBox({
                 //customização
                 type: 'info',
                 title: "aviso",
                 message: "cliente adicionado com sucesso",
                 buttons: ['ok']
        }).then((result) => {
            // ação ao pressionar o botao (result - 0)
            if(result.response === 0){
                // enviar pedido para o renderizador limpar os campos e resetar as conf pre definidas
                // (rotulo 'reset-form) do preload js
                event.reply('reset-form')
            }
            // ação ao pressionar o botão

        })
        } catch(error) {
            //se codigo de erro for 11000 (cpf duplicado) enviar uma mensagem ao usuario
            if (error.code === 11000){
                dialog.showMessageBox({
                    type: 'error',
                    title: "atenção",
                    message: " cpf já está cadastrado \n verifique se digitou corretamente",
                    buttons: ['ok']

                }).then((result) => {
                    if (result.response === 0) {
                        // limpar a caixa do cpf e deixar a borda em vermelho

                    }

                })
            }
        console.log(error)
    }
})


///////////////////////////// relatorio de clientes ////////////////////////////////////////////////

async function relatorioClientes(){
    try{
        // passo 1: consultar o banco de dados e obter a listagem de clientes cadastrados por ordem alfabetica
        const clientes = await clientModel.find().sort({nomeCliente:1})
        // teste de recebimento da listagem de clientes
        // console.log(clientes)
        const doc =new jsPDF ('p', 'mm', 'a4')
        // definir o tamanho da  (tamanho equivalente ao word)
        // p = portrait | l = landscape | mm | a4
        // inserir imagem no doc html
        //imagempath é o caminho q será inserido no pdf
        // imagembase64 (uso da biblioteca fs para ler o arquivo no formato png)
        const imagePath = path.join(__dirname, 'src', 'public', 'img', 'logo.png')
        const imagebase64 = fs.readFileSync(imagePath, {encoding: 'base64'})
        doc.addImage(imagebase64, 'PNG', 5,8) // (5mm, 8mm) x,y

        doc.setFontSize(18)
        // escrever um texto (titulo)
        doc.text("relatorio de clientes", 14, 45) // x,y (mm)
        // inserir a data atual no relatorio
        const dataatual = new Date().toLocaleDateString('pt-BR')
        doc.setFontSize(12)
        doc.text(`Data: ${dataatual}`, 165, 10)
        // variavel de apoio na formatação
        let y = 60
        doc.text("nome", 14,y)
        doc.text("telefone",80, y)
        doc.text("email", 130, y)
        y +=5
        // desenhar uma linha
        doc.setLineWidth(0.5) // expessura da linha
        doc.line(10,y, 200,y) // 10 (inicio) --------- 200 (fim)
        
        y+=10 
        // renderizar os clientes cadastrados no banco
       

        clientes.forEach((c) => {
            // add outra pg se a folha inteira for preenchida (estrategia é saber tamanho da folha)
            // folha a4 tem y=297mm
            if (y > 280) {
                doc.addPage()
                y= 20 // reseta a variavel y
                doc.text("nome", 14,y)
                doc.text("telefone",80, y)
                doc.text("email", 130, y)
                y+=5
                // desenhar uma linha
                doc.setLineWidth(0.5) // expessura da linha
                doc.line(10,y, 200,y) // 10 (inicio) --------- 200 (fim)
                y+=10

            }
            doc.text(c.nomeCliente, 14, y)
            doc.text(c.foneCliente, 80, y)
            doc.text(c.emailCliente || "n/a", 130, y)
            y += 10 


        })
        // add numeração automatica de páginas
        const paginas = doc.internal.getNumberOfPages()
        for (let i = 1; i <= paginas; i++) {
            doc.setPage(i)
            doc.setFontSize(10)
            doc.text(`pagina ${i} de ${paginas}`,105,290, {align:'center'})
        }

        // ...

        // definir o caminho do arquivo temporario
        const tempDir = app.getPath('temp')
        const filePath = path.join(tempDir, 'clientes.pdf')
        // salvar temporariamente o arquivo
        doc.save(filePath)
        // abrir o arquivo do aplicativo padrão de leitura de pdf do computador do usuario
        shell.openPath(filePath)
    } catch(error){
        console.log(error)
    }
    
}



////////////////////////////// fim - relatorio de clientes ////////////////////////////////////////////

/////////////////////////////// começo - pesquisa pelo nome /////////////////////////////////

ipcMain.on('search-name',async (event,name) =>{
   // console.log("teste IPC search-name")
   // console.log(name)
   // find --- (nomeCliente: name) - busca pelo nome 
   // regEXP (name,i) i= insensitive -- ignora maiusculo ou minusculo 
   try {
    const dataClient = await clientModel.find({
        nomeCliente: new RegExp(name, 'i')

    })
    console.log(dataClient)
    // envia os dados do cliente ao renderer
    // !!! ipc apenas trabalha com string ent é necessario converter o JSON para string
    event.reply('render-client', JSON.stringify(dataClient))
   } catch(error){
    console.log(error)
   }
})


///////////////////////////////// fim - pesquisa pelo nome //////////////////////////////////////////