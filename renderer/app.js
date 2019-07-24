//this is the logic that will alter the ui during use.


//Add required modules
const {ipcRenderer} = require('electron')
const items = require('./items')

//Add the dom nodes

let showModal = document.getElementById('show-modal'),
    closeModal = document.getElementById('close-modal'),
    modal = document.getElementById('modal'),
    addItem = document.getElementById('add-item'),
    itemURL = document.getElementById('url'),
    search = document.getElementById('search')

//Open new item global reference to showModal function that we can call from other javaScipt files
window.newItem = () => {
    showModal.click()
}

//Global reference to items.open 
window.openItemNative = items.openNative

//Global reference to items.delete
window.deleteItem = () => {
    let selectedItem = items.getSelectedItem()
    items.delete(selectedItem.index)
}


//focus to search items
window.searchItems = () => {
    search.focus()
}


//Open item in native browser
window.openItemNative = items.openNative


//filter items with "search"
search.addEventListener('keyup', e =>{
    //Loop items that are currently in the DOM that have the class of read-item. This will allow you create an array of those class items and then loop through them.
    
    Array.from(document.getElementsByClassName('read-item')).forEach (item =>{
        
        //Hide any items that don't match search value

        let hasMatch = item.innerText.toLowerCase().includes(search.value)
        item.style.display = hasMatch ? 'flex' : 'none'
    })
})    

document.addEventListener('keydown', e=>{
    if (e.key === 'ArrowUp' || e.key === 'ArrowDown'){
        items.changeSelection(e.key)
    }
})

//disable and enable modal buttons
const toggleModalButtons = () =>{
    //if additem is disabled( after item submission but before the process is completed) apply these rules until a response is received
    if(addItem.disabled === true){
        addItem.disabled = false
        addItem.style.opacity = 1
        addItem.innerText = 'Add Item'
        closeModal.style.display = 'inline' 
        //if it is not disabled (before user submits new entry) apply these rules
    }else{
        addItem.disabled = true
        addItem.style.opacity = .5
        addItem.innerText = 'Adding...'
        closeModal.style.display = 'none'    
    }
}

//Show modal
showModal.addEventListener('click', e => {
    modal.style.display = 'flex'
    itemURL.focus();
})


//Hide modal
closeModal.addEventListener('click', e => {
    modal.style.display = 'none'
})

//Handle new Item
addItem.addEventListener('click', e => {
    //check a url exists
    if (itemURL.value){

        //send new item url to main process
        ipcRenderer.send('new-item', itemURL.value)

        //Disable buttons
        toggleModalButtons()
    }
})

//Listen for new item from main process
ipcRenderer.on ('new-item-success', (e, newItem) =>{
    
    //Add new Item to "items" node
    items.addItem(newItem, true)

    //Enable buttons and reset the form area
    toggleModalButtons()
    modal.style.display = 'none'
    itemURL.value = ''
    
})

//Listen for keyboard submit using the enter key
itemURL.addEventListener('keyup', e => {
    if(e.key === 'Enter')addItem.click()
})

