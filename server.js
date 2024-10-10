const express = require('express');
const app = express();
const port = 8580;

function composeForm(values, errors) {
    return `
    ${errors ? 'Исправьте ошибки, пожалуйста.' : ''}
    <form method="get" action="/submit">
            <span> ${errors?.name || ''}</span>
            <br>
            <label for="name">Имя пользователя:</label>
            <input tipe="text" name="name" value="${removeHTML(values.name)}">
            <br>
            <span> ${errors?.age || ''}</span>
            <br>
            <label for="age">Возраст:</label>
            <input type="number" name="age" value="${values.age}">
            <br>
            <input type="submit" value="Отправить">
        </form>`

}

function successForm(values) {
    return ` Добро пожаловать, ${removeHTML(values.name)}! Ваш возраст ${values.age}!`
}

app.get('/', (req, res) => {
    res.send(composeForm({ name: '', age: ''}, null));
});

app.get('/submit', (req, res) => {
    let errors = [];
    let errorsFlag = false;
    if (!req.query.name) {
        errors.name = 'Имя пользователя не может быть пустым';
        errorsFlag = true;
    }
    if (unValidateText(req.query.name)) {
        errors.name = 'Имя пользователя может содержать только буквы';
        errorsFlag = true;
    }
    if (!req.query.age) {
        errors.age ='Возраст пользователя не может быть пустым';
        errorsFlag = true;
    }
    if (errorsFlag) {
        res.send(composeForm(req.query, errors));
    } else {
        res.send(successForm(req.query));
    }
    
});

app.listen(port, () => {
    console.log(`Сервер запущен на порту ${port}`);
});

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

function unValidateText(text) {
    const chars = Array.from(text);

    for (let char of chars) {
        if (!/[a-zA-Zа-яА-Я]/.test(char)) {
            return true;
        }
    }
}