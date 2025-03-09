# Metana Assignment

# Technology Stack & Justification

## Frontend: React.js
- **Reason for choosing**: 
  - Component-based architecture, making the UI modular and reusable.
  - Provides a responsive interface with fast rendering using the Virtual DOM.

## Backend: Node.js with Express
- **Reason for choosing**:
  - Asynchronous and non-blocking, ideal for handling multiple requests efficiently.
  - Express provides a lightweight and flexible way to create REST APIs.
  - Although I have extensive experience with Spring Boot, I chose Node.js for this project to demonstrate adaptability to different technology stacks.

## Cloud Storage: Google Drive API
- **Reason for choosing**:
  - Secure and cost-effective for storing CV documents.
  - Easily integrates with Google Sheets for data processing.

## Database: Google Sheets
- **Reason for choosing**:
  - Chosen for simplicity and ease of access.
  - No additional database costs compared to traditional SQL/NoSQL databases.

## Email Service: Nodemailer with Gmail
- **Reason for choosing**:
  - Free email service using a Gmail SMTP server.
  - Suitable for sending follow-up emails without extra costs.

## Deployment: Vercel (Frontend) & Render (Backend)
- **Frontend**: Vercel allows free hosting with continuous integration.
- **Backend**: Render offers free hosting for small-scale applications with automated deployment.

---

# High-Level Architecture Diagram

1. **User Submits Form** → React frontend handles input & uploads CV.
2. **CV is Uploaded** → Sent to Google Drive via backend API.
3. **Data Extraction** → Node.js extracts key info & stores in Google Sheets.
4. **Webhook Notification** → Sends data to Metana’s endpoint.
5. **Follow-up Email** → Scheduled email confirmation to applicant.

---

# Cost Estimation

## Scenario 1: 100 Applications per Month

| Service               | Cost Estimate            |
|-----------------------|--------------------------|
| Google Drive (Storage) | Free (15GB limit)        |
| Google Sheets         | Free                     |
| Nodemailer (Emails)   | Free (Gmail SMTP)        |
| Vercel (Frontend)     | Free Tier                |
| Render (Backend)      | Free Tier                |
| **Total**             | **$0**                   |

## Scenario 2: 1 million Applications per Month

| Service               | Cost Estimate            |
|-----------------------|--------------------------|
| Google Drive (Storage) | $10/month (Google One, 2TB plan) |
| Google Sheets         | Free (limits may require upgrade) |
| SendGrid (Emails)     | $89.95/month             |
| Vercel (Frontend)     | $20/month (Pro plan for high traffic) |
| Render (Backend)      | $25/month (Standard instance) |
| **Total**             | **~$144.5/month**        |

---

# Scalability & Optimization Considerations

- **For high traffic**: Use AWS S3 for storage instead of Google Drive.
- **For emails**: Use a dedicated SMTP service like SendGrid to avoid Gmail limits.
- **For backend load**: Deploy multiple instances using a cloud provider (AWS, GCP, Azure).

---

# Challenges & Future Improvements

## Challenges Encountered:
- Google Drive API rate limits might affect high-volume processing.
- Delays in email delivery when using free SMTP services.

## Future Optimizations:
- Move data processing to a serverless function (e.g., AWS Lambda) for cost efficiency.

---

# Final Notes

This documentation provides an overview of the architecture, cost analysis, and potential future improvements. The current implementation is cost-effective for low traffic but requires scaling strategies for high-volume processing.
