var express = require("express");
var bodyparser = require("body-parser");
var stripe = require("stripe")("sk_test_zJb3f0ZbLv5NULXBhqXhpzpH");


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



