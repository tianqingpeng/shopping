var express = require('express');
var help = require('../common/dbHelper');
var router = express.Router();

router.get('/', function(req, res, next) {
  res.render('index', { title: 'Express' });
});

//注册
router.get('/register', function(req, res) {
   	  res.render('register');
});
router.post('/register', function(req, res) {
   	 // var User = global.dbHelper.getModel('user'),
   	  var User = help.getModel('user'),
   	      uname = req.body.uname;
   	      console.log(uname);
   	  User.findOne({name: uname}, function(error, doc) {
   	  	  if(doc) {
   	  	  	req.session.error = '用户名已存在！';
            res.sendStatus(500);
   	  	  } else {
   	  	  	User.create({name: uname, password: req.body.upwd}, function(error, doc){
                if (error) {
                    res.sendStatus(500);
                } else {
                    //req.session.error = '用户名创建成功！';
                    console.log('用户名创建成功');
                    res.sendStatus(200);
                }
   	  	  	});
   	  	  }
   	  });
});

//登录
router.get('/login', function(req, res) {
	res.render('login');
});
router.post('/login', function(req, res) {
    var User = help.getModel('user'),
   	    uname = req.body.uname;
   	User.findOne({name: uname}, function(error, doc) {
   		if(!doc) {
           console.log('用户名不存在');
           res.sendStatus(404);
   		} else if(doc.name != uname){
           console.log('密码错误');
           res.sendStatus(404);
   		} else {
   			console.log('登录成功!');
   			res.sendStatus(200);
   			//req.session.user = doc;
   		}
   	});    
})

//home
router.get('/home', function(req, res) {
	/*if(req.body.name) {*/
		var Commodity = help.getModel('commodity');
        Commodity.find({}, function(error, docs){
        	//console.log(docs);  返回一个数组
        	//将Commoditys变量传入home模板
            res.render('home',{Commoditys:docs});
        });
	/*} else {*/
		// req.session.error = "请先登录"
		/*console.log('请先登录');
        res.redirect('/login');*/
	/*}*/
});

//商品添加
router.get('/addcommodity', function(req, res) {
	 res.render('addcommodity');
});
//将商品添加到数据库中
router.post('/addcommodity', function(req, res) {
	var Commodity = help.getModel('commodity');
	Commodity.create({
		name: req.body.name,
		price: req.body.price,
		imgSrc: req.body.imgSrc
	},function(err, doc) {
		if(doc) {
			console.log(doc)
           res.sendStatus(200);
		} else {
		   res.sendStatus(404);
		}
	});
});

//logout
router.get('/logout', function(req, res) {
	res.redirect('/');
});

//购物车
router.get('/cart', function(req, res) {
	var Cart = help.getModel('cart');
	/*if(!req.session.user){
            req.session.error = "用户已过期，请重新登录:"
            res.redirect('/login');
        }else{*/
            Cart.find({"cStatus": false}, function (error, docs) {
               console.log(docs);  //返回一个数组，数组里面是cart对象的信息
               res.render('cart',{carts:docs});
             });
        /*}*/
})
//添加购物车商品
router.get('/addToCart/:id', function(req, res) {
	/*  if(!req.session.user){
    req.session.error = "用户已过期，请重新登录:"
    res.redirect('/login');
    }else{*/
    var Commodity = help.getModel('commodity'),
        Cart = help.getModel('cart');
    Cart.findOne({"cId":req.params.id},function(error,doc){
        //商品已存在 +1
        if(doc){
            Cart.update({"cId":req.params.id},{$set : { cQuantity : doc.cQuantity + 1 }},function(error,doc){
                //成功返回1  失败返回0
                if(doc > 0){
                    res.redirect('/home');
                }
            });
        //商品未存在，添加
        }else{
            Commodity.findOne({"_id": req.params.id}, function (error, doc) {
                if (doc) {
                    Cart.create({
                        /*uId: req.session.user._id,*/
                        cId: req.params.id,
                        cName: doc.name,
                        cPrice: doc.price,
                        cImgSrc: doc.imgSrc,
                        cQuantity : 1
                    },function(error,doc){
                        if(doc){
                            res.redirect('/home');
                        }
                    });
                } else {

                }
            });
        }
    });
 /* }*/
});
//删除购物车商品
router.get('/delFromCart/:id', function(req, res) {
	   //req.params.id 获取商品ID号
       // var Cart = global.dbHelper.getModel('cart');
        var Cart = help.getModel('cart');
        Cart.remove({"_id":req.params.id},function(error,doc){
            //成功返回1  失败返回0
            if(doc > 0){
                res.redirect('/cart');
            }
        });
})
//购物车结算
router.post('/cart/clearing', function(req, res) {
	   var Cart = help.getModel('cart');
	   Cart.update({"_id":req.body.cid},{$set : { cQuantity : req.body.cnum,cStatus:true }},function(error,doc){
            //更新成功返回1  失败返回0
            if(doc > 0){
                res.sendStatus(200);
            }
        });
})

module.exports = router;
