# Как работать над проектом

## Окружение

* Node.JS (16.18.0)
* Docker

```bash
npm install
```

Команда запустит процесс установки зависимостей проекта из **npm**.

### Сценарии

В `package.json` предопределено несколько сценариев.

#### Запустить проект

```bash
npm start
```

В процессе запуска проекта будет выполнен процесс «Сборки проекта» и запуска результирующего кода.

#### Запустить проект в режиме разработчика

```bash
npm run dev
```

Запуск в режиме разработки (есть автоматический перезапуск через nodemon)

#### Собрать проект

```bash
npm run build
```

Выполняет сборку проекта: удаляет ранее скомпилированный проект и компилирует заново.

#### Проверить линтером

```bash
npm run lint
```

Запуск проверки проекта статическим анализатором кода **ESLint**.

Линтер проверяет файлы только внутри директории `src`.

**Обратите внимание**, при запуске данной команды, ошибки выводятся в терминал.

#### Скомпилировать проект

```bash
npm run compile
```

Создаст директорию `dist` где будет проектик

#### Удалить скомпилированный проект

```bash
npm run clean
```

Очищает содержимое директории `dist`

#### Запустить ts-модуль без компиляции

```bash
npm run ts -- <Путь к модулю с ts-кодом>
```

Пакет `ts-node` позволяет выполнить TS-код в Node.js без предварительной компиляции. Используется только на этапе разработки.

#### Запустить фейковый сервер

```bash
npm run mockServer
```

Запускает сервер из которого можно получить данные `mockData.json` данных. Обязателен для работы команды **generate** в cli

#### Запустить redoc

```bash
npm run doc
```

Запускает [по ссылке](http://localhost:8080) спецификацию в формате OpenAPI 3 (использую redoc-cli вместо @redocly/cli из-за проблем с запуском на node 16.18.0).

### Переменные окружения

Файл с примером переменных окружения — `.env.example`.
Чтобы запустить проект скопируйте содержимое в `.env` файлик.

```plaintext
PORT=8000
SALT='Vladik'
DB_HOST=127.0.0.1
DB_USER='vladik'
DB_PASSWORD='kotikvacia'
DB_PORT=27017
DB_NAME='what-to-watch-db'
JWT_SECRET='secret'
UPLOAD_DIRECTORY='/upload'
STATIC_DIRECTORY='/static'
HOST='localhost'
```

### Работа с БД

* Чтобы поднять локально базу данных нужно выполнить `docker-compose up -d` (опция `-d` позволяет запустить процесс в фоне и не блокировать консоль)
* Чтобы закрыть базу данных можно выполнить команду `docker-compose down`

### Запросы к серверу

Файл с запросами `queries.http` (можно отправлять из редактора если есть расширение или из Postman)

#### Пример запроса

```http
# Фильмы
## Добавить фильм
POST http://localhost:8000/movies/create HTTP/1.1
Accept: application/json
Content-Type: application/json
Authorization: Bearer eyJhbGciOiJIUzI1NiJ9.eyJlbWFpbCI6InZhc2lrQG1haWwuY29tIiwiaWQiOiI2M2M0NThjNWMwNjkwNmZhZDc5YTk4NzgiLCJpYXQiOjE2NzM4MTIyMTYsImV4cCI6MTY3Mzk4NTAxNn0.F-QKIkJYUgD3gcFKKHfC4rUXAmAabcPLV5l4ybT3X1E

{
  "title": "Авиатор",
  "description": "Получив от отца небольшую фабрику, Говард Хьюз превратил ее в гигантское, фантастически прибыльное предприятие. Став владельцем огромной кинокомпании, он снял самый дорогой для своего времени фильм и покорил сердца прелестнейших голливудских актрис.",
  "publishingDate": "2005-05-02T23:59:33.903Z",
  "genre": "drama",
  "releaseYear": 2005,
  "rating": 8,
  "commentsCount": 290,
  "previewPath": "https://what-to-watch.ru/preview/aviator.jpg",
  "moviePath": "https://what-to-watch.ru/movie/aviator.jpg",
  "actors": [
    "Леонардо Ди Каприо",
    "Кейт Бланшетт",
    "Джуд Лоу"
  ],
  "director": "Мартин Скорсезе",
  "duration": 169,
  "posterPath": "aviator.jpg",
  "backgroundImagePath": "OG9SaAd2MsLsln8cdBWAi.jpeg",
  "backgroundColor": "pink"
}
```

#### Пример ответа

```plaintext
HTTP/1.1 201 Created
X-Powered-By: Express
Access-Control-Allow-Origin: *
Content-Type: application/json; charset=utf-8
Content-Length: 1177
ETag: W/"499-bnTyDhrlOrKU9+FxN2IXL4gDhg0"
Date: Mon, 16 Jan 2023 06:34:54 GMT
Connection: close

{
  "title": "Авиатор",
  "description": "Получив от отца небольшую фабрику, Говард Хьюз превратил ее в гигантское, фантастически прибыльное предприятие. Став владельцем огромной кинокомпании, он снял самый дорогой для своего времени фильм и покорил сердца прелестнейших голливудских актрис.",
  "publishingDate": 1115078373903,
  "genre": "drama",
  "releaseYear": 2005,
  "rating": 8,
  "previewPath": "https://what-to-watch.ru/preview/aviator.jpg",
  "moviePath": "https://what-to-watch.ru/movie/aviator.jpg",
  "actors": [
    "Леонардо Ди Каприо",
    "Кейт Бланшетт",
    "Джуд Лоу"
  ],
  "director": "Мартин Скорсезе",
  "duration": 169,
  "user": {
    "id": "63c458c5c06906fad79a9878",
    "email": "vasik@mail.com",
    "name": "evik",
    "avatarPath": "http://localhost:8000/static/default-avatar.jpeg"
  },
  "posterPath": "http://localhost:8000/static/aviator.jpg",
  "backgroundImagePath": "http://localhost:8000/static/OG9SaAd2MsLsln8cdBWAi.jpeg",
  "backgroundColor": "pink",
  "commentsCount": 290
}
```

### Работа с консольной программой

`npm run ts ./src/cli.ts -- --import './mocks/test.tsv'` <— пример работы **import**

```plaintext
Подключение к БД MongoDB.
Соединение было успешно установлено.
Создан новый фильм: [object Object]
Создан новый фильм: Криминальное чтиво
Создан новый фильм: [object Object]
Создан новый фильм: Выживший
Создан новый фильм: [object Object]
Создан новый фильм: Выживший
Создан новый фильм: [object Object]
Создан новый фильм: Отель Гранд Будапешт
Создан новый фильм: [object Object]
Создан новый фильм: Королевство Полной Луны
Создан новый фильм: [object Object]
Создан новый фильм: Королевство Полной Луны
Создан новый фильм: [object Object]
Создан новый фильм: Выживший
Создан новый фильм: [object Object]
Создан новый фильм: Криминальное чтиво
Создан новый фильм: [object Object]
Создан новый фильм: Отель Гранд Будапешт
Создан новый фильм: [object Object]
Создан новый фильм: Отель Гранд Будапешт
10 строк записано в файл !
Соединение с базой данных было прервано.
```

`npm run ts ./src/cli.ts -- --help` <– пример работы команды **help**

```plaintext
Программа для подготовки данных для REST API сервера.

Пример:

    cli.js --<command> [--arguments]
    
Команды:

    --version                   # выводит номер версии
    --help                      # печатает этот текст
    --import <path>             # импортирует данные из TSV
```

`npm run ts ./src/cli.ts -- --version` <– пример работы команды **version**

```plaintext
.env файл был успешно прочитан.
1.0.1
```

`npm run ts ./src/cli.ts -- --generate 10 './mocks/demo.tsv' http://localhost:8888/api` <– пример работы **generate** (перед запуском нужно **обязательно** запустить )

```plaintext
.env файл был успешно прочитан.
Файл с мок данным ./mocks/demo.tsv был успешно создан
```
