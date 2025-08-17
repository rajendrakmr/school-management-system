import RowFormInputField from "@/components/Form/RowFormInputField";
import { useAuthLoginMutation } from "@/store/slice/AuthType";
import { validationRequest, ValidationRules } from "@/utils/validationRequest";
import React, { useState } from "react";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom"; // Import navigate

const AuthLogin: React.FC = () => {
    const navigate = useNavigate();
    const [authLogin, { isLoading: isSubmitting }] = useAuthLoginMutation();
    const [formData, setFormData] = useState({ password: "password123", email: "john@example.com" });
    const [errors, setErrors] = useState<{ password?: string; email?: string; apiError?: string }>({});

    // Validation rules
    const validationRules: ValidationRules = {
        password: { required: true, minLength: 2, maxLength: 20 },
    };

    const handleFormSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
    
        // Validate form input
        const { isValid, errors } = validationRequest(formData, validationRules);
        setErrors(errors);
        
        if (!isValid) {
            toast.error("Please fill in all mandatory fields.", { position: "top-right", autoClose: 3000 });
            console.log("Validation Errors:", errors);
            return;
        }
    
        try {
            // Send login request
            const response = await authLogin({ email: formData.email, password: formData.password }).unwrap();
            
            if (response?.access_token) {
                toast.success("Login successful!", { position: "top-left", autoClose: 3000 });
                localStorage.setItem("authToken", response.access_token);
                console.log("Login Successful:", response);

                // Redirect using navigate
                navigate("/backend");
            } else {
                toast.error("Invalid response format, token missing.", { position: "top-right", autoClose: 3000 });
            }
            
        } catch (err: any) {
            console.error("Login Error:", err);
            let apiError = "Login failed. Please try again."; 

            if (err?.status === 422 && err?.data?.errors) { 
                setErrors(err.data.errors);
                apiError = "Please correct the highlighted errors.";
            } else if (err?.data?.message) { 
                apiError = err.data.message;
            } 

            setErrors((prevErrors) => ({
                ...prevErrors,
                apiError,
            }));

            toast.error(apiError, { position: "top-right", autoClose: 3000 });
        }
    };

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setFormData((prevData) => ({
            ...prevData,
            [e.target.name]: e.target.value,
        }));
        setErrors({ ...errors, [e.target.name]: "" });
    };

    return (
        <div className="row" style={{ backgroundColor: "#d7eaeb", height: "100vh" }}>
            <div className="col-md-4">
                <div className="box-primary tw-mb-4 tw-transition-all lg:tw-col-span-2 tw-duration-200 tw-bg-white tw-shadow-sm tw-rounded-xl tw-ring-1 hover:tw-shadow-md  tw-ring-gray-200">
                    <div className="tw-p-2 sm:tw-p-3">
                        <div className="box-header text-center flex justify-center">
                            <div className="mb-3">
                                <img src="/logo2.png" alt="Logo" className="logo-img mx-auto" />
                            </div>
                        </div>
                        <div className="tw-flow-root tw-border-gray-200">
                            <div className="tw-py-2 tw-align-middle sm:tw-px-5">
                                <a href="?demo_type=all_in_one" className="btn btn-app bg-olive demo-login">
                                    <i className="fas fa-star" /> Super Admin
                                </a>
                                <a href="?demo_type=pharmacy" className="btn bg-maroon btn-app demo-login">
                                    <i className="fas fa-medkit" /> Company
                                </a>
                                <a href="?demo_type=services" className="btn bg-orange btn-app demo-login">
                                    <i className="fas fa-wrench" /> Employee
                                </a>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            <div className="col-md-7">
                <div className="tw-p-5 md:tw-p-6 tw-mb-4 tw-rounded-2xl tw-transition-all tw-duration-200 tw-bg-white tw-shadow-sm tw-ring-1 tw-ring-gray-200">
                    <div className="tw-flex tw-flex-col tw-gap-4 tw-dw-rounded-box tw-dw-p-6 tw-dw-max-w-md">
                        <div className="tw-flex tw-items-center tw-flex-col">
                            <h4 className="tw-text-sm tw-font-medium tw-text-gray-500">
                                Welcome to our HRCloud HRMs
                            </h4>
                        </div>
                        <form method="POST" className="shadow-lg p-5" onSubmit={handleFormSubmit} id="login-form">
                            <RowFormInputField label="Email" name="email" inputValue={formData.email} error={errors.email} required onChange={handleChange} />
                            <RowFormInputField label="Password" name="password" inputValue={formData.password} error={errors.password} required onChange={handleChange} />

                            {errors.apiError && <p className="text-danger">{errors.apiError}</p>}

                            <div className="d-flex justify-content-end pt-3">
                                <button type="submit" className="btn btn-success">
                                    {isSubmitting ? "Logging in..." : "Login"}
                                </button>
                            </div>
                        </form>
                        <div className="tw-flex tw-items-center tw-flex-col">
                            <a href="/register" className="tw-text-sm tw-font-medium tw-text-gray-500 hover:tw-text-gray-500 tw-mt-2">
                                Not yet registered?{" "}
                                <span className="tw-text-sm tw-font-medium tw-bg-gradient-to-r tw-from-indigo-500 tw-to-blue-500 tw-inline-block tw-text-transparent tw-bg-clip-text hover:tw-text-[#467BF5] hover:tw-underline">
                                    Register Now
                                </span>
                            </a>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default AuthLogin;
