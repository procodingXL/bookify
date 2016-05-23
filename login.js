
var app = angular.module("bookify", ['infinite-scroll']);

app.controller("facebook", function ($scope, $window, facebookService) {

    $window.fbAsyncInit = function () {
        FB.init({
            appId: '494568984079229',
            status: true,
            cookie: true,
            xfbml: true,
            version: 'v2.5'
        });
        FB.getLoginStatus(function (response) {
            if (response.status === 'connected') {
                // the user is logged in and has authenticated your
                // app, and response.authResponse supplies
                // the user's ID, a valid access token, a signed
                // request, and the time the access token 
                // and signed request each expire
                console.log("ingelogd");
                getData();
                var uid = response.authResponse.userID;
                var accessToken = response.authResponse.accessToken;
            } else if (response.status === 'not_authorized') {
                // the user is logged in to Facebook, 
                // but has not authenticated your app
            } else {
                console.log("uitgelogd");
            }
        });
    };

    getData = function () {
        facebookService.getData()
          .then(function (response) {
              $scope.last_name = response.last_name;
              console.log($scope.last_name);
              console.log(response.first_name);
              console.log(response.id);
          }
        );
    };



    //javascript
    (function (d, s, id) {
        var js, fjs = d.getElementsByTagName(s)[0];
        if (d.getElementById(id)) return;
        js = d.createElement(s);
        js.id = id;
        js.src = "//connect.facebook.net/nl_NL/sdk.js#xfbml=1&version=v2.6&appId=494568984079229";
        fjs.parentNode.insertBefore(js, fjs);
    }(document, 'script', 'facebook-jssdk'));

    /*
    //Stripe
    $scope.generateToken = function () {
        var form = $('#payment-form');

        // No pressing the buy now button more than once
        form.find('button').prop('disabled', true);

        // Create the token, based on the form object
        Stripe.createToken(form, stripeResponseHandler);
    };

    var stripeResponseHandler = function (status, response) {
        console.log("in responseHandler");
        var form = $('#payment-form');

        // Any validation errors?
        if (response.error) {
            // Show the user what they did wrong
            form.find('.payment-errors').text(response.error.message);

            // Make the submit clickable again
            form.find('button').prop('disabled', false);
        } else {
            // Otherwise, we're good to go! Submit the form.

            // Insert the unique token into the form
            $('<input>', {
                'type': 'hidden',
                'name': 'stripeToken',
                'value': response.id
            }).appendTo(form);

            console.log(response.id);
            Stripe.setApiKey('sk_test_zJb3f0ZbLv5NULXBhqXhpzpH');
            //Stripe.setSecretKey('sk_test_zJb3f0ZbLv5NULXBhqXhpzpH');

            var charge = stripe.charges.create({
                amount: 1000, // amount in cents, again
                currency: "eur",
                source: response.id,
                description: "Example charge"
            }, function (err, charge) {
                if (err && err.type === 'StripeCardError') {
                    // The card has been declined
                }
            });

            // Call the native submit method on the form
            // to keep the submission from being canceled
            form.get(0).submit();
          
        }
    };*/
})

app.factory('facebookService', function ($q) {
    return {
        getData: function () {
            var deferred = $q.defer();
            FB.api('/me', {
                fields: 'last_name, first_name'
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

//app.controller("login", function ($scope, $http, $window, facebookService) {
//    console.log("in controller");

//    getMyLastName = function () {
//        facebookService.getMyLastName()
//          .then(function (response) {
//              $scope.last_name = response.last_name;
//              console.log($scope.last_name);
//          }
//        );
//    };
    
//    $window.fbAsyncInit = function () {
//        FB.init({
//            appId: '494568984079229',
//            status: true,
//            cookie: true,
//            xfbml: true,
//            version: 'v2.5'
//        });
//        FB.Event.subscribe('auth.login', function () {
//            window.location = "http://localhost:5610/index.html";
//        });
//    };
    
//    //javascript
//    (function(d, s, id) {
//        var js, fjs = d.getElementsByTagName(s)[0];
//        if (d.getElementById(id)) return;
//        js = d.createElement(s);
//        js.id = id;
//        js.src = "//connect.facebook.net/nl_NL/sdk.js#xfbml=1&version=v2.6&appId=494568984079229";
//        fjs.parentNode.insertBefore(js, fjs);
//    }(document, 'script', 'facebook-jssdk'));

    
//});