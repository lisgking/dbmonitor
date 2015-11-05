define([],function(){
	 var callbacks = [],
        running = false;

    // fired on resize event
    function resize() {
        if (!running) {
            running = true;
            if (window.requestAnimationFrame) {
                window.requestAnimationFrame(runCallbacks);
            } else {
                setTimeout(runCallbacks, 66);
            }
        }
    };

    // run the actual callbacks
    function runCallbacks() {
        callbacks.forEach(function(callback) {
            callback();
        });
        running = false;
    };

    // adds callback to loop
    function addCallback(callback) {
        if (callback) {
            callbacks.push(callback);
        }
    };

    return {
        // initalize resize event listener
        init: function(callback) {
            window.addEventListener('resize', resize);
            addCallback(callback);
        },

        // public method to add additional callback
        add: function(callback) {
            addCallback(callback);
        }
    };
});
