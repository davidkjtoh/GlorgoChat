angular.module('chatApp', []).controller('ChatController', function($scope) {
    // When we're using HTTPS, use WSS too.
    var ws_scheme = window.location.protocol == "https:" ? "wss" : "ws";
    var chatsock = new ReconnectingWebSocket(ws_scheme + '://' + window.location.host + "/chat" + window.location.pathname);
    
    chatsock.onmessage = function(message) {
        var data = JSON.parse(message.data);
        $scope.message = 'RECEIVED';
        $scope.messages.push({timestamp:data.timestamp, handle:data.handle, message:data.message});
    };

    $scope.submitMessage = function() {
        var message = {
            handle: $scope.handle,
            message: $scope.message,
        }
        chatsock.send(JSON.stringify(message));
        $scope.message = '';
        return false;
    };
});
