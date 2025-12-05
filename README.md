## Тестовое задание

> _Стек TypeScript + Express + TypeORM + MariaDB._

Для запуска `docker compose up --build` - будет запущена база и сервер.

Запуск базы в докере:

```bash
docker run --name mariadb -e MARIADB_ROOT_PASSWORD=root -e MARIADB_DATABASE=test_db -e MARIADB_USER=user -e MARIADB_PASSWORD=root -p 3306:3306 -d mariadb
```

#### Пример создания юзера:

```bash
curl localhost:3000/users \
    --request PUT \
    --data '{ "username": "Ivan Ivanov", "password": "test1" }' \
    --header 'Content-Type: application/json'
```

#### Пример создания поста:

```bash
curl localhost:3000/posts \
    --request PUT \
    --data '{ "title": "Title", "content": "some content", "user_id": 1 }' \
    --header 'Content-Type: application/json'
```

#### Весь API:

```
GET     /users/:id
PUT     /users < payload: { username: string, password: string }
DELETE  /users/:id

GET     /posts/:id
GET     /posts/user/:user_id -> []
PUT     /posts < payload: { title: string, content: string, user_id: number }
DELETE  /posts/:id
```


```sql
CREATE TABLE user (
  id integer PRIMARY KEY,
  name varchar,
  password integer,
  created_at timestamp,
  updated_at timestamp
);

CREATE TABLE post (
  id integer PRIMARY KEY,
  user_id integer FOREIGN KEY,
  title text,
  contetn text,
  created_at timestamp,
  updated_at timestamp
);

```