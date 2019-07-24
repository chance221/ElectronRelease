//Moduels
const fs = require('fs')
const {shell} = require('electron')

//DOM nodes
let items = document.getElementById('items')

//Get readerJS contents by createing a reference to it via fs (a node.js module that allows access to the users local file system). We then set the readerJS varible equal to data that is pulled from this file and interpolated to a string 
let readerJS
fs.readFile(`${__dirname}/readerJS.js`, (err, data) =>{
    readerJS = data.toString()
})

//Listen for "Done" message from reader window
window.addEventListener('message', e=>{
    console.log(e.data)

    //Delete item at a given index we need to first ensure that the selected ittem has an actual index :) we do this with the function below which is getSelected

    if(e.data.action ==='delete-reader-item'){
        //Delete item at given index
        this.delete(e.data.itemIndex)
        
        //close the reader window
        e.source.close()
        console.log(e.source)
    }

    
})
//Open item in native Browser
exports.openNative = () => {

    //Only if we have items
    if(!this.storage.length) return
    
    let selectedItem = this.getSelectedItem()

    shell.openExternal(selectedItem.node.dataset.url)

}

//Delete item

exports.delete = itemIndex =>{

    //remove item from DOM
    items.removeChild(items.childNodes[itemIndex])

    //Remove from storage
    this.storage.splice(itemIndex, 1)

    //Persist
    this.save()

    //Select previous item or new first item if first was deleted
    if(this.storage.length){

        //Get new selected item index
        let newSelectedItemIndex = (itemIndex === 0) ? 0 : itemIndex - 1

        //Ser item at new index as selected
        document.getElementsByClassName('read-item')[newSelectedItemIndex].classList.add('selected')
    }
}
//Get selected item index
exports.getSelectedItem = () =>{
    //Get selected node
    let currentItem = document.getElementsByClassName('read-item selected')[0]

    //Get item Index
    let itemIndex = 0
    let child = currentItem
    while( (child = child.previousSibling) != null) itemIndex++

    //Return selected item and index
    return {node: currentItem, index:itemIndex}
}

//In order to keep track of items AFTER we close the app we can use local storage. As the data needed to be stringified to put it in local storage we need to now turn it back to a JSON 

exports.storage = (JSON.parse(localStorage.getItem('readit-items')) || [])

//Persist storage. We need to stringify this as local storage only supports simple strings

exports.save = () =>{
    localStorage.setItem('readit-items', JSON.stringify(this.storage))
}

//Set item as selected
exports.select = e =>{

    //Remove currently selected item class
    this.getSelectedItem().node.classList.remove('selected')

    //Add to clicked item
    e.currentTarget.classList.add('selected')
}

//Open selected item
exports.open = () =>{

    //Only if we have items(in case of menu open)

    //Get selected item
    let selectedItem = this.getSelectedItem()

    // Get item's url
    let contentURL = selectedItem.node.dataset.url

    // Open item in proxy BrowserWindow and pass additional parameters that set the windows properties to handle the content
    let readerWin = window.open(contentURL, '',`
    maxWidth = 2000,
    maxHeight = 2000,
    width=1200,
    height=800,
    backgroundColor=#DEDEDE,
    nodeIntegration=0,
    contextIsolation=1`)

    //Inject JavaScript by linking it to a variable that will hold the reference to the outside file we will use to inject commands for this window after it is created the variable is created above. We can also get specific information from the readerJS file and replace it with dynamic data. In the code bleoww we replace the text within the special {{index}} tag we created in the readerJS file with the created index for the selected item.  
    readerWin.eval(readerJS.replace('{{index}}', selectedItem.index) )
}

//Move to newly selected item
exports.changeSelection = direction =>{

    //Get selected item
    let currentItem = this.getSelectedItem()

    if(direction === 'ArrowUp' && currentItem.node.previousSibling) {
        currentItem.node.previousSibling.classList.add('selected')
        currentItem.node.classList.remove('selected')

    } else if (direction === 'ArrowDown' && currentItem.node.nextSibling){
        currentItem.node.classList.remove('selected')
        currentItem.node.nextSibling.classList.add('selected')
    }
}

// Add new item. Needs to accept isNew parameter to see if the item already exist in  local storage
exports.addItem = (item, isNew = false) => {
    let itemNode = document.createElement('div')

    //assign "read-item" class
    itemNode.setAttribute('class', 'read-item')

    //assign "read-item" class
    itemNode.setAttribute('data-url', item.url)

    // Add inner HTML
    itemNode.innerHTML = `<img src="${item.screenshot}"><h2>${item.title}</h2>`

    //Append new node to "items"
    items.appendChild(itemNode)

    //Attach click handler to select item
    itemNode.addEventListener('click', this.select)

    //Attach open doubleclick handler
    itemNode.addEventListener('dblclick', this.open)


    //If theis is the first item then select it
    if (document.getElementsByClassName('read-item').length === 1){
        itemNode.classList.add('selected')
    }

    //Add item to storage and persist
    if(isNew){
        this.storage.push(item)
        this.save()
    }
}

this.storage.forEach(item => {
    this.addItem(item)
})

