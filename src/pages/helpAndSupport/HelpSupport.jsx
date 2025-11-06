import { useState } from 'react';
import Header from '../header/Header';
import { Drawer, Input, Button, Form,Modal } from 'antd';
import { toast } from 'react-toastify';

const HelpSupport = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [activeQuestion, setActiveQuestion] = useState(null);
  const [isCallModalVisible, setIsCallModalVisible] = useState(false);
  const [isEmailModalVisible, setIsEmailModalVisible] = useState(false);
  const [isChatDrawerVisible, setIsChatDrawerVisible] = useState(false);
  const [emailForm] = Form.useForm();
  const [chatForm] = Form.useForm();

  const faqs = [
    {
      id: 1,
      question: "How do I place an order?",
      answer: "To place an order, simply browse our products, add items to your cart, and proceed to checkout. You'll need to provide your delivery address and payment information to complete your order."
    },
    {
      id: 2,
      question: "What are the delivery charges?",
      answer: "We offer free delivery on orders over $25. For orders below $25, a $2.99 delivery fee applies. Express delivery options are available at an additional cost."
    },
    {
      id: 3,
      question: "How can I track my order?",
      answer: "Once your order is shipped, you'll receive a confirmation email with a tracking number. You can use this number to track your order on our website or the carrier's website."
    },
    {
      id: 4,
      question: "What payment methods are accepted?",
      answer: "We accept all major credit cards, debit cards, PayPal, Apple Pay, Google Pay, and in some locations, cash on delivery."
    },
    {
      id: 5,
      question: "How do I return an item?",
      answer: "You can initiate a return through your account page within 30 days of receipt. Items must be in original condition with all tags attached. We'll provide a return shipping label for your convenience."
    }
  ];

  const contactOptions = [
    {
      id: 1,
      title: "Chat with us",
      description: "Get instant answers",
      icon: (
        <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z" />
        </svg>
      ),
      onClick: () => setIsChatDrawerVisible(true)
    },
    {
      id: 2,
      title: "Email us",
      description: "We'll reply within 24 hours",
      icon: (
        <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
        </svg>
      ),
      onClick: () => setIsEmailModalVisible(true)
    },
    {
      id: 3,
      title: "Call us",
      description: "Speak to our team",
      icon: (
        <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
        </svg>
      ),
      onClick: () => setIsCallModalVisible(true)
    }
  ];

  const filteredFaqs = faqs.filter(faq =>
    faq.question.toLowerCase().includes(searchQuery.toLowerCase()) ||
    faq.answer.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleCallRequest = () => {
    setIsCallModalVisible(false);
    toast.info('Your call back request sent! Please keep your phone nearby.');
  };

  const handleEmailSubmit = (values) => {
    console.log('Email form values:', values);
    setIsEmailModalVisible(false);
    emailForm.resetFields();
    toast.info('Your message has been sent! We will reply within 24 hours.');
  };

  const handleChatSubmit = (values) => {
    console.log('Chat started with:', values);
    setIsChatDrawerVisible(false);
    chatForm.resetFields();
    toast.success('Chat session started! Our agent will be with you shortly.');
  };



  return (
    <div>
      <Header />

      <div className="max-w-5xl bg-green-50 mx-auto px-20 py-8">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Help & Support</h1>
          <p className="text-gray-600">Find answers to common questions or contact our support team for assistance.</p>
        </div>

        {/* Search Bar */}
        <div className="bg-white rounded-lg shadow-md p-6 mb-8">
          <div className="relative">
            <input
              type="text"
              placeholder="Search for help topics"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full px-4 py-3 pl-12 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent"
            />
            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 absolute left-4 top-3 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
          </div>
        </div>

        {/* Frequently Asked Questions */}
        <div className="bg-white rounded-lg shadow-md p-6 mb-8">
          <h2 className="text-xl font-semibold text-gray-900 mb-6">Frequently Asked Questions</h2>

          <div className="space-y-4">
            {filteredFaqs.length > 0 ? (
              filteredFaqs.map(faq => (
                <div key={faq.id} className="border-b border-gray-200 pb-4 last:border-0">
                  <button
                    onClick={() => setActiveQuestion(activeQuestion === faq.id ? null : faq.id)}
                    className="flex justify-between items-center w-full text-left font-medium text-gray-900 hover:text-green-700 focus:outline-none"
                  >
                    <span>{faq.question}</span>
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      className={`h-5 w-5 transition-transform ${activeQuestion === faq.id ? 'transform rotate-180' : ''}`}
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                    </svg>
                  </button>

                  {activeQuestion === faq.id && (
                    <div className="mt-2 text-gray-600">
                      <p>{faq.answer}</p>
                    </div>
                  )}
                </div>
              ))
            ) : (
              <p className="text-gray-600 text-center py-4">No results found for "{searchQuery}"</p>
            )}
          </div>
        </div>

        {/* Still need help? Section */}
        <div className="bg-white rounded-lg shadow-md p-6">
          <h2 className="text-xl font-semibold text-gray-900 mb-6 text-center">Still need help?</h2>

          <div className="grid md:grid-cols-3 gap-6">
            {contactOptions.map(option => (
              <div
                key={option.id}
                className="border border-gray-200 rounded-lg p-6 text-center hover:border-green-500 hover:shadow-md transition-all cursor-pointer"
                onClick={option.onClick}
              >
                <div className="text-green-600 mb-4 flex justify-center">
                  {option.icon}
                </div>
                <h3 className="font-medium text-gray-900 mb-2">{option.title}</h3>
                <p className="text-sm text-gray-600">{option.description}</p>
              </div>
            ))}
          </div>

          {/* Additional Support Info */}
          <div className="mt-8 pt-6 border-t border-gray-200">
            <div className="grid md:grid-cols-2 gap-8">
              <div>
                <h3 className="font-medium text-gray-900 mb-2">Customer Support Hours</h3>
                <p className="text-sm text-gray-600">Monday - Friday: 8:00 AM - 10:00 PM EST</p>
                <p className="text-sm text-gray-600">Saturday - Sunday: 9:00 AM - 8:00 PM EST</p>
              </div>

              <div>
                <h3 className="font-medium text-gray-900 mb-2">Emergency Support</h3>
                <p className="text-sm text-gray-600">For any urgent issues with active deliveries, call us directly at <span className="text-green-600 font-medium">1-800-45675 HELP-NOW</span></p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Call Us Modal */}
      <Modal
        title={
          <div className="flex items-center">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-green-600 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
            </svg>
            Request a Call Back
          </div>
        }
        open={isCallModalVisible}
        onCancel={() => setIsCallModalVisible(false)}
        footer={[
          <Button key="cancel" className='hover:!border-green-700 hover:!text-green-700' onClick={() => setIsCallModalVisible(false)}>
            Cancel
          </Button>,
          <Button key="submit" type="primary" className="bg-green-600 hover:!bg-green-700 border-green-600 hover:!border-green-700" onClick={handleCallRequest}>
            Request Call
          </Button>,
        ]}
        centered
      >
        <div className="text-center py-4">
          <div className="text-5xl mb-4">📞</div>
          <h3 className="text-lg font-semibold text-gray-900 mb-2">You will receive a call within 30 minutes</h3>
          <p className="text-gray-600">
            Our customer support team will call you back at your registered phone number.
            Please make sure your phone is available.
          </p>
        </div>
      </Modal>

      {/* Email Us Modal */}
      <Modal
        title={
          <div className="flex items-center">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-green-600 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
            </svg>
            Send us an Email
          </div>
        }
        open={isEmailModalVisible}
        onCancel={() => {
          setIsEmailModalVisible(false);
          emailForm.resetFields();
        }}
        footer={null}
        centered
      >
        <Form
          form={emailForm}
          layout="vertical"
          onFinish={handleEmailSubmit}
          className="mt-4"
          requiredMark={false}
        >
          <Form.Item
            name="email"
            label="Email Address"
            rules={[
              { required: true, message: 'Please enter your email address' },
              { type: 'email', message: 'Please enter a valid email address' }
            ]}
          >
            <Input
              placeholder="Enter your email address"
              size="large"
            />
          </Form.Item>

          <Form.Item
            name="message"
            label="Message"
            rules={[
              { required: true, message: 'Please enter your message' },
              { min: 10, message: 'Message must be at least 10 characters long' }
            ]}
          >
            <Input.TextArea
              placeholder="Describe your issue or question in detail..."
              rows={6}
              showCount
              maxLength={1000}
            />
          </Form.Item>

          <Form.Item className="mb-0">
            <div className="flex justify-end space-x-2">
              <Button
                onClick={() => {
                  setIsEmailModalVisible(false);
                  emailForm.resetFields();
                }}
                className="hover:!border-green-700 hover:!text-green-700"
              >
                Cancel
              </Button>
              <Button
                type="primary"
                className="bg-green-600 hover:!bg-green-700 border-green-600 hover:!border-green-700"
                htmlType="submit"
              >
                Send Message
              </Button>
            </div>
          </Form.Item>
        </Form>
      </Modal>

      {/* Chat Drawer */}
      <Drawer
        title={
          <div className="flex items-center">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-green-600 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z" />
            </svg>
            Start a Chat
          </div>
        }
        placement="right"
        onClose={() => {
          setIsChatDrawerVisible(false);
          chatForm.resetFields();
        }}
        open={isChatDrawerVisible}
        width="50%"
        className="chat-drawer"
        styles={{
          body: { padding: '24px' }
        }}
      >
        <div className="h-full flex flex-col">
          <div className="text-center mb-6 flex-shrink-0">
            <div className="text-4xl mb-3">💬</div>
            <h3 className="text-lg font-semibold text-gray-900 mb-2">Chat with our support team</h3>
            <p className="text-gray-600 text-sm">
              Our agents are available to help you in real-time. Average wait time: 2 minutes.
            </p>
          </div>

          <Form
            form={chatForm}
            layout="vertical"
            onFinish={handleChatSubmit}
            requiredMark={false}
            className="flex-1 flex flex-col"
          >
            <div className="space-y-4 flex-1">
              <Form.Item
                name="name"
                label="Your Name"
                rules={[{ required: true, message: 'Please enter your name' }]}
              >
                <Input 
                  placeholder="Enter your full name" 
                  size="large"
                />
              </Form.Item>

              <Form.Item
                name="email"
                label="Email Address"
                rules={[
                  { required: true, message: 'Please enter your email' },
                  { type: 'email', message: 'Please enter a valid email' }
                ]}
              >
                <Input 
                  placeholder="Enter your email address" 
                  size="large"
                />
              </Form.Item>

              <Form.Item
                name="issue"
                label="What can we help you with?"
                rules={[{ required: true, message: 'Please describe your issue' }]}
                className="flex-1"
              >
                <Input.TextArea
                  placeholder="Briefly describe your issue or question..."
                  rows={6}
                  showCount
                  maxLength={200}
                  style={{ height: '120px' }}
                />
              </Form.Item>
            </div>

            <Form.Item className="mb-0 flex-shrink-0 mt-6">
              <div className="flex justify-end space-x-2">
                <Button
                  onClick={() => {
                    setIsChatDrawerVisible(false);
                    chatForm.resetFields();
                  }}
                  className="hover:!border-green-700 hover:!text-green-700"
                >
                  Cancel
                </Button>
                <Button
                  type="primary"
                  className="bg-green-600 hover:!bg-green-700 border-green-600 hover:!border-green-700"
                  htmlType="submit"
                >
                  Start Chat
                </Button>
              </div>
            </Form.Item>
          </Form>
        </div>
      </Drawer>
    </div>
  );
};

export default HelpSupport;