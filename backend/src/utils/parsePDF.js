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
        education: extractSection(text, /(?:Education|Academic Background):?\s*([\s\S]+?)(?:Qualifications|Certifications|Courses|Projects|Portfolio|Experience|Achievements|References|$)/i),
        qualifications: extractSection(text, /(?:Qualifications|Certifications|Courses):?\s*([\s\S]+?)(?:Education|Academic Background|Projects|Portfolio|Experience|Achievements|References|$)/i),
        projects: extractSection(text, /(?:Projects|Portfolio):?\s*([\s\S]+?)(?:Education|Academic Background|Qualifications|Certifications|Courses|Experience|Achievements|References|$)/i),
    };
};

const extractSection = (text, regex) => {
    const match = text.match(regex);
    return match ? match[1].trim() : "Not Found";
};
