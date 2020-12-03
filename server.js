const axios = require('axios');
const express = require('express');
require('dotenv').config();

const app = express();

app.use(express.static('public'));

app.get('/', (req, res) => {
  res.sendFile(__dirname + 'public/index.html');
})

// callback url config trong app zalo (nhớ bật ngrok để có https)
app.get('/login/zalo', async (req, res) => {
  const { code, uid } = req.query;

  // uid là uid của user zalo (dùng cái này để check xem user này đã đăng ký hay chưa)
  // nếu chưa có thì gọi api để lấy thêm một vài thông tin như name, picture để đăng ký (chú ý cần có uid lưu trong db để lần sau còn check)
  const infoRes = await axios.get(`https://oauth.zaloapp.com/v3/access_token?app_id=4590968485401923556&app_secret=44DW6Z9SJRUEI35TPJz5&code=${code}`);
  const { access_token } = infoRes.data;

  const infoMe = await axios.get(`https://graph.zalo.me/v2.0/me?access_token=${access_token}&fields=id,birthday,name,gender,picture`);
  const { name } = infoMe;
  
  // create user rồi gen token
  const token = 'abc'
  // đoạn này nếu trong project thì redirect sang FRONTEND_URL?access_token='abc' bên frontend sẽ lấy access_token từ url, 
  // verify xem có đúng không rồi redirect sang trang home
  // còn đây là đang mỏi quá gửi tạm
  return res.send(token);
})

app.listen(8080, (err) => {
  if (err) throw err;
  console.log('Server started')
})