// arquivo de pre carregamento e reforço de segurança na comunicação entre processos (IPC)

//const { contextBridge, ipcRenderer } = require("electron")

// importaçao dos recursos do framework
// contextbridge segunrança | ipcrenderer comunicação
const {contextBridge,ipcRenderer} = require('electron')

//enviar ao main um pedido para conexão com banco de dados e troca de icone no processo de renderização (index.html - renderer.html)
ipcRenderer.send('db-connect')

contextBridge.exposeInMainWorld('api',{
    clientWindow: () => ipcRenderer.send('client-Window'),
    osWindow: () => ipcRenderer.send('os-Window'),
    dbstatus:(message) => ipcRenderer.on('db-status', message),
    newClient:(client)=>ipcRenderer.send('new-client',client),
    resetForm: (args) => ipcRenderer.on('reset-form', args),
    searchName:(name)=>ipcRenderer.send('search-name',name),
    renderClient:(dataClient)=>ipcRenderer.on('render-client', dataClient),
    validateSearch:() =>ipcRenderer.send('validate-search'),
    setClient: (args) => ipcRenderer.on('set-client', args),
    deleteClient: (id) => ipcRenderer.send('delete-client', id),
    updateClient:(id) => ipcRenderer.send('update-client', client)
})

function dbstatus(message){
    ipcRenderer.on('db-status', message)
}