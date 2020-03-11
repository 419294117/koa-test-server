const router = require('koa-router')();
const {
    query
} = require("../../mysql/index");

const encryption = require('../../config/encryption');
const bcrypt = require('bcryptjs');

const gravatar = require('gravatar');

const sql = require("../../sql/index");

const jwt = require("jsonwebtoken");

const keys = require("../../config/default");
const passport = require('koa-passport');

router.get("/", async (ctx, next) => {
    let rs = await query("SELECT * FROM user");
    console.log(rs);
    ctx.body = rs;
})
/**
 * 注册接口
 */
router.post('/register', async (ctx, next) => {
    // ctx.body = ctx.request.body;
    const result = await query(sql.conditionsSql, ['email', ctx.request.body.email]);
    if (result.length > 0) {
        // 查询到
        ctx.status = 500;
        ctx.body = {
            msg: "邮箱已被占用"
        }
    } else {
        // 没查询到
        const newUser = {
            email: ctx.request.body.email,
            name: ctx.request.body.name,
            password: encryption.encrypt(ctx.request.body.password),
            avatar: gravatar.url(ctx.request.body.email, {
                s: '200',
                r: 'pg',
                d: 'mm'
            })
        }
        console.log(newUser);
        const rs = await query(sql.insertSql, Object.values(newUser));
        console.log(rs);
        if (rs.affectedRows > 0) {
            ctx.status = 200;
            ctx.body = {
                code: 1,
                msg: "注册成功"
            }
        } else {
            ctx.status = 500;
            ctx.body = {
                code: 0,
                msg: "注册失败"
            }
        }
    }
});

/**
 * 登录
 */
router.post('/login', async (ctx, next) => {
    const user = await query(sql.conditionsSql, ['email', ctx.request.body.email]);
    console.log(user);
    if (user.length > 0) {
        var flag = bcrypt.compareSync(ctx.request.body.password, user[0].password); // true
        if (flag) {
            // 返回token
            const payload = {
                id: user[0].id,
                name: user[0].name,
                avatar: user[0].avatar,
                email: user[0].email,
            };
            const token = jwt.sign(payload, keys.secretOrKey, {
                expiresIn: 3600
            });

            ctx.status = 200;
            ctx.body = {
                code: 1,
                token: "Bearer " + token,
                msg: "密码验证成功"
            }
        } else {
            ctx.status = 400;
            ctx.body = {
                code: 0,
                msg: "密码错误"
            }
        }
    } else {
        ctx.status = 404;
        ctx.body = {
            code: 0,
            msg: "用户不存在"
        }
    }
});

/**
 * 返回用户信息  验证token
 */
router.get('/current', passport.authenticate('jwt', {
    session: false
}), async (ctx, next) => {
    console.log(ctx.state.user)
    ctx.body = {
        id: ctx.state.user[0].id,
        email: ctx.state.user[0].email,
        name: ctx.state.user[0].name,
        avatar: ctx.state.user[0].avatar,
    }
})

module.exports = router;