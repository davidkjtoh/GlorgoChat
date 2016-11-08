angular.module('chatApp', []).controller('ChatController', function() {
    // When we're using HTTPS, use WSS too.
    var chatform = this;
    var ws_scheme = window.location.protocol == "https:" ? "wss" : "ws";
    var chatsock = new ReconnectingWebSocket(ws_scheme + '://' + window.location.host + "/chat" + window.location.pathname);
    
    chatsock.onmessage = function(message) {
        var data = JSON.parse(message.data);
        var chat = $("#chat")
        var ele = $('<tr></tr>')

        ele.append(
            $("<td></td>").text(data.timestamp)
        )
        ele.append(
            $("<td></td>").text(data.handle)
        )
        ele.append(
            $("<td></td>").text(data.message)
        )
        
        chat.append(ele)
    };

    chatform.submit = function() {
        var message = {
            handle: chatform.handle,
            message: chatform.message,
        }
        chatsock.send(JSON.stringify(message));
        chatform.message = '';
        chatform.message.focus();
        return false;
    });
});
