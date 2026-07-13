import { useHomeCareApp } from "./hooks/useHomeCareApp.js";
  import { Navbar } from "./components/layout/Navbar.jsx";
  import { Toast } from "./components/feedback/Toast.jsx";
  import { Home } from "./components/home/Home.jsx";
  import { Auth } from "./components/auth/Auth.jsx";
  import { EmailVerification } from "./components/auth/EmailVerification.jsx";
  import { AdminLogin } from "./components/auth/AdminLogin.jsx";
  import { Profile } from "./components/profile/Profile.jsx";
  import { Address } from "./components/address/Address.jsx";
  import { Service } from "./components/service/Service.jsx";
  import { Payment } from "./components/payment/Payment.jsx";
  import { PaymentSuccess } from "./components/payment/PaymentSuccess.jsx";
  import { Bookings } from "./components/bookings/Bookings.jsx";
  import { Agent } from "./components/agent/Agent.jsx";
  import { Admin } from "./components/admin/Admin.jsx";

  export default function App() {
    const app = useHomeCareApp();

    const isAdminView = app.view === "admin";

    return (
      <div className={`min-h-screen text-slate-950 antialiased ${isAdminView ? "bg-slate-50" : "bg-gradient-to-b from-orange-50 via-white to-slate-100"}`}>
        {!isAdminView && (
          <Navbar
            token={app.token}
            role={app.role}
            go={app.go}
            logout={app.logout}
            userName={app.userName}
            userInfo={app.userInfo}
            goUpdateProfile={app.goUpdateProfile}
          />
        )}
        <Toast toasts={app.toasts} dismissToast={app.dismissToast} />
        {app.view === "home" && (<Home search={app.search} setSearch={app.setSearch} services={app.filteredServices} openService={app.openService} loadServices={app.loadServices} loading={app.loading} />)}
        {app.view === "auth" && (<Auth authMode={app.authMode} setAuthMode={app.setAuthMode} role={app.role} mobile={app.mobile} loading={app.loading} submitAuth={app.submitAuth} />)}
        {app.view === "emailVerification" && (<EmailVerification email={app.email} loading={app.loading} verifyEmail={app.verifyEmail} resendCode={app.resendEmailCode} />)}
        {app.view === "adminLogin" && <AdminLogin loading={app.loading} submitAdminLogin={app.submitAdminLogin} />}
        {app.view === "profile" && (<Profile role={app.role} loading={app.loading} submitProfile={app.submitProfile} userInfo={app.userInfo} isUpdate={app.isUpdateProfile} services={app.services} />)}
        {app.view === "address" && <Address addresses={app.addresses} loading={app.loading} addAddress={app.addAddress} />}
        {app.view === "service" && (<Service service={app.selectedService} selectedVariant={app.selectedVariant} setSelectedVariant={app.setSelectedVariant} addresses={app.addresses} token={app.token} role={app.role} go={app.go} createBooking={app.createBooking} />)}
        {app.view === "payment" && (<Payment booking={app.draftBooking} loading={app.loading} createPayment={app.createPayment} />)}
        {app.view === "paymentSuccess" && <PaymentSuccess payment={app.paymentResult} go={app.go} />}
        {app.view === "bookings" && (<Bookings bookings={app.bookings} loadBookings={app.loadBookings} updateBooking={app.updateBooking} />)}
        {app.view === "agent" && (<Agent bookings={app.agentBookings} services={app.agentServices} agentWallet={app.agentWallet} profileId={app.profileId} loading={app.loading} loadBookings={app.loadBookings} loadAgentServices={app.loadAgentServices} loadAgentWallet={app.loadAgentWallet} createAgentService={app.createAgentService} updateBooking={app.updateBooking} />)}
        {app.view === "admin" && (<Admin services={app.services} bookings={app.adminBookings} payments={app.payments} loading={app.loading} createService={app.createService} createVariant={app.createVariant} updateServiceApproval={app.updateServiceApproval} removeService={app.removeService} removeVariant={app.removeVariant} loadAdminData={app.loadAdminData} logoutAdmin={app.logoutAdmin} adminEmail={app.adminEmail} />)}
      </div>
    );
  }
