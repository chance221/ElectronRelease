/*This is the process that will 
1. create a offscreen renderer
2. Load the item URL
3. Retrive Items  Screenshot and title*/

//Modules
const { BrowserWindow }= require("electron")

//create a global instance of the window to ensure that it is not garbage collected
let offscreenWindow

//Exported readItem function
module.exports = (url, callback) =>{
    
    //create offscreen window 
    offscreenWindow = new BrowserWindow({
        width:500,
        height: 500,
        show: false,
        webPreferences:{
            offscreen: true,
            nodeIntegration: false
        }
    })

    //load item url 
    offscreenWindow.loadURL(url)

    //wait for content to finish loading
    offscreenWindow.webContents.on('did-finish-load', e =>{

        //get title page
        let title = offscreenWindow.getTitle()

        //get screenshot of fully loaded page
        offscreenWindow.webContents.capturePage ( image => {

            //get image as dataURL (as the image will be returned as an electron native image we can pass the data and access it)
            let screenshot = image.toDataURL()
        
            //Execute callback with new item object
            callback({title: title, screenshot, url})

            //Clean up
            offscreenWindow.close()
            offscreenWindow = null;
        })
    })
}

