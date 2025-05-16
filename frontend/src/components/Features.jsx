import React from "react";
import {
  RiSearchLine,
  RiShieldCheckLine,
  RiToolsLine,
  RiRadarLine,
} from "react-icons/ri";

const Features = () => {
  const features = [
    {
      title: "Easy Job Search",
      detail: "AI-powered filtering tailored to your skills and interests.",
      icon: <RiSearchLine className="w-8 h-8 text-orange-400" />,
    },
    {
      title: "Secure Applications",
      detail: "Your data is encrypted and handled with utmost care.",
      icon: <RiShieldCheckLine className="w-8 h-8 text-orange-400" />,
    },
    {
      title: "HR Tools",
      detail: "Streamlined hiring from applicant filtering to interviews.",
      icon: <RiToolsLine className="w-8 h-8 text-orange-400" />,
    },
  ];

  return (
    <section className="bg-gray-900 w-full py-16 px-6 md:px-16 lg:px-32">
      <div className="flex flex-col items-center mb-12 text-center max-w-4xl mx-auto space-y-4">
        <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-white leading-tight">
          Why Choose <span className="text-[#155DFC]">SmartHire</span>?
        </h1>
        <p className="text-base sm:text-xl text-gray-300 px-4">
          JobFlow leverages cutting-edge AI and robust security to provide a
          seamless experience for both job seekers and HR professionals.
        </p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
        {features.map((feature, index) => (
          <div
            key={index}
            className="p-6 bg-gray-800 rounded-2xl shadow-lg hover:shadow-xl transition-shadow duration-300 hover:scale-[1.02] transform"
          >
            <div className="flex flex-col items-center text-center space-y-4">
              <span className="rounded-full 	bg-[#2c2c2c] p-4 text-white text-2xl">
                {feature.icon}
              </span>
              <h3 className="text-xl font-semibold text-white">
                {feature.title}
              </h3>
              <p className="text-base text-gray-300">{feature.detail}</p>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
};

export default Features;
