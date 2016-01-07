angularApp.controller('Ctrl', ['$scope', function($scope) {
    $scope.song = {};
    $scope.motto = "Radio Pirate";
    $scope.history = [];
    $scope.historyOpened = false;

    $scope.openHistory = function() {
        $scope.historyOpened = true;
    };
    $scope.closeHistory = function() {
        $scope.historyOpened = false;
    };
}]);