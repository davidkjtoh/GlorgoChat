angular.module('chatApp', []).controller('ChatController', function() {
    // When we're using HTTPS, use WSS too.
    var chatform = this;
    var ws_scheme = window.location.protocol == "https:" ? "wss" : "ws";
    var chatsock = new ReconnectingWebSocket(ws_scheme + '://' + window.location.host + "/chat" + window.location.pathname);
    
    chatsock.onmessage = function(message) {
        var data = JSON.parse(message.data);
        chatform.messages.push({timestamp:data.timestamp, handle:data.handle, message:data.message});
    };

    chatform.submitMessage = function() {
        var message = {
            handle: chatform.handle,
            message: chatform.message,
        }
        chatsock.send(JSON.stringify(message));
        chatform.message = '';
        return false;
    });
});
