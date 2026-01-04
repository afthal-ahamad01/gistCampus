const functions = require("firebase-functions");
const admin = require("firebase-admin");

admin.initializeApp();

const EMAIL_CONFIG = {
  service: "gmail",
  auth: {
    user: process.env.GMAIL_USER,
    pass: process.env.GMAIL_PASS
  }
};

// Lazy initialization to prevent deployment timeouts
let transporter = null;
const getTransporter = () => {
  if (!transporter) {
    const nodemailer = require("nodemailer");
    transporter = nodemailer.createTransport(EMAIL_CONFIG);
  }
  return transporter;
};

exports.sendEnrollmentEmail = functions.firestore
  .document("enrollments/{enrollmentId}")
  .onCreate(async (snap, context) => {
    const data = snap.data();
    const enrollmentId = context.params.enrollmentId;

    console.log(`New enrollment detected: ${enrollmentId}`);

    const mailOptions = {
      from: `"GIST Campus" <${EMAIL_CONFIG.auth.user}>`,
      to: "afthalahamad01@gmail.com",
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
              <td style="padding: 10px; border: 1px solid #dee2e6;">${data.phoneNumber || "N/A"}</td>
            </tr>
            <tr>
              <td style="padding: 10px; border: 1px solid #dee2e6;"><strong>Course</strong></td>
              <td style="padding: 10px; border: 1px solid #dee2e6;">${data.courseId || "N/A"}</td>
            </tr>
            <tr style="background-color: #f8f9fa;">
              <td style="padding: 10px; border: 1px solid #dee2e6;"><strong>NIC</strong></td>
              <td style="padding: 10px; border: 1px solid #dee2e6;">${data.nic || "N/A"}</td>
            </tr>
            <tr>
              <td style="padding: 10px; border: 1px solid #dee2e6;"><strong>Date of Birth</strong></td>
              <td style="padding: 10px; border: 1px solid #dee2e6;">${data.dateOfBirth || "N/A"}</td>
            </tr>
            <tr style="background-color: #f8f9fa;">
              <td style="padding: 10px; border: 1px solid #dee2e6;"><strong>Address</strong></td>
              <td style="padding: 10px; border: 1px solid #dee2e6;">
                ${data.homeAddressLine1 || ""} ${data.homeAddressLine2 || ""}
              </td>
            </tr>
            <tr>
              <td style="padding: 10px; border: 1px solid #dee2e6;"><strong>Designation</strong></td>
              <td style="padding: 10px; border: 1px solid #dee2e6;">${data.designation || "N/A"}</td>
            </tr>
            <tr style="background-color: #f8f9fa;">
              <td style="padding: 10px; border: 1px solid #dee2e6;"><strong>Organization</strong></td>
              <td style="padding: 10px; border: 1px solid #dee2e6;">${data.organization || "N/A"}</td>
            </tr>
             <tr>
              <td style="padding: 10px; border: 1px solid #dee2e6;"><strong>Fluent In</strong></td>
              <td style="padding: 10px; border: 1px solid #dee2e6;">
                ${Array.isArray(data.participantFluentIn) ? data.participantFluentIn.join(", ") : "N/A"}
              </td>
            </tr>
            <tr style="background-color: #f8f9fa;">
              <td style="padding: 10px; border: 1px solid #dee2e6;"><strong>Currently Working</strong></td>
              <td style="padding: 10px; border: 1px solid #dee2e6;">${data.currentlyWorking || "N/A"}</td>
            </tr>
            <tr>
              <td style="padding: 10px; border: 1px solid #dee2e6;"><strong>Office Details</strong></td>
              <td style="padding: 10px; border: 1px solid #dee2e6;">
                ${data.officeAddressLine1 || ""} ${data.officeAddressLine2 || ""} <br>
                ${data.officePhone ? "Phone: " + data.officePhone : ""}
              </td>
            </tr>
            <tr style="background-color: #f8f9fa;">
              <td style="padding: 10px; border: 1px solid #dee2e6;"><strong>Qualifications</strong></td>
              <td style="padding: 10px; border: 1px solid #dee2e6;">
                <strong>Academic:</strong> ${data.academicQualifications || "N/A"}<br>
                <strong>Professional:</strong> ${data.professionalQualifications || "N/A"}
              </td>
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
      // Use the lazy transporter
      await getTransporter().sendMail(mailOptions);
      console.log("Enrollment email sent successfully.");
    } catch (error) {
      console.error("Error sending enrollment email:", error);
    }
  });
