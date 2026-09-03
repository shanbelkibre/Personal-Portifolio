import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Card } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Lock, ShieldCheck, KeyRound, AlertCircle, Loader2, User } from 'lucide-react';
import { useCMS } from '@/context/CMSContext';

const Admin = () => {
  const navigate = useNavigate();
  const { login } = useCMS();
  
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [isVerifying, setIsVerifying] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    // Basic Input Validation for SQL/XSS
    const sqlXssRegex = /(<script>|SELECT|INSERT|UPDATE|DELETE|DROP|--|;)/i;
    if (sqlXssRegex.test(username) || sqlXssRegex.test(password)) {
      setError('Invalid characters detected.');
      return;
    }

    setIsVerifying(true);

    try {
      // Temporarily use the old login logic for fallback if backend isn't ready,
      // but ideally this should call a backend endpoint.
      const success = await login(password); // Will update CMSContext later to pass username as well
      if (success) {
        navigate('/');
      } else {
        setError('Invalid credentials.');
      }
    } catch (err) {
      setError('Authentication error occurred.');
    } finally {
      setIsVerifying(false);
    }
  };

  return (
    <div className="min-h-screen bg-background flex flex-col items-center justify-center p-4">
      <Card className="w-full max-w-md p-8 bg-card border-border shadow-2xl backdrop-blur-xl space-y-6">
        <div className="text-center flex flex-col items-center">
          <div className="w-14 h-14 rounded-full bg-primary/10 flex items-center justify-center text-primary mb-3 shadow-inner">
            <Lock className="w-7 h-7" />
          </div>
          <h2 className="text-2xl font-bold tracking-tight">Admin Authentication</h2>
          <p className="text-sm text-muted-foreground mt-1">
            Secure backend login for Portfolio CMS.
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          {error && (
            <div className="flex items-center gap-2 p-3 rounded-lg bg-destructive/10 border border-destructive/30 text-destructive text-sm font-medium">
              <AlertCircle className="w-4 h-4 flex-shrink-0" />
              <span>{error}</span>
            </div>
          )}

          <div className="space-y-2">
            <label className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">
              Username
            </label>
            <div className="relative">
              <User className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
              <Input
                type="text"
                placeholder="Enter admin username..."
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                className="pl-9 bg-secondary/50 border-border focus-visible:ring-primary"
                autoFocus
                required
              />
            </div>
          </div>

          <div className="space-y-2">
            <label className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">
              Password
            </label>
            <div className="relative">
              <KeyRound className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
              <Input
                type="password"
                placeholder="Enter password..."
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="pl-9 bg-secondary/50 border-border focus-visible:ring-primary"
                required
              />
            </div>
          </div>

          <div className="flex justify-end gap-3 pt-3">
            <Button
              type="button"
              variant="outline"
              onClick={() => navigate('/')}
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
                  Login to Backend
                </>
              )}
            </Button>
          </div>
        </form>
      </Card>
    </div>
  );
};

export default Admin;
