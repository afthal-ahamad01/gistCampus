import React from 'react';
import { Link } from 'react-router-dom';

const PrivacyPolicy = () => {
    return (
        <div className="min-h-screen bg-gray-50 pt-24 pb-16">
            <div className="max-w-4xl mx-auto px-4">
                <header className="mb-12">
                    <h1 className="text-4xl font-extrabold text-gray-900 mb-4">Privacy Policy</h1>
                    <p className="text-lg text-gray-600">Effective Date: January 16, 2026</p>
                </header>

                <div className="bg-white rounded-2xl shadow-sm p-8 md:p-12 space-y-8 text-gray-700 leading-relaxed">
                    <section>
                        <p className="font-medium text-gray-900 border-l-4 border-primary pl-4 py-2 bg-primary/5 rounded-r-lg">
                            We sincerely appreciate your decision to be a part of the GIST community. Your personal information and privacy are of utmost importance to us. This Privacy Policy outlines our practices regarding the collection, use, disclosure, and protection of your personal information when you visit our website and utilise our services.
                        </p>
                        <p className="mt-4">
                            If you have any reservations regarding the terms of this Privacy Policy, we kindly encourage you to refrain from using our website and services. Thank you for your understanding.
                        </p>
                    </section>

                    <section className="space-y-4">
                        <h2 className="text-2xl font-bold text-gray-900">1. Information We Collect</h2>
                        <p>We gather information that you willingly share with us, as well as data that is automatically collected during your visits to our website.</p>

                        <div className="ml-4 space-y-4">
                            <div>
                                <h3 className="font-semibold text-gray-900">a. Personal Information You Provide</h3>
                                <ul className="list-disc ml-6 mt-2 space-y-1">
                                    <li>This may include your name, email address, phone number, mailing address, and educational background.</li>
                                    <li>Additionally, any details entered in forms, applications, registrations, or surveys are also collected.</li>
                                </ul>
                            </div>
                            <div>
                                <h3 className="font-semibold text-gray-900">b. Automatically Collected Information</h3>
                                <ul className="list-disc ml-6 mt-2 space-y-1">
                                    <li>We may collect your IP address, browser type and settings, device identifiers, and operating system.</li>
                                    <li>We also gather usage and analytics data, such as pages visited and duration of your stay on our website.</li>
                                    <li>If applicable, we may collect location information.</li>
                                </ul>
                            </div>
                            <div>
                                <h3 className="font-semibold text-gray-900">c. Cookies and Tracking Technologies</h3>
                                <p className="mt-2 ">To enhance your experience and gather usage data, we utilize cookies and similar technologies. You have the option to accept or decline cookies through your browser settings. For more information on our use of cookies, please refer to our <Link to="/cookie-policy" className="text-primary hover:underline font-bold">Cookie Policy</Link>.</p>
                            </div>
                        </div>
                    </section>

                    <section className="space-y-4">
                        <h2 className="text-2xl font-bold text-gray-900">2. How We Use Your Information</h2>
                        <p>We use the information we collect for various purposes, including:</p>
                        <ul className="list-disc ml-6 space-y-1">
                            <li>Operating, maintaining, and improving our website and services.</li>
                            <li>Addressing your inquiries and providing customer support.</li>
                            <li>Sending newsletters, promotional materials, and updates regarding courses and events.</li>
                            <li>Personalizing your experience to deliver relevant content.</li>
                            <li>Conducting internal analytics and research.</li>
                            <li>Complying with legal obligations and safeguarding our rights.</li>
                        </ul>
                    </section>

                    <section className="space-y-4">
                        <h2 className="text-2xl font-bold text-gray-900">3. Sharing Your Information</h2>
                        <p>We may share your personal information under the following circumstances:</p>
                        <ul className="list-disc ml-6 space-y-1">
                            <li><strong>With Your Consent:</strong> When you provide us with permission to share your information.</li>
                            <li><strong>Service Providers:</strong> With trusted third parties who assist us in delivering our services (e.g., payment processors, analytics providers).</li>
                            <li><strong>Legal Requirements:</strong> If mandated by law, legal processes, or to ensure the safety and rights of others.</li>
                            <li><strong>Business Transfers:</strong> In connection with mergers, sales, or acquisitions of assets.</li>
                        </ul>
                        <p className="bg-gray-50 p-4 rounded-lg italic text-sm border-l-2 border-gray-300">
                            Please be assured that we do not sell, lease, or rent your personal information to third parties for marketing purposes without your explicit consent.
                        </p>
                    </section>

                    <section className="space-y-4">
                        <h2 className="text-2xl font-bold text-gray-900">4. Cookies and Similar Technologies</h2>
                        <p>Our partners utilise cookies and similar tracking technologies to:</p>
                        <ul className="list-disc ml-6 space-y-1">
                            <li>Enable essential website functions.</li>
                            <li>Analyse usage patterns and trends.</li>
                            <li>Enhance and personalise your experience.</li>
                        </ul>
                        <p>Most browsers offer the ability to control cookie settings, although disabling certain cookies may impact website functionality.</p>
                    </section>

                    <section className="space-y-4">
                        <h2 className="text-2xl font-bold text-gray-900">5. Data Retention</h2>
                        <p>We retain personal information only as long as necessary to fulfil the purposes stated in this Privacy Policy, including compliance with legal, tax, and accounting obligations, unless a longer retention period is required by law. Once your information is no longer needed, we ensure it is securely deleted or anonymised.</p>
                    </section>

                    <section className="space-y-4">
                        <h2 className="text-2xl font-bold text-gray-900">6. How We Protect Your Information</h2>
                        <p>We implement appropriate organisational and technical measures to safeguard your personal information against unauthorised access, disclosure, loss, or alteration. Nevertheless, please be aware that no system can be guaranteed to be completely secure, and the transmission of information is at your own risk.</p>
                    </section>

                    <section className="space-y-4">
                        <h2 className="text-2xl font-bold text-gray-900">7. Your Privacy Rights</h2>
                        <p>Depending on your location and relevant laws, you may have certain rights, including:</p>
                        <ul className="list-disc ml-6 space-y-1">
                            <li>Accessing the personal information, we hold about you.</li>
                            <li>Correcting any inaccuracies in your information.</li>
                            <li>Requesting the deletion of your personal information.</li>
                            <li>Opting out of marketing communications.</li>
                        </ul>
                        <p>You can submit requests to exercise these rights using the contact details provided on our website.</p>
                    </section>

                    <section className="space-y-4">
                        <h2 className="text-2xl font-bold text-gray-900">8. Third-Party Links</h2>
                        <p>Our website may contain links to external sites operated by third parties. We are not responsible for the content, privacy practices, or data security of these external websites; we encourage you to review their respective privacy policies.</p>
                    </section>

                    <section className="space-y-4">
                        <h2 className="text-2xl font-bold text-gray-900">9. Changes to This Privacy Policy</h2>
                        <p>We may periodically update this Privacy Policy. We will inform you of any significant changes by posting the revised policy with an updated date. We encourage you to revisit this page regularly to stay informed.</p>
                    </section>
                </div>
            </div>
        </div>
    );
};

export default PrivacyPolicy;
