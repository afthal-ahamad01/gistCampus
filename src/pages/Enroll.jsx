import { useState } from "react";
import { useForm } from "react-hook-form";
import { Link } from "react-router-dom";
import { useContent } from "../context/ContentContext";
import { submitEnrollment } from "../services/publicActions";

import { FaGraduationCap } from 'react-icons/fa';

// Mirrors the inquiry.nibm.lk flow but adjusted to the custom
// requirements (renamed labels, removed sponsor fields, etc.)
const Enroll = ({ initialCourse }) => {
  const { content } = useContent();
  const [submissionState, setSubmissionState] = useState({ status: "idle", message: "" });
  const [selectedProgramId, setSelectedProgramId] = useState("");

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm({
    defaultValues: {
      title: "",
      programmes: "", // This will store the program ID
      courseId: initialCourse || "",
      participantFluentIn: [],
    },
  });

  // Watch for program changes to filter courses
  const handleProgramChange = (e) => {
    setSelectedProgramId(e.target.value);
  };

  // Filter courses based on selected program
  const filteredCourses = selectedProgramId
    ? content.courses.filter(course => course.programTypeId === selectedProgramId)
    : content.courses;

  const onSubmit = async (values) => {
    try {
      setSubmissionState({ status: "loading" });
      await submitEnrollment(values);
      setSubmissionState({
        status: "success",
        message:
          "Thank you for applying! Your submission was successful. Our administration team will reach out to you soon. Kindly verify that your contact information is correct.",
      });
      reset();
      setSelectedProgramId(""); // Reset filter
    } catch (error) {
      console.error(error);
      setSubmissionState({
        status: "error",
        message: "We could not submit your enrollment at this time. Please try again shortly.",
      });
    }
  };

  return (
    <section className="max-w-5xl mx-auto px-4 py-20" id="enroll-form">
      <div className="mb-10 text-center">
        <div className="inline-flex items-center justify-center p-4 bg-primary/10 rounded-full mb-4">
          <FaGraduationCap className="text-4xl text-primary" />
        </div>
        <h1 className="text-4xl font-bold text-gray-900 mb-4">Enroll Now</h1>
        <p className="text-gray-600 max-w-3xl mx-auto">
          Complete the form and our enrollment advisors from GIST Campus will contact you with the programme pack.
        </p>
      </div>
      <form onSubmit={handleSubmit(onSubmit)} className="bg-white shadow-lg rounded-3xl p-8 space-y-10">
        <Section title="Personal Details">
          <div className="grid md:grid-cols-2 gap-6">
            <Field label="Title" required error={errors.title?.message}>
              <select
                {...register("title", { required: "Title is required" })}
                className="form-input"
              >
                <option value="">Select</option>
                <option value="Mr">Mr</option>
                <option value="Mrs">Mrs</option>
                <option value="Miss">Miss</option>
              </select>
            </Field>
            <Field label="Full Name in Block Letters" required error={errors.fullName?.message}>
              <input
                type="text"
                {...register("fullName", { required: "Full Name is required" })}
                className="form-input uppercase"
                placeholder="AS PER NIC"
              />
            </Field>
            <Field label="Designation" error={errors.designation?.message}>
              <input type="text" {...register("designation")} className="form-input" placeholder="Your title" />
            </Field>
            <Field label="Organization" error={errors.organization?.message}>
              <input type="text" {...register("organization")} className="form-input" placeholder="Company / institute" />
            </Field>
            <Field label="National Identity Card (NIC) Number" required error={errors.nic?.message}>
              <input
                type="text"
                {...register("nic", { required: "NIC Number is required" })}
                className="form-input"
                placeholder="Enter NIC Number"
              />
            </Field>

            <Field label="Programmes" required error={errors.programmes?.message}>
              <select
                {...register("programmes", {
                  required: "Please select a programme category",
                  onChange: handleProgramChange
                })}
                className="form-input"
              >
                <option value="">Select programme</option>
                {content.programmes?.map((programme) => (
                  <option key={programme.id} value={programme.id}>
                    {programme.name}
                  </option>
                ))}
              </select>
            </Field>

            <Field label="Select Course" required error={errors.courseId?.message}>
              <select {...register("courseId", { required: "Please select a course" })} className="form-input">
                <option value="">Select course</option>
                {filteredCourses.map((course) => (
                  <option key={course.id} value={course.title}>
                    {course.title}
                  </option>
                ))}
              </select>
              {filteredCourses.length === 0 && selectedProgramId && (
                <p className="text-xs text-red-500 mt-1">No courses found for this programme.</p>
              )}
            </Field>

            <Field label="Date of Birth" required error={errors.dateOfBirth?.message}>
              <input
                type="date"
                {...register("dateOfBirth", { required: "Date of birth is required" })}
                className="form-input"
              />
            </Field>
            <Field label="Home Address - Street Line 1" required error={errors.homeAddressLine1?.message}>
              <input
                type="text"
                {...register("homeAddressLine1", { required: "Street Address is required" })}
                className="form-input"
                placeholder="Street Address Line 1"
              />
            </Field>
            <Field label="Home Address - Street Line 2">
              <input
                type="text"
                {...register("homeAddressLine2")}
                className="form-input"
                placeholder="Street Address Line 2"
              />
            </Field>
            <Field label="Email" required error={errors.email?.message}>
              <input
                type="email"
                {...register("email", { required: "Email is required" })}
                className="form-input"
                placeholder="name@email.com"
              />
            </Field>
            <Field label="Phone Number" required error={errors.phoneNumber?.message}>
              <input
                type="tel"
                {...register("phoneNumber", { required: "Phone number is required" })}
                className="form-input"
                placeholder="+94 7X XXX XXXX"
              />
            </Field>
          </div>

          <div className="grid md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 space-y-3">
                <span>Participant Fluent In</span>
                <div className="flex flex-wrap gap-4">
                  {["English", "Sinhala", "Tamil"].map((language) => (
                    <label key={language} className="inline-flex items-center gap-2 text-sm text-gray-700">
                      <input type="checkbox" value={language} {...register("participantFluentIn")} className="accent-primary" />
                      {language}
                    </label>
                  ))}
                </div>
              </label>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 space-y-3">
                <span>
                  Are you currently working? <span className="text-red-500">*</span>
                </span>
                <div className="flex gap-6">
                  {["Yes", "No"].map((option) => (
                    <label key={option} className="inline-flex items-center gap-2 text-sm text-gray-700">
                      <input
                        type="radio"
                        value={option}
                        {...register("currentlyWorking", { required: "Please select an option" })}
                        className="accent-primary"
                      />
                      {option}
                    </label>
                  ))}
                </div>
                {errors.currentlyWorking && (
                  <span className="text-red-500 text-xs">{errors.currentlyWorking.message}</span>
                )}
              </label>
            </div>
          </div>
        </Section>

        <Section title="Office Details">
          <div className="grid md:grid-cols-2 gap-6">
            <Field label="Office Address - Street Line 1">
              <input type="text" {...register("officeAddressLine1")} className="form-input" placeholder="Street Address Line 1" />
            </Field>
            <Field label="Office Address - Street Line 2">
              <input type="text" {...register("officeAddressLine2")} className="form-input" placeholder="Street Address Line 2" />
            </Field>
            <Field label="Office Phone Number">
              <input type="tel" {...register("officePhone")} className="form-input" placeholder="Office contact" />
            </Field>
          </div>
        </Section>

        <Section title="Pre Qualifications">
          <Field label="Academic Qualifications">
            <textarea
              {...register("academicQualifications")}
              rows="3"
              className="form-input"
              placeholder="Degrees, diplomas, certifications"
            />
          </Field>
          <Field label="Professional Qualifications">
            <textarea
              {...register("professionalQualifications")}
              rows="3"
              className="form-input"
              placeholder="Professional memberships, licenses"
            />
          </Field>
        </Section>

        <button
          type="submit"
          className="w-full bg-primary text-white py-4 rounded-2xl font-semibold hover:opacity-90 transition"
          disabled={submissionState.status === "loading"}
        >
          {submissionState.status === "loading" ? "Submitting..." : "Enroll Now"}
        </button>

        {submissionState.message && (
          <p
            className={`text-center font-medium ${submissionState.status === "error" ? "text-red-500" : "text-green-600"
              }`}
          >
            {submissionState.message}
          </p>
        )}
      </form>
      <p className="text-center text-sm text-gray-500 mt-6">
        Need help? Call us via hotline +94 117 321 000 or{" "}
        <Link to="/#contact" className="text-primary font-semibold">
          view campus contacts
        </Link>
        .
      </p>
    </section>
  );
};

const Field = ({ label, children, required, error }) => (
  <label className="block text-sm font-medium text-gray-700 space-y-2">
    <span>
      {label} {required && <span className="text-red-500">*</span>}
    </span>
    {children}
    {error && <span className="text-red-500 text-xs">{error}</span>}
  </label>
);

const Section = ({ title, children }) => (
  <div className="space-y-4">
    <div>
      <h3 className="text-xl font-semibold text-gray-900">{title}</h3>
      <div className="h-1 w-16 bg-primary mt-2 rounded-full" />
    </div>
    <div className="space-y-6">{children}</div>
  </div>
);

export default Enroll;
