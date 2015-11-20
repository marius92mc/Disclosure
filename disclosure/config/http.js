/**
 * HTTP Server Settings
 * (sails.config.http)
 *
 * Configuration for the underlying HTTP server in Sails.
 * Only applies to HTTP requests (not WebSockets)
 *
 * For more information on configuration, check out:
 * http://sailsjs.org/#!/documentation/reference/sails.config/sails.config.http.html
 */

 var passport = require('passport');
 var FacebookStrategy = require('passport-facebook');
 var verify =  function (token, tokenSecret, profile, done) {
    console.log(token);
    return done(profile);

 };

module.exports.http = {

  /****************************************************************************
  *                                                                           *
  * Express middleware to use for every Sails request. To add custom          *
  * middleware to the mix, add a function to the middleware config object and *
  * add its key to the "order" array. The $custom key is reserved for         *
  * backwards-compatibility with Sails v0.9.x apps that use the               *
  * `customMiddleware` config option.                                         *
  *                                                                           *
  ****************************************************************************/


   customMiddleware: function(app) {

        app.use(passport.initialize());
        app.use(passport.session());

        passport.serializeUser(function (user, done) {
            // console.log("serializeUser", user);
            done(null, user);
        });

        passport.deserializeUser(function (obj, done) {

            done(null, obj);
        });

        console.log('init express middleware');
        passport.use(new FacebookStrategy({
            clientID: '937702679657157',
            clientSecret: 'ead4ac09cac850d7070f88a7f99d44d3',
            callbackURL: 'http://localhost:1337/auth/facebook/callback',
            profileFields: ['id', 'displayName', 'name', 'gender', 'picture', 'emails']
        },
        // facebook will send back the tokens and profile
        function(access_token, refresh_token, profile, done) {

            User.count({id: profile.id}).exec(function(error, found) {
              if(error)
                console.log(error);
              if(found === 0) {
                var user = {
                  id: profile.id,
                  name: profile.displayName,
                  photo: profile.photos[0].value,
                  provider: profile.provider
                };
                User.create(user, function(err, model) {
                  if(err)
                    console.log(err);
                });
              }
            });

            return done(null, profile);
        }));

        app.get('/auth/facebook', passport.authenticate('facebook', {authType: 'reauthenticate'}));
        app.get('/auth/facebook/callback', passport.authenticate('facebook', { failureRedirect: '/', successRedirect: '/hello' }));
   }




  /***************************************************************************
  *                                                                          *
  * The order in which middleware should be run for HTTP request. (the Sails *
  * router is invoked by the "router" middleware below.)                     *
  *                                                                          *
  ***************************************************************************/

    // order: [
    //   'startRequestTimer',
    //   'cookieParser',
    //   'session',
    //   'myRequestLogger',
    //   'bodyParser',
    //   'handleBodyParserError',
    //   'compress',
    //   'methodOverride',
    //   'poweredBy',
    //   '$custom',
    //   'router',
    //   'www',
    //   'favicon',
    //   '404',
    //   '500'
    // ],

  /****************************************************************************
  *                                                                           *
  * Example custom middleware; logs each request to the console.              *
  *                                                                           *
  ****************************************************************************/

    // myRequestLogger: function (req, res, next) {
    //     console.log("Requested :: ", req.method, req.url);
    //     return next();
    // }


  /***************************************************************************
  *                                                                          *
  * The body parser that will handle incoming multipart HTTP requests. By    *
  * default as of v0.10, Sails uses                                          *
  * [skipper](http://github.com/balderdashy/skipper). See                    *
  * http://www.senchalabs.org/connect/multipart.html for other options.      *
  *                                                                          *
  ***************************************************************************/

    // bodyParser: require('skipper')

  // },

  /***************************************************************************
  *                                                                          *
  * The number of seconds to cache flat files on disk being served by        *
  * Express static middleware (by default, these files are in `.tmp/public`) *
  *                                                                          *
  * The HTTP static cache is only active in a 'production' environment,      *
  * since that's the only time Express will cache flat-files.                *
  *                                                                          *
  ***************************************************************************/

  // cache: 31557600000
};