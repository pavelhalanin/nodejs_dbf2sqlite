const fs = require("fs");
const Helper = require("./Helper.class");

(async function () {
  try {
    Helper.consoleLogWithTime("< < < < < < < <");

    const DBF_FOLDER = "./dbf";
    if (!fs.existsSync(DBF_FOLDER)) {
      fs.mkdirSync(DBF_FOLDER, { recursive: true });
    }

    const DBF_PATH_ARRAY = Helper.getFilesList(DBF_FOLDER);
    console.log(DBF_PATH_ARRAY);

    const LENGTH = DBF_PATH_ARRAY.length;
    for (let i = 0; i < LENGTH; ++i) {
      const DBF_PATH = `./${DBF_PATH_ARRAY[i]}`;
      Helper.printProcent(i, LENGTH, `=> ${DBF_PATH}`);
      Helper.printDbfRows_byPath(DBF_PATH);
    }
  } catch (exception) {
    console.error(exception);
  } finally {
    Helper.consoleLogWithTime("> > > > > > > >");
  }
})();
