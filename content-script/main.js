var browser = browser || chrome

async function onGot(list) {
    if (Object.keys(list).length === 0 && list.constructor === Object) {
        list.domainList = [];
    }
    if (list.domainList.includes(location.host)) {
        html = await buildDocumentContent()
        document.open()
        document.write(html)
        document.close()
    }
}

// Getting the activated variable 
browser.storage.sync.get('activated', function(value) {
    // If there is no values in the storage we consider that the extension is on
    if (Object.keys(value).length === 0 && value.constructor === Object) {
        browser.storage.sync.get({
            activated: true
        });

        var getting = browser.storage.sync.get("domainList", onGot);
    } else {
        if (value.activated) {
            var getting = browser.storage.sync.get("domainList", onGot);
        }
    }
});


async function buildDocumentContent() {
    let promise = new Promise(function(resolve, reject) {
        // Waiting for all the ressources to be fetched
        Promise.all([fetchExtensionTextResource("content-script/ressources/customContent.html"), fetchExtensionTextResource("content-script/ressources/customContent.css"), fetchExtensionTextResource("content-script/ressources/customContent.js")]).then(async(values) => {
            let htmlContentElement = document.createElement("div");
            htmlContentElement.innerHTML = values[0];

            let css = document.createElement("style");
            css.type = 'text/css'
            css.innerHTML = values[1]
            try {
                let imageTmpURL = await fetchExtensionBlobResource("content-script/ressources/images/background.webp")
                css.innerHTML = css.innerHTML + `body {background-image: url(${imageTmpURL})}`
            } catch (error) {
                reject(error)
            }
            htmlContentElement.appendChild(css)

            let js = document.createElement("script");
            js.innerHTML = values[2]
            htmlContentElement.appendChild(js)

            resolve(htmlContentElement.innerHTML)
        }).catch(function(error) {
            reject(error)
        })
    })
    try {
        let html = await promise
        return html
    } catch (error) {
        console.log(`Error: ${error}`);
        return ''
    }


}


function fetchExtensionTextResource(resourcePath) {
    let promise = new Promise(function(resolve, reject) {
        // Fetching css content
        fetch(browser.extension.getURL(resourcePath)).then((response) => {
                if (response.ok) {
                    response.text().then(function(content) {
                        resolve(content)
                    })
                } else {
                    console.log('Bad network answer');
                    reject('Bad network answer')
                }
            })
            .catch(function(error) {
                console.log(`Got a problem with the fetch operation ${error.message}`);
                reject(error)
            })
    })

    return promise;
}

function fetchExtensionBlobResource(resourcePath) {
    let promise = new Promise(function(resolve, reject) {
        // Fetching css content
        fetch(browser.extension.getURL(resourcePath)).then((response) => {
                if (response.ok) {
                    response.blob().then(function(content) {
                        let url = URL.createObjectURL(content)
                        resolve(url)
                    })
                } else {
                    console.log('Bad network answer');
                    reject('Bad network answer')
                }
            })
            .catch(function(error) {
                console.log(`Got a problem with the fetch operation ${error.message}`);
                reject(error)
            })
    })

    return promise;
}