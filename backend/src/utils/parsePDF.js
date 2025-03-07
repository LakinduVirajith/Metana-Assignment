import pdfParse from "pdf-parse/lib/pdf-parse.js";

export const parsePDF = async (buffer) => {
    const pdfData = await pdfParse(buffer);
    const text = pdfData.text;
    return extractInfoFromText(text);
};

const extractInfoFromText = (text) => {
    return {
        name: extractSection(text, /(?:Name|Full Name):?\s*(.+)/i),
        email: extractSection(text, /(?:Email|E-mail):?\s*([\w._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,})/i),
        phoneNumber: extractSection(text, /(?:Phone|Contact):?\s*(\+?\d[\d\s-]+)/i),
        education: extractSection(text, /(?:Education|Academic Background):?\s*([\s\S]+?)(?:Qualifications|Experience|$)/i),
        qualifications: extractSection(text, /(?:Qualifications|Certifications):?\s*([\s\S]+?)(?:Projects|Experience|$)/i),
        projects: extractSection(text, /(?:Projects|Portfolio):?\s*([\s\S]+?)(?:Experience|$)/i),
    };
};

const extractSection = (text, regex) => {
    const match = text.match(regex);
    return match ? match[1].trim() : "Not Found";
};
