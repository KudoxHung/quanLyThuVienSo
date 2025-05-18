import TheThuVienGV from "../../../asset/files/MT_TheThuVien_GVMaVach.docx";
import TheThuVienHS from "../../../asset/files/MT_TheThuVien_HSMaVach.docx";
import Docxtemplater from "docxtemplater";
import { saveAs } from "file-saver";
import PizZip from "pizzip";
import PizZipUtils from "pizzip/utils/index.js";

function loadFile(url, callback) {
  PizZipUtils.getBinaryContent(url, callback);
}
export const generateDocument = (data, unitID) => {
  let docType = "";
  switch (unitID) {
    case "623c8912-7675-446f-9106-98180fe057d4":
      docType = TheThuVienHS;
      break;
    case "623c8912-7675-446f-9106-98180fe057d5":
      docType = TheThuVienGV;
      break;
    default:
      break;
  }

  loadFile(docType, function (error, content) {
    if (error) {
      throw error;
    }
    var zip = new PizZip(content);
    var doc = new Docxtemplater(zip, {
      paragraphLoop: true,
      linebreaks: true
    });
    doc.setData(data);
    try {
      doc.render();
    } catch (error) {
      function replaceErrors(key, value) {
        if (value instanceof Error) {
          return Object.getOwnPropertyNames(value).reduce(function (error, key) {
            error[key] = value[key];
            return error;
          }, {});
        }
        return value;
      }
      console.log(JSON.stringify({ error: error }, replaceErrors));

      if (error.properties && error.properties.errors instanceof Array) {
        const errorMessages = error.properties.errors
          .map(function (error) {
            return error.properties.explanation;
          })
          .join("\n");
        console.log("errorMessages", errorMessages);
        // errorMessages is a humanly readable message looking like this :
        // 'The tag beginning with "foobar" is unopened'
      }
      throw error;
    }
    var out = doc.getZip().generate({
      type: "blob",
      mimeType: "application/vnd.openxmlformats-officedocument.wordprocessingml.document"
    }); //Output the document using Data-URI
    saveAs(out, `TheThuVien-${data?.userCode}.docx`);
  });
};
