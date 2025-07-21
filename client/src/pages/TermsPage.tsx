
import { motion } from "framer-motion";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export default function TermsPage() {
  const sections = [
    {
      title: "Order Processing",
      titleBn: "অর্ডার প্রক্রিয়াকরণ",
      content: [
        "Orders are processed within 1-3 business days after payment confirmation.",
        "Custom designs may require additional 2-5 days depending on complexity.",
        "আপনার অর্ডার পেমেন্ট নিশ্চিত হওয়ার ১-৩ কার্যদিবসের মধ্যে প্রক্রিয়া করা হবে।",
        "কাস্টম ডিজাইনের জটিলতার উপর ভিত্তি করে অতিরিক্ত ২-৫ দিন সময় লাগতে পারে।"
      ]
    },
    {
      title: "Payment Terms",
      titleBn: "পেমেন্ট শর্তাবলী",
      content: [
        "We accept bKash, Nagad, and Upay mobile payments.",
        "An advance payment of ৳100 is required to confirm your order.",
        "Remaining amount will be collected upon delivery.",
        "আমরা বিকাশ, নগদ এবং উপায় মোবাইল পেমেন্ট গ্রহণ করি।",
        "অর্ডার নিশ্চিত করতে ১০০ টাকা অগ্রিম পেমেন্ট প্রয়োজন।",
        "বাকি টাকা ডেলিভারির সময় নেওয়া হবে।"
      ]
    },
    {
      title: "Delivery Policy",
      titleBn: "ডেলিভারি নীতি",
      content: [
        "Delivery is available across Bangladesh.",
        "Delivery charges vary by location (৳70 inside Dhaka, ৳120 outside).",
        "Free delivery on orders above ৳1500.",
        "সারা বাংলাদেশে ডেলিভারি সুবিধা রয়েছে।",
        "ডেলিভারি চার্জ এলাকাভেদে আলাদা (ঢাকার ভিতরে ৭০ টাকা, বাইরে ১২০ টাকা)।",
        "১৫০০ টাকার ওপর অর্ডারে ফ্রি ডেলিভারি।"
      ]
    },
    {
      title: "Return & Exchange",
      titleBn: "ফেরত ও পরিবর্তন",
      content: [
        "Custom/personalized products are non-refundable unless defective.",
        "Manufacturing defects will be replaced free of charge.",
        "Return requests must be made within 3 days of delivery.",
        "কাস্টম/ব্যক্তিগতকৃত পণ্য ত্রুটিপূর্ণ না হলে ফেরত যোগ্য নয়।",
        "উৎপাদন ত্রুটি বিনামূল্যে প্রতিস্থাপন করা হবে।",
        "ডেলিভারির ৩ দিনের মধ্যে ফেরত অনুরোধ করতে হবে।"
      ]
    }
  ];

  return (
    <div className="min-h-screen pt-6">
      <div className="container mx-auto px-4">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-12"
        >
          <h1 className="text-4xl font-bold font-poppins mb-4 text-shadow">Terms & Conditions</h1>
          <p className="text-xl text-gray-300">শর্তাবলী ও নিয়মকানুন</p>
        </motion.div>

        {/* Terms Sections */}
        <div className="space-y-8">
          {sections.map((section, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 * index }}
            >
              <Card className="glass-effect">
                <CardHeader>
                  <CardTitle className="text-white">{section.title}</CardTitle>
                  <p className="text-gold">{section.titleBn}</p>
                </CardHeader>
                <CardContent>
                  <ul className="space-y-3">
                    {section.content.map((item, itemIndex) => (
                      <li key={itemIndex} className="text-gray-300 leading-relaxed">
                        • {item}
                      </li>
                    ))}
                  </ul>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </div>

        {/* Contact Information */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="mt-12"
        >
          <Card className="glass-effect">
            <CardHeader>
              <CardTitle className="text-white text-center">Questions?</CardTitle>
              <p className="text-gray-300 text-center">কোন প্রশ্ন থাকলে যোগাযোগ করুন</p>
            </CardHeader>
            <CardContent className="text-center">
              <p className="text-gray-300 mb-4">
                If you have any questions about these terms and conditions, please contact us:
              </p>
              <div className="space-y-2">
                <p className="text-white">WhatsApp: +8801940689487</p>
                <p className="text-white">Email: trynex-lifestyle@gmail.com</p>
              </div>
            </CardContent>
          </Card>
        </motion.div>
      </div>
    </div>
  );
}
