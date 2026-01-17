// import { useAuth0 } from "@auth0/auth0-react";
// import { Lock, ShieldCheck } from "lucide-react";

// export default function Login() {
//   const { loginWithRedirect, isAuthenticated, isLoading } = useAuth0();

//   if (isLoading) {
//     return (
//       <div className="flex items-center justify-center h-screen bg-gray-50">
//         <div className="animate-spin h-10 w-10 rounded-full border-b-2 border-blue-600" />
//       </div>
//     );
//   }

//   if (isAuthenticated) {
//     return (
//       <div className="flex items-center justify-center h-screen bg-gray-50">
//         <div className="bg-white p-8 rounded-xl shadow-sm text-center">
//           <p className="text-gray-700 font-medium">You are already logged in</p>
//         </div>
//       </div>
//     );
//   }

//   return (
//     <div className="min-h-screen flex bg-gray-50">
//       {/* Left Branding Section */}
//       <div className="hidden lg:flex w-1/2 bg-gradient-to-br from-blue-700 to-indigo-800 text-white p-12 flex-col justify-between">
//         <div>
//           <div className="flex items-center gap-3 mb-8">
//             <div className="bg-white/20 p-3 rounded-xl">
//               <ShieldCheck className="w-6 h-6" />
//             </div>
//             <h1 className="text-2xl font-bold tracking-tight">AssetFlow</h1>
//           </div>

//           <h2 className="text-4xl font-bold leading-tight mb-6">
//             Smart Asset & Facility Management
//           </h2>
//           <p className="text-blue-100 text-lg leading-relaxed max-w-md">
//             Manage customers, buildings, and assets with real-time insights and
//             intelligent analytics.
//           </p>
//         </div>

//         <p className="text-blue-200 text-sm">
//           © {new Date().getFullYear()} AssetFlow. All rights reserved.
//         </p>
//       </div>

//       {/* Right Login Section */}
//       <div className="flex w-full lg:w-1/2 items-center justify-center px-6">
//         <div className="w-full max-w-md">
//           <div className="bg-white rounded-2xl shadow-lg p-8">
//             <div className="text-center mb-8">
//               <div className="mx-auto w-14 h-14 bg-blue-50 rounded-xl flex items-center justify-center text-blue-600 mb-4">
//                 <Lock className="w-6 h-6" />
//               </div>
//               <h2 className="text-2xl font-bold text-gray-900">
//                 Sign in to your account
//               </h2>
//               <p className="text-gray-500 mt-2">
//                 Secure access powered by Auth0
//               </p>
//             </div>

//             <button
//               onClick={() => loginWithRedirect()}
//               className="w-full flex items-center justify-center gap-3 bg-blue-600 hover:bg-blue-700 text-white py-3 rounded-xl font-semibold transition-all shadow-lg shadow-blue-200"
//             >
//               <ShieldCheck className="w-5 h-5" />
//               Continue with Auth0
//             </button>

//             <div className="mt-6 text-center text-sm text-gray-400">
//               By signing in, you agree to our{" "}
//               <span className="text-blue-600 font-medium cursor-pointer">
//                 Terms
//               </span>{" "}
//               and{" "}
//               <span className="text-blue-600 font-medium cursor-pointer">
//                 Privacy Policy
//               </span>
//             </div>
//           </div>
//         </div>
//       </div>
//     </div>
//   );
// }

import { useAuth0 } from "@auth0/auth0-react";
import { Lock, ShieldCheck } from "lucide-react";

export default function Login() {
  const { loginWithRedirect, isAuthenticated, isLoading } = useAuth0();

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gray-50">
        <div className="animate-spin h-10 w-10 rounded-full border-b-2 border-blue-600" />
      </div>
    );
  }

  if (isAuthenticated) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gray-50">
        <div className="bg-white p-8 rounded-xl shadow-sm text-center">
          <p className="text-gray-700 font-medium">You are already logged in</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col lg:flex-row bg-gray-50">
      {/* Branding Section */}
      <div className="w-full lg:w-1/2 bg-gradient-to-br from-blue-700 to-indigo-800 text-white p-10 flex flex-col justify-between">
        <div>
          <div className="flex items-center gap-3 mb-10">
            <div className="bg-white/20 p-3 rounded-xl">
              <ShieldCheck className="w-6 h-6" />
            </div>
            <h1 className="text-2xl font-bold tracking-tight">AssetFlow</h1>
          </div>

          <h2 className="text-3xl lg:text-4xl font-bold leading-tight mb-6">
            Smart Asset & Facility Management
          </h2>

          <p className="text-blue-100 text-base lg:text-lg leading-relaxed max-w-md">
            Manage customers, buildings, and assets with real-time insights and
            intelligent analytics.
          </p>
        </div>

        <p className="text-blue-200 text-sm mt-10">
          © {new Date().getFullYear()} AssetFlow. All rights reserved.
        </p>
      </div>

      {/* Login Section */}
      <div className="flex w-full lg:w-1/2 items-center justify-center px-6 py-12">
        <div className="w-full max-w-md">
          <div className="bg-white rounded-2xl shadow-lg p-8">
            <div className="text-center mb-8">
              <div className="mx-auto w-14 h-14 bg-blue-50 rounded-xl flex items-center justify-center text-blue-600 mb-4">
                <Lock className="w-6 h-6" />
              </div>

              <h2 className="text-2xl font-bold text-gray-900">
                Sign in to your account
              </h2>

              <p className="text-gray-500 mt-2">
                Secure access powered by Auth0
              </p>
            </div>

            <button
              onClick={() => loginWithRedirect()}
              className="w-full flex items-center justify-center gap-3 bg-blue-600 hover:bg-blue-700 text-white py-3 rounded-xl font-semibold transition-all shadow-lg shadow-blue-200"
            >
              <ShieldCheck className="w-5 h-5" />
              Continue with Auth0
            </button>

            <div className="mt-6 text-center text-sm text-gray-400">
              By signing in, you agree to our{" "}
              <span className="text-blue-600 font-medium cursor-pointer">
                Terms
              </span>{" "}
              and{" "}
              <span className="text-blue-600 font-medium cursor-pointer">
                Privacy Policy
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
