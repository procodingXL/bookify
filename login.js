var app = angular.module("bookify", ['infinite-scroll', 'firebase']);
﻿

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
        $scope.userName = "";
        facebookService.getData()
          .then(function (response) {
              $scope.last_name = response.last_name;
              console.log($scope.last_name);
              console.log(response.first_name);
              console.log(response.id);
              $scope.userName = response.first_name;
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



app.controller('paymentController', function ($scope, $http, userService) {

    //$scope.hideForm = false;

    $scope.generateToken = function () {
        var form = $('#payment-form');

        // No pressing the buy now button more than once
        //$scope.submitDis = true;
        form.find('button').prop('disabled', true);

        // Create the token, based on the form object
        Stripe.createToken(form, stripeResponseHandler);

    };

    var stripeResponseHandler = function (status, response) {
        console.log(response);
        var form = $('#payment-form');

        // Any validation errors?
        if (response.error) {
            // Show the user what they did wrong
            //$scope.error = response.error.message;
            form.find('.payment-errors').text(response.error.message);
            // Make the submit clickable again
            form.find('button').prop('disabled', false);
            //$scope.submitDis = false;
        } else {
            // Otherwise, we're good to go! Submit the form.

             //Insert the unique token into the form
            $('<input>', {
                'type': 'hidden',
                'name': 'stripeToken',
                'value': response.id
            }).appendTo(form);
          

            console.log(response.id);

            console.log(form.get(0));
            //form.get(0).submit();
            
            $http({
                method: 'POST',
                url: 'http://localhost:3000/api/posts',
                data: $('#payment-form').serialize(),
                headers: { 'Content-Type': 'application/x-www-form-urlencoded' }
            }).
                then(function (response) {
                    console.log(response.data);
                    //if (response.data == "Transaction completed") {
                    //    $scope.msgCompleted = response.data;
                    //    $scope.hideForm = true;
                    //} else {
                    //    form.find('.payment-errors').text(response.data);
                    //    form.find('button').prop('disabled', false);
                        
                    //} 
                    
                    if (response.data == "Transaction completed")
                    {
                        firebaseDB.child("users").child(userService.authData.uid).update({
                            premium: true

                        })
                    }
                
                    $scope.msgCompleted = response.data;
                    $scope.hideForm = true;
                });

        }
    };
})

