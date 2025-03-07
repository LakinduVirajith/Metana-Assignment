import { google } from "googleapis";
import auth from "./googleAuth.js";

const sheets = google.sheets({ version: "v4", auth });

export const saveDataToSheet = async (data) => {
    try {
        const spreadsheetId = process.env.GOOGLE_SHEET_ID;
        const sheetName = process.env.GOOGLE_SHEET_NAME || "Sheet1";
        const range = `${sheetName}!A:G`;
        
        // HEADERS FOR THE FIRST ROW
        const headers = [["Name", "Email", "Phone Number", "Education", "Qualifications", "Projects", "CV URL"]];
        const values = [[data.name, data.email, data.phoneNumber, data.education, data.qualifications, data.projects, data.cvUrl]];

        // CHECK IF THE SHEET ALREADY HAS DATA
        const checkResponse = await sheets.spreadsheets.values.get({
            spreadsheetId,
            range: `${sheetName}!A1:A1`,
        });

        if (!checkResponse.data.values) {
            await sheets.spreadsheets.values.append({
                spreadsheetId,
                range,
                valueInputOption: "USER_ENTERED",
                requestBody: { values: headers },
            });
        }

        const response = await sheets.spreadsheets.values.append({
            spreadsheetId,
            range,
            valueInputOption: "USER_ENTERED",
            requestBody: { values },
        });

        console.log("Data saved to Google Sheet:", response.data);
        return true;
    } catch (error) {
        console.error("Error saving data to Google Sheet:", error);
        return false;
    }
};
