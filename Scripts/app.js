
var firebaseDB = new Firebase('https://sizzling-inferno-2458.firebaseio.com/');
var isNewUser = true;
firebaseDB.onAuth(function (authData) {
    if (authData && isNewUser) {
        // save the user's profile into the database so we can list users,
        // use them in Security and Firebase Rules, and show profiles
        firebaseDB.child("users").child(authData.uid).set({
            provider: authData.provider,
            name: authData.facebook.displayName
        });
    }
});

var app = angular.module('bookify').controller('itebooks', ['$scope', '$http', 'itebooks', function ($scope, $http, itebooks) {
    console.log("Creating new itebooks");

    $scope.itebooks = new itebooks();
}]);

//app.controller("booklist", function ($scope) {
//    console.log("Bookify booklist");
//});
function authDataCallback(authData) {
    if (authData) {
        console.log("User " + authData.uid + " is logged in with " + authData.provider);
    } else {
        console.log("User is logged out");
    }
}

app.factory('userService', function ($http) {
   
    var User = {};
   
 
    
    var userData = {
        //facebookid: facebookid,
        name: "bob lolz",
        firstname : "bob",
        lastname : "lolz",
        premium: true,
        books: {
            "book1": "goed boek",
            "boek2" : "geen goed boek"
        }
    }
    User.data = userData;
    User.updateName = function (firstName, lastName) {
        userData.name = firstName + lastName;
        userData.firstname = firstName || "nog";
        userData.lastname = lastName || "niks";
        //ref.once("value", function (snapshot) {
        //    if (snapshot.child("fbid").exists()) {
        //        console.log("fbid does exist");
        //    } else {
        //        console.log("fbid does not exist");
        //    }
        //});
        firebaseDB.push(User.data);
    }
    User.updateFBID = function (fbId) {
        userData.fbid = fbId;
    }
    User.log = function () {
        console.log("userData.log called");
        console.log(userData);
    }
    
    return User;
})
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

var firebase = angular.module('bookify').controller('firebaseCtrl', ['$scope', '$http', 'facebookService', '$firebaseObject','userService', function ($scope, $http, facebookService, $firebaseObject, userService) {
    //var firebaseDB = new Firebase('https://sizzling-inferno-2458.firebaseio.com/');
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
    console.log("userService");
    console.log(userService);
    userService.log();
    
    //for (var i = 0; i < 20; i++) {
    //    var newBook = "book" + i;
    //    var newValue = "value" + i;
    //    userJson.books[newBook] = newValue;
    //}
    //console.log(userJson);
    //console.log("Logged UserJSON object");
    //userJson.Testing = "added new data";
    ////console.log(userJson);
    //console.log("Logged UserJSON object after adding data");
    //firebaseDB.push(userService.data);
    //var getFbData = function () {
    //    facebookService.getData()
    //      .then(function (response) {
    //          facebookid = response.id;
    //          name = response.first_name + response.last_name;
    //          console.log(response.first_name);
             
    //      }
    //    );
        
    //}
    //getFbData();
    //firebaseDB.push(userJson);
    
}]);

