"use client";

import { Button, Row, Col, Card, Carousel } from "antd";
import Link from "next/link";
import {
  SearchOutlined,
  EnvironmentOutlined,
  SafetyCertificateOutlined,
  DollarOutlined,
  ClockCircleOutlined,
  CarOutlined,
} from "@ant-design/icons";
import {
  P2PListingIllustration,
  RealTimeSearchIllustration,
  AutomatedReservationsIllustration,
  SecurePaymentsIllustration,
} from "../components/Illustrations";

export default function Home() {
  return (
    <main className="min-h-screen bg-soft-light dark:bg-slate-900 overflow-hidden transition-colors duration-300">
      {/* Hero Section */}
      <div className="w-full bg-[#E6EDF2] dark:bg-slate-800/50 px-4 md:px-8 lg:px-12 py-20 md:py-24 relative overflow-hidden transition-colors duration-300">
        <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-12 gap-10 items-center">
          {/* Left Content */}
          <div className="lg:col-span-6 flex flex-col gap-6 relative z-10">
            <h1 className="text-[#0A1A3F] dark:text-white text-4xl md:text-5xl lg:text-6xl font-bold leading-tight mb-2 tracking-tight transition-colors duration-300">
              SmartPark: <br />
              <span className="text-[#1363DF] text-6xl font-bold">
                {" "}
                The Future of Parking
              </span>
            </h1>

            <p className="text-lg text-slate-600 dark:text-slate-300 max-w-lg mb-4 leading-relaxed transition-colors duration-300">
              Connect with verified hosts for premium parking spots, or turn
              your empty driveway into a reliable source of passive income.
            </p>

            {/* Dark Blue Options Box (Premium Glassy) */}
            <div className="bg-[#0A1A3F] rounded-[2rem] p-6 md:p-8 shadow-[0_20px_50px_rgba(10,26,63,0.3)] relative overflow-hidden">
              {/* subtle decor inside box */}
              <div className="absolute top-0 right-0 w-32 h-32 bg-white/5 rounded-bl-[4rem] pointer-events-none"></div>
              <div className="absolute -bottom-10 -left-10 w-24 h-24 bg-[#1363DF]/50 rounded-full blur-[40px] pointer-events-none"></div>
              <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full h-full bg-gradient-to-br from-[#1363DF]/10 to-transparent pointer-events-none"></div>

              <h3 className="text-white text-xl md:text-2xl font-semibold mb-6 text-center relative z-10">
                Start Your Journey
              </h3>

              <div className="flex flex-col sm:flex-row items-center justify-center gap-4 relative z-10 w-full">
                <Link href="/search" className="w-full sm:w-auto">
                  <Button
                    size="large"
                    icon={<SearchOutlined />}
                    className="w-full btn-hero-scndry sm:w-auto h-14 px-8 text-lg font-semibold rounded-full hover:-translate-y-1 transition-all duration-300 flex items-center justify-center border border-white/20 bg-white/10 backdrop-blur-md shadow-[0_8px_32px_0_rgba(255,255,255,0.1)] text-white hover:bg-white/20 hover:border-white/40"
                  >
                    Find a Spot
                  </Button>
                </Link>
                <Link href="/register" className="w-full sm:w-auto">
                  <Button
                    size="large"
                    icon={<EnvironmentOutlined />}
                    className="w-full sm:w-auto list-btn h-14 px-8 text-lg font-semibold rounded-full hover:-translate-y-1 transition-all duration-300 flex items-center justify-center border border-[#1363DF] bg-[#1363DF]/90 backdrop-blur-xl shadow-[0_8px_32px_0_rgba(19,99,223,0.4)] text-white hover:bg-[#1363DF] hover:border-blue-400"
                  >
                    List Your Space
                  </Button>
                </Link>
              </div>
            </div>

            {/* Light Blue Services Box (Glassy) */}
            <div className="bg-white/60 dark:bg-slate-800/60 backdrop-blur-xl border border-white/40 dark:border-slate-700/50 rounded-3xl p-6 md:p-8 flex flex-col xl:flex-row items-center xl:items-start justify-between gap-6 shadow-[0_8px_30px_rgb(0,0,0,0.04)] dark:shadow-none mt-2 transition-colors duration-300">
              <div className="text-center xl:text-left">
                <h4 className="text-[#0A1A3F] dark:text-white font-extrabold text-lg mb-2 transition-colors duration-300">
                  Join the SmartPark Network
                </h4>
                <p className="text-[#2C3E50] dark:text-slate-300 text-sm leading-relaxed max-w-sm m-0 transition-colors duration-300">
                  Experience a secure, cost-effective, and transparent parking
                  ecosystem designed to empower drivers and property owners.
                </p>
              </div>
              <Button className="learn-more-btn px-8 h-12 font-bold shadow-lg shadow-blue-500/30 whitespace-nowrap mt-2 xl:mt-0 transition-all hover:scale-105 ">
                Learn More
              </Button>
            </div>
          </div>

          {/* Right Content Images Grid */}
          <div className="lg:col-span-6 flex flex-col gap-6 relative z-10">
            {/* Top Image: Car Landscape */}
            <div className="w-full h-[300px] md:h-[350px] lg:h-[400px] rounded-[2rem] overflow-hidden shadow-2xl relative bg-blue-100 group">
              <img
                src="/smartparkbannerHero.png"
                alt="SmartPark Parking"
                className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
              />
              {/* Subtle gradient overlay */}
              <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent"></div>
            </div>

            {/* Bottom Sub-grid for map/abstract content */}
            <div className="w-full flex justify-start">
              <div className="w-full h-[200px] md:h-[250px] rounded-[2rem] overflow-hidden shadow-xl relative bg-[#DCE4ED] group flex items-center justify-center">
                <img
                  src="https://images.unsplash.com/photo-1506521781263-d8422e82f27a?q=80&w=1200&auto=format&fit=crop"
                  alt="Parking Top View"
                  className="w-full h-full object-cover opacity-90 transition-transform duration-700 group-hover:scale-105"
                />
                {/* Play icon overlay linked to YouTube */}
                <a
                  href="https://youtu.be/p3gGMSokWAE?si=hMHZloN7X_hwY_eS"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="absolute inset-0 flex items-center justify-center"
                >
                  <div className="w-14 h-14 bg-white rounded-full flex items-center justify-center shadow-lg cursor-pointer hover:scale-110 transition-transform">
                    <div className="w-0 h-0 border-t-8 border-t-transparent border-l-[14px] border-l-[#0A1A3F] border-b-8 border-b-transparent ml-1"></div>
                  </div>
                </a>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* How It Works Section */}
      <div className="py-32 px-6 max-w-7xl mx-auto relative">
        {/* Background Decorative Elements */}
        <div className="absolute top-0 right-0 w-64 h-64 bg-[#1363DF]/5 rounded-full blur-[100px] pointer-events-none"></div>
        <div className="absolute bottom-0 left-0 w-80 h-80 bg-[#0A1A3F]/5 rounded-full blur-[100px] pointer-events-none"></div>

        <div className="text-center mb-20 relative z-10">
          <h2 className="text-4xl md:text-4xl text-[#0A1A3F] dark:text-white font-bold mb-6 tracking-tight transition-colors duration-300">
            How It Works
          </h2>
          <p className="text-lg md:text-xl text-gray-500 dark:text-slate-400 max-w-2xl mx-auto transition-colors duration-300">
            Experience seamless parking in three simple steps. We've designed the process to be as effortless as driving into your own garage.
          </p>
        </div>

        <Row gutter={[48, 48]} className="relative justify-center z-10">
          {/* Connecting Line for Desktop */}
          <div className="hidden lg:block absolute top-[40%] left-[15%] right-[15%] h-1 bg-gradient-to-r from-[#1363DF]/10 via-[#1363DF]/30 to-[#1363DF]/10 z-0 rounded-full"></div>

          {/* Step 1 */}
          <Col xs={24} lg={8} className="relative z-10 flex">
            <div className="bg-white dark:bg-slate-800 rounded-[2.5rem] p-10 shadow-[0_20px_40px_rgba(10,26,63,0.06)] dark:shadow-none border border-gray-100 dark:border-slate-700 flex flex-col items-center text-center w-full transform transition-all hover:-translate-y-2 hover:shadow-[0_30px_60px_rgba(19,99,223,0.1)] group">
              <div className="relative mb-10 w-24 h-24">
                <div className="absolute inset-0 bg-[#E6EDF2] dark:bg-slate-700 rounded-full scale-0 group-hover:scale-110 transition-transform duration-500"></div>
                <div className="w-24 h-24 bg-white dark:bg-slate-800 rounded-full flex items-center justify-center text-4xl text-[#1363DF] font-bold shadow-lg border-2 border-[#1363DF]/10 relative z-10 transition-colors duration-300">
                  1
                </div>
                <div className="absolute -bottom-3 -right-3 w-12 h-12 bg-[#0A1A3F] dark:bg-[#1363DF] rounded-full flex items-center justify-center text-white shadow-lg z-20 transition-colors duration-300">
                  <SearchOutlined className="text-xl" />
                </div>
              </div>
              <h4 className="text-2xl font-bold mb-4 text-[#0A1A3F] dark:text-white transition-colors duration-300">Search Location</h4>
              <p className="text-gray-500 dark:text-slate-400 leading-relaxed transition-colors duration-300">
                Enter your destination and date. Our smart algorithm instantly matches you with available, verified parking spots nearby in real-time.
              </p>
            </div>
          </Col>

          {/* Step 2 */}
          <Col xs={24} lg={8} className="relative z-10 flex">
            <div className="bg-white dark:bg-slate-800 rounded-[2.5rem] p-10 shadow-[0_20px_40px_rgba(10,26,63,0.06)] dark:shadow-none border border-gray-100 dark:border-slate-700 flex flex-col items-center text-center w-full transform transition-all hover:-translate-y-2 hover:shadow-[0_30px_60px_rgba(19,99,223,0.1)] group">
              <div className="relative mb-10 w-24 h-24">
                <div className="absolute inset-0 bg-[#E6EDF2] dark:bg-slate-700 rounded-full scale-0 group-hover:scale-110 transition-transform duration-500"></div>
                <div className="w-24 h-24 bg-[#0A1A3F] dark:bg-[#1363DF] rounded-full flex items-center justify-center text-4xl text-white font-bold shadow-xl relative z-10 ring-8 ring-[#0A1A3F]/10 dark:ring-slate-700 transition-colors duration-300">
                  2
                </div>
                <div className="absolute -bottom-3 -right-3 w-12 h-12 bg-[#1363DF] dark:bg-[#0A1A3F] rounded-full flex items-center justify-center text-white shadow-lg z-20 transition-colors duration-300">
                  <SafetyCertificateOutlined className="text-xl" />
                </div>
              </div>
              <h4 className="text-2xl font-bold mb-4 text-[#0A1A3F] dark:text-white transition-colors duration-300">Book & Pay</h4>
              <p className="text-gray-500 dark:text-slate-400 leading-relaxed transition-colors duration-300">
                Review transparent pricing, select your required duration, and securely pay online to guarantee your space before you even leave.
              </p>
            </div>
          </Col>

          {/* Step 3 */}
          <Col xs={24} lg={8} className="relative z-10 flex">
            <div className="bg-white dark:bg-slate-800 rounded-[2.5rem] p-10 shadow-[0_20px_40px_rgba(10,26,63,0.06)] dark:shadow-none border border-gray-100 dark:border-slate-700 flex flex-col items-center text-center w-full transform transition-all hover:-translate-y-2 hover:shadow-[0_30px_60px_rgba(19,99,223,0.1)] group">
              <div className="relative mb-10 w-24 h-24">
                <div className="absolute inset-0 bg-[#E6EDF2] dark:bg-slate-700 rounded-full scale-0 group-hover:scale-110 transition-transform duration-500"></div>
                <div className="w-24 h-24 bg-white dark:bg-slate-800 rounded-full flex items-center justify-center text-4xl text-[#1363DF] font-bold shadow-lg border-2 border-[#1363DF]/10 relative z-10 transition-colors duration-300">
                  3
                </div>
                <div className="absolute -bottom-3 -right-3 w-12 h-12 bg-[#0A1A3F] dark:bg-[#1363DF] rounded-full flex items-center justify-center text-white shadow-lg z-20 transition-colors duration-300">
                  <CarOutlined className="text-xl" />
                </div>
              </div>
              <h4 className="text-2xl font-bold mb-4 text-[#0A1A3F] dark:text-white transition-colors duration-300">Park Seamlessly</h4>
              <p className="text-gray-500 dark:text-slate-400 leading-relaxed transition-colors duration-300">
                Follow the precise GPS directions right to your reserved spot. Pull in, park stress-free, and enjoy your day without circling blocks.
              </p>
            </div>
          </Col>
        </Row>
      </div>

      {/* Our Solutions Section (Split Background) */}
      <div className="relative pt-24 pb-32 overflow-hidden">
        {/* Background Split */}
        <div className="absolute top-0 left-0 w-full h-[45%] bg-[#DCE4ED] dark:bg-slate-800 z-0 transition-colors duration-300"></div>
        <div className="absolute bottom-0 left-0 w-full h-[55%] bg-[#0A1A3F] dark:bg-slate-950 z-0 transition-colors duration-300"></div>

        <div className="max-w-7xl mx-auto px-6 relative z-10">
          <div className="mb-12">
            <h2 className="text-3xl md:text-4xl text-[#0A1A3F] dark:text-white font-bold m-0 transition-colors duration-300">
              Our Solutions
            </h2>
          </div>

          {/* Solutions Cards Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 lg:gap-8 mb-20">
            {/* Card 1 */}
            <div className="bg-white dark:bg-slate-900 rounded-2xl p-8 shadow-xl dark:shadow-none dark:border dark:border-slate-800 flex flex-col h-full transform transition-all hover:-translate-y-2 duration-300">
              <div className="h-40 w-full mb-6 flex items-center justify-center">
                <P2PListingIllustration />
              </div>
              <h3 className="text-[#0A1A3F] dark:text-white font-bold text-center text-lg mb-4 transition-colors duration-300">
                Peer-to-Peer Listing
              </h3>
              <p className="text-gray-500 dark:text-slate-400 text-sm text-center flex-grow leading-relaxed transition-colors duration-300">
                Turn your unused driveway or commercial lot into a revenue
                stream. Parking owners can easily register spaces, set custom
                rates, availability rules, and manage capacities from their
                dashboard.
              </p>
              <div className="mt-6 flex justify-end">
                <Link
                  href="#"
                  className="text-[#0A1A3F] dark:text-[#1363DF] font-semibold flex items-center gap-2 hover:text-[#1363DF] dark:hover:text-blue-400 transition-colors text-sm"
                >
                  Learn More <span>→</span>
                </Link>
              </div>
            </div>

            {/* Card 2 */}
            <div className="bg-white dark:bg-slate-900 rounded-2xl p-8 shadow-xl dark:shadow-none dark:border dark:border-slate-800 flex flex-col h-full transform transition-all hover:-translate-y-2 duration-300">
              <div className="h-40 w-full mb-6 flex items-center justify-center">
                <RealTimeSearchIllustration />
              </div>
              <h3 className="text-[#0A1A3F] dark:text-white font-bold text-center text-lg mb-4 transition-colors duration-300">
                Real-Time Search
              </h3>
              <p className="text-gray-500 dark:text-slate-400 text-sm text-center flex-grow leading-relaxed transition-colors duration-300">
                Drivers can seamlessly search for available parking spots via
                interactive map or list views. Filter by location, date, and
                time to find exactly what you need in seconds.
              </p>
              <div className="mt-6 flex justify-end">
                <Link
                  href="#"
                  className="text-[#0A1A3F] dark:text-[#1363DF] font-semibold flex items-center gap-2 hover:text-[#1363DF] dark:hover:text-blue-400 transition-colors text-sm"
                >
                  Learn More <span>→</span>
                </Link>
              </div>
            </div>

            {/* Card 3 */}
            <div className="bg-white dark:bg-slate-900 rounded-2xl p-8 shadow-xl dark:shadow-none dark:border dark:border-slate-800 flex flex-col h-full transform transition-all hover:-translate-y-2 duration-300">
              <div className="h-40 w-full mb-6 flex items-center justify-center">
                <AutomatedReservationsIllustration />
              </div>
              <h3 className="text-[#0A1A3F] dark:text-white font-bold text-center text-lg mb-4 transition-colors duration-300">
                Automated Reservations
              </h3>
              <p className="text-gray-500 dark:text-slate-400 text-sm text-center flex-grow leading-relaxed transition-colors duration-300">
                Lock in your spot with instant blocking of reserved slots. Host
                owners can configure listings to accept bookings automatically
                or manually approve them based on preference.
              </p>
              <div className="mt-6 flex justify-end">
                <Link
                  href="#"
                  className="text-[#0A1A3F] dark:text-[#1363DF] font-semibold flex items-center gap-2 hover:text-[#1363DF] dark:hover:text-blue-400 transition-colors text-sm"
                >
                  Learn More <span>→</span>
                </Link>
              </div>
            </div>

            {/* Card 4 */}
            <div className="bg-white dark:bg-slate-900 rounded-2xl p-8 shadow-xl dark:shadow-none dark:border dark:border-slate-800 flex flex-col h-full transform transition-all hover:-translate-y-2 duration-300">
              <div className="h-40 w-full mb-6 flex items-center justify-center">
                <SecurePaymentsIllustration />
              </div>
              <h3 className="text-[#0A1A3F] dark:text-white font-bold text-center text-lg mb-4 transition-colors duration-300">
                Secure Gateway Integration
              </h3>
              <p className="text-gray-500 dark:text-slate-400 text-sm text-center flex-grow leading-relaxed transition-colors duration-300">
                Complete your booking with integrated, encrypted payment portals
                for peace of mind. Both drivers and owners receive instant
                automated confirmations to verify the transaction.
              </p>
              <div className="mt-6 flex justify-end">
                <Link
                  href="#"
                  className="text-[#0A1A3F] dark:text-[#1363DF] font-semibold flex items-center gap-2 hover:text-[#1363DF] dark:hover:text-blue-400 transition-colors text-sm"
                >
                  Learn More <span>→</span>
                </Link>
              </div>
            </div>
          </div>

          {/* Bottom CTA Block inside dark section */}
          <div className="text-center max-w-3xl mx-auto flex flex-col items-center">
            <h3 className="text-white text-3xl md:text-4xl font-bold mb-6 mt-4">
              Discover How Our Solutions Work for You
            </h3>
            <p className="text-[#BACDE0] text-base md:text-lg mb-10 leading-relaxed max-w-2xl px-4">
              Schedule a demo to explore our innovative parking solutions
              tailored to your needs. See firsthand how our technology and
              services can streamline parking operations and enhance convenience
              for you and your customers.
            </p>
            <Button className="bg-white border-none py-10 text-white font-bold rounded-full px-10 h-14 btn-dark-scndry text-lg shadow-lg hover:bg-gray-100 transition-transform hover:scale-105">
              Book A Demo & Start Earning Today
            </Button>
          </div>
        </div>
      </div>

      {/* Why choose smartpark section start */}

      {/* Why choose us section end */}

      {/* Customer Experience Carousel */}
      <div className="py-24 px-6 max-w-7xl mx-auto">
        <div className="text-center mb-16">
          <h2 className="text-4xl text-[#0A1A3F] dark:text-white font-bold mb-4 transition-colors duration-300">
            Hear From Our Community
          </h2>
          <p className="text-lg text-gray-500 dark:text-slate-400 max-w-2xl mx-auto transition-colors duration-300">
            See how SmartPark is transforming the daily commute and helping property owners earn in their communities.
          </p>
        </div>

        <div className="max-w-6xl mx-auto">
          <Carousel autoplay effect="fade" dotPosition="bottom" className="pb-12 custom-carousel">
            {/* Carousel Item 1 */}
            <div>
              <div className="bg-white dark:bg-slate-800 rounded-3xl p-8 md:p-12 shadow-[0_10px_40px_rgba(0,0,0,0.06)] dark:shadow-none border border-gray-100 dark:border-slate-700 flex flex-col md:flex-row items-center gap-8 mx-4 my-2 transition-colors duration-300">
                <div className="w-24 h-24 shrink-0 rounded-full overflow-hidden border-4 border-[#E6EDF2] dark:border-slate-700">
                  <img
                    src="https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?q=80&w=200&auto=format&fit=crop"
                    alt="Customer 1"
                    className="w-full h-full object-cover"
                  />
                </div>
                <div className="text-center md:text-left">
                  <div className="text-[#1363DF] text-4xl font-serif mb-4 flex justify-center md:justify-start">"</div>
                  <p className="text-gray-600 dark:text-slate-300 text-lg md:text-xl italic mb-6 leading-relaxed transition-colors duration-300">
                    Finding parking downtown used to add 30 minutes to my commute every single day. Since I started using SmartPark, I reserve a spot the night before and drive straight to my destination. It's completely eliminated my morning stress!
                  </p>
                  <div>
                    <h4 className="text-[#0A1A3F] dark:text-white font-bold text-lg transition-colors duration-300">Nuwan P.</h4>
                    <p className="text-gray-400 dark:text-slate-500 text-sm transition-colors duration-300">Daily Commuter</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Carousel Item 2 */}
            <div>
              <div className="bg-white dark:bg-slate-800 rounded-3xl p-8 md:p-12 shadow-[0_10px_40px_rgba(0,0,0,0.06)] dark:shadow-none border border-gray-100 dark:border-slate-700 flex flex-col md:flex-row items-center gap-8 mx-4 my-2 transition-colors duration-300">
                <div className="w-24 h-24 shrink-0 rounded-full overflow-hidden border-4 border-[#E6EDF2] dark:border-slate-700">
                  <img
                    src="https://images.unsplash.com/photo-1544005313-94ddf0286df2?q=80&w=200&auto=format&fit=crop"
                    alt="Customer 2"
                    className="w-full h-full object-cover"
                  />
                </div>
                <div className="text-center md:text-left">
                  <div className="text-[#1363DF] text-4xl font-serif mb-4 flex justify-center md:justify-start">"</div>
                  <p className="text-gray-600 dark:text-slate-300 text-lg md:text-xl italic mb-6 leading-relaxed transition-colors duration-300">
                    I live near a stadium but my driveway was always empty while I was at work. I listed it on SmartPark and now it practically pays for my family's weekly groceries. The app is so easy to manage, and the automated payments are flawless.
                  </p>
                  <div>
                    <h4 className="text-[#0A1A3F] dark:text-white font-bold text-lg transition-colors duration-300">Hiruni D.</h4>
                    <p className="text-gray-400 dark:text-slate-500 text-sm transition-colors duration-300">Space Owner</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Carousel Item 3 */}
            <div>
              <div className="bg-white dark:bg-slate-800 rounded-3xl p-8 md:p-12 shadow-[0_10px_40px_rgba(0,0,0,0.06)] dark:shadow-none border border-gray-100 dark:border-slate-700 flex flex-col md:flex-row items-center gap-8 mx-4 my-2 transition-colors duration-300">
                <div className="w-24 h-24 shrink-0 rounded-full overflow-hidden border-4 border-[#E6EDF2] dark:border-slate-700">
                  <img
                    src="https://images.unsplash.com/photo-1573497019940-1c28c88b4f3e?q=80&w=200&auto=format&fit=crop"
                    alt="Customer 3"
                    className="w-full h-full object-cover"
                  />
                </div>
                <div className="text-center md:text-left">
                  <div className="text-[#1363DF] text-4xl font-serif mb-4 flex justify-center md:justify-start">"</div>
                  <p className="text-gray-600 dark:text-slate-300 text-lg md:text-xl italic mb-6 leading-relaxed transition-colors duration-300">
                    As an event coordinator, parking is always the biggest complaint we get. We partnered with SmartPark to secure commercial lots nearby for our attendees. The digital kiosks and mobile valets made the whole experience seamless.
                  </p>
                  <div>
                    <h4 className="text-[#0A1A3F] dark:text-white font-bold text-lg transition-colors duration-300">Tharusha K.</h4>
                    <p className="text-gray-400 dark:text-slate-500 text-sm transition-colors duration-300">Event Coordinator</p>
                  </div>
                </div>
              </div>
            </div>
          </Carousel>
        </div>
      </div>
      {/* CTA Banner */}
    </main>
  );
}
