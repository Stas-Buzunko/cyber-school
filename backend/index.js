const express = require('express')
const cors = require('cors')
const bodyParser = require('body-parser')
// const admin = require('firebase-admin')
var stripeToken = 'sk_test_mokQLE90JDfe8foUzMRby89E'
var stripe = require('stripe')(stripeToken)


const app = express()
app.use(cors({ credentials: true, origin: true }))
app.use(bodyParser.json())

var passport = require('passport')

// admin.initializeApp({
//   credential: admin.credential.cert({
//     projectId: "dressmate-d0b76",
//     clientEmail: "dressmate@dressmate-d0b76.iam.gserviceaccount.com",
//     privateKey: "-----BEGIN PRIVATE KEY-----\nMIIEvQIBADANBgkqhkiG9w0BAQEFAASCBKcwggSjAgEAAoIBAQCaC4y3JsvwcyXD\nku65w4rRbkBoFZEVHUylquDmMGdm2RH6BXM+tvDtTJzg2+WAMrEPWbKQDRAtrX3q\n1w9YA1iEI1QLgr2b+vp0F3BWA6HRlUTjOXqij7FgR7IHgc7RTjyKvf187HsybY6z\nFZfZAgCgsePBBCyxydEcNdnzBqkoVYYHF1OtovH2sfPRxK149I4t4vP+o7YjMBsj\ndKyvoBSd6Ylq4COC3hH7/ZL0C2OwZ+EGj6SnIh0b3XsLocoP6cNN+rzkX4n/TiSB\nsjmHRZfvQuqqxZEJf3RYwvaVQaw9s0713WkiyM01UVcsIochdOoRqmecRHj2WoBA\nIMDszWNHAgMBAAECggEAbEar/NyPQo6dP6+ajwYMIBMfwElQdgfnJRdMB2CEfb0c\nLqIAFFfgVtuf9Ul7MjXvUHvaz/fupDyrIhNSHKoVYKO4YnLeNbIestT6x+q7piYG\nirSPJ45avfMHBtHN/j7AvUC32UQbgCGTyPrnhcgrisge7z+w7rKNgge0D2diJQ+I\n9iyWJ0UPjxeQOXNmEdsSLdanO9CyKLb3UL9nU0g5cVoISrWHeLIv05kaVv9gRPnd\nPM3cYUzIaDFi+c3XJlVQG+Hqu5dvX5b3kBCBHeG65+DgikuU+ckDV4DGpgZMxsHF\nd8DGEVuBsh+8hc6mNbsguc73rViIjxrGZ83Im9UH8QKBgQDJ2WbV0QlazQe44Nvh\nmNiSrmXaS3NGAsbFIRyJOp8vl62HgoZDemYZ+aaXqV0fJIjcoM2ThRwWft7szq/v\n9E83Mf7b6eLT+cC63PfgW/WfyKOe5X4/0WZGrOyEafZ3jDUSVZZk56iLpImH3NGW\n69zpxDi82E5ma0u/sFVaGnDIyQKBgQDDXw7ZK4ZDToxrNOlPcdKXd0gIYAM07WIP\nq9LAD0z4jidej7qRFA7A/KNoJhkiZ9Bx0A8NVK2SJc/wg3DgfgWleNd9yEDRyqz/\n+FJJIOSm+gO1rSXX//amWLcsgMtLBy9D8qFya/G6xKaKMgckWK/HUr3sKa0uvNr1\n1NUnDCvjjwKBgQCDRphCEVyzKEuQavW2aFDaPQBTE+UZsG6UAK/tdCnZqx0Z18L4\nmd9Tn3FAi87blUhJrW9mNRkKbGMRwm7ccZkffa2SWy/By1oUbefsjAJYdAYuLnWI\njeilqIt+pue74n0VuoJAiAWvJEiqCuxo6mdXxd1cvJVouPmf5s/r9OxLOQKBgA3Y\nGpFBCE6UrlaadT3v7uBUz4Hoa9HAUIaTwmdhri6exCNrQ+kr5q++N0YWDQnnGVo3\nSBnFulb03vtIFSOTSosjOQHswssa9Y9d5VbRQeKjLMge8OORe8Tl3HUG22EBrVO/\nSbl19LcrYDHCwcbNkgcp0dN+UItTTqDE6CXQMvv5AoGAME9R+jJNqrfXIaYRuJXB\nXLNAtRxPN1vClmOBsfHEsgxXh3tfPe4+4BdzJYzZlM7KmiGe8ywjXuu8xYCBFnnG\npUA6bQ89zmBa5hYTAn6l1pSvcRzYaSgrulDjULyudQMsW8Z7Kj7f5GB5LtKRwEqB\nvdUE1+eg/2hDIMejLDD+ol0=\n-----END PRIVATE KEY-----\n"
//   }),
//   databaseURL: "https://dressmate-d0b76.firebaseio.com"
// });



app.post('/charge', (req, res) => {
  const { token, amount } = req.body
  stripe.charges.create({
    amount, // Amount in cents
    currency: 'usd',
    source: token,
    description: 'cyber-academy'
  }, (error, charge) => {
    if (charge.status === 'succeeded') {
      // everything is ok
      console.log('charge is successful')
      res.sendStatus(200)
    } else {
      // something went wrong
      console.log('charge failed')
      res.sendStatus(400)
    }
  })
})


const SteamStrategy = require('passport-steam').Strategy

passport.use(new SteamStrategy({
    returnURL: 'http://localhost:3001/auth/steam/return',
    realm: 'http://localhost:3001/',
    apiKey: 'DA083B7B78BC4F2F6690F3A154A1008D'
  },
  function(identifier, profile, done) {
    // asynchronous verification, for effect...
    process.nextTick(function () {

      // To keep the example simple, the user's Steam profile is returned to
      // represent the logged-in user.  In a typical application, you would want
      // to associate the Steam account with a user record in your database,
      // and return that user instead.
      profile.identifier = identifier;
      return done(null, profile);
    });
  }
));

app.get('/auth/steam',
  passport.authenticate('steam', { failureRedirect: '/' }),
  function(req, res) {
    res.redirect('/');
  });

app.get('/auth/steam/return',
  passport.authenticate('steam', { failureRedirect: '/' }),
  function(req, res) {
    res.redirect('/');
  });
app.listen(3001, function () {
  console.log(`Example app listening on port 3001`)
})
