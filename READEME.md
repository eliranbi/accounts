
start postgreSQL server 
-------------------------------

docker run --name ebiPostgresql -e POSTGRES_USER=admin -e POSTGRES_PASSWORD=password -p 5432:5432 -d postgres

create postfreSQL account and wallet tables ( wallet for wallet services ... )
--------------------------------------------------------------------------------
cd scripts
npx tsc create-table.ts
node create-table.js


start wallet services first .. 
-------------------------------
cd src
npx tsc wallet-services.ts
node wallet-services.js

start account services ...
-------------------------------
cd src
npx tsc server.ts
node wallet-server.js
