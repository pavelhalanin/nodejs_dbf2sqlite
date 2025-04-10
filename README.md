## Что делает этот код?

Из папки dbf (любой вложености папки) с файлами *.dbf создасться таблицы в SQLite.

Имена таблицы - путь до файла.

Замена пути, чтобы получить наименование таблицы:
- `./` => `<пустота>`
- `.DBF` => `<пустота>`
- `.dbf` => `<пустота>`
- `[~\d\w]` (не число и не буква) => `_`

Пример:

```
Путь до DBF                             => Таблица в SQLite
./dbf/table1.DBF                        => dbf_table1
./dbf/table2.dbf                        => dbf_table2
./dbf/folder1/table11.DBF               => dbf_folder1_table11
./dbf/folder1/table12.dbf               => dbf_folder1_table12
./dbf/folder1/sub1/table111.DBF         => dbf_folder1_sub1_table111
./dbf/folder1/sub1/table112.dbf         => dbf_folder1_sub1_table112
./dbf/folder1/sub1/sub2/table1121.DBF   => dbf_folder1_sub1_sub2_table1121
./dbf/folder1/sub1/sub2/table1122.dbf   => dbf_folder1_sub1_sub2_table1122
```

## Как запустить

1. Если не установлен NodeJS, установить NodeJS.
1. Если не установлены пакеты node_modules, установить пакеты node_modules.
    ```
    npm i
    ```
1. Если установлены пакеты node_modules, запустить скрипт:
    ```
    node main.js
    ```
1. Если скрипт выполнился,
то появится база данных database.sqlite,
которую посмотреть можно в VSCode,
имея расширение `SQLite Viewer`.
