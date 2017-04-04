const express = require('express')
const cors = require('cors')
const bodyParser = require('body-parser')
const admin = require('firebase-admin')
const stripeToken = 'sk_test_mokQLE90JDfe8foUzMRby89E'
const stripe = require('stripe')(stripeToken)

const app = express()
app.use(cors({ credentials: true, origin: true }))
app.use(bodyParser.json())

const passport = require('passport')
app.use(passport.initialize())

const serviceAccount = require('./key.json')
const env = process.env.NODE_ENV || 'development'
const front = env === 'development'
  ? 'http://localhost:3000'
  : 'https://cyber-academy.firebaseapp.com'

const backend = env === 'development'
  ? 'http://localhost:3001'
  : 'https://cyber-academy.tk'

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
  databaseURL: 'https://cyber-academy.firebaseio.com'
})

function createOrUpdateProfile (user) {
  admin.database().ref('users/' + user.steamId)
  .once('value')
  .then(snapshot => {
    let updates

    if (snapshot.val() !== null) {
      // update
      updates = {
        avatar: user.profile._json.avatar,
        profileurl: user.profile._json.profileurl,
        displayName: user.profile.displayName
      }
    } else {
      // create
      updates = {
        avatar: user.profile._json.avatar,
        profileurl: user.profile._json.profileurl,
        timecreated: user.profile._json.timecreated,
        displayName: user.profile.displayName,
        timeRegistered: Math.floor(Date.now() / 1000)
      }
    }

    admin.database().ref('users/' + user.steamId).update(updates)
  })
}

function generateToken (steamId) {
  return admin.auth().createCustomToken(steamId)
  .then(customToken => customToken)
}

app.post('/charge', (req, res) => {
  const { token, amount, courseId, userId } = req.body

  stripe.charges.create({
    amount, // Amount in cents
    currency: 'usd',
    source: token,
    description: 'cyber-academy'
  }, (error, charge) => {
    if (charge.status === 'succeeded') {
      // everything is ok
      console.log('charge is successful')

      // add access to course
      // read course length in the future
      admin.database().ref('users/' + userId).once('value')
      .then(snapshot => {

        const user = snapshot.val()
        if (user !== null) {
          const { userCourses = [] } = user

          admin.database().ref('users/' + userId).update({
            userCourses: [
              ...userCourses,
              {
                courseId,
                validFrom: Math.floor(Date.now() / 1000),
                validUntil: Math.floor(Date.now() / 1000) + 2 * 30 * 24 * 60 * 60
              }
            ]
          })
        }
      })

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
  returnURL: `${backend}/auth/steam/return`,
  realm: backend,
  apiKey: '36046F0A7375F30D33BBC38FE19C0225'
},
  function (identifier, profile, done) {
    process.nextTick(function () {
      var user = {
        identifier: identifier,
        steamId: identifier.match(/\d+$/)[0],
        profile: profile
      }

      return done(null, user)
    })
  }
))

passport.serializeUser(function (user, done) {
  done(null, user.identifier)
})

passport.deserializeUser(function (identifier, done) {
    // For this demo, we'll just return an object literal since our user
    // objects are this trivial.  In the real world, you'd probably fetch
    // your user object from your database here.
  done(null, {
    identifier: identifier,
    steamId: identifier.match(/\d+$/)[0]
  })
})

app.get('/auth/steam',
  passport.authenticate('steam', { failureRedirect: '/' }),
  function (req, res) {
    res.redirect('/')
  })

app.get('/auth/steam/return', passport.authenticate('steam'),
  function (request, response) {
    if (request.user) {
      createOrUpdateProfile(request.user)
      generateToken(request.user.steamId)
      .then(customToken =>
        response.redirect(`${front}/login?token=${customToken}`)
      )
    } else {
      response.redirect('/?failed')
    }
  })

app.listen(3001, function () {
  console.log(`Example app listening on port 3001`)
})
