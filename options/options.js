var browser = browser || chrome

let domainList = []

let rmElement = function(element) {
    element.parentElement.remove();
    domainList.splice(element.id, 1);
    updateList()
}

function isValidURL(str) {
    var a  = document.createElement('a');
    a.href = str;
    return (a.host && a.host != window.location.host);
 }

function addElement() {
    
    let value = document.querySelector("#newElement").value
    if(isValidURL(value)){
        var parser = document.createElement('a');
        parser.href = value
        domainList.push(parser.host)
        browser.storage.sync.set({
            domainList: domainList
        });
        restoreOptions()
    }
    else{
        console.error("You must enter a valid url !")
    }
}


function updateList() {
    browser.storage.sync.set({
        domainList: domainList
    });
    restoreOptions()
}


function restoreOptions() {

    function setCurrentChoice(result) {
        domainList = result.domainList || []
        let list = ''
        let id = 0
        domainList.forEach(element => {
            list += `<li>
                        <label>${element}</label>
                        <button class='blocked-domain' id='${id++}'>delete</button>
                    </li>`
        });

        document.getElementById('domainList').innerHTML = list
        let elements = document.getElementsByClassName('blocked-domain')
        for(let i = 0; i < elements.length; ++i) {
            elements[i].addEventListener("click", function(){rmElement(this)});
        }
    }

    function onError(error) {
        console.log(`Error: ${error}`);
    }

    var getting = browser.storage.sync.get("domainList", setCurrentChoice);
    //getting.then(setCurrentChoice, onError);
}
  
document.addEventListener("DOMContentLoaded", restoreOptions);
document.querySelector("form").addEventListener("submit", addElement);