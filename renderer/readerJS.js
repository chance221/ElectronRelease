//create button in remote content window to mark item as "done"

let readitClose = document.createElement('div')
readitClose.innerText= 'Done'

//style button

readitClose.style.position = 'fixed'
readitClose.style.bottom = '15px'
readitClose.style.right='15px'
readitClose.style.padding='5px 10px'
readitClose.style.fontSize='20px'
readitClose.style.fontWeight='bold'
readitClose.style.background='dodgerblue'
readitClose.style.color='white'
readitClose.style.borderRadius='5px'
readitClose.style.cursor='default'
readitClose.style.boxShadow='2px 2px 2px rgba(0,0,0,0.2)'

//Attach click handler to the button you just created
readitClose.onclick = e=>{

   //Message parent (opener) window with the message 'item-done' and to any target origin as denoted with the *. We now would like to delete this item meaning we need to access the local storage. We do this in the items.js file but to access it we need to send it in a message with the action set to 'delete-reader-item'
   window.opener.postMessage({
       action: 'delete-reader-item',
       itemIndex: {{index}}
   }, '*')
}


 //Append button to body
 document.getElementsByTagName('body')[0].appendChild(readitClose)

