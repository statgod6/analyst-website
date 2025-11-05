export default function TermsPage() {
  return (
    <div className="min-h-screen bg-white py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-4xl font-bold text-gray-900 mb-4">Terms & Conditions</h1>
        <p className="text-gray-600 mb-8">Last Updated: November 2024</p>
        
        <div className="prose prose-lg max-w-none">
          <section className="mb-8">
            <h2 className="text-2xl font-semibold text-gray-900 mb-4">1. Agreement to Terms</h2>
            <p className="text-gray-700 mb-4">
              By accessing and purchasing products from this website, you accept and agree to be bound by the terms and conditions outlined below. If you do not agree to these terms, please do not use our services.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold text-gray-900 mb-4">2. Digital Product Purchase</h2>
            <p className="text-gray-700 mb-4">
              All products sold on this website are digital downloads. Upon successful payment, you will receive instant access to downloadable content via email or through your account dashboard.
            </p>
            <p className="text-gray-700 mb-4">
              <strong>Important:</strong> All sales are final once the download link is accessed or the product is delivered. Please ensure you review product descriptions carefully before purchase.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold text-gray-900 mb-4">3. Usage Rights & License</h2>
            <p className="text-gray-700 mb-4">
              When you purchase a product, you are granted a personal, non-transferable, non-exclusive license to use the content for your own purposes only.
            </p>
            <ul className="list-disc pl-6 text-gray-700 mb-4 space-y-2">
              <li>You may use the content for personal or commercial projects</li>
              <li>You may NOT redistribute, resell, or share the content with others</li>
              <li>You may NOT claim ownership or authorship of the content</li>
              <li>You may NOT use the content to create competing products</li>
            </ul>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold text-gray-900 mb-4">4. Payment & Security</h2>
            <p className="text-gray-700 mb-4">
              We use Razorpay, a secure payment gateway, to process all transactions. We do not store your credit card information on our servers. All payments are processed securely through encrypted connections.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold text-gray-900 mb-4">5. Refund Policy</h2>
            <p className="text-gray-700 mb-4">
              Due to the instant delivery nature of digital products, we generally do not offer refunds. However, we understand that technical issues may occur.
            </p>
            <p className="text-gray-700 mb-4">
              <strong>Refunds will be considered ONLY in the following cases:</strong>
            </p>
            <ul className="list-disc pl-6 text-gray-700 mb-4 space-y-2">
              <li>Technical issues that prevent you from accessing the purchased content</li>
              <li>You received a corrupted or incomplete file</li>
              <li>Product is significantly different from the description</li>
            </ul>
            <p className="text-gray-700 mb-4">
              To request a refund, please contact us within 7 days of purchase with proof of the issue. Refund requests will be reviewed on a case-by-case basis.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold text-gray-900 mb-4">6. Intellectual Property</h2>
            <p className="text-gray-700 mb-4">
              All content, including but not limited to text, graphics, logos, images, AI prompts, guides, and tutorials, is the intellectual property of the website owner and is protected by copyright laws.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold text-gray-900 mb-4">7. User Responsibilities</h2>
            <p className="text-gray-700 mb-4">
              You are responsible for maintaining the confidentiality of your account credentials and for all activities that occur under your account. You agree to:
            </p>
            <ul className="list-disc pl-6 text-gray-700 mb-4 space-y-2">
              <li>Provide accurate and complete information during purchase</li>
              <li>Use the products in compliance with applicable laws</li>
              <li>Not engage in unauthorized use or distribution of content</li>
            </ul>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold text-gray-900 mb-4">8. Disclaimer of Warranties</h2>
            <p className="text-gray-700 mb-4">
              Our products are provided "as is" without any warranties, express or implied. While we strive to provide high-quality content, we do not guarantee specific results from using our products.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold text-gray-900 mb-4">9. Limitation of Liability</h2>
            <p className="text-gray-700 mb-4">
              We shall not be liable for any indirect, incidental, special, or consequential damages arising from your use of our products or services.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold text-gray-900 mb-4">10. Changes to Terms</h2>
            <p className="text-gray-700 mb-4">
              We reserve the right to modify these terms at any time. Changes will be effective immediately upon posting. Your continued use of the website after changes constitutes acceptance of the modified terms.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold text-gray-900 mb-4">11. Contact Information</h2>
            <p className="text-gray-700 mb-4">
              If you have any questions about these Terms & Conditions, please contact us:
            </p>
            <ul className="list-none text-gray-700 space-y-2">
              <li><strong>Email:</strong> admin@aiforeveryone.com</li>
              <li><strong>Website:</strong> AI for Everyone</li>
            </ul>
          </section>

          <div className="mt-12 p-6 bg-blue-50 rounded-lg border-l-4 border-blue-500">
            <p className="text-gray-700">
              <strong>Note:</strong> By completing a purchase on this website, you acknowledge that you have read, understood, and agree to be bound by these Terms & Conditions.
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}
