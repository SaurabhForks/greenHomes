import jsPDF from "jspdf";
import { CATEGORIES } from "./data";

export const exportPDF = (
  scenarioName,
  targetLevel,
  scores,
  selections,
  totalProjected,
) => {
  const doc = new jsPDF();
  const pageWidth = doc.internal.pageSize.width;
  let yPos = 20;

  // Header
  doc.setFontSize(20);
  doc.setTextColor(40, 90, 40); // Dark Green
  doc.text("IGBC Green Homes Feasibility Report", 14, yPos);
  yPos += 10;

  doc.setFontSize(12);
  doc.setTextColor(0, 0, 0);
  doc.text(`Scenario Name: ${scenarioName}`, 14, yPos);
  yPos += 7;
  doc.text(`Target Certification: ${targetLevel}`, 14, yPos);
  yPos += 7;
  doc.text(`Date: ${new Date().toLocaleDateString()}`, 14, yPos);
  yPos += 15;

  // Score Summary
  doc.setFillColor(240, 253, 244); // Light green bg
  doc.rect(14, yPos, pageWidth - 28, 25, "F");
  doc.setFontSize(14);
  doc.text(`Secured Points (Yes): ${scores.yes}`, 20, yPos + 10);
  doc.text(`Potential Points (Maybe): ${scores.maybe}`, 20, yPos + 18);
  doc.text(`Total Projected: ${totalProjected}`, 100, yPos + 14);
  yPos += 35;

  // Categories
  CATEGORIES.forEach((cat) => {
    if (yPos > 270) {
      doc.addPage();
      yPos = 20;
    }

    doc.setFontSize(16);
    doc.setTextColor(40, 90, 40);
    doc.text(`${cat.name} (${cat.totalPoints} pts)`, 14, yPos);
    yPos += 8;

    doc.setDrawColor(200, 200, 200);
    doc.line(14, yPos, pageWidth - 14, yPos);
    yPos += 10;

    cat.credits.forEach((credit) => {
      if (yPos > 270) {
        doc.addPage();
        yPos = 20;
      }

      const selection = selections[credit.id] || { status: "none", notes: "" };
      let statusText =
        selection.status === "yes"
          ? "[YES]"
          : selection.status === "maybe"
          ? "[MAYBE]"
          : selection.status === "no"
          ? "[NO]"
          : "[-]";

      doc.setFontSize(11);
      doc.setTextColor(0);

      // Status Column
      if (selection.status === "yes") doc.setTextColor(22, 163, 74);
      else if (selection.status === "maybe") doc.setTextColor(202, 138, 4);
      else if (selection.status === "no") doc.setTextColor(220, 38, 38);

      doc.text(statusText, 14, yPos);

      // Credit Name & Points
      doc.setTextColor(0);
      const pointsLabel = credit.mandatory ? "(Req)" : `(${credit.points} pts)`;
      doc.text(`${credit.name} ${pointsLabel}`, 40, yPos);

      yPos += 6;

      // Notes if any
      if (selection.notes) {
        doc.setFontSize(9);
        doc.setTextColor(100);
        doc.text(`Note: ${selection.notes}`, 40, yPos);
        yPos += 6;
      }
      yPos += 2;
    });
    yPos += 10;
  });

  doc.save(`${scenarioName.replace(/\s+/g, "_")}_Report.pdf`);
};
