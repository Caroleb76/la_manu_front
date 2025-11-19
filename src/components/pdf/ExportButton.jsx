import { jsPDF } from "jspdf";

function ExportButton() {
  const handleExportPDF = () => {
    const doc = new jsPDF();
    doc.text("Hello world! This is your PDF.", 10, 10);
    doc.save("document.pdf");
  };

  return (
    <button className="btn btn-primary" onClick={handleExportPDF}>
      Exporter en PDF
    </button>
  );
}

export default ExportButton;
