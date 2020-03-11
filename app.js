const Koa = require('koa');
const router = require('./routes/api/user');
const bodyParser = require('koa-bodyparser');
const passport = require('koa-passport');

const app = new Koa();

app.use(bodyParser());
app.use(passport.initialize());
app.use(passport.session());
// 回调到config文件中的passport.js
require('./config/passport')(passport);

// 配置路由模块
app.use(router.routes()).use(router.allowedMethods());

const PORT = 8090 || process.env.PORT;

app.listen(PORT, () => {
    console.log(`server running on ${PORT}`);
})