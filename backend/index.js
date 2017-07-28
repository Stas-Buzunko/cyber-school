const express = require('express')
const cors = require('cors')
const bodyParser = require('body-parser')
const admin = require('firebase-admin')
const stripeToken = 'sk_test_mokQLE90JDfe8foUzMRby89E'
const stripe = require('stripe')(stripeToken)
const Long = require('long')
const app = express()
const axios = require('axios')
const CronJob = require('cron').CronJob
const Promise = require('bluebird')

app.use(cors({ credentials: true, origin: true }))
app.use(bodyParser.json())

const passport = require('passport')
app.use(passport.initialize())

const serviceAccount = require('./key.json')
const env = process.env.NODE_ENV
const front = env === 'development'
  ? 'http://localhost:3000'
  : 'https://cyber-academy.net'

const backend = env === 'development'
  ? 'http://localhost:3001'
  : 'https://server.cyber-academy.net'

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
  databaseURL: 'https://cyber-academy.firebaseio.com'
})

function getDotaStatistics (dotaId) {
  return axios.get(`http://api.opendota.com/api/players/${dotaId}`)
  .then(response => response.data)
}

function toDotaId (steamId) {
  return new Long.fromString(steamId).sub('76561197960265728').toNumber()
}

function createOrUpdateProfile (user) {
  return admin.database().ref('users/' + user.steamId)
  .once('value')
  .then(snapshot => {
    let updates

    const dotaId = toDotaId(user.steamId)
    getDotaStatistics(dotaId)
    .then(statistics => {
      if (snapshot.val() !== null) {
        // update
        updates = {
          avatar: user.profile._json.avatar,
          profileurl: user.profile._json.profileurl,
          displayName: user.profile.displayName,
          statistics
        }
      } else {
        // create

        updates = {
          avatar: user.profile._json.avatar,
          profileurl: user.profile._json.profileurl,
          timecreated: user.profile._json.timecreated,
          displayName: user.profile.displayName,
          timeRegistered: Math.floor(Date.now() / 1000),
          dotaId,
          statistics
        }
      }

      admin.database().ref('users/' + user.steamId).update(updates)
    })
  })
}

function generateToken (steamId) {
  return admin.auth().createCustomToken(steamId)
  .then(customToken => customToken)
}

var job = new CronJob({
  cronTime: '00 46 * * * 0-6',
  onTick: function () {
    var time = Date.now()
    console.log('hello 31')

    admin.database().ref('users').once('value')
    .then(snapshot => {
      const object = snapshot.val()
      const users = object
      Object.keys(users).forEach(id => users[`${id}`].id = id)

      const promisesUsers = Object.values(users).map(user => {
        return Promise.props({
          mmr: axios.get(`https://api.opendota.com/api/players/${user.dotaId}`),
          wl:axios.get(`https://api.opendota.com/api/players/${user.dotaId}/wl`),
          totals: axios.get(`https://api.opendota.com/api/players/${user.dotaId}/totals`),
          userId: user.id
        })
      .then(result => {
        return (result)
      })
    })
      Promise.all(promisesUsers).then(usersData => {
        usersData.forEach(user => {
          const steamId = user.userId
          const mmr = user.mmr.data.mmr_estimate.estimate
          const mmrN = user.mmr.data.mmr_estimate.n
          const data = user.totals.data
          const userData = {
            kda: {
              field: 'kda',
              name: 'KDA (kill, death, assists)',
              values: [
                { date:1499165762407, value:6, n: 453},
                { date:1499175762407, value:2, n: 454},
                { date:1499195762407, value:7, n: 455},
                { date:1499205762407, value:4, n: 456},

                { date:1499285762407, value:17, n: 457},
                { date:1499285762407, value:6, n: 458},
                { date:1499295762407, value:2, n: 459},
                { date:1499295762407, value:7, n: 460},


                { date:1499335762407, value:4, n: 462},
                { date:1499345762407, value:17, n: 463},
                { date:1499355762407, value:6, n: 464},

                { date:1499335762407, value:4, n: 462},
                { date:1499345762407, value:17, n: 463},
                { date:1499355762407, value:6, n: 464},
                { date:1499365762407, value:2, n: 465},

                { date:1499375762407, value:7, n: 466},
                { date:1499575762407, value:4, n: 467},
                { date:1499875762407, value:17, n: 468},

                { date:1500384125882, value:7, n: 469},
                { date:1500384225882, value:4, n: 470},
                { date:1500385225882, value:17, n: 471}


              ]
            },
            gpm: {
              field: 'gpm',
              name: 'GPM (gold per minute)',
              values: []
            },
            xpm: {
              field: 'xpm',
              name: 'XPM (experience per minute)',
              values: []
            },
            lastHits:  {
              field: 'lastHits',
              name: 'Last hits',
              values: []
            },
            denies:  {
              field: 'denies',
              name: 'Denies',
              values: []
            },
            heroDamage:  {
              field: 'heroDamage',
              name: 'Hero damage',
              values: []
            },
            towerDamage: {
              field: 'towerDamage',
              name: 'Tower damage',
              values: []
            },
            mmr: {
              field: 'mmr',
              name: 'MMR',
              values: []
            },
            winRate: {
              field: 'winRate',
              name: 'Win rate',
              values: []
            }
          }

          let newChartStatistic =
          users[`${steamId}`].statistics.chartStatistic ?
          users[`${steamId}`].statistics.chartStatistic :
          userData
          const winN = user.wl.data.win
          const loseN = user.wl.data.lose

          function pushPoint (item, field, fieldName) {
            if (item.field === field) {
              if (users[`${steamId}`].statistics.chartStatistic) {
                if (newChartStatistic[`${fieldName}`].values[(newChartStatistic[`${fieldName}`].values.length - 1)].n !== item.n) {
                  newChartStatistic[`${fieldName}`].values.push({ value: Math.ceil(item.sum / item.n), date: Date.now(), n: item.n })
console.log('rewrite', field, Math.ceil(item.sum / item.n), 'n', item.n, 'user', steamId, 'date', Date.now())
                }
              } else {
                newChartStatistic[`${fieldName}`].values.push({ value: Math.ceil(item.sum / item.n), date: Date.now(), n: item.n })
console.log('rewrite', field, Math.ceil(item.sum / item.n), 'n', item.n, 'user', steamId, 'date', Date.now())

              }
            }
          }

          data.map((item) => {
            pushPoint(item, 'kda', 'kda')
            pushPoint(item, 'gold_per_min', 'gpm')
            pushPoint(item, 'xp_per_min', 'xpm')
            pushPoint(item, 'last_hits', 'lastHits')
            pushPoint(item, 'denies', 'denies')
            pushPoint(item, 'hero_damage', 'heroDamage')
            pushPoint(item, 'tower_damage', 'towerDamage')
          })
          if (users[`${steamId}`].statistics.chartStatistic) {
            if (newChartStatistic.mmr.values[(newChartStatistic.mmr.values.length - 1)].n !== mmrN) {
              newChartStatistic.mmr.values.push({ value: mmr, date: Date.now(), n: mmrN })
              console.log('rewrite mmr', mmr, 'n', mmrN, 'user', steamId, 'date', Date.now())
            }
          } else {
            newChartStatistic.mmr.values.push({ value: mmr, date: Date.now(), n: mmrN })
            console.log('rewrite mmr', mmr, 'n', mmrN, 'user', steamId, 'date', Date.now())
          }

          if (users[`${steamId}`].statistics.chartStatistic) {
            if ((newChartStatistic.winRate.values[(newChartStatistic.winRate.values.length - 1)].winN !== winN) ||
            (newChartStatistic.winRate.values[(newChartStatistic.winRate.values.length - 1)].loseN !== loseN)) {
              const winRate = Math.round(user.wl.data.lose / (user.wl.data.lose + user.wl.data.win) * 100) / 100
              newChartStatistic.winRate.values.push({ value: winRate, date: Date.now(), winN, loseN })
console.log('rewrite winRate', winRate, 'winN', winN, 'loseN', loseN, 'user', steamId, 'date', Date.now())
            }
          } else {
            const winRate = Math.round(user.wl.data.lose / (user.wl.data.lose + user.wl.data.win) * 100) / 100
            newChartStatistic.winRate.values.push({ value: winRate, date: Date.now(), winN, loseN })
console.log('rewrite winRate', winRate, 'winN', winN, 'loseN', loseN, 'user', steamId, 'date', Date.now())
          }

          const newStatistics = users[`${steamId}`].statistics
          newStatistics.chartStatistic = newChartStatistic

          admin.database().ref('users/' + `${steamId}`).update({
            statistics: newStatistics
          })
          // console.log('newStatistics', newStatistics)
        })

      })
    })
  },
  start: false,
  timeZone: 'Europe/Minsk'
})
job.start()

app.post('/charge', (req, res) => {
  const { token, amount, courseId, userId, isVip } = req.body

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
        const { estimate = 0 } = user.statistics.mmr_estimate
          if (isVip) {
            console.log(isVip)
            const { userVipCourses = [] } = user
            admin.database().ref('users/' + userId).update({
              userVipCourses: [
                ...userVipCourses,
                {
                  courseId,
                  validFrom: Math.floor(Date.now() / 1000),
                  validUntil: Math.floor(Date.now() / 1000) + 2 * 30 * 24 * 60 * 60,
                  startMMR: estimate
                }
              ]
            })
          }
          const { userCourses = [] } = user
          admin.database().ref('users/' + userId).update({
            userCourses: [
              ...userCourses,
              {
                courseId,
                validFrom: Math.floor(Date.now() / 1000),
                validUntil: Math.floor(Date.now() / 1000) + 2 * 30 * 24 * 60 * 60,
                startMMR: estimate
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

app.post('/update', (req, res) => {
  const { uid, email } = req.body

  console.log('start update', uid, email)

  admin.auth().updateUser(uid, {
    email
  })
 .then(() => {
    console.log('update successful')
    res.sendStatus(200)
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
      // Promise.all([
      createOrUpdateProfile(request.user)
      generateToken(request.user.steamId)
      .then(customToken => {
      // console.log(result)
        response.redirect(`${front}/login?token=${customToken}`)
      })
    } else {
      response.redirect('/?failed')
    }
  })

app.listen(3001, function () {
  console.log(`Example app listening on port 3001`)
})
