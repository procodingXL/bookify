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
        snapshot.forEach(function (childSnapshot) {
            var childData = childSnapshot.val();
            var allbooks = childSnapshot.child("books");
            //console.log(childSnapshot.child("books").numChildren());
            var counter = 0;
            allbooks.forEach(function (test) {

                if (array[counter] !== undefined) {
                    console.log("already in there");
                    console.log(array[counter].id);
                    console.log(test.child("ID").val());
                    for (var i = 0; i < array.length; i++) {
                        if (array[i].id == test.child("ID").val()) {
                            console.log("real duplicate");
                            array[i].times++;
                            array[i].title = test.child("Title").val();
                        }
                    }
                    //if (array[counter].id == test.child("ID").val()) {
                    //    console.log("real duplicate");
                    //    array[counter].times++;
                    //    array[counter].title = test.child("Title").val();
                    //}
                }
                else {
                    console.log("new book ");
                    //item not in array need to be added
                    //test.child("ID").val()
                    array.push({
                        id: test.child("ID").val(),
                        times: 1,
                        title: test.child("Title").val()
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

app.get("/api/premium", function (req, res) {
    array = [];

    ref.once("value", function (snapshot) {
        //get all books to determine the top x books
        snapshot.forEach(function (childSnapshot) {
            var childData = childSnapshot.val();
            var allbooks = childSnapshot.child("books");
            //console.log(childSnapshot.child("books").numChildren());
            var counter = 0;
            allbooks.forEach(function (test) {
                if (array[counter] !== undefined) {
                    if (array[counter].id == test.child("ID").val()) {
                        //console.log("real duplicate");
                        array[counter].times++;
                    }
                }
                else {
                    //item not in array need to be added
                    test.child("ID").val()
                    array.push({
                        id: test.child("ID").val(),
                        times: 1

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
})






