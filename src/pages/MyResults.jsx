import { useState } from "react";
import { useForm } from "react-hook-form";
import { verifyCertificateNumber, submitTranscriptRequest } from "../services/publicActions";
import { useContent } from "../context/ContentContext";

// Handles certificate verification + transcript requests with Firebase
// writes, mirroring the immediate feedback requirements.
const MyResults = () => {
  const { content, certificates } = useContent();
  const [verificationResult, setVerificationResult] = useState(null);
  const [transcriptState, setTranscriptState] = useState({ status: "idle", message: "" });
  const {
    register: registerCertificate,
    handleSubmit: handleVerifySubmit,
    reset: resetCertificate,
  } = useForm({
    defaultValues: { certificateNo: "" },
  });
  const {
    register: registerTranscript,
    handleSubmit: handleTranscriptSubmit,
    watch,
    setValue,
    reset: resetTranscript,
    formState: { errors: errorsTranscript },
  } = useForm();

  const selectedProgrammeName = watch("programmeName");

  const availableCourses = content.courses?.filter(course => {
    // Find the ID of the selected programme name
    const progId = content.programmes?.find(p => (p.name || p.label) === selectedProgrammeName)?.id;
    // Match course 'programTypeId' with programme 'id'
    return course.programTypeId === progId;
  }) || [];


  const onVerify = async ({ certificateNo }) => {
    const trimmed = certificateNo.trim();
    if (!trimmed) {
      setVerificationResult({ exists: false });
      return;
    }

    try {
      const response = await verifyCertificateNumber(trimmed);
      if (response.exists) {
        setVerificationResult({
          exists: true,
          message:
            "Verification successful — the entered certificate number is authentic and registered in the GIST Campus.",
        });
        resetCertificate();
      } else {
        const fallback = certificates.find((certificate) => certificate.certificateNo === trimmed);
        if (fallback) {
          setVerificationResult({
            exists: true,
            message:
              "Verification successful — the entered certificate number is authentic and registered in the GIST Campus.",
          });
        } else {
          setVerificationResult({
            exists: false,
            message: "Certificate not found. Please verify the certificate number and try again.",
          });
        }
      }
    } catch (error) {
      console.error(error);
      setVerificationResult({
        exists: false,
        message: "Certificate not found. Please verify the certificate number and try again.",
      });
    }
  };

  const onRequestTranscript = async (values) => {
    try {
      setTranscriptState({ status: "loading" });
      await submitTranscriptRequest(values);
      setTranscriptState({
        status: "success",
        message: "Your request has been submitted successfully. The administration will contact you shortly.",
      });
      alert("Request sent successfully!");
      resetTranscript();
    } catch (error) {
      console.error(error);
      setTranscriptState({
        status: "error",
        message: "Unable to submit your request at this time. Please try again shortly.",
      });
    }
  };

  return (
    <section className="max-w-5xl mx-auto px-4 py-20 space-y-16">
      <article className="bg-white shadow-lg rounded-3xl p-8 space-y-6">
        <header>
          <h1 className="text-3xl font-bold text-gray-900">My Results</h1>
          <p className="text-gray-600 mt-2">
            Enter your certificate number to validate its authenticity instantly.
          </p>
        </header>

        <form onSubmit={handleVerifySubmit(onVerify)} className="space-y-4">
          <label className="block text-sm font-medium text-gray-700 space-y-2">
            <span>
              Certificate No <span className="text-red-500">*</span>
            </span>
            <input
              type="text"
              placeholder="Enter Certificate No"
              {...registerCertificate("certificateNo", { required: true })}
              className="form-input"
            />
          </label>
          <button type="submit" className="px-6 py-3 bg-primary text-white rounded-xl font-semibold">
            Verify
          </button>
        </form>

        {verificationResult && (
          <p className={`font-medium ${verificationResult.exists ? "text-green-600" : "text-red-500"}`}>
            {verificationResult.message}
          </p>
        )}
      </article>

      <article className="bg-white shadow-lg rounded-3xl p-8 space-y-6" id="transcript-request">
        <header>
          <h2 className="text-2xl font-semibold text-gray-900 mb-2">Request Transcript</h2>
          <p className="text-gray-600">
            Fill in the details exactly as registered at GIST Campus to help us process your request faster.
          </p>
        </header>

        <form onSubmit={handleTranscriptSubmit(onRequestTranscript)} className="space-y-4">
          <div className="grid md:grid-cols-2 gap-6">
            <Field
              label="Full Name (as per records)"
              registerProps={registerTranscript("fullName", { required: "Full Name is required" })}
              error={errorsTranscript.fullName}
            />
            <Field
              label="Student ID / Registration Number"
              registerProps={registerTranscript("studentId", { required: "Student ID is required" })}
              error={errorsTranscript.studentId}
            />
            <Field
              label="National ID / Passport Number"
              registerProps={registerTranscript("nicOrPassport", { required: "NIC/Passport is required" })}
              error={errorsTranscript.nicOrPassport}
            />
            <Field
              label="Email Address"
              registerProps={registerTranscript("email", { required: "Email is required" })}
              type="email"
              error={errorsTranscript.email}
            />
            <Field
              label="Contact Number"
              registerProps={registerTranscript("contactNumber", { required: "Contact Number is required" })}
              error={errorsTranscript.contactNumber}
            />
            <div className="space-y-2">
              <label className="block text-sm font-medium text-gray-700">
                Program / Course Name <span className="text-red-500">*</span>
              </label>
              <select
                {...registerTranscript("programmeName", { required: "Please select a programme" })}
                className={`form-input w-full ${errorsTranscript.programmeName ? "border-red-500" : ""}`}
                onChange={(e) => {
                  registerTranscript("programmeName").onChange(e); // Keep react-hook-form logic
                  setValue("courseName", ""); // Reset course when program changes
                }}
              >
                <option value="">Select a Programme</option>
                {content.programmes?.map((prog) => (
                  <option key={prog.id} value={prog.name || prog.label}>
                    {prog.name || prog.label}
                  </option>
                ))}
              </select>
              {errorsTranscript.programmeName && <span className="text-xs text-red-500">{errorsTranscript.programmeName.message}</span>}
            </div>

            <div className="space-y-2">
              <label className="block text-sm font-medium text-gray-700">
                Course <span className="text-red-500">*</span>
              </label>
              <select
                {...registerTranscript("courseName", { required: "Please select a course" })}
                className={`form-input w-full ${errorsTranscript.courseName ? "border-red-500" : ""}`}
                disabled={!selectedProgrammeName}
              >
                <option value="">{selectedProgrammeName ? "Select a Course" : "Select a Programme First"}</option>
                {availableCourses.length > 0 ? (
                  availableCourses.map(course => (
                    <option key={course.id} value={course.title}>{course.title}</option>
                  ))
                ) : (
                  selectedProgrammeName && <option value="general">General / Other</option>
                )}
              </select>
              {errorsTranscript.courseName && <span className="text-xs text-red-500">{errorsTranscript.courseName.message}</span>}
            </div>

            <Field
              label="Batch / Year of Enrollment"
              registerProps={registerTranscript("batch", { required: "Batch info is required" })}
              error={errorsTranscript.batch}
            />
            <Field
              label="Completion Year / Expected Graduation Year"
              registerProps={registerTranscript("completionYear", { required: "Completion Year is required" })}
              error={errorsTranscript.completionYear}
            />
          </div>
          <div className="space-y-2">
            <label className="block text-sm font-medium text-gray-700">
              Purpose of Request <span className="text-red-500">*</span>
            </label>
            <textarea
              rows="3"
              placeholder="Visa processing, employment verification, etc."
              className={`form-input w-full ${errorsTranscript.purpose ? "border-red-500" : ""}`}
              {...registerTranscript("purpose", { required: "Purpose is required" })}
            />
            {errorsTranscript.purpose && <span className="text-xs text-red-500">{errorsTranscript.purpose.message}</span>}
          </div>
          <button
            type="submit"
            className="w-full bg-gray-900 text-white py-4 rounded-2xl font-semibold hover:opacity-90 transition"
            disabled={transcriptState.status === "loading"}
          >
            {transcriptState.status === "loading" ? "Submitting..." : "Confirm"}
          </button>
          {transcriptState.message && (
            <p
              className={`text-center font-medium ${transcriptState.status === "error" ? "text-red-500" : "text-green-600"
                }`}
            >
              {transcriptState.message}
            </p>
          )}
        </form>
      </article>
    </section>
  );
};

const Field = ({ label, registerProps, children, type = "text", error }) => (
  <label className="block text-sm font-medium text-gray-700 space-y-2">
    <span>
      {label} <span className="text-red-500">*</span>
    </span>
    {children || <input type={type} className={`form-input ${error ? "border-red-500" : ""}`} {...registerProps} />}
    {error && <span className="text-xs text-red-500">{error.message || "This field is required"}</span>}
  </label>
);

export default MyResults;

