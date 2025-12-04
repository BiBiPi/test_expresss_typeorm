## Тестовое задание

> _Стек TypeScript + Express + TypeORM + MariaDB._

Для запуска `docker compose up` - будет запущена база и сервер.

Запуск базы в докере:

```bash
docker run --name mariadb -e MARIADB_ROOT_PASSWORD=root -e MARIADB_DATABASE=test_db -e MARIADB_USER=user -e MARIADB_PASSWORD=root -p 3306:3306 -d mariadb
```

Пример создания юзера:

```bash
curl localhost:3000/users \
    --request POST \
    --data '{ "name": "Ivan Ivanov" }' \
    --header 'Content-Type: application/json'
```