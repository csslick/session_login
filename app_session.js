var express = require('express');
var session = require('express-session');
var app = express();
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

app.get('/login', (req, res) =>{
	res.sned('Hello Login');
});


// ----------------------------------------------------------
app.listen(3000, function(){
	console.log('Server Run at 3000 port');
});