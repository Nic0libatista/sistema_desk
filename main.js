console.log("Processo principal")

const { app, BrowserWindow, nativeTheme, Menu } = require('electron')


// janela principal
let win
const createWindow = () => {
    // a linha baixo define o tema: claro ou escuro
    nativeTheme.themeSource = 'dark'
    win = new BrowserWindow({
    width: 800,
    height: 600,
    //esconde o menu
    //autoHideMenuBar: true,
    // botão minimizar sem aparecer na tela
    //minimizable: false,
    //mudar o tamanho esticando a tela
    resizable: false
  })

  
// menu personalizado
Menu.setApplicationMenu(Menu.buildFromTemplate(template))

  win.loadFile('./src/views/index.html')
}

// fim da janela principal
  
// janela sobre
function aboutWindow(){
  nativeTheme.themeSource = 'system'
  const main = BrowserWindow.getFocusedWindow()
  let about 
  // estabelecer uma relaçao hierarquica entre janlas 
  if (main) {
    // criar a janela sobre 
    about = new BrowserWindow ({
      width:360,
      height:200,
      autoHideMenuBar: true,
      resizable: false,
      minimizable: false,
      parent: main,
      modal: true
    })
  }
  // carregar o doc html na janela
  about.loadFile('./src/views/sobre.html')
}

// iniciar a aplicação

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


// template do menu
const template = [
  {
      label: 'Cadastro',
      submenu: [
        {
          label: 'Cliente'
        },
        {
          label: 'OS'
        },
        {
          label: 'separator'
        },
        {
          label: 'Sair',
          click: ()=> app.quit(),
          accelerator:'Alt+F4'
        }
      ]
  },
  {
      label: 'Relatórios'
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
          role: 'zoomout'
        },
        {
          label: 'Restaurar o zoom padrão',
          role: 'resetZoom'
        },
        {
          type: 'separator',
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

