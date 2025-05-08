import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";

export const generateReportPDF = async (data) => {
  // Create a new jsPDF instance with landscape orientation
  const doc = new jsPDF({
    orientation: "landscape",
  });

  // Set up the title
  const titleWidth = (doc.getStringUnitWidth(data.title) * doc.internal.getFontSize()) / doc.internal.scaleFactor;
  const titleX = (doc.internal.pageSize.width - titleWidth) / 2;
  doc.setFontSize(18);
  doc.text(data.title, titleX, 10); // Center the title

  // Extract headers from the first object in the type array
  const headers = Object.keys(data.type[0]);

  // Extract body data from the type array
  const body = data.type.map((item) => Object.values(item));

  // Calculate cell width based on the number of columns and available width
  const availableWidth = doc.internal.pageSize.width - 20; // Adjust 20 as needed for margin
  const cellWidth = availableWidth / headers.length;

  // Generate column styles dynamically
  const columnStyles = {};
  headers.forEach((header, index) => {
    columnStyles[index] = { cellWidth: cellWidth };
  });

  // Generate auto table with headers and body
  autoTable(doc, {
    head: [headers],
    body: body,
    startY: 20, // Adjust startY as needed
    startX: 10, // Adjust startX for margin
    theme: "grid",
    columnStyles: columnStyles,
  });

  // Save the data to the file
  const outputPath = `../PDF/reports/${data.title}-report.pdf`;
  doc.save(outputPath);

  return outputPath;
};

