# Лекция 1
Предпосылки к созданию Node.js

## Что такое Node.js?
Раян Даль - Американский инженер-программист cоздатель Node.js
`Node.js` — это платформа, которая позволяет разработчикам
писать серверную часть программ на JavaScript.


### Как Node.js работает “под капотом”?

Событийная модель в Node.js
Каждый запрос клиента не блокируется
другими запросами.
* Выполнение кода происходит в одном потоке,
что позволяет не думать о параллельном
доступе к памяти
* Пока в рамках одного запроса приложение
делает запрос в БД или читает файл, Node.js
не простаивает и обрабатывает запросы
от других клиентов
* Такой подход не так требователен
к ресурсам железа

Чтобы разобраться с принципом работы Node.js, нужно понять, из чего он состоит.

*V8 — это среда, которая интерпретирует и компилирует JavaScript-код в машинный код. V8 также поддерживает возможности ECMAScript 6: классы,
стрелочные функции, промисы и другие. Такая среда исполнения работает в браузере Google Chrome и многих других.
* libUV — это библиотека на языке C, которая используется в Node.js для
обработки асинхронных операций ввода-вывода (I/O). Она отвечает за
предоставление асинхронных операций I/O и управление событийным
циклом.
* Менеджер пакетов NPM — это программа, которая позволяет устанавливать
и использовать дополнительные модули и библиотеки из общедоступного
репозитория. Об NPM мы подробно поговорим во второй лекции.

Контекст выполнения — это механизм, который позволяет интерпретатору
понимать, какие переменные и функции доступны для использования в текущий
момент.
Существует два контекста выполнения:
* Глобальный — создается при запуске скрипта. В него записываются все
переменные и функции, которые мы определим в скрипте.
* Контекст функции — создается во время вызова функции. В него
записываются переменные и функции, которые были определены внутри
исходной функции

Стек — это абстрактный тип данных, представляющий собой список элементов,
организованных по принципу LIFO (last in, first out), то есть последний добавленный
элемент будет первым удаленным. Чаще всего принцип работы стека сравнивают
со стопкой тарелок: есть стопка из трех тарелок, чтобы взять вторую, нужно сначала
взять третью.

Стек вызовов (call stack) — это механизм для отслеживания текущего контекста и
порядка вызовов функций. Каждый раз, когда функция вызывается, она
добавляется в стек вызовов. Когда функция завершается, она удаляется из стека
вызовов.


При запуске скрипта всегда создается глобальный контекст.
* Все объявленные переменные и функции в скрипте записываются в
глобальный контекст.
* Вызов функции создает новый контекст, и он добавляется в стек вызовов.
* Если в текущем контексте функции нет искомой переменной или функции,
интерпретатор ищет переменные и функции в контексте ниже по стеку.
* Для функций может быть создано столько контекстов, сколько позволяет
размер стека вызовов.

### Как связан интерпретатор V8 с библиотекой libUV?

В интернете часто говорят, что JavaScript выполняется в единственном потоке и не
имеет возможности параллельного выполнения кода. Это не совсем верно, так как
рассматривать JavaScript в отрыве от платформы, на которой он запускается,
некорректно.

Правильнее будет сказать, что движок, который интерпретирует JavaScript,
работает в одном потоке, но платформа, в рамках которой запускается движок,
позволяет достигнуть параллелизма в некоторых случаях, в том числе за счет
потоков.

В Node.js используется движок V8, и сам по себе он интерпретирует и выполняет
JavaScript-код в одном потоке выполнения. Это значит, что невозможно выполнить
две операции параллельно, код будет выполняться в том порядке, в котором был
написан, согласно правилам исполнения кода в JavaScript. Но в Node.js, помимо
самого движка V8, есть еще библиотека libUV.

```javascript 
setTimeout(() => {
  console.log('log in settimeout');
}, 1000);
console.log('log in global context');
```

При запуске скрипта с помощью Node.js инициализируется движок V8. В него
передаются разные переменные и функции, которые не являются частью
интерпретатора, такие как setTimeout. 

Когда мы вызываем setTimeout, мы передаем nв него два аргумента — колбек и время, через которое нужно вызвать
соответствующий колбек. Тут и происходит магия. Адрес колбека, который мы передаем, отправляется в libUV вместе с временем, через которое нужно вызвать этот колбек.

 Далее libUV инициализирует внутри себя таймер и постоянно
проверяет, не пришло ли время выполнить колбек. Как раз поэтому V8 свободен и
может выполнять код дальше, ведь таймер обрабатывается на стороне libUV.

1. При запуске скрипта инициализируется V8 и LibUV.
2. Далее начинается выполнение кода. Запускается функция setTimeout, ивызов функции добавляется в стек вызовов.
3. Как только функция setTimeout попадает в стек вызовов, происходит передача всех необходимых данных библиотеке libUV — это адрес колбека,
инициализированного в первом аргументе setTimeout(), и время таймера из второго аргумента.

4. Далее выполнение функции setTimeout завершается, и контекст функции извлекается из стека вызовов V8. Но что происходит в libUV? Здесь стоит
пояснить, что такое цикл событий. Цикл событий — это бесконечный цикл, который работает до тех пор, пока в
нем есть какие-либо задачи на выполнение. В нашем случае в цикл событий попадает таймер, и цикл на каждой итерации проверяет, достиг ли таймер
нужного времени.

<image src="./images/1.jpg">

5. После выполнения setTimeout на пятой строчке выполняется функция log()
глобального объекта console. Она добавляется в стек вызовов. Обратите внимание, что пока выполняется функция log(), в цикле событий содержится задача-таймер, которая еще не выполнилась, так как не пришло время.

6. После того как выполнится функция log() на пятой строчке, ее контекст
извлечется из стека событий. После этого в коде нечего выполнять. Но
Node.js не прекратит выполнение скрипта, так как есть зарегистрированная
задача в цикле событий. Что же произойдет, когда таймер достигнет нужного
времени? Адрес колбека передастся в очередь колбеков Callback Queue.
Очередь колеков нужна для того, чтобы хранить адреса функций, которые
нужно выполнить в интерпретаторе

<image src="./images/2.jpg">

7. После того как адрес колбека передастся в очередь колбеков, libUV проверит стек вызовов в V8. Если он окажется пустым (и только в этом случае), передаст в стек вызовов адрес функции, а V8 создаст для колбека контекст и начнет выполнять этот колбек.

<image src="./images/3.jpg">

8. Далее, так как в интерпретаторе была вызвана функция колбек, выполняется
тело этой функции и запускается функция log() глобального объекта console.
Эта функция добавляется в стек вызовов.

<image src="./images/4.jpg">

9. Когда выполнится функция log(), ее контекст извлечется из стека вызовов.

10. После этого, так как в колбеке больше нет кода, колбек также завершает свое выполнение и извлекается из стека вызовов.

Чтобы лучше понять работу Node.js, можно использовать
[Loupe](http://latentflip.com/loupe/?code=JC5vbignYnV0dG9uJywgJ2NsaWNrJywgZnVuY3Rpb24gb25DbGljaygpIHsKICAgIHNldFRpbWVvdXQoZnVuY3Rpb24gdGltZXIoKSB7CiAgICAgICAgY29uc29sZS5sb2coJ1lvdSBjbGlja2VkIHRoZSBidXR0b24hJyk7ICAgIAogICAgfSwgMjAwMCk7Cn0pOwoKY29uc29sZS5sb2coIkhpISIpOwoKc2V0VGltZW91dChmdW5jdGlvbiB0aW1lb3V0KCkgewogICAgY29uc29sZS5sb2coIkNsaWNrIHRoZSBidXR0b24hIik7Cn0sIDUwMDApOwoKY29uc29sZS5sb2coIldlbGNvbWUgdG8gbG91cGUuIik7!!!PGJ1dHRvbj5DbGljayBtZSE8L2J1dHRvbj4%3D) — инструмент визуализации работы v8 и цикла событий. 

<u>Важно знать, что Loupe не умеет работать со стрелочными функциями.</u>

***В браузере вместо libUV трудится библиотека WebAPI.***


### Резюмируя все, что мы разобрали касаемо работы Node.js, можем выделить важные тезисы:
* V8 работает в одном потоке, но libUV забирает на себя часть асинхронных задач, что позволяет не останавливать работу интерпретатора.
* Цикл событий в libUV — это бесконечный цикл, который работает до тех пор, пока есть задачи на выполнение и интерпретатор выполняет код.
* Помимо таймеров, libUV позволяет выполнять различные задачи: чтение и запись файлов, обработку сетевых запросов, запуск отдельных потоков и многое другое. Все это будет выполняться в рамках libUV, эти задачи не будут блокировать выполнение кода интерпретатором

## Установка Node.js

Зайдите на официальный сайт [nodejs](https://nodejs.org/en) и перейдите в раздел DOWNLOADS.

После установки Node.js его работоспособность можно проверить командой
`node -v` Эта команда позволяет узнать,
какая версия Node.js установлена на компьютере

## Способы запуска кода

Есть два способа запустить Javascript-код в Node.js — REPL и запуск файла с JS-кодом. Для начала разберемся, что такое REPL.

***REPL*** (Read-Eval-Print Loop) — это интерактивная оболочка для исполнения кода в Node.js в консоли. REPL позволяет вводить JavaScript-выражения и получать результат их выполнения.

Чтобы запустить REPL, нужно открыть терминал и ввести команду node без аргументов. Вы увидите приглашение к вводу, которое обозначается символом `>`
REPL сохраняет значения переменных в памяти, пока мы не закроем оболочку. Эти команды начинаются с символа `.` (точка). Например, если мы хотим посмотреть
список всех доступных команд, можем использовать команду `.help`

`Ctrl + D` выйти из режима REPL

В целом, режим REPL может подойти для написания простых скриптов, проверки маленького кусочка кода на работоспособность или для того, чтобы вспомнить, как работает та или иная конструкция языка

### Запуск JavaScript-файлов
Для запуска фалйа используем команду: `node nameFile.js`, где **nameFile.js** имя файла скрипта.

## Написание простого веб-сервера

1. Создаем файл `index.js`
2. Импортируем модуль HTTP с помощью функции
`require()`. Эта функция возвращает объект, который содержит функции и
объекты модуля HTTP
```javascript 
const http =require('http');
```
3.Создаем объект `server` с помощью функции
`http.createServer()`. Эта функция принимает в качестве аргумента функцию обратного вызова (callback), которая будет вызываться при каждом
HTTP-запросе к серверу. Эта функция обратного вызова получает два параметра: `req` и `res`. Параметр `req` представляет объект HTTP-запроса, а
параметр `res` представляет объект HTTP-ответа.

```javascript 
const server = http.createServer((req, res)=>{
    console.log('Запрос на сервер получен')
})
```
4. Указываем порт для запуска сервера с помощью
метода `server.listen()`. Этот метод принимает два аргумента: порт и функцию обратного вызова, которая будет вызываться при успешном запуске сервера.
```javascript
const port = 3000;
server.listen(port, ()=>{
    console.log(`Сервер запущен на порту: ${port}`)
})
```

5. Запускаем скрипт командой `node index.js`

Обратите внимание, что программа не завершает свое выполнение после запуска, как обычные JS-скрипты. Программа как бы зависает в бесконечном выполнении.
Все это происходит потому, что мы запустили HTTP-сервер и он должен постоянно ожидать запроса от клиентов, не должен завершаться, пока мы не захотим это сделать руками. Такое поведение обеспечивает libUV. Чтобы завершить скрипт, нужно вызвать функцию остановки сервера `.close()`, libUV перестанет слушать порт и выполнение скрипта остановится.

### Как отправлять HTTP-ответы с помощью объекта res?

Объект res в колбеке представляет HTTP-ответ, который мы можем отправить клиенту в ответ на его HTTP-запрос. У объекта res есть различные свойства и
методы, которые позволяют нам управлять содержимым и форматом ответа.

Метод `res.writeHead()` позволяет установить заголовки ответа — метаданные, которые передаются вместе с данными ответа и содержат информацию об их
типе, размере, кодировке и других характеристиках. Метод `res.writeHead()` принимает два аргумента:
* Код состояния (status code) — число, которое указывает на результат обработки запроса сервером. Например, код 200 означает успешный ответ, а код 404 — что запрашиваемый ресурс не найден.
* Объект заголовков (headers) — объект, который содержит пары ключ-значение, где ключ — это имя заголовка, а значение — это значение заголовка. Например, `{‘Content-Type’: ‘text/html’}` означает,
что тип данных ответа — это HTML-текст.

Метод `res.end()` позволяет завершить отправку ответа. Этот метод принимает один необязательный аргумент: данные (data).
* Данные — это строка или буфер, содержащие данные ответа, которые мы хотим отправить клиенту. Например, '\<h1>Hello world!\</h1>' означает, что мы хотим отправить HTML-текст с заголовком «Hello world!». Если мы не передаем аргумент `data` в метод `res.end()`, то мы отправляем пустой ответ

В теле колбека `createServer() ` допишем две строчки:

```javascript
res.writeHead(200, {'Content-Type': 'text/html; charset=UTF-8'});
res.end('<h1>Добро пожаловать на мой сайт </h1>')
```
В первом аргументе функции `res.writeHead()` мы указываем, какой код ответа будет на этот запрос. Вторым аргументом передаем объект заголовков, где указываем
единственный заголовок `Content-Type` со значением `text/html; charset=UTF-8.` Это нужно, чтобы указать браузеру, как правильно читать тело ответа.

Метод `res.end() `завершает выполнение запроса на наш сервер и принимает в качестве аргумента строку с данными, которые мы хотим вернуть.

Теперь, если мы запустим этот код и перейдем в браузере по адресу
`http://localhost:3000/`, то мы увидим страницу с заголовком «Добро пожаловать на мой сайт!».

### Как обрабатывать разные пути запроса?

Но что, если мы хотим сделать две разные страницы? Например:
1. `http://localhost:3000/home`
2. `http://localhost:3000/about`

Когда мы получаем запрос, и запускается наш обработчик запросов, мы всегда можем узнать, какой путь в адресной строке был передан. Пути в адресной строке еще называют `роутами`.

Финальный код будет выглядеть так:

```javascript 
const http =require('http');
const server =http.createServer((req, res)=>{
    console.log('Запрос получен');
    if (req.url ===='/home'){
        res.writeHead(
            200,
            {'Content-Type':'text/html; charset=UTF-8'}
        );
        res.end('<h1>Добро пожаловать на главную страницу</h1>')
    }
    else if(req.url==='/about'){
        res.writeHead(
            200,
            {'Content-Type':'text/html; charset=UTF-8'}
        );
        res.end('<h1>Добро пожаловать на  страницу о нас </h1>')
    }
});

const port =3000;
server.listen(port, ()=>{
    console.log('Сервер запущен')
})
```
Все, что мы сделали, — добавили два условных блока.
Объект запроса `req` имеет поле `url`, которое хранит строку со значением роута, который был передан во время запроса из браузера. Таким образом мы можем
обрабатывать любые роуты, в том числе роуты вида `/home/prices`, если, например,
нужно сделать подстраницу нашей главной страницы

### Как создать страницу 404?

Код `404` говорит о том, что искомой страницы на
ресурсе не существует. 
Добавим в блок `http.createServer` еще одну проверку:

```javascript 
else{
    res.writeHead(
        404,
        {'Content-Type':'text/html; charset=UTF-8'}
    );
    res.end('<h1>Страница не найдена </h1>')
}
```
**Дополнительные материалы**

* [Официальная документация Node.js](https://nodejs.org/docs/latest/api/)
* [Документация по модулю HTTP](https://nodejs.org/api/http.html)
* [Протокол HTTP](https://developer.mozilla.org/ru/docs/Web/HTTP/Overview)

# Лекция 2