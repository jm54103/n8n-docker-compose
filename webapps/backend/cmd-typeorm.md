# TOP DOWN DESIGN ORM
npx typeorm-ts-node-commonjs migration:generate ./src/migrations/generate_tables -d ./src/data-source.ts
npx typeorm-ts-node-commonjs migration:run -d ./src/data-source.ts ระบุชื่อ CrateTables1774019036793.ts

npx typeorm-ts-node-commonjs migration:run -d ./src/data-source.ts