/*Because this will not export functions as it will only run once when creating the window to establish menu we just require it in the window that needs to display this specific menu bar*/

//Modules
const {remote, shell} = require('electron')


//Menu tempelate created to hold menu items

const template = [
    {
        label:'Items',
        submenu: [
            {
                label:'Add New',
                click: window.newItem, //we need to create a global object that we can access the new Item function previously created from menu.js
                accelerator: 'CmdOrCtrl+O'
            }, 
            {
                label:'Read Item',
                accelerator:'CmdOrCtrl+Enter',
                click: window.openItem
            },
            {
                label:'Delete Item',
                accelerator: 'CmdOrCtrl+Backspace',
                click:window.deleteItem
            },
            {
                label:'Open in Browser',
                accelerator: 'CmdOrCtrl+Shift+O',
                click:window.openItemNative
            },
            {
                label:'Search Items',
                accelerator: 'CmdOrCtrl+S',
                click:window.searchItems
            }
        ]
    },
    {
        role:'editMenu' //this will tell electron to add edit menu items for us
    },
    {
        role: 'windowMenu'
    },
    {
        role: 'help',
        submenu: [
            {
                label: 'Learn more',
                click: () => { shell.openExternal("https://github.com/stackacademytv/master-electron")} //The shell allows us to open up the url in the default browser
            }
        ]

    }

]
//Set mac-Specific first menu item. Because mac by default automatically makes the first item in menu the application name we need to write code to check for the platform and then set the menu items accordingly. The code below will format the first menu item for mac computers automatically (as every mac app has these predefined)
if(process.platform ==='darwin'){

    template.unshift({
        label: remote.app.getName(),
        submenu: [
            {role: 'about'},
            {type: 'seperator'},
            {role: 'services'},
            {type: 'seperator'},
            {role: 'hide'},
            {role: 'hideothers'},
            {role: 'unhide'},
            {role: 'seperator'},
            {role: 'quit'}
        ]
    })
}

//Build menu. We pass the template into the remote.Menu module to make use of the buildFromTemplate method
const menu = remote.Menu.buildFromTemplate(template)

//Set as main app manu
remote.Menu.setApplicationMenu(menu)