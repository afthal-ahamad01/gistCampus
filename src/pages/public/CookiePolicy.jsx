import React from 'react';

const CookiePolicy = () => {
    return (
        <div className="min-h-screen bg-gray-50 pt-24 pb-16">
            <div className="max-w-4xl mx-auto px-4">
                <header className="mb-12">
                    <h1 className="text-4xl font-extrabold text-gray-900 mb-4">Cookie Policy</h1>
                    <p className="text-lg text-gray-600">Effective Date: January 16, 2026</p>
                </header>

                <div className="bg-white rounded-2xl shadow-sm p-8 md:p-12 space-y-8 text-gray-700 leading-relaxed">
                    <section>
                        <p className="font-medium text-gray-900 border-l-4 border-primary pl-4 py-2 bg-primary/5 rounded-r-lg">
                            We appreciate your visit to our website and want to inform you about how GIST utilises cookies and similar technologies. This policy outlines what these technologies entail, the reasons for their use, and how you can manage your preferences regarding them. By continuing to browse or engage with our website, you consent to the use of cookies in accordance with this policy.
                        </p>
                    </section>

                    <section className="space-y-4">
                        <h2 className="text-2xl font-bold text-gray-900">1. Understanding Cookies</h2>
                        <p>Cookies are small text files that are placed on your device, whether it be a computer, tablet, or mobile phone, when you visit a website. They play a vital role in ensuring that the website operates smoothly, remembers your preferences, and enhances your overall experience.</p>
                        <div className="ml-4 mt-4">
                            <p className="font-semibold mb-2 text-gray-900">Cookies can be categorised as:</p>
                            <ul className="list-disc ml-6 space-y-1">
                                <li><strong>Session Cookies:</strong> These are temporary and are deleted when you close your browser.</li>
                                <li><strong>Persistent Cookies:</strong> These remain on your device for a specified duration.</li>
                            </ul>
                        </div>
                    </section>

                    <section className="space-y-6">
                        <h2 className="text-2xl font-bold text-gray-900">2. Categories of Cookies We Utilise</h2>

                        <div className="space-y-4">
                            <div>
                                <h3 className="text-xl font-semibold text-gray-900">a. Strictly Necessary Cookies</h3>
                                <p className="mt-2">These cookies are crucial for the fundamental functionalities of our website. They facilitate essential tasks such as navigation, form submissions, and accessing secure areas. The absence of these cookies may hinder the website's performance.</p>
                            </div>

                            <div>
                                <h3 className="text-xl font-semibold text-gray-900">b. Performance and Analytics Cookies</h3>
                                <p className="mt-2  ">These cookies gather insights on how visitors interact with our website, including pages viewed and any error messages encountered. The information collected is aggregated and anonymised, which helps us in enhancing the website’s performance and user experience.</p>
                                <div className="ml-6 mt-2">
                                    <p className="font-semibold mb-1 text-gray-900 uppercase italic">Examples include:</p>
                                    <ul className="list-disc ml-6 space-y-1">
                                        <li>Analysing website traffic</li>
                                        <li>Evaluating page load times</li>
                                        <li>Observing user interaction patterns</li>
                                    </ul>
                                </div>
                            </div>

                            <div>
                                <h3 className="text-xl font-semibold text-gray-900 ">c. Functionality Cookies</h3>
                                <p className="mt-2 ">These cookies enable the website to remember your preferences, such as language choices or regional settings, and to provide a more personalized experience.</p>
                            </div>

                            <div>
                                <h3 className="text-xl font-semibold text-gray-900 ">d. Third-Party Cookies</h3>
                                <p className="mt-2 ">Certain cookies may be placed by external service providers, such as those offering analytics or embedded content services. The use of these cookies is governed by the privacy and cookie policies of the respective third parties.</p>
                            </div>
                        </div>
                    </section>

                    <section className="space-y-4">
                        <h2 className="text-2xl font-bold text-gray-900">3. Purpose of Using Cookies</h2>
                        <p>We employ cookies for the following reasons:</p>
                        <ul className="list-disc ml-6 space-y-1">
                            <li>To ensure proper functioning of the website</li>
                            <li>To enhance website performance and usability</li>
                            <li>To gain insights into visitor interactions with our website</li>
                            <li>To remember user preferences</li>
                            <li>To support security and administrative functionalities</li>
                        </ul>
                    </section>

                    <section className="space-y-4">
                        <h2 className="text-2xl font-bold text-gray-900">4. Managing Your Cookie Preferences</h2>
                        <p>You have the autonomy to accept or decline cookies. You can adjust your cookie settings through your browser preferences:</p>
                        <ul className="list-disc ml-6 space-y-1">
                            <li>Most browsers allow you to block or delete cookies</li>
                            <li>You can also configure your browser to alert you when cookies are utilized</li>
                        </ul>
                        <p className="bg-amber-50 p-4 rounded-lg border-l-4 border-amber-400 text-amber-800 text-sm italic font-bold">
                            Please be aware that disabling certain cookies may influence the functionality and performance of our website.
                        </p>
                    </section>

                    <section className="space-y-4">
                        <h2 className="text-2xl font-bold text-gray-900">5. Updates to This Cookie Policy</h2>
                        <p>We may periodically revise this Cookie Policy to align with technological advancements, legal requirements, or our evolving practices. Any updates will be reflected on this page, along with the date of the revision. We encourage you to occasionally review this policy to stay informed about our practices.</p>
                    </section>
                </div>
            </div>
        </div>
    );
};

export default CookiePolicy;
