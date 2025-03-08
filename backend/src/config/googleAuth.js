import { google } from "googleapis";

const auth = new  google.auth.GoogleAuth({
    keyFile: "google-service-account.json",
    scopes: [
        "https://www.googleapis.com/auth/drive",
        "https://www.googleapis.com/auth/spreadsheets"
    ],
})

export default auth;