var app = angular.module('chatApp', []);

app.controller('ChatController', function($scope, websocketService) {
    // When we're using HTTPS, use WSS too.
    var ws_scheme = window.location.protocol == "https:" ? "wss" : "ws";
    var socket_url = ws_scheme + '://' + window.location.host + "/chat" + window.location.pathname;
    
    var ws = websocketService.start(socket_url, function (message) {
        var data = JSON.parse(message.data);
        $scope.$apply(function () {
            $scope.messages.push({timestamp:data.timestamp, handle:data.handle, message:data.message});
        });
    });

    $scope.submitMessage = function() {
        var message = {
            handle: $scope.handle,
            message: $scope.message,
        }
        ws.send(JSON.stringify(message));
        $scope.message = '';
        return false;
    };
});

app.factory('websocketService', function () {
    return {
        start: function (url, callback) {
            var websocket = new WebSocket(url);
            websocket.onopen = function () {
            };
            websocket.onclose = function () {
            };
            websocket.onmessage = function (evt) {
                callback(evt);
            };
            websocket.send = function (message) {
                websocket.send(message);
            }
        }
    }
});
