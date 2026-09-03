import React, { useState, useEffect } from "react";
import { useCMS } from "@/context/CMSContext";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Lock, ShieldCheck, KeyRound, AlertCircle, Loader2 } from "lucide-react";

export const AdminLoginModal: React.FC = () => {
  const {
    isAdminLoggedIn,
    isAdminLoginOpen,
    setIsAdminLoginOpen,
    setIsCMSDrawerOpen,
    login,
  } = useCMS();

  const [passcode, setPasscode] = useState("");
  const [error, setError] = useState("");
  const [isVerifying, setIsVerifying] = useState(false);

  // Listen for Ctrl+Shift+A keypress globally
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.ctrlKey || e.metaKey) && e.shiftKey && (e.key === "A" || e.key === "a")) {
        e.preventDefault();
        if (isAdminLoggedIn) {
          setIsCMSDrawerOpen(true);
        } else {
          setIsAdminLoginOpen(true);
        }
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [isAdminLoggedIn, setIsAdminLoginOpen, setIsCMSDrawerOpen]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setIsVerifying(true);

    try {
      const success = await login(passcode);
      if (success) {
        setPasscode("");
      } else {
        setError("Invalid admin passcode! Check your .env file or passcode setting.");
      }
    } catch (err) {
      setError("Authentication error occurred.");
    } finally {
      setIsVerifying(false);
    }
  };

  return (
    <Dialog open={isAdminLoginOpen} onOpenChange={setIsAdminLoginOpen}>
      <DialogContent className="sm:max-w-md bg-card border-border shadow-2xl backdrop-blur-xl">
        <DialogHeader className="text-center flex flex-col items-center">
          <div className="w-14 h-14 rounded-full bg-primary/10 flex items-center justify-center text-primary mb-3 shadow-inner">
            <Lock className="w-7 h-7" />
          </div>
          <DialogTitle className="text-2xl font-bold tracking-tight">
            Admin CMS Authentication
          </DialogTitle>
          <DialogDescription className="text-sm text-muted-foreground mt-1">
            Triggered by <kbd className="px-1.5 py-0.5 text-xs bg-muted rounded border border-border font-mono text-primary">Ctrl + Shift + A</kbd>. Enter passcode to edit portfolio content.
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4 pt-2">
          {error && (
            <div className="flex items-center gap-2 p-3 rounded-lg bg-destructive/10 border border-destructive/30 text-destructive text-sm font-medium">
              <AlertCircle className="w-4 h-4 flex-shrink-0" />
              <span>{error}</span>
            </div>
          )}

          <div className="space-y-2">
            <label className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">
              Admin Passcode
            </label>
            <div className="relative">
              <KeyRound className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
              <Input
                type="password"
                placeholder="Enter passcode..."
                value={passcode}
                onChange={(e) => setPasscode(e.target.value)}
                className="pl-9 bg-secondary/50 border-border focus-visible:ring-primary"
                autoFocus
              />
            </div>
          </div>

          <div className="flex justify-end gap-3 pt-3">
            <Button
              type="button"
              variant="outline"
              onClick={() => setIsAdminLoginOpen(false)}
            >
              Cancel
            </Button>
            <Button type="submit" disabled={isVerifying} className="gap-2 shadow-md hover:shadow-lg">
              {isVerifying ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  Verifying...
                </>
              ) : (
                <>
                  <ShieldCheck className="w-4 h-4" />
                  Unlock Admin CMS
                </>
              )}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default AdminLoginModal;
