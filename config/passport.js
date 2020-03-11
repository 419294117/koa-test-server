const JwtStrategy = require('passport-jwt').Strategy,
    ExtractJwt = require('passport-jwt').ExtractJwt;
const keys = require("./default");
const sql = require('../sql/index');
const opts = {};
const {
    query
} = require("../mysql/index");
opts.jwtFromRequest = ExtractJwt.fromAuthHeaderAsBearerToken();
opts.secretOrKey = keys.secretOrKey;
module.exports = passport => {
    // console.log(passport);
    passport.use(new JwtStrategy(opts, async function (jwt_payload, done) {
        const user = await query(sql.conditionsSql, ["id",jwt_payload.id]);
        if (user) {
            return done(null, user);
        } else {
            return done(null, false);
        }
        // User.findOne({
        //     id: jwt_payload.sub
        // }, function (err, user) {
        //     if (err) {
        //         return done(err, false);
        //     }
        //     if (user) {
        //         return done(null, user);
        //     } else {
        //         return done(null, false);
        //     }
        // });
    }));
}