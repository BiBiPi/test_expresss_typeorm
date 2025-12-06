## Тестовое задание

> _Стек: TypeScript + Express + TypeORM + MariaDB + JWT._

Для запуска `docker compose up --build` - будет запущена база и сервер.

##### Запуск базы в докере:

```bash
docker run --name mariadb -e MARIADB_ROOT_PASSWORD=root -e MARIADB_DATABASE=test_db -e MARIADB_USER=user -e MARIADB_PASSWORD=root -p 3306:3306 -d mariadb
```

##### Пример создания юзера:

```bash
curl localhost:3000/users \
    --request POST \
    --data '{ "username": "Ivan Ivanov", "password": "test1" }' \
    --header 'Content-Type: application/json'
```

##### Вход, проверка и токен:

```bash
curl localhost:3000/signin \
    --request POST \
    --data '{ "username": "Ivan Ivanov", "password": "test1" }' \
    --header 'Content-Type: application/json'
```

> _Пароль генерируется с солью, возвращает __JWT__ с __USER_ID__ в пайлоаде._

```typescript
{ access_tocken: string }
```

##### Пример создания поста:

```bash
curl localhost:3000/posts \
    --request PUT \
    --data '{ "title": "Title", "content": "some content", "access_token": "..." }' \
    --header 'Content-Type: application/json'
```

##### Получть посты с пагинацией:

```bash
curl localhost:3000/posts/:page/:limit
```

##### Весь API:

```
POST    /signin < payload: { username: string, password: string }
POST    /users < payload: { username: string, password: string } - create user
DELETE  /users/:id

GET     /posts/:page/:limit
PUT     /posts < payload: { title: string, content: string, access_token: string }
DELETE  /posts/:id
```

##### Схема таблиц:

```sql
create table users (
  id integer primary key,
  name varchar unique,
  password integer,
  created_at timestamp,
  updated_at timestamp
);

create table posts (
  id integer primary key,
  user_id integer foreign key,
  title text,
  contetn text,
  created_at timestamp,
  updated_at timestamp
);
```