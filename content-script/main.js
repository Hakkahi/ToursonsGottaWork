var browser = browser || chrome

function onGot(list) {
    if(list.domainList.includes(location.host)){
        document.head = `
            <head>
                <meta charset="utf-8">
            </head>
        `
        document.body.innerHTML = `
            <div>
                <p>COURAGE TOURSONNE</p>
            </div>
        `
    }
}

// Getting the activated variable 
browser.storage.sync.get('activated', function(value){
    if(Object.keys(value).length === 0 && value.constructor === Object){
        browser.storage.sync.set({
            activated: true
        });
        
        var getting = browser.storage.sync.get("domainList", onGot);
    }
    else{
        if(value.activated){
            var getting = browser.storage.sync.get("domainList", onGot);
        }
    }
});

