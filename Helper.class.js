const fs = require("fs");
const path = require("path");
const { open } = require("sqlite");
const sqlite3 = require("sqlite3");
const iconv = require("iconv-lite");
const { DBFFile } = require("dbffile");

module.exports = class Helper {
  static async getDatabaseConnect() {
    return await open({
      filename: "./database.sqlite",
      driver: sqlite3.Database,
    });
  }

  static async printDbfRows_byPath(path) {
    const dbf = await DBFFile.open(path);

    const DATABASE_NAME = `${path}`
      .replace("./", "")
      .replace(".dbf", "")
      .replace(".DBF", "")
      .replace(/[^\d\w]/g, "_");
    const ARRAY_COLS = await dbf.fields.map((f) => f.name);
    const ARRAY_DATA_COLS = await dbf.fields;

    const ARRAY_ROWS = await dbf.readRecords(dbf.recordCount);

    const SQL_DROP_TABLE = `DROP TABLE IF EXISTS ${DATABASE_NAME};`;

    const SQL_CREATE_TABLE = `CREATE TABLE ${DATABASE_NAME} (\t${ARRAY_COLS.map(
      (col) => `${col} TEXT`
    ).join(",\n\t")}\n);`;

    const SQL_INSERT = `INSERT INTO
        ${DATABASE_NAME}
        (${ARRAY_COLS.join(", ")})
        VALUES
        ${ARRAY_ROWS.map(
          (row) =>
            `(${ARRAY_DATA_COLS.map((col_data) => {
              const COL_NAME = col_data.name;
              const COL_TYPE = col_data.type;

              if (COL_TYPE == "D") {
                const VALUE = row[COL_NAME];
                const D = new Date(VALUE);
                return `'${D.toJSON()}'`;
              }

              const VALUE = `${row[COL_NAME]}`;
              const RESULT = iconv.decode(VALUE, "win1251");

              return `'${RESULT}'`;
            }).join(", ")})`
        ).join(",\n\t")}
    `;

    const db = await Helper.getDatabaseConnect();
    try {
      // console.log(SQL_DROP_TABLE);
      await db.run(`${SQL_DROP_TABLE}`);

      // console.log(SQL_CREATE_TABLE);
      await db.run(`${SQL_CREATE_TABLE}`);

      // console.log(SQL_INSERT);
      await db.run(`${SQL_INSERT}`);
    } catch (exception) {
      console.error(exception);
    } finally {
      db.close();
    }
  }

  static getFilesList(folderPath) {
    const filesList = [];

    function readDirectory(directory) {
      const items = fs.readdirSync(directory);

      items.forEach((item) => {
        const fullPath = path.join(directory, item);
        const stats = fs.statSync(fullPath);

        if (stats.isDirectory()) {
          readDirectory(fullPath); // Рекурсия для вложенных директорий
        } else if (stats.isFile()) {
          filesList.push(fullPath);
        }
      });
    }

    readDirectory(folderPath);
    return filesList;
  }

  static consoleLogWithTime(log) {
    const D = new Date();

    const YYYY = D.getFullYear();
    const MM = `${D.getMonth() + 1}`.padStart(2, "0");
    const DD = `${D.getDate()}`.padStart(2, "0");

    const HH = `${D.getHours()}`.padStart(2, "0");
    const II = `${D.getMinutes()}`.padStart(2, "0");
    const SS = `${D.getSeconds()}`.padStart(2, "0");

    const DATE_TIME = `${YYYY}-${MM}-${DD}_${HH}-${II}-${SS}`;
    console.log(`[${DATE_TIME}] ${log}`);
  }

  static printProcent(i, length, text = "") {
    const PROCENT = Math.round((((i + 1) * 100) / length) * 100) / 100;
    const PROCENT_STR = Number(PROCENT).toFixed(2);

    const I = `${i + 1}`.padStart(4, "0");
    const LENGTH = `${length}`.padStart(4, "0");

    Helper.consoleLogWithTime(`${I}/${LENGTH} - ${PROCENT_STR}% ${text}`);
  }
};
