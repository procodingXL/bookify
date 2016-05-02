
var app = angular.module('bookify').controller('itebooks', ['$scope', '$http', 'itebooks', function ($scope, $http, itebooks) {
    console.log("Creating new itebooks");

    $scope.itebooks = new itebooks();
}]);

//app.controller("booklist", function ($scope) {
//    console.log("Bookify booklist");
//});




// Reddit constructor function to encapsulate HTTP and pagination logic
app.factory('itebooks', function ($http) {
    var itebooks = function () {
        this.items = [];
        this.busy = false;
        this.after = 1;
        console.log("Created object itebooks");
    };

    itebooks.prototype.nextPage = function () {
        console.log("Starting next page");
        if (this.busy) return;
        this.busy = true;

        var url = "http://it-ebooks-api.info/v1/search/php/page/" + this.after;
        $http({
            method: 'GET',
            url: url
        }).success(function (data) {
            console.log(data.Books);
            var items = data.Books;
            for (var i = 0; i < items.length; i++) {
                this.items.push(items[i]);
            }
            this.after++;
            console.log(this.after);
            console.log(url);
            this.busy = false;
        }.bind(this));
    };
    console.log("return itebooks");
    return itebooks;
});

var firebase = angular.module('bookify').controller('firebaseCtrl', ['$scope', '$http', 'facebookService', function ($scope, $http, facebookService) {
    var firebaseDB = new Firebase('https://sizzling-inferno-2458.firebaseio.com/');
    var name, facebookid, premium;
    premium = true;
    
    var userJson = {
        facebookid: facebookid,
        name: name,
        premium: premium,
        books: {

        }
    }
    for (var i = 0; i < 20; i++) {
        var newBook = "book" + i;
        var newValue = "value" + i;
        userJson.books[newBook] = newValue;
    }
    var getFbData = function () {
        facebookService.getData()
          .then(function (response) {
              facebookid = response.id;
              name = response.first_name + response.last_name;
              console.log(response.first_name);
             
          }
        );
        
    }
    getFbData();
    //firebaseDB.push(userJson);
    
}]);

