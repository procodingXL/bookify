var app = angular.module("bookify", []);

app.factory('facebookService', function ($q) {
    return {
        getMyLastName: function () {
            var deferred = $q.defer();
            FB.api('/me', {
                fields: 'last_name'
            }, function (response) {
                if (!response || response.error) {
                    deferred.reject('Error occured');
                } else {
                    deferred.resolve(response);
                }
            });
            console.log(deferred.promise);
            return deferred.promise;
        }
    }
});

app.controller("login", function ($scope, $http, $window, facebookService) {
    console.log("in controller");

    getMyLastName = function () {
        facebookService.getMyLastName()
          .then(function (response) {
              $scope.last_name = response.last_name;
              console.log($scope.last_name);
          }
        );
    };
    
    $window.fbAsyncInit = function () {
        FB.init({
            appId: '494568984079229',
            status: true,
            cookie: true,
            xfbml: true,
            version: 'v2.5'
        });
        FB.Event.subscribe('auth.login', function () {
            window.location = "http://localhost:5610/index.html";
        });
    };
    
    //javascript
    (function(d, s, id) {
        var js, fjs = d.getElementsByTagName(s)[0];
        if (d.getElementById(id)) return;
        js = d.createElement(s);
        js.id = id;
        js.src = "//connect.facebook.net/nl_NL/sdk.js#xfbml=1&version=v2.6&appId=494568984079229";
        fjs.parentNode.insertBefore(js, fjs);
    }(document, 'script', 'facebook-jssdk'));

    
});