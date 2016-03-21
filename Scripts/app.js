var app = angular.module("bookify", []);

app.controller("booklist", function ($scope) {

});

app.controller("itebooks", function ($scope,$http) {
    console.log("inside itebooks controller");
    $http({
        method: 'GET',
        url: 'http://it-ebooks-api.info/v1/'
    }).then(function successCallback(response) {
        //when successfull
        console.log(response);
    }, function errorCallback(response) {
        //when failed
    });
});