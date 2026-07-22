import React, { useState, useEffect, useRef } from 'react';
import { Shield, Key, Mail, Cpu, CheckCircle, Github, Award, User, AlertCircle, Sparkles } from 'lucide-react';

interface LoginPageProps {
  onLoginSuccess: (user: { name: string; role: string }) => void;
  onBackToLanding: () => void;
}

interface UserAccount {
  name: string;
  email: string;
  passwordHash: string;
  role: string;
}

export default function LoginPage({ onLoginSuccess, onBackToLanding }: LoginPageProps) {
  const [isRegisterMode, setIsRegisterMode] = useState(false);
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [role, setRole] = useState('Logistics Officer');
  const [errorMsg, setErrorMsg] = useState('');
  const [successMsg, setSuccessMsg] = useState('');

  // Target User object for success routing
  const [authenticatedUser, setAuthenticatedUser] = useState<UserAccount | null>(null);

  // MFA OTP states
  const [showOtp, setShowOtp] = useState(false);
  const [generatedOtp, setGeneratedOtp] = useState('');
  const [otpCode, setOtpCode] = useState(['', '', '', '', '', '']);
  
  const [passStrength, setPassStrength] = useState({ score: 0, label: 'Weak', color: 'bg-brand-danger' });
  
  // Face Scan Webcam States
  const [faceScanActive, setFaceScanActive] = useState(false);
  const [faceScanStep, setFaceScanStep] = useState(0);
  const videoRef = useRef<HTMLVideoElement>(null);
  const streamRef = useRef<MediaStream | null>(null);

  // Default system account if none exists
  useEffect(() => {
    const existing = localStorage.getItem('aether_users');
    if (!existing) {
      const defaultUsers: UserAccount[] = [
        {
          name: 'Dr. Sarah Jenkins',
          email: 'sjenkins@aetheros.ai',
          passwordHash: 'Admin123!',
          role: 'CTO & Supply Architect'
        }
      ];
      localStorage.setItem('aether_users', JSON.stringify(defaultUsers));
    }
  }, []);

  // Password strength checker
  useEffect(() => {
    if (!password) {
      setPassStrength({ score: 0, label: 'Weak', color: 'bg-brand-danger' });
      return;
    }
    let score = 0;
    if (password.length >= 8) score++;
    if (/[A-Z]/.test(password)) score++;
    if (/[0-9]/.test(password)) score++;
    if (/[^A-Za-z0-9]/.test(password)) score++;

    let label = 'Weak';
    let color = 'bg-brand-danger';
    if (score === 2) { label = 'Fair'; color = 'bg-yellow-500'; }
    else if (score === 3) { label = 'Good'; color = 'bg-brand-blue'; }
    else if (score === 4) { label = 'Strong'; color = 'bg-brand-emerald'; }

    setPassStrength({ score, label, color });
  }, [password]);

  // Biometric login webcam simulation
  useEffect(() => {
    if (!faceScanActive) return;

    // Request webcam access
    navigator.mediaDevices.getUserMedia({ video: { width: 300, height: 300 } })
      .then(stream => {
        streamRef.current = stream;
        if (videoRef.current) {
          videoRef.current.srcObject = stream;
        }
      })
      .catch(err => {
        console.error("Webcam blocked or unavailable:", err);
        setErrorMsg("Webcam access denied. Please allow camera permissions to run Biometric scan.");
        setFaceScanActive(false);
      });

    const interval = setInterval(() => {
      setFaceScanStep(prev => {
        if (prev >= 3) {
          clearInterval(interval);
          setTimeout(() => {
            // Stop camera streams
            if (streamRef.current) {
              streamRef.current.getTracks().forEach(track => track.stop());
            }
            setFaceScanActive(false);

            // Fetch default Sarah Jenkins credentials for face login
            const users: UserAccount[] = JSON.parse(localStorage.getItem('aether_users') || '[]');
            const sarah = users.find(u => u.email === 'sjenkins@aetheros.ai') || {
              name: 'Dr. Sarah Jenkins',
              role: 'CTO & Supply Architect'
            };
            onLoginSuccess({ name: sarah.name, role: sarah.role });
          }, 1500);
          return 3;
        }
        return prev + 1;
      });
    }, 1200);

    return () => {
      clearInterval(interval);
      if (streamRef.current) {
        streamRef.current.getTracks().forEach(track => track.stop());
      }
    };
  }, [faceScanActive, onLoginSuccess]);

  const handleFaceScanStart = () => {
    setErrorMsg('');
    setFaceScanActive(true);
    setFaceScanStep(0);
  };

  // Sign In / Sign Up handler
  const handleAuthSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg('');
    setSuccessMsg('');

    const usersList: UserAccount[] = JSON.parse(localStorage.getItem('aether_users') || '[]');

    if (isRegisterMode) {
      // REGISTRATION
      if (password !== confirmPassword) {
        setErrorMsg("Passwords do not match.");
        return;
      }
      if (passStrength.score < 3) {
        setErrorMsg("Password is too weak. Must contain numbers, uppercase letters, and symbols.");
        return;
      }
      if (usersList.some(u => u.email === email)) {
        setErrorMsg("An account with this email already exists.");
        return;
      }

      const newUser: UserAccount = {
        name,
        email,
        passwordHash: password,
        role
      };

      usersList.push(newUser);
      localStorage.setItem('aether_users', JSON.stringify(usersList));
      setSuccessMsg("Account registered successfully! You can now sign in.");
      setIsRegisterMode(false);
      setName('');
      setPassword('');
      setConfirmPassword('');
    } else {
      // SIGN IN
      const matchedUser = usersList.find(u => u.email === email && u.passwordHash === password);
      if (!matchedUser) {
        setErrorMsg("Invalid security credentials or password.");
        return;
      }

      // Generate actual random 6-digit OTP code
      const generated = Math.floor(100000 + Math.random() * 900000).toString();
      setGeneratedOtp(generated);
      setAuthenticatedUser(matchedUser);
      setOtpCode(['', '', '', '', '', '']);
      setShowOtp(true);
    }
  };

  const handleOtpChange = (val: string, idx: number) => {
    if (isNaN(Number(val))) return;
    const newOtp = [...otpCode];
    newOtp[idx] = val;
    setOtpCode(newOtp);

    // Auto focus next input
    if (val && idx < 5) {
      const nextInput = document.getElementById(`otp-${idx + 1}`);
      nextInput?.focus();
    }

    const typedOtp = newOtp.join('');
    if (typedOtp.length === 6) {
      if (typedOtp === generatedOtp) {
        // Correct OTP -> Log in with real name & role
        if (authenticatedUser) {
          onLoginSuccess({ name: authenticatedUser.name, role: authenticatedUser.role });
        }
      } else {
        // Incorrect OTP -> Trigger error and reset
        setErrorMsg("Invalid Multi-Factor Token. Security clearance denied.");
        setOtpCode(['', '', '', '', '', '']);
        setShowOtp(false);
      }
    }
  };

  // Social logins popup windows
  const handleSocialLogin = (platform: 'Google' | 'GitHub') => {
    const width = 500;
    const height = 600;
    const left = window.screenX + (window.innerWidth - width) / 2;
    const top = window.screenY + (window.innerHeight - height) / 2;

    const popup = window.open(
      '',
      `${platform} Authorization`,
      `width=${width},height=${height},left=${left},top=${top}`
    );

    if (popup) {
      popup.document.write(`
        <html>
          <head>
            <title>${platform} Login</title>
            <style>
              body { background: #030308; color: #f1f1f6; font-family: sans-serif; display: flex; flex-direction: column; align-items: center; justify-content: center; height: 100vh; margin: 0; }
              .card { background: rgba(255,255,255,0.05); padding: 40px; border-radius: 20px; border: 1px solid rgba(255,255,255,0.1); text-align: center; max-width: 350px; }
              button { background: #8b5cf6; color: white; border: none; padding: 12px 24px; border-radius: 10px; font-weight: bold; cursor: pointer; margin-top: 20px; width: 100%; }
              button:hover { opacity: 0.9; }
            </style>
          </head>
          <body>
            <div class="card">
              <h2>AetherOS AI Authorization</h2>
              <p>Authorize AetherOS to access your secure ${platform} profile credentials.</p>
              <button onclick="window.opener.postMessage('social-success', '*'); window.close();">Confirm & Authorize</button>
            </div>
          </body>
        </html>
      `);

      const messageListener = (event: MessageEvent) => {
        if (event.data === 'social-success') {
          // Log in with mock platform names
          onLoginSuccess({
            name: `${platform} Operator`,
            role: 'Federated Identity'
          });
          window.removeEventListener('message', messageListener);
        }
      };
      window.addEventListener('message', messageListener);
    }
  };

  return (
    <div className="relative min-h-screen flex items-center justify-center bg-[#030308] overflow-hidden px-4">
      {/* Background gradients */}
      <div className="absolute inset-0 bg-aurora opacity-50 z-0"></div>

      {/* Main glass wrapper */}
      <div className="relative z-10 w-full max-w-md glass-panel rounded-3xl p-8 shadow-2xl transition-all duration-300">
        
        {/* Back navigation */}
        <button onClick={onBackToLanding} className="absolute top-6 left-6 text-xs text-brand-muted hover:text-white transition-colors">
          ← Back to Site
        </button>

        {/* Logo Title */}
        <div className="text-center mt-4 mb-8">
          <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-2xl bg-gradient-to-tr from-brand-blue to-brand-purple shadow-[0_0_20px_rgba(139,92,246,0.3)] mb-3">
            <span className="text-xl font-bold text-white">Æ</span>
          </div>
          <h2 className="text-2xl font-bold font-sans text-white">AetherOS AI</h2>
          <p className="text-xs text-brand-cyan tracking-widest font-semibold uppercase mt-1">Autonomous Supply Control</p>
        </div>

        {/* Error / Success Banners */}
        {errorMsg && (
          <div className="flex gap-2 rounded-xl bg-brand-danger/10 border border-brand-danger/20 p-3.5 text-xs text-brand-danger mb-4">
            <AlertCircle className="h-4.5 w-4.5 shrink-0" />
            <span>{errorMsg}</span>
          </div>
        )}
        {successMsg && (
          <div className="flex gap-2 rounded-xl bg-brand-emerald/10 border border-brand-emerald/20 p-3.5 text-xs text-[#10b981] mb-4">
            <CheckCircle className="h-4.5 w-4.5 shrink-0" />
            <span>{successMsg}</span>
          </div>
        )}

        {/* Regular Login / Register Form */}
        {!showOtp && !faceScanActive && (
          <form onSubmit={handleAuthSubmit} className="space-y-4">
            {isRegisterMode && (
              <div className="space-y-1">
                <label className="block text-[10px] font-bold text-brand-muted uppercase tracking-wider">Full Name</label>
                <div className="relative">
                  <User className="absolute left-3 top-3.5 h-4 w-4 text-brand-muted" />
                  <input
                    type="text"
                    required
                    placeholder="Sarah Jenkins"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    className="w-full glass-input pl-10 pr-4 py-3 text-xs focus:outline-none"
                  />
                </div>
              </div>
            )}

            <div className="space-y-1">
              <label className="block text-[10px] font-bold text-brand-muted uppercase tracking-wider">Enterprise Email</label>
              <div className="relative">
                <Mail className="absolute left-3 top-3.5 h-4 w-4 text-brand-muted" />
                <input
                  type="email"
                  required
                  placeholder="sjenkins@aetheros.ai"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full glass-input pl-10 pr-4 py-3 text-xs focus:outline-none"
                />
              </div>
            </div>

            <div className="space-y-1">
              <div className="flex items-center justify-between">
                <label className="block text-[10px] font-bold text-brand-muted uppercase tracking-wider">Password</label>
                {!isRegisterMode && <a href="#" className="text-[10px] text-brand-purple hover:underline">Forgot?</a>}
              </div>
              <div className="relative">
                <Key className="absolute left-3 top-3.5 h-4 w-4 text-brand-muted" />
                <input
                  type="password"
                  required
                  placeholder="••••••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full glass-input pl-10 pr-4 py-3 text-xs focus:outline-none"
                />
              </div>

              {/* Password strength indicators */}
              {isRegisterMode && password && (
                <div className="mt-1.5 space-y-1">
                  <div className="flex justify-between items-center text-[9px]">
                    <span className="text-brand-muted">Strength:</span>
                    <span className="font-bold uppercase text-white">{passStrength.label}</span>
                  </div>
                  <div className="h-1 w-full bg-white/5 rounded-full overflow-hidden">
                    <div
                      className={`h-full transition-all duration-300 ${passStrength.color}`}
                      style={{ width: `${(passStrength.score / 4) * 100}%` }}
                    />
                  </div>
                </div>
              )}
            </div>

            {isRegisterMode && (
              <>
                <div className="space-y-1">
                  <label className="block text-[10px] font-bold text-brand-muted uppercase tracking-wider">Confirm Password</label>
                  <div className="relative">
                    <Key className="absolute left-3 top-3.5 h-4 w-4 text-brand-muted" />
                    <input
                      type="password"
                      required
                      placeholder="••••••••••••"
                      value={confirmPassword}
                      onChange={(e) => setConfirmPassword(e.target.value)}
                      className="w-full glass-input pl-10 pr-4 py-3 text-xs focus:outline-none"
                    />
                  </div>
                </div>

                <div className="space-y-1">
                  <label className="block text-[10px] font-bold text-brand-muted uppercase tracking-wider">Security Access Role</label>
                  <select
                    value={role}
                    onChange={(e) => setRole(e.target.value)}
                    className="w-full bg-[#0c0c16] border border-white/10 rounded-lg text-xs p-2 text-white focus:outline-none"
                  >
                    <option>Logistics Officer</option>
                    <option>CTO & Supply Architect</option>
                    <option>Carbon Audit Officer</option>
                    <option>Admin Principal</option>
                  </select>
                </div>
              </>
            )}

            <button type="submit" className="w-full rounded-xl bg-gradient-to-r from-brand-blue to-brand-purple py-3 text-xs font-semibold hover:opacity-95 transition-opacity shadow-[0_0_15px_rgba(139,92,246,0.2)]">
              {isRegisterMode ? 'Complete Security Registration' : 'Validate Credentials'}
            </button>

            {/* Mode Switcher */}
            <div className="text-center mt-2">
              <button
                type="button"
                onClick={() => setIsRegisterMode(!isRegisterMode)}
                className="text-[11px] text-brand-purple hover:underline"
              >
                {isRegisterMode ? 'Already have an account? Sign In' : "Don't have credentials? Register Profile"}
              </button>
            </div>

            {/* Biometric Scan */}
            {!isRegisterMode && (
              <>
                <div className="relative flex items-center justify-center my-6">
                  <span className="absolute inset-x-0 h-px bg-white/10"></span>
                  <span className="relative bg-[#0b0b17] px-3 text-[10px] text-brand-muted font-semibold">OR SECURE SCAN</span>
                </div>

                <button
                  type="button"
                  onClick={handleFaceScanStart}
                  className="w-full flex items-center justify-center gap-2 rounded-xl border border-brand-cyan/20 bg-brand-cyan/5 py-3 text-xs font-semibold hover:bg-brand-cyan/10 hover:border-brand-cyan/40 transition-all text-brand-cyan"
                >
                  <Cpu className="h-4 w-4" />
                  <span>Initiate Biometric Webcam Scan</span>
                </button>

                {/* Social Sign-ins */}
                <div className="grid grid-cols-2 gap-3 mt-4">
                  <button
                    type="button"
                    onClick={() => handleSocialLogin('GitHub')}
                    className="flex items-center justify-center gap-2 rounded-xl bg-white/5 border border-white/5 py-2.5 text-xs font-medium hover:bg-white/10 transition-colors"
                  >
                    <Github className="h-4 w-4" />
                    <span>GitHub OAuth</span>
                  </button>
                  <button
                    type="button"
                    onClick={() => handleSocialLogin('Google')}
                    className="flex items-center justify-center gap-2 rounded-xl bg-white/5 border border-white/5 py-2.5 text-xs font-medium hover:bg-white/10 transition-colors"
                  >
                    <Award className="h-4 w-4 text-brand-cyan" />
                    <span>Google IAM</span>
                  </button>
                </div>
              </>
            )}
          </form>
        )}

        {/* OTP Screen */}
        {showOtp && (
          <div className="space-y-6">
            <div className="text-center space-y-2">
              <h3 className="text-base font-bold text-white">Enter Verification Code</h3>
              <p className="text-xs text-brand-muted font-medium">A security OTP code has been dispatched. You must input the exact generated token.</p>
            </div>

            {/* Glowing OTP Notification Alert */}
            <div className="glass-panel border-brand-purple/20 bg-brand-purple/5 rounded-xl p-3 flex items-center justify-between text-xs text-brand-purple select-none">
              <div className="flex items-center gap-1.5 font-semibold">
                <Sparkles className="h-4 w-4 text-brand-cyan animate-pulse" />
                <span>Clearance Token Generated:</span>
              </div>
              <span className="font-mono font-bold tracking-widest text-white text-sm bg-white/5 px-2.5 py-0.5 rounded border border-white/5 select-all">
                {generatedOtp}
              </span>
            </div>

            <div className="flex justify-center gap-2">
              {otpCode.map((char, idx) => (
                <input
                  key={idx}
                  id={`otp-${idx}`}
                  type="text"
                  maxLength={1}
                  value={char}
                  onChange={(e) => handleOtpChange(e.target.value, idx)}
                  className="h-11 w-11 rounded-lg glass-input text-center font-bold text-base focus:outline-none focus:border-brand-purple"
                />
              ))}
            </div>

            <button
              onClick={() => { setShowOtp(false); setOtpCode(['','','','','','']); }}
              className="w-full text-center text-xs text-brand-muted hover:text-brand-purple transition-colors"
            >
              Back to credentials
            </button>
          </div>
        )}

        {/* Face Biometric Verification HUD with LIVE Webcam Feed */}
        {faceScanActive && (
          <div className="flex flex-col items-center py-4 space-y-6">
            <div className="relative h-48 w-48 rounded-full border-2 border-brand-cyan/20 flex items-center justify-center overflow-hidden bg-black">
              {/* Webcam Video Element */}
              <video
                ref={videoRef}
                autoPlay
                playsInline
                muted
                className="absolute inset-0 w-full h-full object-cover rounded-full"
              />

              {/* Animated HUD Scanning circle overlay */}
              <div className="absolute inset-2 rounded-full border border-dashed border-brand-cyan/40 animate-spin-slow pointer-events-none"></div>
              
              {/* Scanning horizontal line */}
              <div className="scanning-line pointer-events-none"></div>

              {/* Mapped facial nodes */}
              {faceScanStep >= 1 && (
                <>
                  <span className="absolute top-[32%] left-[36%] h-2 w-2 rounded-full bg-brand-emerald animate-ping"></span>
                  <span className="absolute top-[32%] right-[36%] h-2 w-2 rounded-full bg-brand-emerald animate-ping"></span>
                </>
              )}
              {faceScanStep >= 2 && (
                <>
                  <span className="absolute top-[52%] left-[49%] h-2 w-2 rounded-full bg-brand-cyan animate-ping"></span>
                  <span className="absolute bottom-[36%] left-[32%] h-2 w-2 rounded-full bg-brand-cyan animate-ping"></span>
                  <span className="absolute bottom-[36%] right-[32%] h-2 w-2 rounded-full bg-brand-cyan animate-ping"></span>
                </>
              )}

              {/* Text indicator */}
              <div className="absolute bottom-4 inset-x-0 flex items-center justify-center pointer-events-none">
                <span className="bg-[#030308]/80 backdrop-blur-sm border border-white/10 rounded px-2 py-0.5 text-[8px] text-brand-cyan font-bold tracking-widest uppercase">
                  {faceScanStep === 0 && 'Webcam Active'}
                  {faceScanStep === 1 && 'Scanning Face'}
                  {faceScanStep === 2 && 'Matching Coordinates'}
                  {faceScanStep === 3 && 'Verified'}
                </span>
              </div>

              {faceScanStep === 3 && (
                <div className="absolute inset-0 flex items-center justify-center bg-brand-dark/40 backdrop-blur-[1px]">
                  <div className="flex flex-col items-center text-brand-emerald">
                    <CheckCircle className="h-12 w-12 mb-1 animate-bounce" />
                  </div>
                </div>
              )}
            </div>

            <div className="text-center space-y-1">
              <h4 className="text-sm font-semibold text-white">Biometric Scanning Enclave</h4>
              <p className="text-[11px] text-brand-muted">
                {faceScanStep === 0 && 'Opening hardware video feed...'}
                {faceScanStep === 1 && 'Acquiring active coordinate map nodes...'}
                {faceScanStep === 2 && 'Verifying credentials against security sector...'}
                {faceScanStep === 3 && 'Signature matched! Opening Command Workspace.'}
              </p>
            </div>

            <button
              onClick={() => {
                if (streamRef.current) {
                  streamRef.current.getTracks().forEach(track => track.stop());
                }
                setFaceScanActive(false);
              }}
              className="text-xs text-brand-muted hover:text-brand-danger transition-colors"
            >
              Cancel scan
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
