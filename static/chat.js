var app = angular.module('chatApp', []);

app.controller('ChatController', function($scope, socket) {
    // When we're using HTTPS, use WSS too.
    var ws_scheme = window.location.protocol == "https:" ? "wss" : "ws";
    var socket_url = ws_scheme + '://' + window.location.host + "/chat" + window.location.pathname;
    socket.ws = new WebSocket(socket_url);
    
    socket.onmessage(function(message) {
        var data = JSON.parse(message.data);
        $scope.messages.push({timestamp:data.timestamp, handle:data.handle, message:data.message});
    });

    $scope.submitMessage = function() {
        var message = {
            handle: $scope.handle,
            message: $scope.message,
        }
        socket.send(message);
        $scope.message = '';
        return false;
    };
});

app.factory('socket', [function() {
    var stack = [];
    var onmessageDefer;
    socket = {
        ws: new WebSocket(),
        send: function(data) {
            data = JSON.stringify(data);
            if (socket.ws.readyState == 1) {
                socket.ws.send(data);
            } else {
                stack.push(data);
            }
        },
        onmessage: function(callback) {
            if (socket.ws.readyState == 1) {
                socket.ws.onmessage = callback;
            } else {
                onmessageDefer = callback;
            }
        }
    };
    socket.ws.onopen = function(event) {
        for (i in stack) {
            socket.ws.send(stack[i]);
        }
        stack = [];
        if (onmessageDefer) {
            socket.ws.onmessage = onmessageDefer;
            onmessageDefer = null;
        }
    };
    return socket;
}]);
