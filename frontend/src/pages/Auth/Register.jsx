import { useContext, useState } from "react";
import AuthLayout from "../../components/layouts/AuthLayout";
import { validateEmail } from "../../utils/helper";
import Input from "../../components/inputs/Input";
import { Link, useNavigate } from "react-router-dom";
import ProfilePicSelector from "../../components/inputs/ProfilePicSelector";
import axiosInstance from "../../utils/axiosInstance";
import { API_PATHS } from "../../utils/apiPaths";
import { UserContext } from "../../context/userContext";
import uploadImage from "../../utils/uploadImage";
import LoadingButton from "../../components/LoadingButton";
import RoleSelectDropdown from "../../components/inputs/RoleSelectDropdown";
import { ROLE_DATA } from "../../utils/data";

export default function Register() {
  const [profilePic, setProfilePic] = useState(null);
  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [adminInviteToken, setAdminInviteToken] = useState("Member");

  const [error, setError] = useState(null);

  const { updateUser, loading, setLoading } = useContext(UserContext);
  const navigate = useNavigate();

  // handle register
  async function handleRegister(e) {
    e.preventDefault();

    let profileImageUrl = "";

    if (!fullName) {
      setError("Please enter your full name");
      return;
    }

    if (!validateEmail(email)) {
      setError("Please enter a valid email");
      return;
    }

    if (!password) {
      setError("Please enter your password");
      return;
    }

    if (password.length < 8) {
      setError("Password must be at least 8 characters");
      return;
    }

    if (!profilePic) {
      setError("Please upload a profile image");
      return;
    }

    setError(null);

    // register api call
    setLoading(true);
    try {
      // upload profile image if present
      if (profilePic) {
        const imageUploadRes = await uploadImage(profilePic);
        profileImageUrl = imageUploadRes.imageUrl || "";
      }

      const response = await axiosInstance.post(API_PATHS.AUTH.REGISTER, {
        name: fullName,
        email,
        password,
        profileImageUrl,
        adminInviteToken,
      });

      const { token, user } = response.data;

      if (token) {
        localStorage.setItem("token", token);
        updateUser(response.data);

        // redirect based on user role
        if (user.role === "admin") {
          navigate("/admin/dashboard");
        } else {
          navigate("/user/dashboard");
        }
      }
    } catch (error) {
      if (error.response && error.response.data.message) {
        setError(error.response.data.message);
      } else {
        setError("An error occurred. Please try again later.");
      }
    } finally {
      setLoading(false);
    }
  }
  return (
    <AuthLayout>
      <div className="lg:w-[70%] lg:mx-auto min-h-full md:h-[calc(100vh-108px)] flex flex-col justify-center">
        <h3 className="text-xl font-semibold text-black">Create an account</h3>
        <p className="text-sm text-slate-700 mt-1 mb-6">
          Join us today by entering your details below
        </p>

        <form onSubmit={handleRegister}>
          <ProfilePicSelector image={profilePic} setImage={setProfilePic} />

          <div className="grid grid-cols-2 gap-4">
            <Input
              type="text"
              label="Full Name"
              placeholder="John"
              value={fullName}
              onChange={(e) => setFullName(e.target.value)}
            />

            <Input
              type="text"
              label="Email"
              placeholder="john@example.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />

            <Input
              type="password"
              label="Password"
              placeholder="min 8 characters"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />

            {/* <Input
              type="text"
              label="Admin Invite Token"
              placeholder="6 digit code"
              value={adminInviteToken}
              onChange={(e) => setAdminInviteToken(e.target.value)}
            /> */}

            <RoleSelectDropdown
              options={ROLE_DATA}
              onChange={(value) => {
                setAdminInviteToken(value === "Admin" ? "Admin" : "Member");
              }}
              placeholder="Select Role"
              value={adminInviteToken}
            />
          </div>

          {error && <p className="text-red-500 text-xs pb-2.5">{error}</p>}

          {/* <button type="submit" className="btn-primary">
            REGISTER
          </button> */}

          <LoadingButton pending={loading} className="btn-primary">
            REGISTER
          </LoadingButton>

          <p className="text-sm text-slate-800 mt-3">
            Already have an account?{" "}
            <Link to="/login" className="font-medium text-primary underline">
              Login
            </Link>
          </p>
        </form>
      </div>
    </AuthLayout>
  );
}
