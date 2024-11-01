const express = require('express');
const app = express();
const port = 8580;

app.use(express.urlencoded({ extended: true }));
app.use(express.json());

//Функция компонирования формы
function composeForm(values, errors) {
    return `
    ${errors ? 'Исправьте ошибки, пожалуйста.' : ''}
    <form method="POST" action="/submit">
            <span> ${errors ? errors.name : ''}</span>
            <br>
            <label for="name">Имя пользователя:</label>
            <input type="text" name="name" value="${removeHTML(values.name)}">
            <br>
            <label for="age">Возраст:</label>
            <input type="number" name="age" value="${values.age}" required>
            <br>
            <input type="submit" value="Отправить">
        </form>`

}

//Функция обработки успешного запроса
function successForm(values) {
    return ` Добро пожаловать, ${removeHTML(values.name)}! Ваш возраст ${values.age}!`
}

//Исходная страница
app.get('/', (req, res) => {
    res.send(composeForm({ name: '', age: '' }, null));
});

//Обработчик GET-запроса
app.get('/success', (req, res) => {
    console.log(req.query);
    
    res.send(successForm(req.query));
});

//Обработчик формы
app.post('/submit', (req, res) => {
    let errors = [];
    let errorsFlag = false;
    console.log(req.body);
    
    if (!req.body.name) {
        errors.name = 'Имя пользователя не может быть пустым';
        errorsFlag = true;
    }
    if (unValidateText(req.body.name)) {
        errors.name = 'Имя пользователя может содержать только буквы';
        errorsFlag = true;
    }
    if (errorsFlag) {
        res.send(composeForm(req.body, errors));
    } else {
        res.redirect(301, `/success?name=${req.body.name}&age=${req.body.age}`);
    }

    
});

//Запуск сервера
app.listen(port, () => {
    console.log(`Сервер запущен на порту ${port}`);
});

//Функция очистки HTML
function removeHTML(text) {
    if (!text)
        return text;
    text = text.toString()
        .split("&").join("")
        .split("<").join("")
        .split(">").join("")
        .split('"').join("")
        .split("'").join("");
    return text;
}

//Функция проверки на буквы
function unValidateText(text) {
    const chars = Array.from(text);

    for (let char of chars) {
        if (!/[a-zA-Zа-яА-Я]/.test(char)) {
            return true;
        }
    }
}