import { Captcha } from "./components/Captcha";

function App() {
  const handleSuccess = () => {
    console.log("Captcha passed! User verified as human.");
  };

  const handleFailure = () => {
    console.log("Captcha failed. User may be a bot.");
  };

  const handleRetry = () => {
    console.log("User retrying captcha.");
  };

  return (
    <div className='min-h-screen w-[100vw] bg-gradient-to-br from-blue-50 via-white to-purple-50'>
      {/* Header */}
      <header className='bg-white shadow-sm border-b border-gray-100 w-full'>
        <div className='max-w-6xl mx-auto px-4 py-4 flex items-center justify-between'>
          <h4 className='text-xl font-bold text-gray-800'>Captcha Demo</h4>
          <span className='text-sm text-gray-500'>
            Custom Camera-based Verification
          </span>
        </div>
      </header>

      {/* Main Content */}
      <main className='max-w-6xl mx-auto px-4 py-12 w-full'>
        <div className='bg-white rounded-3xl shadow-xl p-8'>
          <Captcha
            onSuccess={handleSuccess}
            onFailure={handleFailure}
            onRetry={handleRetry}
          />
        </div>
      </main>
    </div>
  );
}

export default App;
