import { useState } from "react";
import { useForm } from "react-hook-form";
import { verifyCertificateNumber, submitTranscriptRequest } from "../services/publicActions";
import { useContent } from "../context/ContentContext";

// Handles certificate verification + transcript requests with Firebase
// writes, mirroring the immediate feedback requirements.
const MyResults = () => {
  const { certificates } = useContent();
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
    reset: resetTranscript,
  } = useForm();

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
              registerProps={registerTranscript("fullName", { required: true })}
            />
            <Field
              label="Student ID / Registration Number"
              registerProps={registerTranscript("studentId", { required: true })}
            />
            <Field
              label="National ID / Passport Number"
              registerProps={registerTranscript("nicOrPassport", { required: true })}
            />
            <Field label="Email Address" registerProps={registerTranscript("email", { required: true })} type="email" />
            <Field label="Contact Number" registerProps={registerTranscript("contactNumber", { required: true })} />
            <Field label="Program / Course Name" registerProps={registerTranscript("programmeName", { required: true })} />
            <Field label="Batch / Year of Enrollment" registerProps={registerTranscript("batch", { required: true })} />
            <Field
              label="Completion Year / Expected Graduation Year"
              registerProps={registerTranscript("completionYear", { required: true })}
            />
          </div>
          <Field label="Purpose of Request" registerProps={registerTranscript("purpose", { required: true })}>
            <textarea rows="3" className="form-input" placeholder="Visa processing, employment verification, etc." />
          </Field>
          <button
            type="submit"
            className="w-full bg-gray-900 text-white py-4 rounded-2xl font-semibold hover:opacity-90 transition"
            disabled={transcriptState.status === "loading"}
          >
            {transcriptState.status === "loading" ? "Submitting..." : "Confirm"}
          </button>
          {transcriptState.message && (
            <p
              className={`text-center font-medium ${
                transcriptState.status === "error" ? "text-red-500" : "text-green-600"
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

const Field = ({ label, registerProps, children, type = "text" }) => (
  <label className="block text-sm font-medium text-gray-700 space-y-2">
    <span>
      {label} <span className="text-red-500">*</span>
    </span>
    {children || <input type={type} className="form-input" {...registerProps} />}
  </label>
);

export default MyResults;

