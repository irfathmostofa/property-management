import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { Button } from "../../components/ui/Button";
import { Input } from "../../components/ui/Input";
import { Select } from "../../components/ui/Select";
import { Card, CardContent } from "../../components/ui/Card";
import {
  Building2,
  User,
  Mail,
  Lock,
  Phone,
  MapPin,
  CreditCard,
} from "lucide-react";
import toast from "react-hot-toast";
import { supabase } from "../../utils/supabase";

export function SignupPage() {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    email: "",
    password: "",
    confirmPassword: "",
    full_name: "",
    phone: "",
    whatsapp_number: "",
    nid: "",
    address: "",
    role: "owner",
  });

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Validation
    if (formData.password !== formData.confirmPassword) {
      toast.error("Passwords do not match");
      return;
    }

    if (formData.password.length < 6) {
      toast.error("Password must be at least 6 characters");
      return;
    }

    setLoading(true);

    try {
      // Prepare metadata with all required fields
      const metadata = {
        full_name: formData.full_name,
        phone: formData.phone,
        whatsapp_number: formData.whatsapp_number || "",
        nid: formData.nid || "",
        address: formData.address || "",
        role: formData.role,
      };

      console.log("Attempting signup with metadata:", metadata);

      const { data: authData, error: signUpError } = await supabase.auth.signUp({
        email: formData.email,
        password: formData.password,
        options: {
          data: metadata,
        },
      });

      if (signUpError) {
        console.error("Signup error details:", signUpError);
        throw signUpError;
      }

      if (authData.user) {
        console.log("User created successfully:", authData.user.id);
        
        // Small delay to ensure trigger has run
        setTimeout(() => {
          toast.success("Account created successfully! Please check your email to verify your account.");
          navigate("/login");
        }, 1500);
      }
    } catch (error) {
      console.error("Signup error:", error);
      
      // Specific error messages
      if (error.message.includes("Database error")) {
        toast.error("Database error. Please contact support or try again later.");
      } else if (error.message.includes("User already registered")) {
        toast.error("An account with this email already exists.");
      } else {
        toast.error(error.message || "Failed to create account");
      }
    } finally {
      setLoading(false);
    }
  };

  const roleOptions = [
    { value: "owner", label: "Property Owner" },
    { value: "admin", label: "Administrator" },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary-50 to-gray-100 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-2xl mx-auto">
        <div className="text-center mb-8">
          <div className="flex justify-center mb-4">
            <div className="p-3 bg-primary-100 rounded-full">
              <Building2 className="h-8 w-8 text-primary-600" />
            </div>
          </div>
          <h2 className="text-3xl font-bold text-gray-900">
            Create an Account
          </h2>
          <p className="mt-2 text-sm text-gray-600">
            Join Rent Management System to manage your properties
          </p>
        </div>

        <Card>
          <CardContent className="p-6 md:p-8">
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <Input
                  label="Full Name"
                  name="full_name"
                  required
                  value={formData.full_name}
                  onChange={handleChange}
                  icon={User}
                  placeholder="John Doe"
                />

                <Input
                  label="Email Address"
                  name="email"
                  type="email"
                  required
                  value={formData.email}
                  onChange={handleChange}
                  icon={Mail}
                  placeholder="john@example.com"
                />

                <Input
                  label="Phone Number"
                  name="phone"
                  required
                  value={formData.phone}
                  onChange={handleChange}
                  icon={Phone}
                  placeholder="+8801234567890"
                />

                <Input
                  label="WhatsApp Number (Optional)"
                  name="whatsapp_number"
                  value={formData.whatsapp_number}
                  onChange={handleChange}
                  icon={Phone}
                  placeholder="+8801234567890"
                />

                <Input
                  label="NID Number (Optional)"
                  name="nid"
                  value={formData.nid}
                  onChange={handleChange}
                  icon={CreditCard}
                  placeholder="1234567890"
                />

                <Select
                  label="Account Type"
                  name="role"
                  required
                  value={formData.role}
                  onChange={handleChange}
                  options={roleOptions}
                />

                <div className="md:col-span-2">
                  <Input
                    label="Address"
                    name="address"
                    value={formData.address}
                    onChange={handleChange}
                    icon={MapPin}
                    placeholder="Your full address"
                  />
                </div>

                <Input
                  label="Password"
                  name="password"
                  type="password"
                  required
                  value={formData.password}
                  onChange={handleChange}
                  icon={Lock}
                  placeholder="••••••••"
                />

                <Input
                  label="Confirm Password"
                  name="confirmPassword"
                  type="password"
                  required
                  value={formData.confirmPassword}
                  onChange={handleChange}
                  icon={Lock}
                  placeholder="••••••••"
                />
              </div>

              <Button type="submit" loading={loading} fullWidth>
                Create Account
              </Button>

              <div className="text-center text-sm">
                <span className="text-gray-600">Already have an account?</span>{" "}
                <Link
                  to="/login"
                  className="text-primary-600 hover:text-primary-700 font-medium"
                >
                  Sign in here
                </Link>
              </div>
            </form>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}