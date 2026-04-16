## Build and run

1. `docker-compose up -d --build`
2. `docker exec -it symfony_php composer install`
3. `docker exec -it symfony_php php bin/console doctrine:database:create`
4. `docker exec -it symfony_php php bin/console doctrine:migrations:migrate`