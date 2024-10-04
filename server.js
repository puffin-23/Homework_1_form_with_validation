const express = require('express');
const app = express();
const port = 3000;

app.use(express.urlencoded({ extended: true }));

app.get('/', (req, res) => {
    res.send(`
        <form method="get" action="/submit">
            <label for="name">Имя пользователя:</label>
            <input id="name" name="name" required>
            <br>
            <label for="age">Возраст:</label>
            <input type="number" id="age" name="age" required>
            <br>
            <input type="submit" value="Отправить">
        </form>
    `);
});

app.get('/submit', (req, res) => {

   console.log(req.query);
console.log(req.body);

   let name = escapeHTML(req.query.name);
   let age = parseInt(req.query.age);

   console.log(name, age);


    // Серверная валидация
    if ( unValidateText(name) || age < 0) {
        res.status(400).send(`
         <h1>Введены некорректные данные</h1>
         <form method="get" action="/submit">
             <label for="name">Имя пользователя:</label>
             <input id="name" name="name" value="${name}" required>
             <br>
             <label for="age">Возраст:</label>
             <input type="number" id="age" name="age" value="${age}" required>
             <br>
             <input type="submit" value="Отправить">
         </form>
     `);
   } else {
        // Если валидация успешна
        res.send(`<h1>Добрый день, ${name}! Вам ${age} лет.</h1>`);
    }

});

app.listen(port, () => {
    console.log(`Сервер запущен на порту ${port}`);
});

function escapeHTML(text) {
   if ( !text )
       return text;
   text=text.toString()
       .split("&").join("&amp;")
       .split("<").join("&lt;")
       .split(">").join("&gt;")
       .split('"').join("&quot;")
       .split("'").join("&#039;");
   return text;
}

function unValidateText (text) {
    const chars = Array.from(text);
    
    for (let char of chars) {
        if ( !/[a-zA-Zа-яА-Я]/.test(char) ) {
            return true; 
        } 
    }
}