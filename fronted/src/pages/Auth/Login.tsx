import RowFormInputField from "@/components/Form/RowFormInputField";
import { useAuthLoginMutation } from "@/store/slice/auth";
import { validationRequest, ValidationRules } from "@/utils/validationRequest";
import React, { useEffect, useRef, useState } from "react";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";
import { setUserData } from "@/store/slice/userInfo";
import Logo from "../../../public/logo2.png";
const AuthLogin: React.FC = () => {
    const navigate = useNavigate();
    const [authLogin, { isLoading: isSubmitting }] = useAuthLoginMutation();
    const [formData, setFormData] = useState({ password: "password123", email: "admin@admin.com" });
    const [errors, setErrors] = useState<{ password?: string; email?: string; apiError?: string }>({});

    const validationRules: ValidationRules = {
        password: { required: true, minLength: 2, maxLength: 20 },
    };
    const dispatch = useDispatch()
    const timeoutRef = useRef<number | null>(null);
    const handleFormSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        const { isValid, errors } = validationRequest(formData, validationRules);
        setErrors(errors);

        if (!isValid) {
            toast.error("Please fill in all mandatory fields.", { position: "top-right", autoClose: 3000 });
            return;
        }

        try {
            const response = await authLogin({ email: formData.email, password: formData.password }).unwrap();

            if (response?.user) {
                dispatch(setUserData({
                    user: response.user,
                    menu: response.menu,
                }));
                toast.success("Login successful!", { position: "top-left", autoClose: 3000 });
                timeoutRef.current = window.setTimeout(() => {
                    navigate("/");
                }, 2000);
            } else {
                toast.error("Invalid response format, token missing.", { position: "top-right", autoClose: 3000 });
            }
        } catch (err: any) {
            let apiError = "Login failed. Please try again.";
            if (err?.status === 422 && err?.data?.errors) {
                setErrors(err.data.errors);
                apiError = "Please correct the highlighted errors.";
            } else if (err?.data?.message) {
                apiError = err.data.message;
            }
            setErrors((prevErrors) => ({ ...prevErrors, apiError }));
            toast.error(apiError, { position: "top-right", autoClose: 3000 });
        }
    };
    useEffect(() => {
        return () => {
            if (timeoutRef.current) {
                clearTimeout(timeoutRef.current);
            }
        };
    }, []);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setFormData((prevData) => ({ ...prevData, [e.target.name]: e.target.value }));
        setErrors({ ...errors, [e.target.name]: "" });
    };

    return (
        <div className="row min-h-screen flex flex-col md:flex-row bg-[#d7eaeb]">
            {/* Demo login panel */}
            {/* <div className="col-md-5 p-4 mt-4  md:w-1/3 w-full bg-gradient-to-b from-teal-500 to-teal-700 flex flex-col items-center justify-center p-8">
                <img src="/logo2.png" alt="Logo" className="w-24 h-24 mb-6" />
                <h2 className="text-white text-2xl font-bold mb-6 text-center">Demo Logins</h2>
                <div className="flex flex-col gap-3 w-full">
                    <a href="?demo_type=all_in_one" className="py-2 px-4 bg-white text-teal-700 rounded-lg text-center hover:bg-teal-50 transition">
                        <i className="fas fa-star mr-2" /> Super Admin
                    </a>
                    <a href="?demo_type=pharmacy" className="py-2 px-4 bg-white text-teal-700 rounded-lg text-center hover:bg-teal-50 transition">
                        <i className="fas fa-medkit mr-2" /> Company
                    </a>
                    <a href="?demo_type=services" className="py-2 px-4 bg-white text-teal-700 rounded-lg text-center hover:bg-teal-50 transition">
                        <i className="fas fa-wrench mr-2" /> Employee
                    </a>
                </div>
            </div> */}

            {/* Login form */}
            <div className="col-md-6 shadow-lg p-5 mt-5 md:w-2/3 w-full flex justify-center items-center p-8">
                <div className="bg-white rounded-3xl shadow-xl p-10 w-full max-w-md">

                    <h4 className="text-3xl font-bold text-center mb-2">
                     <img src={Logo} alt="Logo" className="w-24 h-24 mb-6" />  Smart School Management
                        
                    </h4>
                    
                    <p className="text-gray-600 text-center mb-6">
                       Powered by ERP SaaS
                    </p>
                    <form onSubmit={handleFormSubmit} className="space-y-4">
                        <RowFormInputField
                            label="Email"
                            name="email"
                            inputValue={formData.email}
                            error={errors.email}
                            required
                            onChange={handleChange}
                        />
                        <RowFormInputField
                            label="Password"
                            name="password"
                            inputValue={formData.password}
                            error={errors.password}
                            required
                            type="password"
                            onChange={handleChange}
                        />
                        {errors.apiError && <p className="text-red-500 text-sm">{errors.apiError}</p>}
                        <button
                            type="submit"
                            className="form-control  mt-5 bg-success col-md-4"
                        >
                            {isSubmitting ? "Logging in..." : "Login"}
                        </button>
                    </form>
                </div>
            </div>
        </div>
    );
};

export default AuthLogin;
