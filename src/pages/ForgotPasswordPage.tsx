import { useState } from "react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { Mail, ArrowLeft, Music2 } from "lucide-react";
import { useAuth } from "@/context/AuthContext";
import { useToast } from "@/hooks/use-toast";
import { FirebaseError } from "firebase/app";

const ForgotPasswordPage = () => {
  const { resetPassword } = useAuth();
  const { toast } = useToast();
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [sent, setSent] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      await resetPassword(email);
      setSent(true);
      toast({ title: "Email sent!", description: "Check your inbox for reset instructions" });
    } catch (err) {
      const msg = err instanceof FirebaseError ? err.message.replace("Firebase: ", "") : "Reset failed";
      toast({ title: "Reset failed", description: msg, variant: "destructive" });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-background p-4">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="w-full max-w-md"
      >
        <div className="flex flex-col items-center mb-8">
          <div className="w-14 h-14 rounded-2xl bg-primary flex items-center justify-center mb-4">
            <Music2 className="text-primary-foreground" size={28} />
          </div>
          <h1 className="font-heading text-3xl font-bold text-foreground">Reset password</h1>
          <p className="text-sm text-muted-foreground mt-1 text-center">
            Enter your email and we'll send you a reset link
          </p>
        </div>

        <form onSubmit={handleSubmit} className="flex flex-col gap-4 bg-card border border-border rounded-2xl p-6">
          {sent ? (
            <div className="text-center py-4">
              <p className="text-sm text-foreground mb-2">✉️ Email sent!</p>
              <p className="text-xs text-muted-foreground">Check your inbox at {email}</p>
            </div>
          ) : (
            <>
              <div>
                <label className="text-xs text-muted-foreground mb-1.5 block">Email</label>
                <div className="relative">
                  <Mail size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                    className="w-full pl-10 pr-3 py-2.5 rounded-lg bg-background border border-border text-foreground text-sm focus:outline-none focus:ring-2 focus:ring-primary/50"
                    placeholder="you@example.com"
                  />
                </div>
              </div>
              <button
                type="submit"
                disabled={loading}
                className="w-full py-2.5 rounded-lg bg-primary text-primary-foreground font-medium text-sm hover:opacity-90 transition-opacity disabled:opacity-50"
              >
                {loading ? "Sending..." : "Send reset link"}
              </button>
            </>
          )}
        </form>

        <Link
          to="/login"
          className="flex items-center justify-center gap-1.5 text-sm text-muted-foreground hover:text-foreground mt-6"
        >
          <ArrowLeft size={14} /> Back to sign in
        </Link>
      </motion.div>
    </div>
  );
};

export default ForgotPasswordPage;
