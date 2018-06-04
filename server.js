/**
 * Created by fairy.
 */ 
var express = require('express');
var app = express();
var bodyParser = require('body-parser');
var morgan = require('morgan');
var config = require('./config'); //读取配置文件config.js信息
var Client = require('./app/models/client'); //获取 User model 信息

// 配置
// =============================================================================
var port = process.env.PORT || 3333; 
// 允许跨域
app.all('*', function(req, res, next) {
    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Headers", "X-Requested-With");
    res.header("Access-Control-Allow-Methods","PUT,POST,GET,DELETE,OPTIONS");
    res.header("X-Powered-By",' 3.2.1')
    res.header("Content-Type", "application/json;charset=utf-8");
    next();
});
app.set('superSecret', config.secret); // 设置app 的超级密码--用来生成摘要的密码

//用body parser 来解析post和url信息中的参数
app.use(bodyParser.urlencoded({
    extended: false
}));
app.use(bodyParser.json());

// 使用 morgan 将请求日志打印到控制台
app.use(morgan('dev'));

 
// =============================================================================
//路由定义

// 基础路由
app.get('/', function (req, res) {
    res.send('Hello! The API is at http://localhost:' + port + '/api');
});
// 获取express Router的实例
var router = express.Router(); 
// 任何路由的每次request都执行
router.use(function (req, res, next) {
    // 打印
    console.log('Something is happening.');
    next(); // 在这里会将request交给下一个中间件，如果这个中间件后面没有其他中间件，请求会交给匹配的路由作处理
});
// API路由
router.get('/', function (req, res) {
    res.json({
        message: 'hooray! welcome to our api!'
    });
});

/**
 * KIS client  
 *  @param :district. :commodity
 *  @return 返回指定地区的kis 客户list
 * 
 */
var formatRes = function (data) {
    return {
        "success": true,
        "result": data
    }
}
router.route('/kisbydistr/:district').get(function (req, res) {
    district = req.params.district.replace(/^\s+|\s+$/g, "");
    res.json(formatRes(Client.getKISByDistr(district)));
});
router.route('/kisclient').get(function (req, res) {
    res.json(formatRes(Client.getAllKIS()));
});

router.route('/kisbycommodity/:commodity').get(function (req, res) {
    commodity = req.params.commodity.replace(/^\s+|\s+$/g, "");
    res.json(formatRes(Client.getKISByCommodity(commodity)));
});


/**
 * CERP client  
 * 
 */
router.route('/cerpbydistr/:district').get(function (req, res) {
    district = req.params.district.replace(/^\s+|\s+$/g, "");
    res.json(formatRes(Client.getCERPByDistr(district)));
});

router.route('/cerpclient').get(function (req, res) {
    res.json(formatRes(Client.getAllCERP()));
});

router.route('/cerpbyindustry/:industry').get(function (req, res) {
    industry = req.params.industry.replace(/^\s+|\s+$/g, "");
    res.json(formatRes(Client.getCERPByIndustry(industry)));
});


// 所有的路由都会加上前缀 /api
app.use('/api', router);

// =======================
// 启动服务 ======
// =======================
app.listen(port);
console.log('Magic happens at http://localhost:' + port);