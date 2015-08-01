var User = require('../models/user');

// showSignup
exports.showSignup = function(req, res){
  res.render('signup', {
    title: '注册页面'
  });
};

// showSignin
exports.showSignin = function(req, res){
  res.render('signin', {
    title: '登录页面'
  });
};

// signup
exports.signup = function(req, res){
//app.post('/user/signup', function(req, res){
  var _user = req.body.user;
  //var user = new User(_user);

  User.findOne({name: _user.name}, function(err, user){
    if(err){
      console.log(err);
    }

    if(user){
      return res.redirect('/signin');
    }
    else {
      user = new User(_user);
      user.save(function(err, user){
        if(err){
          console.log(err);
        }
        res.redirect('/admin/user/list');
        //res.redirect('/');
      });
    }
  });
};
//});

// signin
exports.signin = function(req, res){
//app.post('/user/signin', function(req, res){
  var _user = req.body.user;
  var name = _user.name;
  var password = _user.password;

  User.findOne({name: name}, function(err, user){
    if(err){
      console.log(err);
    }

    if(!user){
      return res.redirect('/signup');
    }

    user.comparePassword(password, function(err, isMatch){
      if(err){
        console.log(err);
      }

      if(isMatch){
        //console.log('Password is matched');
        req.session.user = user;
        return res.redirect('/');
      }
      else{
        //console.log('Password is not matched');
        return res.redirect('/signin');
      }
    });
  });
};
//});

// logout
exports.logout = function(req, res){
//app.get('/logout', function(req, res){
  delete req.session.user;
  //delete app.locals.user;
  res.redirect('/');
};
//});

// userlist page
exports.list = function(req, res){
//app.get('/admin/userlist', function(req, res){
//  var user = req.session.user;
//  if(!user){
//    return res.redirect('/signin');
//  }
//  if(user.role > 10){
//    User.fetch(function(err, users){
//      if(err){
//        console.log(err);
//      }
//
//      res.render('userlist', {
//        title: 'imooc 用户列表页',
//        users: users
//      });
//    });
//  }
  User.fetch(function(err, users){
    if(err){
      console.log(err);
    }

    res.render('userlist', {
      title: 'imooc 用户列表页',
      users: users
    });
  });
};
//});

// midware for user
exports.signinRequired = function(req, res, next){
  var user = req.session.user;

  if(!user){
    return res.redirect('/signin');
  }

  next();
};

// midware for user
exports.adminRequired = function(req, res, next){
  var user = req.session.user;

  if(user.role <= 10){
    return res.redirect('/signin');
  }

  next();
};
