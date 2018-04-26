var browser = browser || chrome

var toggle = document.querySelector('input[type="checkbox"]');
browser.storage.sync.get('activated', function(value){
    if(value.activated){
        toggle.checked = true
    }
    else{
        toggle.checked = false        
    }
})


document.addEventListener('DOMContentLoaded', function () {
    
    toggle.addEventListener('change', function () {
        if (toggle.checked) {
            browser.storage.sync.set({
                activated: true
            });
        } else {
            browser.storage.sync.set({
                activated: false
            });
        }
    });
});