import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { homeLogo } from "../assets/icons";
import { loginImage } from "../assets/images";

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();

  const handleNavigation = ({ route }) => {
    navigate(route);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const response = await fetch(
        "http://localhost:8080/cat201project/Login",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/x-www-form-urlencoded",
          },
          body: `action=login&email=${encodeURIComponent(
            email.trim()
          )}&password=${encodeURIComponent(password.trim())}`,
        }
      );

      const data = await response.json();
      console.log("Login response data:", data);

      if (data.success) {
        const userData = {
          email: data.email,
          role: data.role,
          username: data.username,
          wallet: Number(data.wallet),
        };
        console.log("About to store user data:", userData);

        localStorage.setItem("user", JSON.stringify(userData));

        const storedData = localStorage.getItem("user");
        console.log("Stored user data:", JSON.parse(storedData));

        if (data.role === "admin") {
          navigate("/cardCategory");
        } else {
          navigate("/");
        }
      } else {
        alert("Invalid email or password");
      }
    } catch (error) {
      console.error("Error:", error);
      alert("Login failed. Please try again.");
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 text-gray-900 flex justify-center">
      <div className="max-w-screen-xl m-0 sm:m-10 bg-white shadow sm:rounded-lg flex justify-center flex-1">
        <div className="lg:w-1/2 xl:w-5/12 p-6 sm:p-12">
          <div>
            <img src={homeLogo} className="w-32 mx-auto" alt="Home Logo" />
          </div>
          <div className="mt-12 flex flex-col items-center">
            <h1 className="text-2xl xl:text-3xl font-extrabold">Login</h1>
            <form onSubmit={handleSubmit} className="w-full flex-1 mt-8">
              <div className="mx-auto max-w-xs">
                <input
                  className="w-full px-8 py-4 rounded-lg font-medium bg-gray-100 border border-gray-200 placeholder-gray-500 text-sm focus:outline-none focus:border-gray-400 focus:bg-white"
                  type="email"
                  placeholder="Email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                />
                <input
                  className="w-full px-8 py-4 rounded-lg font-medium bg-gray-100 border border-gray-200 placeholder-gray-500 text-sm focus:outline-none focus:border-gray-400 focus:bg-white mt-5"
                  type="password"
                  placeholder="Password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                />
                <button
                  className="mt-5 tracking-wide font-semibold bg-indigo-500 text-gray-100 w-full py-4 rounded-lg hover:bg-indigo-700 transition-all duration-300 ease-in-out flex items-center justify-center focus:shadow-outline focus:outline-none"
                  type="submit"
                >
                  <span className="ml-3">Log in</span>
                </button>
              </div>
            </form>
            <div className="mx-auto max-w-xs">
              <button
                className="mt-5 tracking-wide font-semibold bg-gray-100 text-slate-600 hover:text-white w-full py-4 rounded-lg hover:bg-gray-600 all duration-300 ease-in-out flex items-center justify-center focus:shadow-outline focus:outline-none"
                onClick={() => handleNavigation({ route: "/signuppage" })}
                type="button"
              >
                <span className="ml-3">Sign Up</span>
              </button>
              <p className="mt-6 text-xs text-gray-600 text-center">
                I agree to abide by templatana's Terms of Service and its
                Privacy Policy
              </p>
            </div>
          </div>
        </div>
        <div className="flex-1 bg-indigo-100 text-center hidden lg:flex">
          <div className="w-full bg-contain bg-center bg-no-repeat">
            <img className="object-fill" src={loginImage} alt="Login Visual" />
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;
