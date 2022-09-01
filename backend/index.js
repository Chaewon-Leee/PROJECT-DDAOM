const express = require("express");
const app = express();
const port = 3000;
const database = require("./database");
const bodyParser = require("body-parser");
const cookieParser = require("cookie-parser");
const jwt = require("jsonwebtoken");
global.a = "";
app.use(bodyParser.json());
app.use(cookieParser());

// 프레임 시작

app.post("/api/frame/color", async (req, res) => {
  const Project_User = await database.run(
    `SELECT * FROM Project_User WHERE user_id = "${a}"`
  );
  res.send(Project_User);
});

app.post("/api/frame/project_name", async (req, res) => {
  const Project = await database.run(
    `SELECT * FROM Project WHERE id IN
    (SELECT project_id FROM Project_User WHERE user_id ='${a}');`
  );
  res.send(Project);
});

// 프레임 끝

// 회원가입 시작

app.post("/api/signup", async (req, res) => {
  await database.run(
    `INSERT IGNORE INTO User (id,name,password,hint) VALUES ('${req.body.content.id}','${req.body.content.name}','${req.body.content.password}','${req.body.content.pwhint}')`
  );
  await database.run(
    `INSERT INTO Project_User (user_id,user_name) VALUES ('${req.body.content.id}','${req.body.content.name}')`
  );
});

app.post("/api/checkid", async (req, res) => {

  const query = await database.run(`SELECT id FROM User;`);
  let result = "사용가능";
  for (i in query) {
    const exist = query[i].id;
    if (req.body.content === exist) {
      result = "사용불가능";
    }
  }
  res.send(result);
});

// 회원가입 끝

// 로그인 시작

app.get("/api/login", async (req, res) => {
  if (req.cookies && req.cookies.token) {
    jwt.verify(req.cookies.token, "46081382", (err, decoded) => {
      if (err) {
        return res.send(401);
      }
      res.send(decoded);
    });
  } else {
    res.sendStatus(401);
  }
});

app.post("/api/login", async (req, res) => {
  const members = await database.run("SELECT * FROM User");

  const loginId = req.body.loginId;
  const loginpw = req.body.loginPw;
  global.a = req.body.loginId;
  const member = members.find(
    (m) => m.id === loginId && m.password === loginpw
  );

  if (member) {
    const option = {
      domain: "localhost",
      path: "/",
      httpOnly: true,
    };

    const token = jwt.sign(
      {
        id: member.id,
        name: member.name,
      },
      "46081382",
      {
        expiresIn: "15m",
        issuer: "ddaom",
      }
    );
    res.cookie("token", token, option);
    res.send(member);
  } else {
    res.send(404);
  }
});

app.delete("/api/login", async (req, res) => {
  if (req.cookies && req.cookies.token) {
    res.clearCookie("token");
  }
  res.sendStatus(200);
});

// 로그인 끝

//비밀번호 시작

app.post("/api/password", async (req, res) => {
  const checkdata = await database.run(`SELECT name,id FROM User WHERE name='${req.body.content.name}' and id='${req.body.content.id}';`)
  let result = '사용불가능'
  for(i in checkdata){
    const exist_name = checkdata[i].name
    const exist_id = checkdata[i].id
    if(req.body.content.name === exist_name & req.body.content.id === exist_id) {
      result = '사용가능'
    }
  }
  if(result === '사용불가능'){
    return res.send('사용불가능')
  }
  const query = await database.run(`SELECT hint,password FROM User WHERE name = '${req.body.content.name}' and id = '${req.body.content.id}';`)
  for(i in query){
    const hintValue = query[i].hint
    const search = query[i].password
    if(req.body.content.hint === hintValue){
       return res.send(search)
    } else{
       return res.send('힌트 답변 틀림')
    }
  }
});

//비밀번호 끝

// 프로젝트 생성 시작

app.post("/api/makeProject/id", async (req, res) => {
  const project = await database.run(`SELECT id FROM Project`);
  res.send(project);
});

app.post("/api/makeProject", async (req, res) => {
  const content = req.body.content

  await database.run(
    `INSERT INTO Project (id,name,start_date,end_date,description,image_path,file_path) VALUES ('${content.id}','${content.name}','${content.start_date}','${content.end_date}','${content.description}','${content.image_path}','${content.file_path}')`
  );

  for(let j = 0; j < content.linkName.length; j++) {
    const url = content.linkurl[j]
    const name = content.linkName[j]
    await database.run(
      `INSERT INTO Link (url,title,project_id) VALUES ('${url}','${name}','${content.id}')`
    );
  }
});

app.post("/api/makeProject/user", async (req, res) => {
  const user = await database.run(`SELECT id, name FROM User`);
  res.send(user);
});

app.post("/api/makeProject/project_user", async (req, res) => {
  await database.run(
    `INSERT INTO Project_User (user_id,project_id,user_name) VALUES ('${req.body.content.user_id}',${req.body.content.id},'${req.body.content.user_name}')`
  );
});

app.post("/api/makeProject/project_user/personal", async (req, res) => {
  const name = await database.run(
    `SELECT name FROM User WHERE id = '${a}';`
  );
  await database.run(
    `INSERT INTO Project_User (user_id,project_id,user_name) VALUES ('${a}',${req.body.content.id},'${name[0].name}')`
  );
});

// 프로젝트 생성 끝

// 일정 생성 시작

app.post("/api/makePlan/project", async (req, res) => {
  const Project = await database.run(
    `SELECT * FROM Project WHERE id IN (
      SELECT project_id FROM Project_User WHERE user_id = '${a}');`
  );
  res.send(Project);
});

app.post("/api/makePlan/together", async (req, res) => {
  const scheduleValue = req.body.content;

  await database.run(
    `INSERT INTO Schedule (user_id, project_id, title,start_date,end_date,description) VALUES ('${a}', '${scheduleValue.projectId}','${scheduleValue.title}','${scheduleValue.start_date}','${scheduleValue.end_date}','${scheduleValue.description}')`
  );
});

app.post("/api/makePlan/personal", async (req, res) => {
  const scheduleValue = req.body.content;

  await database.run(
    `INSERT INTO Schedule (user_id, title,start_date,end_date,description) VALUES ('${a}','${scheduleValue.title}','${scheduleValue.start_date}','${scheduleValue.end_date}','${scheduleValue.description}')`
  );
});

// 일정 생성 끝

// 프로젝트 리스트

app.get("/api/list", async (req, res) => {
  const result = await database.run(
    `SELECT * FROM Project WHERE id IN (SELECT project_id FROM Project_User WHERE user_id ='${a}')`
  );

  res.send(result);
});

app.get("/api/link", async (req, res) => {
  // 링크
  const result = await database.run(
    `SELECT * FROM Link WHERE project_id IN (SELECT project_id FROM Project_User WHERE user_id = '${a}')`
  );

  res.send(result);
});

app.get("/api/peer", async (req, res) => {
  // 같이하는 팀원
  const result = await database.run("SELECT * FROM Project_User");
  res.send(result);
});

app.put("/api/fix/:nameid", async (req, res) => {
  await database.run(
    `UPDATE Project SET name ='${req.body.fixed[0]}', description ='${req.body.fixed[1]}' WHERE id=${req.params.nameid}`
  );
  const result = await database.run(
    `SELECT * FROM Project WHERE id IN (SELECT project_id FROM Project_User WHERE user_id = '${a}')`
  );
  res.send(result);
});

app.put("/api/fixlink/:linkid", async (req, res) => {
  console.log(req.params.linkid);
  await database.run(
    `UPDATE Link SET title ='${req.body.fixlink[0]}',url ='${req.body.fixlink[1]}' WHERE title='${req.params.linkid}'`
  );
  const result = await database.run(
    `SELECT * FROM Link WHERE project_id IN (SELECT project_id FROM Project_User WHERE user_id = '${a}')`
  );
  res.send(result);
});

app.get("/api/schedule", async (req, res) => {
  // 프로젝트 일정 가져오기
  const result = await database.run(
    `SELECT * FROM Schedule WHERE user_id = '${a}'`
  );
  res.send(result);
});

app.delete("/api/list/delete/:projectid", async (req, res) => {
  await database.run(
    `DELETE FROM Project WHERE id = '${req.params.projectid}'`
  );
});

// 프로젝트 리스트 끝

// 메인 페이지 시작

app.post("/api/main/Project_User", async (req, res) => {
  const Project_User = await database.run(
    `SELECT * FROM Project_User WHERE user_id = "${a}" ORDER BY project_id`
  );
  res.send(Project_User);
});

app.post("/api/main/Project", async (req, res) => {
  const Project = await database.run(
    `SELECT * FROM Project WHERE id IN
    (SELECT project_id FROM Project_User WHERE user_id ='${a}' ORDER BY project_id);`
  );
  res.send(Project);
});

app.post("/api/main/Schedule", async (req, res) => {
  const Schedule = await database.run(
    `SELECT * FROM Schedule WHERE user_id = '${a}';`
  );
  res.send(Schedule);
});

app.post("/api/main/Schedule/edit", async (req, res) => {
  // textValue[0] : schedule id, textValue[1] : text 내용
  const textValue = req.body.content;

  await database.run(
    `UPDATE Schedule SET description = '${textValue[1]}' WHERE id = ${textValue[0]};`
  );
});

app.post("/api/main/Schedule/remove", async (req, res) => {
  // removeValue : 삭제 할 schedule id
  const removeValue = req.body.content;

  await database.run(`DELETE FROM Schedule WHERE id = ${removeValue};`);
});

// 메인 페이지 끝

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`);
});
