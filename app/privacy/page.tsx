export default function PrivacyPage() {
  return (
    <>
      {/* Hero Section */}
      <section className="bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 text-white py-16 relative overflow-hidden">
        <div className="absolute inset-0 overflow-hidden opacity-30">
          <div className="absolute top-0 left-1/4 w-96 h-96 bg-purple-500 rounded-full filter blur-3xl"></div>
          <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-pink-500 rounded-full filter blur-3xl"></div>
        </div>
        <div className="container-custom text-center relative z-10">
          <h1 className="text-4xl md:text-5xl font-serif font-bold mb-4">
            <span className="bg-gradient-to-r from-blue-400 via-purple-400 to-pink-400 bg-clip-text text-transparent">Privacy Policy</span>
          </h1>
        </div>
      </section>
      
      <div className="min-h-screen bg-white py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-4xl mx-auto">
        
        <div className="prose prose-lg max-w-none">
          <section className="mb-8">
            <h2 className="text-2xl font-semibold mb-4">
              <span className="bg-gradient-to-r from-blue-600 via-purple-600 to-pink-500 bg-clip-text text-transparent">1. Information We Collect</span>
            </h2>
            <p className="text-gray-700 mb-4">
              We collect information you provide during purchase, including name, email address, and
              payment information processed securely through Razorpay.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold mb-4">
              <span className="bg-gradient-to-r from-blue-600 via-purple-600 to-pink-500 bg-clip-text text-transparent">2. How We Use Your Information</span>
            </h2>
            <p className="text-gray-700 mb-4">
              Your information is used to process orders, deliver digital products, and provide
              customer support. We never sell your personal information to third parties.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold mb-4">
              <span className="bg-gradient-to-r from-blue-600 via-purple-600 to-pink-500 bg-clip-text text-transparent">3. Data Security</span>
            </h2>
            <p className="text-gray-700 mb-4">
              We use industry-standard encryption to protect your data. Payment information is
              processed securely through Razorpay and never stored on our servers.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold mb-4">
              <span className="bg-gradient-to-r from-blue-600 via-purple-600 to-pink-500 bg-clip-text text-transparent">4. Your Rights</span>
            </h2>
            <p className="text-gray-700 mb-4">
              You have the right to access, update, or delete your personal information. Contact
              us at privacy@example.com for any data-related requests.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold mb-4">
              <span className="bg-gradient-to-r from-blue-600 via-purple-600 to-pink-500 bg-clip-text text-transparent">5. Contact Us</span>
            </h2>
            <p className="text-gray-700">
              For privacy concerns, contact us at privacy@example.com
            </p>
          </section>
        </div>
        </div>
      </div>
    </>
  )
}
