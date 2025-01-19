import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { homeLogo } from "../assets/icons";
import { Images } from "../assets/images";
import InputField from "../components/InputField";

const SignUp = () => {
  const [currentPage, setCurrentPage] = useState(1);
  const [userDetails, setUserDetails] = useState({
    username: "",
    full_name: "",
    email: "",
    password: "",
    phone: "",
  });
  const [addressDetails, setAddressDetails] = useState({
    address: "",
    city: "",
    state: "",
    zip: "",
    country: "",
  });

  const navigate = useNavigate();

  const handleInputChange = (e, isAddress = false) => {
    const { name, value } = e.target;
    if (isAddress) {
      setAddressDetails({ ...addressDetails, [name]: value });
    } else {
      setUserDetails({ ...userDetails, [name]: value });
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const formData = new URLSearchParams();
    // Add the action parameter
    formData.append("action", "signup");

    // Add all user details
    Object.entries(userDetails).forEach(([key, value]) => {
      formData.append(key, value);
    });

    // Add all address details
    Object.entries(addressDetails).forEach(([key, value]) => {
      formData.append(key, value);
    });

    // Add role
    formData.append("role", "user");

    try {
      const response = await fetch(
        "http://localhost:8080/cat201project/Login",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/x-www-form-urlencoded",
          },
          body: formData.toString(),
        }
      );

      if (response.ok) {
        const data = await response.json();
        if (data.success) {
          alert("User registered successfully!");
          navigate("/loginpage"); // Redirect to the home page
        } else {
          throw new Error(data.message || "Failed to register user");
        }
      } else {
        const errorData = await response.json();
        throw new Error(errorData.message || "Failed to register user");
      }
    } catch (error) {
      console.error("Error:", error);
      alert(error.message || "Signup failed. Please try again.");
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
            <h1 className="text-2xl xl:text-3xl font-extrabold">
              {currentPage === 1
                ? "Sign Up - User Details"
                : "Sign Up - Address"}
            </h1>
            <form onSubmit={handleSubmit} className="w-full flex-1 mt-8">
              {currentPage === 1 ? (
                <div className="mx-auto max-w-xs">
                  <InputField
                    placeholder="Username"
                    name="username"
                    value={userDetails.username}
                    onChange={handleInputChange}
                  />
                  <InputField
                    placeholder="Full Name"
                    name="full_name"
                    value={userDetails.full_name}
                    onChange={handleInputChange}
                    className="mt-5"
                  />
                  <InputField
                    type="email"
                    placeholder="Email"
                    name="email"
                    value={userDetails.email}
                    onChange={handleInputChange}
                    className="mt-5"
                  />
                  <InputField
                    type="password"
                    placeholder="Password"
                    name="password"
                    value={userDetails.password}
                    onChange={handleInputChange}
                    className="mt-5"
                  />
                  <InputField
                    placeholder="Phone"
                    name="phone"
                    value={userDetails.phone}
                    onChange={handleInputChange}
                    className="mt-5"
                  />
                  <button
                    type="button"
                    onClick={() => setCurrentPage(2)}
                    className="mt-5 tracking-wide font-semibold bg-indigo-500 text-gray-100 w-full py-4 rounded-lg hover:bg-indigo-700 transition-all duration-300 ease-in-out flex items-center justify-center focus:shadow-outline focus:outline-none"
                  >
                    Next
                  </button>
                </div>
              ) : (
                <div className="mx-auto max-w-xs">
                  <InputField
                    placeholder="Street"
                    name="address"
                    value={addressDetails.address}
                    onChange={(e) => handleInputChange(e, true)}
                  />
                  <InputField
                    placeholder="City"
                    name="city"
                    value={addressDetails.city}
                    onChange={(e) => handleInputChange(e, true)}
                    className="mt-5"
                  />
                  <InputField
                    placeholder="State"
                    name="state"
                    value={addressDetails.state}
                    onChange={(e) => handleInputChange(e, true)}
                    className="mt-5"
                  />
                  <InputField
                    placeholder="ZIP"
                    name="zip"
                    value={addressDetails.zip}
                    onChange={(e) => handleInputChange(e, true)}
                    className="mt-5"
                  />
                  <InputField
                    placeholder="Country"
                    name="country"
                    value={addressDetails.country}
                    onChange={(e) => handleInputChange(e, true)}
                    className="mt-5"
                  />
                  <div className="mt-5 flex justify-between">
                    <button
                      type="button"
                      onClick={() => setCurrentPage(1)}
                      className="tracking-wide font-semibold bg-gray-200 text-gray-800 w-1/3 py-4 rounded-lg hover:bg-gray-300 transition-all duration-300 ease-in-out flex items-center justify-center focus:shadow-outline focus:outline-none"
                    >
                      Back
                    </button>
                    <button
                      type="submit"
                      className="tracking-wide font-semibold bg-indigo-500 text-gray-100 w-1/3 py-4 rounded-lg hover:bg-indigo-700 transition-all duration-300 ease-in-out flex items-center justify-center focus:shadow-outline focus:outline-none"
                    >
                      Submit
                    </button>
                  </div>
                </div>
              )}
            </form>
          </div>
        </div>
        <div className="flex-1 bg-indigo-100 text-center hidden lg:flex">
          <div className="w-full bg-contain bg-center bg-no-repeat">
            <img
              className="object-fill"
              src={Images.hero.LoginImage}
              alt="Signup Visual"
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default SignUp;
