// 서버측에 세션 정보를 저장하여 로그인/아웃 구현
// 쿠키는 클라이언트에 저장하는 방식이라 보안상 좋지 않음

var express = require('express');
var session = require('express-session');
var FileStore = require('session-file-store')(session);
var bodyParser = require('body-parser');
var app = express();

app.use(bodyParser.urlencoded({extended: false}));
app.use(session({
  secret: 'secretcodehere',
  resave: false,	// 접속시 secret code 새로 갱신 안함
  saveUninitialized: true,
  store: new FileStore()
  // cookie: { secure: true } // 보안: 개발자 도구에서 확인 불가함
}))

// 회원 DB
var userData = [
	{
		id: 'kwon',
		pwd: '123456',
		name: 'Michael Kwon'
	}
];

// 로그인 | 서버측의 세션 정보를 추가(실재는 db에 저장해야 함)한다.
app.get('/welcome', (req, res) =>{
	// 로그인이면(요청한 사용자 세션 정보가 있으면)
	console.log(req.session.name);
	if(req.session.name){
		res.send(`
			<h1>Welcome, ${req.session.name}</h1>
			<a href="/logout">logout</a>`);
	} else{
		res.send(`
			<h1>Welcome</h1>
			<ul>
				<li><a href="/login">Login</a></li>
				<li><a href="/register">Register</a></li>
			</ul>`);
	}
});

// 회원가입
app.post('/register', (req, res) =>{
	// 폼에서 받은 회원가입 데이터(*먼저 기존 회원 확인 필요함)
	var user = {
		id: req.body.id,
		pwd: req.body.pwd,
		name: req.body.name
	}
	req.session.name = user.id;
	req.session.save(() =>{
		userData.push(user); // 유저DB에 추가
		console.log(userData);
		res.redirect('/welcome');
	});
});

// 회원가입 페이지
app.get('/register', (req, res) =>{
	var html = `
		<h1>Register</h1>
		<form action="/register" method="post">
			<p>
				<input type="text" name="id" placeholder="id">
			</p>
			<p>
				<input type="password" name="pwd" placeholder="password">
			</p>
			<p>
				<input type="text" name="name" placeholder="name">
			</p>
			<p>
				<input type="submit" />
			</p>
		</form>`;	
		res.send(html);
});

// 로그아웃 | 서버측의 세션 정보를 제거한다.
app.get('/logout', (req,res) =>{
	console.log('삭제할 세션: ' + req.session.name);
	console.log(userData);
	delete req.session.name;	// 세션 제거
	//req.session.destroy();	// 세션 제거
	res.redirect('/welcome');
});

// 로그인 폼 전송
app.post('/login', (req, res) =>{
	var id = req.body.id;
	var pwd = req.body.pwd;

	// 사용자 확인
	for(var i=0; i<userData.length; i++){
		if(id === userData[i].id && userData[i].pwd === pwd){
				// session(서버측)에 사용자 정보(이름) 저장
				req.session.name = userData[i].name;

				// 그냥 redirect하면 session이 초기화 되는데??
				// 해결: req.session.save() | 세션값이 저장되면 처리하는 콜백함수
				// for문에서 중간에 빠져나오기 위해 return
				return req.session.save(function(){
					res.redirect('/welcome');
				});
		}
	}	
		var html = `You are not member! <a href="/login">login</a>`;
		res.send(html);
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