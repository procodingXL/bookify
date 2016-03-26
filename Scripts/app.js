var app = angular.module("bookify", ['infinite-scroll']);

app.controller("booklist", function ($scope) {
    console.log("Bookify booklist");
});

app.controller("itebooks", function ($scope, $http, itebooks) {
    console.log("Creating new itebooks");

    $scope.itebooks = new itebooks();
  
});


// Reddit constructor function to encapsulate HTTP and pagination logic
app.factory('itebooks', function ($http) {
    var itebooks = function () {
        this.items = [];
        this.busy = false;
        this.after = 1;
    };

    itebooks.prototype.nextPage = function () {
        if (this.busy) return;
        this.busy = true;

        var url = "http://it-ebooks-api.info/v1/search/php/page/"+this.after;
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

    return itebooks;
});

