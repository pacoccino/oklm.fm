angularApp.directive('clickout', ['$timeout', function($timeout) {

    return {
        restrict: 'A',
        scope: { clickoutFn: '&' },
        link: function(scope, element) {
            var checkMe = function(event) {
                if(element.find(event.target).length !== 0) {
                    return;
                }
                if($(event.target).hasClass('coo')) {
                    return;
                }
                $timeout(function() {
                    scope.clickoutFn()();
                });
            };

            $(document).click(checkMe);
        }
    };
}]);