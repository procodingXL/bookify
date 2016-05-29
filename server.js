var express = require("express");
var bodyparser = require("body-parser");
var stripe = require("stripe")("sk_test_zJb3f0ZbLv5NULXBhqXhpzpH");
var Firebase = require("firebase");
var array = [];

var FirebaseConfig = {
    serviceAccount: "credentials.json",
    databaseURL: "https://sizzling-inferno-2458.firebaseio.com",
}

Firebase.initializeApp(FirebaseConfig);
var db = Firebase.database();
var ref = db.ref("users");



var app = express();

app.use(bodyparser.json());
app.use(bodyparser.urlencoded({ extended: true }));

app.use(function (req, res, next) {
    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
    next();
});

app.listen(3000);

app.post("/api/posts", function (req, res) {
    console.log('in post--server');
    var stripeToken = req.body.stripeToken;
    console.log(req.body);
    console.log(stripeToken);
    var charge = stripe.charges.create({
        amount: 1000, // amount in cents
        currency: "eur",
        source: stripeToken,
        description: "Example charge"
    }, function (err, charge) {
        if (err && err.type === 'StripeCardError') {
            res.send("The card has been declined");
        } else if (err) {
            res.send("Something went wrong");
        }
        else res.send("Transaction completed");
    });
});

app.get("/api/top:number", function (req, res) {
    array = [];
    ref.once("value", function (snapshot) {
        //get all books to determine the top x books
        snapshot.forEach(function (SnapshotUsers) {
            var childData = SnapshotUsers.val();
            var allbooks = SnapshotUsers.child("books");
            var counter = 0;
            allbooks.forEach(function (SnapshotBooks) {

                if (array[counter] !== undefined) {
                    console.log("already in there");
                    console.log(array[counter].id);
                    console.log(SnapshotBooks.child("ID").val());
                    for (var i = 0; i < array.length; i++) {
                        if (array[i].id == SnapshotBooks.child("ID").val()) {
                            console.log("real duplicate");
                            array[i].times++;
                            array[i].title = SnapshotBooks.child("Title").val();
                        }
                    }

                }
                else {
                    console.log("new book ");
                    //item not in array need to be added
                    array.push({
                        id: SnapshotBooks.child("ID").val(),
                        times: 1,
                        title: SnapshotBooks.child("Title").val()
                    });
                }
                counter++;
            })

        })

        array.sort(function (a, b) {
            return parseFloat(b.times) - parseFloat(a.times);
        });
        res.send(array.slice(0, req.params.number));
        console.log(array.slice(0, req.params.number));

    })
});
app.delete("/api/remove/:id", function (req, res) {
    
    if (req.params.id.indexOf("facebook:") >-1) {
        console.log("it is correct");
        var userref = ref.child(req.params.id);
        var userName;
        userref.once("value", function (snapshot) {
            console.log("once");
            console.log(snapshot.val());
            userName = snapshot.child("name").val();
            if (userName != null) {
                console.log("we have removed user " + userName);
                res.send("we have removed user " + userName);
                userref.remove();
            } else {
                res.send("Sorry we cannot delete the user");
            }
            
        })
    }else{
        console.log("it is not correct");
        res.send("Sorry we cannot delete the user");
    }
   

//userName = userref.child("name").val();

    
});

app.get("/api/premium", function (req, res) {

    ref.once("value", function (snapshot) {
        //get all books to determine the top x books
        var total = 0, premium = 0, nonpremium = 0;

        snapshot.forEach(function (childSnapshot) {
            var childData = childSnapshot.val();
            var allpremium = childSnapshot.child("premium");
            if (allpremium.val())
                premium++;
            else
                nonpremium++;
            total++;
        })
        var percent = (((nonpremium - premium) / nonpremium) * 100);
        var premiumPercentage = ((premium / total) * 100).toFixed(0);
        var nonpremiumPercentage = ((nonpremium / total) * 100).toFixed(0);
        var output = {
            premiumUsers: premium,
            nonPremiumUsers: nonpremium,
            premiumUsersPercentage: premiumPercentage,
            nonPremiumUsersPercentage: nonpremiumPercentage,
            totalUsers: total
        }
        console.log(output);
        res.json(output);

    })

})






