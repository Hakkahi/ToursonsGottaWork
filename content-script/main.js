var browser = browser || chrome

function onGot(list) {
    if(list.domainList.includes(location.host)){
        document.body.innerHTML = `
            <div>
                <p>COURAGE TOURSONNE</p>
            </div>
        `
    }
}

var getting = chrome.storage.sync.get("domainList", onGot);