// 서버측에 세션 정보를 저장하여 로그인/아웃 구현
// 쿠키는 클라이언트에 저장하는 방식이라 보안상 좋지 않음

var express = require('express');
var session = require('express-session');
var bodyParser = require('body-parser');
var app = express();

app.use(bodyParser.urlencoded({extended: false}));
app.use(session({
  secret: 'secretcodehere',
  resave: false,	// 접속시 새로 secret code 새로 갱신 안함
  saveUninitialized: true,
  // cookie: { secure: true } // 보안: 개발자 도구에서 확인 불가함
}))

// sesstion 정보는 각 접속자별로 서버에 저장됨
app.get('/count', function(req, res){
	if(req.session.count){
		req.session.count++;
	} else{
		req.session.count = 1;	// 서버에 클라이언트 접속에 필요한 세션값 저장	
	}
	console.log(req.session.count);
	// res.send에 숫자값을 전달하면 오류남(string만 받음)
	res.send('session count: ' + req.session.count);

});

// 로그인 | 서버측의 세션 정보를 추가(실재는 db에 저장해야 함)한다.
app.get('/welcome', (req, res) =>{
	// 로그인이면(요청한 사용자 세션 정보가 있으면)
	if(req.session.name){
		res.send(`
			<h1>Welcome, ${req.session.name}</h1>
			<a href="/logout">logout</a>`);
	} else{
		res.send(`
			<h1>Welcome</h1>
			<a href="/login">login</a>`);
	}
});

// 로그아웃 | 서버측의 세션 정보를 제거한다.
app.get('/logout', (req,res) =>{
	delete req.session.name;	// 세션 제거
	res.redirect('/welcome');
});

// 로그인 폼 전송
app.post('/login', (req, res) =>{
	var userData = {
		id: 'kwon',
		pwd: '123456',
		name: 'Michael Kwon'
	};
	var id = req.body.id;
	var pwd = req.body.pwd;

	// 사용자 확인
	if(id === userData.id && userData.pwd === pwd){
		// session(서버측)에 사용자 정보(이름) 저장
		req.session.name = userData.name;
		res.redirect('/welcome');
	} else{
		var html = `You are not member! <a href="/login">login</a>`;
		res.send(html);
	}
});

// 로그인 화면
app.get('/login', (req, res) =>{
	// post 방식 폼(보안용)
	var html = `
		<h1>Login</h1>
		<form action="/login" method="post">
			<p>
				<input type="text" name="id" placeholder="id">
			</p>
			<p>
				<input type="password" name="pwd" placeholder="password">
			</p>
			<p>
				<input type="submit" />
			</p>
		</form>`;
	res.send(html);
});


// ----------------------------------------------------------
app.listen(3000, function(){
	console.log('Server Run at 3000 port');
});