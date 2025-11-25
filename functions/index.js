const functions = require("firebase-functions");
const admin = require("firebase-admin");
const nodemailer = require("nodemailer");

admin.initializeApp();

// ==================================================================
// EMAIL CONFIGURATION
// ==================================================================
// TODO: You MUST replace these values with your actual credentials.
// For Gmail, you need to generate an "App Password":
// https://myaccount.google.com/apppasswords
const EMAIL_CONFIG = {
  service: "gmail",
  auth: {
    user: "afthal6958@gmail.com",
    pass: "eyni qvsy jwsk svvj"
  }
};

const transporter = nodemailer.createTransport(EMAIL_CONFIG);

// ==================================================================
// CLOUD FUNCTIONS
// ==================================================================

/**
 * Trigger: When a new document is created in 'enrollments' collection.
 * Action: Sends an email notification to the campus admin.
 */
exports.sendEnrollmentEmail = functions.firestore
  .document("enrollments/{enrollmentId}")
  .onCreate(async (snap, context) => {
    const data = snap.data();
    const enrollmentId = context.params.enrollmentId;

    console.log(`New enrollment detected: ${enrollmentId}`);

    const mailOptions = {
      from: `"NIBM Portal" <${EMAIL_CONFIG.auth.user}>`,
      to: "afthal6958@gmail.com", // Sending to personal email as requested
      subject: "New Enrollment",
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <h2 style="color: #0056b3;">New Enrollment Application</h2>
          <p>A new student has submitted an enrollment form.</p>
          
          <table style="width: 100%; border-collapse: collapse; margin-top: 20px;">
            <tr style="background-color: #f8f9fa;">
              <td style="padding: 10px; border: 1px solid #dee2e6;"><strong>Student Name</strong></td>
              <td style="padding: 10px; border: 1px solid #dee2e6;">${data.fullName || "N/A"}</td>
            </tr>
            <tr>
              <td style="padding: 10px; border: 1px solid #dee2e6;"><strong>Email</strong></td>
              <td style="padding: 10px; border: 1px solid #dee2e6;">${data.email || "N/A"}</td>
            </tr>
            <tr style="background-color: #f8f9fa;">
              <td style="padding: 10px; border: 1px solid #dee2e6;"><strong>Mobile</strong></td>
              <td style="padding: 10px; border: 1px solid #dee2e6;">${data.mobile || "N/A"}</td>
            </tr>
            <tr>
              <td style="padding: 10px; border: 1px solid #dee2e6;"><strong>Course</strong></td>
              <td style="padding: 10px; border: 1px solid #dee2e6;">${data.courseName || "N/A"}</td>
            </tr>
            <tr style="background-color: #f8f9fa;">
              <td style="padding: 10px; border: 1px solid #dee2e6;"><strong>NIC</strong></td>
              <td style="padding: 10px; border: 1px solid #dee2e6;">${data.nic || "N/A"}</td>
            </tr>
          </table>

          <p style="margin-top: 20px; color: #6c757d; font-size: 12px;">
            This is an automated message from the NIBM Clone Portal.
            ID: ${enrollmentId}
          </p>
        </div>
      `,
    };

    try {
      await transporter.sendMail(mailOptions);
      console.log("Enrollment email sent successfully.");
    } catch (error) {
      console.error("Error sending enrollment email:", error);
    }
  });
