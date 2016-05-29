
var firebaseDB = new Firebase('https://sizzling-inferno-2458.firebaseio.com/');
var UserExists = true;
var premium = false;

var app = angular.module('bookify').controller('itebooks', ['$scope', '$http', 'itebooks', 'userService', function ($scope, $http, itebooks, userService) {
    console.log("Creating new itebooks");
    $scope.addBook = userService.addBook;
    $scope.premium = userService.premium;
    $scope.itebooks = new itebooks();
}]);


function authDataCallback(authData) {
    if (authData) {
        console.log("User " + authData.uid + " is logged in with " + authData.provider);
    } else {
        console.log("User is logged out");
    }
}

app.factory('userService', function ($http) {

    var User = {};

    User.authData;

    var userData = {
        //facebookid: facebookid,
        name: "bob lolz",
        firstname: "bob",
        lastname: "lolz",
        premium: true,
        books: {
            "lolz": {
                name: "name"
            }

        }
    }
    User.data = userData;
    User.updateName = function (firstName, lastName) {
        userData.name = firstName + lastName;
        userData.firstname = firstName || "nog";
        userData.lastname = lastName || "niks";
        
        firebaseDB.push(User.data);
    }
    User.updateFBID = function (fbId) {
        userData.fbid = fbId;
    }

    User.addBook = function (book) {
        console.log("add book");
        if (User.authData) {
            //authData = User.AuthData;
            //authData has data
            bookID = book.ID;

            firebaseDB.child("users").child(User.authData.uid).child("books").child(book.ID).set({
                ID: book.ID,
                Title: book.Title
            })
        }
    }
    User.premium = function () {

        firebaseDB.child("users").child(User.authData.uid).update({
            premium: premium

        })
        premium = !premium;
    }


    return User;
})
app.factory('itebooks', function ($http) {
    var itebooks = function () {
        this.items = [];
        this.busy = false;
        this.after = 1;
    };

    itebooks.prototype.nextPage = function () {
        if (this.busy) return;
        this.busy = true;

        var url = "http://it-ebooks-api.info/v1/search/php/page/" + this.after;
        $http({
            method: 'GET',
            url: url
        }).success(function (data) {
            var items = data.Books;
            for (var i = 0; i < items.length; i++) {
                this.items.push(items[i]);
            }
            this.after++;
            this.busy = false;
        }.bind(this));
    };
    return itebooks;
});

var firebase = angular.module('bookify').controller('firebaseCtrl', ['$scope', '$http', 'facebookService', '$firebaseObject', 'userService', function ($scope, $http, facebookService, $firebaseObject, userService) {
    //var firebaseDB = new Firebase('https://sizzling-inferno-2458.firebaseio.com/');
    //check if user exists
    firebaseDB.onAuth(function (authData) {
        console.log("authData");
        console.log(authData);
        if (authData) {
            firebaseDB.child('users').child(authData.uid).once("value", function (snapshot) {
                UserExists = (snapshot.val() !== null);
            })
        }
        if (authData && !UserExists) {
            //new user so create his node on the server
            firebaseDB.child("users").child(authData.uid).set({
                provider: authData.provider,
                name: authData.facebook.displayName,
                premium: false
                
            });
            userService.authData = authData;
        }
        else if (authData && UserExists) {
            //user already exists only update database
            firebaseDB.child("users").child(authData.uid).update({
                provider: authData.provider,
                name: authData.facebook.displayName,
                premium:false
            });
            userService.authData = authData;
        }
    });
    firebaseDB.authWithOAuthPopup("facebook", function (error, authData) {
        if (error) {
            console.log("login failed", error);
        } else {
            console.log("succes", authData);
        }
    })


    var name, facebookid, premium;
    name = "john";

    premium = true;
    $scope.data = $firebaseObject(firebaseDB);

  

}]);

