/**
Напишите HTTP сервер и реализуйте два обработчика, где:
- По URL “/” будет возвращаться страница, на которой есть гиперссылка на
вторую страницу по ссылке “/about”
- А по URL “/about” будет возвращаться страница, на которой есть гиперссылка
на первую страницу “/”
- Также реализуйте обработку несуществующих роутов (404).
- * На каждой странице реализуйте счетчик просмотров. Значение счетчика
должно увеличиваться на единицу каждый раз, когда загружается страница
 */

let counterVisitPageMain = 0;
let counterVisitPageAbout = 0;
const fs = require('fs');
const http = require('http');
const port = 3000;
const server = http.createServer(async (req, res) => {
    if (req.url === '/') {
        fs.readFile('index.html', function (error, data) {
            if (error) {
                res.statusCode = 404;
                res.end('<h1 style="color:red" >The page does not exist</h1>');
            }

            else {
                ++counterVisitPageMain;
                let resultPage = data.toString().replace("{counter}", counterVisitPageAbout)
                res.writeHead(200,
                    { 'Content-Type': 'text/html' });
                res.write(resultPage, 'utf8')
                res.end();
            }
        })
    }

    if (req.url === '/about') {
        fs.readFile('about.html', function (error, data) {
            if (error) {
                res.statusCode = 404;
                res.end('<h1 style="color:red" >The page does not exist</h1>');
            }
            else {
                ++counterVisitPageAbout;
                let resultPage = data.toString().replace("{counter}", counterVisitPageAbout)
                res.writeHead(200,
                    { 'Content-Type': 'text/html' });
                res.write(resultPage, 'utf8')
                res.end();
            }
        })
    }
})

server.listen(port);


