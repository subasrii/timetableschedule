var mysql =require('mysql');
var express = require('express');
var session = require('express-session');
var bodyParser = require('body-parser');
var path = require('path');
var ejs=require('ejs');

var con = mysql.createConnection({
	host     : 'localhost',
	user     : 'root',
	password : '',
	database : 'realtime'
});

var app = express();
app.use(bodyParser.urlencoded({extended : false}));
app.use(bodyParser.json());
app.use(express.static('public'));
app.set('view engine','ejs');
app.listen(8080);
app.get('/', function(req, res) {
	res.render('pages/index')
});
app.use(session({
	secret: 'secret',
	resave: true,
	saveUninitialized: true
}));



app.use(function (req, res, next) {
    res.locals.staffname = req.session.staffname;
	res.locals.studentname = req.session.studentname;
	res.locals.uname = req.session.uname;
    next();
  });

//login

app.post('/admin',function(req,res,next){
    var uname=req.body.uname;
    var pwd=req.body.pwd;
    if(uname="rkmbs")
    {
        if(pwd=="mbs")
        {
          console.log("login success");
          res.redirect('/adminhome');
        }
    else
    {
     console.log("Invalid password");
     res.redirect('/errorpage');
    }
}
else{
    console.log("Invalid username");
    res.redirect('/errorpage');
}
    });

//    app.get('/profil', function(req, res) {
		
// 		if (req.session.loggedin) {
// 			staffid = req.session.staffid
// 			staffname = req.session.staffname
// 			department = req.session.department
// 			email = req.session.email
// 			officenumber = req.session.officenumber
// 			password  = req.session.password
// 			confirmpassword  = req.session.confirmpassword
// 			position = req.session.position
// 			var sql = "SELECT * FROM staff WHERE staffname = '"+ staffname + "'";
// 			con.query( sql, function ( err, resultSet ) {
	
// 				if ( err ) throw err;
			
				
// 				 catfood = resultSet[0].catfood;
				
			
// 			});
			
// 			res.render('pages/staffview',{data:rows})
// 			res.end();
			  
			
// 		} else {
			
			
// 			res.send('Please login to view this page! <a href="stafflogin">login</a>');
// 		}
// 		res.end();
// 	});

app.post('/auth', function(req, res) {
	var staffname = req.body.staffname;
	var password = req.body.password;
	if (staffname && password) {
		con.query('SELECT * FROM staff WHERE staffname = ? AND password = ?', [staffname, password], function(error, results, fields) {
			if (results.length > 0) {
				req.session.loggedin = true;
				req.session.staffname = staffname;
				 res.redirect('/staffhome');
                console.log("login sucess");
			} else {
				console.log("invalid username and password");
				res.redirect('/errorpage');
			}			
			res.end();
		});
	} else {
		console.log('Please enter Username and Password!');
		res.redirect('/errorpage');
		res.end();
	}
});

// app.get('/adminhome',function(req,res){
//     if(req.session.loggedin==true)
//     {
//         res.render('pages/adminhome');
//     }else{
//         res.render('pages/admin')
//     }
// });

app.get('/staffhome',function(req,res){
    if(req.session.loggedin==true)
    {
        res.render('pages/staffhome');
    }else{
        res.render('pages/stafflogin')
    }
});

app.get('/studhome',function(req,res){
    if(req.session.loggedin==true)
    {
        res.render('pages/studhome');
    }else{
        res.render('pages/studlogin')
    }
});

app.get('/adminhome',function(req,res){
    if(req.session.loggedin==true)
    {
        res.render('pages/adminhome');
    }else{
        res.render('pages/admin')
    }
});

// app.post("/auth",function(req,res,next){

//     var staffname=req.body.staffname;
//     var password=req.body.password;

    
//     var query="select * from staff where staffname='"+staffname+"' and password='"+password+"'";

//     con.query(query,function(err,rows,fields){
//             if(rows.length > 0)
//             {
//                 req.session.loggin=true
//                 req.session.staffname=staffname;
//                 res.redirect("/staffhome");

//             }else{
//                 console.log("Invalid login");
//             }
//         })
// });

app.get("/logout",function(req,res){
    req.session.loggedin=false;
    req.session.destroy();
    res.redirect("/");
});

// app.get('/staffhome', function(request, response) {
// 	if (req.session.loggedin) {
// 		res.send('Welcome back, ' + req.session.staffname + '!');
// 	} else {
// 		res.send('Please login to view this page!');
// 	}
// 	res.end();
// });

app.get('/studlogin', function(req, res) {
	res.render('pages/studlogin')
});
app.get('/stafflogin', function(req, res) {
	res.render('pages/stafflogin')
});

app.post('/vlogin', function(req, res) {
	var studentname = req.body.studentname;
	var password = req.body.password;
	if (studentname && password) {
		con.query('SELECT * FROM stud WHERE studentname = ? AND password = ?', [studentname, password], function(error, results, fields) {
			if (results.length > 0) {
				req.session.loggedin = true;
				req.session.studentname = studentname;
				res.redirect('/studhome');
                console.log("login success");
			} else {
				res.send('Incorrect Username and/or Password!');
				res.redirect('/errorpage');
			}			
			res.end();
		});
	} else {
		res.send('Please enter Username and Password!');
		res.redirect('/errorpage');
		res.end();
	}
});



// app.get('/studhome', function(request, response) {
// 	if (req.session.loggedin) {
// 		res.send('Welcome back, ' + req.session.studentname + '!');
// 	} else {
// 		res.send('Please login to view this page!');
// 	}
// 	res.end();
// });

//getapp
app.get('/feedback',function(req,res){
	res.render('pages/feedback');
});
app.get('/welcome',function(req,res){
	res.render('pages/welcome');
});
app.get('/adminhome',function(req,res){
	res.render('pages/adminhome');
});
app.get('/studhome',function(req,res){
	res.render('pages/studhome');
});
app.get('/staffhome',function(req,res){
	res.render('pages/staffhome');
});

app.get('/update',function(req,res){
	res.render('pages/update');
});

app.get('/errorpage',function(req,res){
	res.render('pages/errorpage');
});

app.get('/staffdelete',function(req,res){
	res.render('pages/staffdelete');
});

app.get('/studdelete',function(req,res){
	res.render('pages/studdelete');
});

app.get('/subdelete',function(req,res){
	res.render('pages/subdelete');
});

app.get('/clsdelete',function(req,res){
	res.render('pages/clsdelete');
});

app.get('/staffupdate',function(req,res){
res.render('pages/staffupdate');
});

app.get('/studupdate',function(req,res){
res.render('pages/studupdate');
});
app.get('/clsupdate',function(req,res){
res.render('pages/clsupdate');
});
app.get('/subupdate',function(req,res){
res.render('pages/subupdate');
});

app.get('/tableview',function(req,res){
res.render('pages/tableview');
});

app.get('/timetable',function(req,res){
res.render('pages/timetable');
});
app.get('/addclass',function(req,res){
res.render('pages/addclass');
});
app.get('/addsubject',function(req,res){
res.render('pages/addsubject');
});
app.get('/staffregistration',function(req,res){
res.render('pages/staffregistration');

});
app.get('/staffreg',function(req,res){
res.render('pages/staffreg');

});
app.get('/studreg',function(req,res){
res.render('pages/studreg');

});

app.get('/loginhome',function(req,res){
res.render('pages/loginhome');

});

app.get('/signuphome',function(req,res){
res.render('pages/signuphome');

});

app.get('/studregistration',function(req,res){
res.render('pages/studregistration');

});

app.get('/admin',function(req,res){
res.render('pages/admin');

});
app.get('/adddepartment',function(req,res){
	res.render('pages/adddepartment');
	
	});

app.get('/feedbackupdate',function(req,res){
	res.render('pages/feedbackupdate');
});
app.get('/feedbackdelete',function(req,res){
	res.render('pages/feedbackdelete');
});
app.get('/feedbackview',function(req,res){
	res.render('pages/feedbackview');
});

app.get('/download',function(req,res){
res.render('pages/download');
});
app.get('/report',function(req,res){
res.render('pages/report');
});



// save
app.post('/studsave',function(req,res,next){
    var studentname=req.body.studentname;
    var course=req.body.course;
    var department =req.body.department;
    var email=req.body.email;
    var personalnumber=req.body.personalnumber;
    var password=req.body.password;
    var confirmpassword=req.body.confirmpassword;
    var semester=req.body.semester;
    var academicyear=req.body.academicyear;
    var date=req.body.date;
    var query="insert into stud(studentname,course,department,email,personalnumber,password,confirmpassword,semester,academicyear,date) values('"+req.body.studentname+"','"+req.body.course+"','"+req.body.department+"','"+req.body.email+"','"+req.body.personalnumber+"','"+req.body.password+"','"+req.body.confrimpassword+"','"+req.body.semester+"','"+req.body.academicyear+"','"+req.body.date+"')";
    con.query(query,function(err,result){
    if(err)
    {
    throw err;
    }
    else
    {
     console.log("Inserted Successfully");
    }
    res.redirect('pages/index');
    });
    });

	app.post('/depsave',function(req,res,next){
		var department=req.body.department;
		var query="insert into dep(department) values('"+req.body.department+"')";
		con.query(query,function(err,result){
		if(err)
		{
		throw err;
		}
		else
		{
		 console.log("Inserted Successfully");
		}
		res.redirect('pages/feedback');
		});
		});
app.post('/feedsave',function(req,res,next){
	var username=req.body.username;
	var category=req.body.category;
	var subject=req.body.subject;
	var message=req.body.message;
	var query="insert into feed(username,category,subject,message) values('"+req.body.username+"','"+req.body.category+"','"+req.body.subject+"','"+req.body.message+"')";
	con.query(query,function(err,result){
	if(err)
	{
	throw err;
	}
	else
	{
	 console.log("Inserted Successfully");
	}
	res.redirect('pages/feedback');
	});
	});
 
 app.post('/staffsave',function(req,res,next){
  var staffid=req.body.staffid;
 var staffname=req.body.staffname;
 var department =req.body.department;
 var email=req.body.email;
 var officenumber=req.body.officenumber;
 var password=req.body.password;
 var confirmpassword=req.body.confirmpassword;
 var position=req.body.position;
 var query="insert into staff(staffid,staffname,department,email,officenumber,password,confirmpassword,position) values('"+req.body.staffid+"','"+req.body.staffname+"','"+req.body.department+"','"+req.body.email+"','"+req.body.officenumber+"','"+req.body.password+"','"+req.body.confrimpassword+"','"+req.body.position+"')";
 con.query(query,function(err,result){
 if(err)
 {
 throw err;
 }
 else
 {
  console.log("Inserted Successfully");
 }
 res.redirect('pages/staffregistration');
 });
 });
 
 app.post('/clssave',function(req,res,next){
	 var classname=req.body.classname;
	 var classsection=req.body.classsection;
	var semester=req.body.semester;
	var dayorderallocation=req.body.dayorderallocation;
	var periodtime=req.body.periodtime;
	var staffselection=req.body.staffselection;
	var subjectallocation=req.body.subjectallocation;
	var query="insert into addcls(classname,classsection,semester,dayorderallocation,periodtime,staffselection,subjectallocation) values('"+req.body.classname+"','"+req.body.classsection+"','"+req.body.semester+"','"+req.body.dayorderallocation+"','"+req.body.periodtime+"','"+req.body.staffselection+"','"+req.body.subjectallocation+"')";
	con.query(query,function(err,result){
	if(err)
	{
	throw err;
	}
	else
	{
	 console.log("Inserted Successfully");
	}
	res.redirect('pages/addclass');
	});
	});
 
	app.post('/subsave',function(req,res,next){
	 var subjectcode=req.body.subjectcode;
	var subjectname=req.body.subjectname;
	var credithour=req.body.credithour;
	var semester=req.body.semester;
	var year=req.body.year;
	var query="insert into addsub(subjectcode,subjectname,credithour,semester,year) values('"+req.body.subjectcode+"','"+req.body.subjectname+"','"+req.body.credithour+"','"+req.body.semester+"','"+req.body.year+"')";
	con.query(query,function(err,result){
	if(err)
	{
	throw err;
	}
	else
	{
	 console.log("Inserted Successfully");
	}
	res.redirect('pages/addsubject');
	});
	});
	// update
	app.post('/subupdate',function(req,res,next){
 
	 var subjectcode=req.body.subjectcode;
	 var subjectname=req.body.subjectname;
	 var credithour=req.body.credithour;
	 var semester=req.body.semester;
	 var year=req.body.year;
	 var query="update addsub set subjectname='"+req.body.subjectname+"',credithour='"+req.body.credithour+"',semester='"+req.body.semester+"' ,year='"+req.body.year+"'where subjeccode='"+req.body.subjectcode+"'";
	 con.query(query,function(err,result){
		 if(err)
	 {
	 throw err;
	 }
	 else
	 {
	  console.log("update Successfully");
	 }
	  res.redirect('/');
		 });
	 });
 	app.post('/feedupdate',function(req,res,next){
		var username=req.body.username;
		var category=req.body.category;
		var subject=req.body.subject;
		var message=req.body.message;
	var query="update feed set username='"+req.body.username+"',category='"+req.body.category+"',subject='"+req.body.subject+"' ,message='"+req.body.meassage+"' where username='"+req.body.username+"'";
	con.query(query,function(err,result){
		if(err)
	{
	throw err;
	}
	else
	{
	 console.log("update Successfully");
	}
	 res.redirect('/');
		});
	});
 
	app.post('/clsupdate',function(req,res,next){
	 var classname=req.body.classname;
	 var classsection=req.body.classsection;
	var semester=req.body.semester;
	var dayorderallocation=req.body.dayorderallocation;
	var periodtime=req.body.periodtime;
	var staffselection=req.body.staffselection;
	var subjectallocation=req.body.subjectallocation;
	
 var query="update addcls set classsection='"+req.body.classsection+"',semester='"+req.body.semester+"',dayorderallocation='"+req.body.dayorderallocation+"' ,periodtime='"+req.body.periodtime+"',staffselection='"+req.body.staffselection+"',subjectallocation='"+req.body.subjectallocation+" where classname='"+req.body.classname+"'";
 con.query(query,function(err,result){
	 if(err)
 {
 throw err;
 }
 else
 {
  console.log("update Successfully");
 }
  res.redirect('/');
	 });
 });
 
	app.post('/studupdate',function(req,res,next){
 
	 var studentid=req.body.studentid;
	 var studentname=req.body.studentname;
	 var department =req.body.department;
	 var email=req.body.email;
	 var personalnumber=req.body.personalnumber;
	 var password=req.body.password;
	 var confirmpassword=req.body.confirmpassword;
	 var semester =req.body.semester;
	 var academicyear =req.body.academicyear;
	 var date =req.body.date;
 var query="update stud set studentname='"+req.body.studentname+"',department='"+req.body.department+"',email='"+req.body.email+"',personalnumber='"+req.body.personalnumber+"',password='"+req.body.password+"',confirmpassword='"+req.body.confirmpassword+"',semester='"+req.body.semester+"' ,academicyear='"+req.body.academicyear+"',date='"+req.body.date+"' where studentname='"+req.body.studentname+"'";
 con.query(query,function(err,result){
	 if(err)
 {
 throw err;
 }
 else
 {
  console.log("update Successfully");
 }
  res.redirect('/');
	 });
 });
	
 app.post('/staffupdate',function(req,res,next){
 
	 var staffid=req.body.staffid;
	 var staffname=req.body.staffname;
	 var department =req.body.department;
	 var email=req.body.email;
	 var officenumber=req.body.officenumber;
	 var password=req.body.password;
	 var confirmpassword=req.body.confirmpassword;
	 var position=req.body.position;
 
 var query="update staff set staffname='"+req.body.staffname+"',department='"+req.body.department+"',email='"+req.body.email+"',officenumber='"+req.body.officenumber+"',password='"+req.body.password+"',confirmpassword='"+req.body.confirmpassword+"',position='"+req.body.position+"' where staffid='"+req.body.staffid+"'";
 con.query(query,function(err,result){
	 if(err)
 {
 throw err;
 }
 else
 {
  console.log("update Successfully");
 }
  res.redirect('/');
	 });
 });

//  delete
 app.post('/subdelete',function(req,res,next){
	 var subjectcode=req.body.subjectcode;
	 var query="delete from addsub where  subjectcode='"+req.body.subjectcode+"'";
	 con.query(query,function(err,result){
		 if(err)
	 {
	 throw err;
	 }
	 else
	 {
	  console.log("deleted Successfully");
	 }
	  res.redirect('/');
		 });
	 });
 
 app.post('/clsdelete',function(req,res,next){
	 var department=req.body.department;
	 var query="delete * from addcls where  classname='"+req.body.classname+"'";
	 con.query(query,function(err,result){
		 if(err)
	 {
	 throw err;
	 }
	 else
	 {
	  console.log("deleted Successfully");
	 }
	  res.redirect('/');
		 });
	 });

	 app.post('/feeddelete',function(req,res,next){
		var username=req.body.username;
		var query="delete * from feed where  username='"+req.body.username+"'";
		con.query(query,function(err,result){
			if(err)
		{
		throw err;
		}
		else
		{
		 console.log("deleted Successfully");
		}
		 res.redirect('/');
			});
		});
 
 app.post('/staffdelete',function(req,res,next){
 var staffid=req.body.staffid;
 var query="delete * from staff where  staffid='"+req.body.staffid+"'";
 con.query(query,function(err,result){
	 if(err)
 {
 throw err;
 }
 else
 {
  console.log("deleted Successfully");
 }
  res.redirect('/');
	 });
 });
 
 app.post('/studdelete',function(req,res,next){
	 var studentname=req.body.studentname;
	 var query="delete * from stud where  studentname='"+req.body.studentname+"'";
	 con.query(query,function(err,result){
		 if(err)
	 {
	 throw err;
	 }
	 else
	 {
	  console.log("deleted Successfully");
	 }
	  res.redirect('/');
		 });
	 });

	 //view

	 app.get('/view1',function(req,res,next){
		con.query('SELECT * from staff',function(err,rows){
			if(err)
			{
		   res.render('/',{data:''})
			}
			else
			{
				res.render('pages/view1',{data:rows})
			}
			
			});
		});
		
		app.get('/timetable',function(req,res,next){
			con.query('SELECT addsub.staffname from addsub  innerjoin addcls on addsub.credithour=addcls.periodtime',function(err,rows){
				if(err)
				{
			   res.render('/',{data:''})
				}
				else
				{
					res.render('pages/',{data:rows})
				}
				
				});
			});
		
		app.get('/view2',function(req,res,next){
			con.query('SELECT * from stud',function(err,rows){
				if(err)
				{
			   res.render('/',{data:''})
				}
				else
				{
					res.render('pages/view2',{data:rows})
				}
				
				});
			});
			app.get('/view3',function(req,res,next){
				con.query('SELECT * from addsub',function(err,rows){
					if(err)
					{
				   res.render('/',{data:''})
					}
					else
					{
						res.render('pages/view3',{data:rows})
					}
					
					});
				});
				app.get('/view4',function(req,res,next){
					con.query('SELECT * from adcls  ',function(err,rows){
						if(err)
						{
					   res.render('/',{data:''})
						}
						else
						{
							res.render('pages/view4',{data:rows})
						}
						
						});
					});
		app.get('/staffview',function(req,res,next){
			if (req.session.loggedin)
					var staffid = req.session.staffid
			       var staffname = req.session.staffname
			       var  department = req.session.department
			       var  email = req.session.email
			        var officenumber = req.session.officenumber
			        var  password  = req.session.password
			        var confirmpassword  = req.session.confirmpassword
			         var position = req.session.position
			con.query("SELECT * FROM staff WHERE staffname = '"+ staffname + "'",function(err,rows){
				if(err)
				{
			   res.render('/',{data:''})
				}
				else
				{
					res.render('pages/staffview',{data:rows})
				}
			
				});
			});
             
		
		
			app.get('/studview',function(req,res,next){
				if (req.session.loggedin)
						var studentid = req.session.studentid
					   var studentname = req.session.studentname
					   var  course = req.session.course
					   var  department = req.session.department
					   var  email = req.session.email
						var personalnumber = req.session.personalnumber
						var  password  = req.session.password
						var confirmpassword  = req.session.confirmpassword
						 var semester = req.session.semester
						 var  academicyear= req.session.academicyear
						 var  date= req.session.date
				con.query("SELECT * FROM stud WHERE studentname = '"+ studentname + "'",function(err,rows){
					if(err)
					{
				   res.render('/',{data:''})
					}
					else
					{
						res.render('pages/studview',{data:rows})
					}
				
					});
				});

			// app.get('/studview',function(req,res,next){
			// 	con.query('SELECT * from stud ',function(err,rows){
			// 		if(err)
			// 		{
			// 	   res.render('/',{data:''})
			// 		}
			// 		else
			// 		{
			// 			res.render('pages/studview',{data:rows})
			// 		}
					
			// 		});
			// 	});
		
		
				app.get('/clsview',function(req,res,next){
					con.query('SELECT * from adcls ',function(err,rows){
						if(err)
						{
					   res.render('/',{data:''})
						}
						else
						{
							res.render('pages/clsview',{data:rows})
						}
						
						});
					});
		
		
					app.get('/subview',function(req,res,next){
						con.query('SELECT * from addsub ',function(err,rows){
							if(err)
							{
						   res.render('/',{data:''})
							}
							else
							{
								res.render('pages/subview',{data:rows})
							}
							
							});
						});
		
			app.get('/tableview',function(req,res,next){
				con.query('SELECT staffname from staff',function(err,rows){
					if(err)
					{
				   res.render('/',{data:''})
					}
					else
					{
						res.render('pages/tableview',{data:rows})
					}
					
					});
				});
				
				app.get('/feedview',function(req,res,next){
					con.query('SELECT * from feed ',function(err,rows){
						if(err)
						{
					   res.render('/',{data:''})
						}
						else
						{
							res.render('pages/feedview',{data:rows})
						}
						
						});
					});
