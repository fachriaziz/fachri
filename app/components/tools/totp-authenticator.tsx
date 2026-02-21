"use client";

import { useState, useEffect, useMemo, useRef } from "react";
import { ToolIcons } from "@/app/components/ui/tool-icons";
import { Card, CardContent } from "@/app/components/ui/card";
import { Button } from "@/app/components/ui/button";
import { cn } from "@/lib/utils";
import { motion, AnimatePresence } from "framer-motion";
import * as OTPAuth from "otpauth";
import { QRCodeCanvas } from "qrcode.react";
import { TechIcons } from "@/app/components/ui/icons";
import { Tabs, TabsList, TabsTrigger } from "@/app/components/ui/tabs";
import {
  CopyButton,
  CopyButtonWithLabel,
} from "@/app/components/ui/copy-button";
import { EmptyState } from "@/app/components/ui/empty-state";
import { Input } from "@/app/components/ui/input";
import { Label } from "@/app/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/app/components/ui/select";
import { P, H3, H4, Muted, Small } from "@/app/components/ui/typography";
import { CardHeader } from "@/app/components/ui/card";
import { Separator } from "@/app/components/ui/separator";
import { CodeBlock } from "@/app/components/ui/code-block";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/app/components/ui/tooltip";

// --- Types ---
type Algorithm = "SHA1" | "SHA256" | "SHA512";
type TabMode = "generator" | "developer";

// --- Helpers ---
const generateBase32 = (length = 16) => {
  const chars = "ABCDEFGHIJKLMNOPQRSTUVWXYZ234567";
  let result = "";
  const randomValues = new Uint32Array(length);
  window.crypto.getRandomValues(randomValues);
  for (let i = 0; i < length; i++) {
    result += chars[randomValues[i] % 32];
  }
  return result;
};

// Base32 <-> Hex Converters
const base32ToHex = (base32: string): string => {
  const base32chars = "ABCDEFGHIJKLMNOPQRSTUVWXYZ234567";
  let bits = "";
  let hex = "";

  const clean = base32.toUpperCase().replace(/\s/g, "").replace(/=+$/, "");
  for (let i = 0; i < clean.length; i++) {
    const val = base32chars.indexOf(clean.charAt(i));
    if (val === -1) continue;
    bits += val.toString(2).padStart(5, "0");
  }

  for (let i = 0; i + 4 <= bits.length; i += 4) {
    const chunk = bits.substr(i, 4);
    hex += parseInt(chunk, 2).toString(16);
  }
  return hex;
};

const hexToBase32 = (hex: string): string => {
  const base32chars = "ABCDEFGHIJKLMNOPQRSTUVWXYZ234567";
  let bits = "";
  let base32 = "";

  const clean = hex.toLowerCase().replace(/[^0-9a-f]/g, "");
  for (let i = 0; i < clean.length; i++) {
    const val = parseInt(clean.charAt(i), 16);
    bits += val.toString(2).padStart(4, "0");
  }

  for (let i = 0; i + 5 <= bits.length; i += 5) {
    const chunk = bits.substr(i, 5);
    if (chunk.length < 5) break;
    base32 += base32chars.charAt(parseInt(chunk, 2));
  }
  return base32;
};

function Section({
  title,
  description,
  icon: Icon,
  children,
  className,
  action,
}: {
  title: string;
  description?: string;
  icon?: React.ComponentType<{ size?: number; className?: string }>;
  children: React.ReactNode;
  className?: string;
  action?: React.ReactNode;
}) {
  return (
    <div className={cn("space-y-4", className)}>
      <div className="flex items-center justify-between px-1">
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            {Icon && (
              <Icon size={16} className="text-primary/80" />
            )}
            <H3 className="text-xs font-bold uppercase tracking-[0.1em] text-foreground/90 border-none pb-0">
              {title}
            </H3>
          </div>
          {description && (
            <p className="text-xs text-muted-foreground/60 font-medium ml-1">
              {description}
            </p>
          )}
        </div>
        {action}
      </div>
      {children}
    </div>
  );
}

// --- Main Component ---
export function TOTPAuthenticator() {
  const [mode, setMode] = useState<TabMode>("generator");

  // Config State
  const [secret, setSecret] = useState("");
  const [algorithm, setAlgorithm] = useState<Algorithm>("SHA1");
  const [digits, setDigits] = useState(6);
  const [period, setPeriod] = useState(30);
  const [label, setLabel] = useState("MyApp");
  const [issuer, setIssuer] = useState("LabUser");

  return (
    <TooltipProvider delayDuration={400}>
      <div className="w-full max-w-6xl mx-auto space-y-12 pb-20 animate-in fade-in duration-700">
        <div className="flex justify-start">
          <Tabs
            value={mode}
            onValueChange={(v) => setMode(v as TabMode)}
            className="w-full"
          >
            <TabsList>
              <TabsTrigger value="generator" className="gap-2">
                <ToolIcons.Shield size={16} /> Generator & Verify
              </TabsTrigger>
              <TabsTrigger value="developer" className="gap-2">
                <ToolIcons.Code size={16} /> Developer Tools
              </TabsTrigger>
            </TabsList>
          </Tabs>
        </div>

        <AnimatePresence mode="wait">
          <motion.div
            key={mode}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.2 }}
            className="pt-4"
          >
            {mode === "generator" ? (
              <GeneratorView
                secret={secret}
                setSecret={setSecret}
                algorithm={algorithm}
                setAlgorithm={setAlgorithm}
                digits={digits}
                setDigits={setDigits}
                period={period}
                setPeriod={setPeriod}
                label={label}
                setLabel={setLabel}
                issuer={issuer}
                setIssuer={setIssuer}
              />
            ) : (
              <DeveloperView key={secret} secret={secret} />
            )}
          </motion.div>
        </AnimatePresence>
      </div>
    </TooltipProvider>
  );
}

// --- Generator View ---
function GeneratorView({
  secret,
  setSecret,
  algorithm,
  setAlgorithm,
  digits,
  setDigits,
  period,
  setPeriod,
  label,
  setLabel,
  issuer,
  setIssuer,
}: {
  secret: string;
  setSecret: (s: string) => void;
  algorithm: Algorithm;
  setAlgorithm: (a: Algorithm) => void;
  digits: number;
  setDigits: (d: number) => void;
  period: number;
  setPeriod: (p: number) => void;
  label: string;
  setLabel: (l: string) => void;
  issuer: string;
  setIssuer: (i: string) => void;
}) {
  const [token, setToken] = useState("");
  const [timeLeft, setTimeLeft] = useState(0);
  const [showSecret, setShowSecret] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Verifier State
  const [verifierSecret, setVerifierSecret] = useState(secret);
  const [verifyInput, setVerifyInput] = useState("");
  const [verifyResult, setVerifyResult] = useState<{
    valid: boolean;
    delta: number | null;
  } | null>(null);

  // -- Token Generation Logic --
  useEffect(() => {
    let interval: NodeJS.Timeout;

    if (!secret) {
      setToken("");
      setError(null);
    } else {
      try {
        if (!/^[A-Z2-7]+=*$/i.test(secret.replace(/\s/g, ""))) {
          throw new Error("Invalid Base32");
        }
        setError(null);

        const totp = new OTPAuth.TOTP({
          issuer,
          label,
          algorithm,
          digits,
          period,
          secret: OTPAuth.Secret.fromBase32(secret.replace(/\s/g, "")),
        });

        const update = () => {
          setToken(totp.generate());
          const seconds = Math.floor(Date.now() / 1000);
          setTimeLeft(period - (seconds % period));
        };

        update();
        interval = setInterval(update, 1000);
      } catch {
        setError("Invalid Configuration or Secret");
        setToken("");
      }
    }

    return () => {
      if (interval) clearInterval(interval);
    };
  }, [secret, algorithm, digits, period, label, issuer]);

  const uri = useMemo(() => {
    if (!secret || error) return "";
    try {
      const totp = new OTPAuth.TOTP({
        issuer,
        label,
        algorithm,
        digits,
        period,
        secret: OTPAuth.Secret.fromBase32(secret.replace(/\s/g, "")),
      });
      return totp.toString();
    } catch {
      return "";
    }
  }, [secret, issuer, label, algorithm, digits, period, error]);

  const progress = (timeLeft / period) * 100;

  // -- Verification Logic --
  const handleVerify = (input: string, vs: string) => {
    setVerifyInput(input);
    if (!vs || input.length < digits) {
      setVerifyResult(null);
      return;
    }

    try {
      const totp = new OTPAuth.TOTP({
        algorithm,
        digits,
        period,
        secret: OTPAuth.Secret.fromBase32(vs.replace(/\s/g, "")),
      });

      const delta = totp.validate({ token: input, window: 1 });
      setVerifyResult({ valid: delta !== null, delta });
    } catch {
      setVerifyResult({ valid: false, delta: null });
    }
  };

  const qrRef = useRef<HTMLDivElement>(null);
  const downloadQR = () => {
    const canvas = qrRef.current?.querySelector("canvas");
    if (canvas) {
      const url = canvas.toDataURL("image/png");
      const link = document.createElement("a");
      link.download = `totp-${label}-${issuer}.png`;
      link.href = url;
      link.click();
    }
  };

  return (
    <div className="space-y-12 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-start">
        {/* LEFT COLUMN: Configuration & Verification */}
        <div className="space-y-8">
          <Section
            title="Configuration"
            description="Set up your TOTP parameters"
            icon={ToolIcons.Settings}
          >
            <Card>
              <CardContent className="p-6 space-y-6">
                {/* Secret Input */}
                <div className="space-y-3">
                  <div className="flex justify-between items-center">
                    <Label className="text-xs font-bold uppercase text-muted-foreground/60 ml-1">
                      Secret Key (Base32)
                    </Label>
                    <div className="flex items-center gap-1">
                      <TooltipProvider>
                        <Tooltip>
                          <TooltipTrigger asChild>
                            <Button
                              variant="ghost"
                              size="icon"
                              onClick={() => {
                                setSecret("");
                                setVerifierSecret("");
                              }}
                              disabled={!secret}
                              className="h-8 w-8 text-muted-foreground hover:text-destructive transition-colors"
                            >
                              <ToolIcons.RotateCcw size={14} />
                            </Button>
                          </TooltipTrigger>
                          <TooltipContent>
                            <p>Reset Configuration</p>
                          </TooltipContent>
                        </Tooltip>

                        <Tooltip>
                          <TooltipTrigger asChild>
                            <Button
                              variant="ghost"
                              size="icon"
                              onClick={() => {
                                const s = generateBase32();
                                setSecret(s);
                                setVerifierSecret(s);
                              }}
                              className="h-8 w-8 text-muted-foreground hover:text-primary transition-colors"
                            >
                              <ToolIcons.RefreshCw size={14} />
                            </Button>
                          </TooltipTrigger>
                          <TooltipContent>
                            <p>Generate Random Secret</p>
                          </TooltipContent>
                        </Tooltip>
                      </TooltipProvider>
                    </div>
                  </div>
                  <div className="relative group">
                    <Input
                      type={showSecret ? "text" : "password"}
                      value={secret}
                      onChange={(e) => setSecret(e.target.value.toUpperCase())}
                      className={cn(
                        "font-mono text-sm h-12 bg-background/50 border-border/50 focus-visible:ring-primary/20 transition-all",
                        error &&
                          "border-destructive/50 focus-visible:ring-destructive/20",
                      )}
                      placeholder="JBSWY3DPEHPK3PXP..."
                    />
                    <button
                      onClick={() => setShowSecret(!showSecret)}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground/50 hover:text-foreground transition-colors p-1"
                      aria-label={showSecret ? "Hide secret" : "Show secret"}
                    >
                      {showSecret ? (
                        <ToolIcons.EyeOff size={16} />
                      ) : (
                        <ToolIcons.Eye size={16} />
                      )}
                    </button>
                  </div>
                  {error && (
                    <Small className="text-destructive font-bold text-xs uppercase flex items-center gap-1 px-1">
                      <ToolIcons.X size={10} /> {error}
                    </Small>
                  )}
                  {!secret && !error && (
                    <Muted className="text-xs px-1 italic">
                      Enter a Base32 encoded secret key to begin.
                    </Muted>
                  )}
                </div>

                <Separator className="bg-border/30" />

                {/* Advanced Options */}
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label className="text-xs font-bold uppercase text-muted-foreground/60 ml-1">
                      Algorithm
                    </Label>
                    <Select
                      value={algorithm}
                      onValueChange={(v) => setAlgorithm(v as Algorithm)}
                    >
                      <SelectTrigger className="h-10 bg-background/50 border-border/50 text-xs">
                        <SelectValue placeholder="Algorithm" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="SHA1">SHA1 (Default)</SelectItem>
                        <SelectItem value="SHA256">SHA256</SelectItem>
                        <SelectItem value="SHA512">SHA512</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-2">
                    <Label className="text-xs font-bold uppercase text-muted-foreground/60 ml-1">
                      Digits
                    </Label>
                    <Select
                      value={digits.toString()}
                      onValueChange={(v) => setDigits(Number(v))}
                    >
                      <SelectTrigger className="h-10 bg-background/50 border-border/50 text-xs">
                        <SelectValue placeholder="Digits" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="6">6 Digits</SelectItem>
                        <SelectItem value="8">8 Digits</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                <div className="space-y-2">
                  <Label className="text-xs font-bold uppercase text-muted-foreground/70 ml-1">
                    Update Period (Seconds)
                  </Label>
                  <div className="relative">
                    <Input
                      type="number"
                      value={period}
                      onChange={(e) => setPeriod(Number(e.target.value))}
                      className="h-10 font-mono bg-background/50 border-border/50 text-xs"
                    />
                  </div>
                </div>

                <Separator className="bg-border/30" />

                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label className="text-xs font-bold uppercase text-muted-foreground/60 ml-1">
                      Label
                    </Label>
                    <Input
                      value={label}
                      onChange={(e) => setLabel(e.target.value)}
                      className="h-10 bg-background/50 border-border/50 text-xs"
                      placeholder="e.g. Account@Email"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label className="text-xs font-bold uppercase text-muted-foreground/60 ml-1">
                      Issuer
                    </Label>
                    <Input
                      value={issuer}
                      onChange={(e) => setIssuer(e.target.value)}
                      className="h-10 bg-background/50 border-border/50 text-xs"
                      placeholder="e.g. MyService"
                    />
                  </div>
                </div>
              </CardContent>
            </Card>
          </Section>

          <Section
            title="Verification"
            description="Test an existing token"
            icon={ToolIcons.Shield}
          >
            <Card className="p-6 flex flex-col h-full min-h-[260px]">
              <div className="space-y-4 flex-1">
                <div className="space-y-2">
                  <Label className="text-xs font-bold uppercase text-muted-foreground/60 ml-1">
                    Token to Verify
                  </Label>
                  <div className="relative">
                    <Input
                      value={verifyInput}
                      onChange={(e) =>
                        handleVerify(
                          e.target.value.replace(/\D/g, ""),
                          verifierSecret,
                        )
                      }
                      maxLength={digits}
                      className="w-full h-12 text-2xl font-black font-mono tracking-[0.3em] bg-background/50 border-border/50 focus-visible:ring-primary/20 text-center"
                      placeholder={"0".repeat(digits)}
                    />
                    {verifyInput && (
                      <button
                        onClick={() => handleVerify("", verifierSecret)}
                        className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground/50 hover:text-foreground transition-colors p-1"
                      >
                        <ToolIcons.X size={14} />
                      </button>
                    )}
                  </div>
                </div>

                <div className="space-y-2">
                  <Label className="text-xs font-bold uppercase text-muted-foreground/60 ml-1">
                    Manual Secret
                  </Label>
                  <Input
                    value={verifierSecret}
                    onChange={(e) => {
                      setVerifierSecret(e.target.value.toUpperCase());
                      handleVerify(verifyInput, e.target.value.toUpperCase());
                    }}
                    className="w-full h-9 font-mono text-xs bg-background/50 border-border/50 focus-visible:ring-primary/20"
                    placeholder="Enter secret..."
                  />
                  {secret && verifierSecret !== secret && (
                    <button
                      onClick={() => {
                        setVerifierSecret(secret);
                        handleVerify(verifyInput, secret);
                      }}
                      className="text-xs font-bold text-primary hover:underline px-1 flex items-center gap-1"
                    >
                      <ToolIcons.RefreshCw size={10} /> Sync with configuration
                    </button>
                  )}
                </div>
              </div>

              <div className="pt-4 mt-auto">
                {!verifierSecret ? (
                  <div className="h-10 rounded-xl border border-dashed border-border/30 flex items-center justify-center text-xs font-bold uppercase tracking-widest text-muted-foreground/40 italic">
                    No Secret Set
                  </div>
                ) : verifyResult ? (
                  <div
                    className={cn(
                      "h-10 px-4 rounded-xl border flex items-center justify-center gap-2 font-black text-xs transition-all animate-in fade-in slide-in-from-bottom-2 duration-300",
                      verifyResult.valid
                        ? "bg-green-500/10 border-green-500/20 text-green-500"
                        : "bg-destructive/10 border-destructive/20 text-destructive",
                    )}
                  >
                    {verifyResult.valid ? (
                      <>
                        <ToolIcons.Check size={16} strokeWidth={3} />
                        VALID TOKEN
                      </>
                    ) : (
                      <>
                        <ToolIcons.X size={16} strokeWidth={3} />
                        INVALID TOKEN
                      </>
                    )}
                  </div>
                ) : (
                  <div className="h-10 rounded-xl bg-muted/50 border border-border/20 flex items-center justify-center text-xs font-bold uppercase tracking-widest text-muted-foreground/60 transition-all">
                    Waiting for input...
                  </div>
                )}
              </div>
            </Card>
          </Section>
        </div>

        {/* RIGHT COLUMN: Output (Token & QR) */}
        <div className="space-y-8">
          <Section
            title="Generated Token"
            description="Your temporary authentication code"
            icon={ToolIcons.ShieldCheck}
          >
            <Card className="relative overflow-hidden group min-h-[220px] flex flex-col items-center justify-center p-8">
              {!secret ? (
                <div className="text-center space-y-4 opacity-30 animate-pulse">
                  <div className="w-16 h-16 bg-muted rounded-full flex items-center justify-center mx-auto">
                    <ToolIcons.Unlock size={32} />
                  </div>
                  <P className="text-xs font-bold uppercase tracking-widest">
                    Waiting for secret...
                  </P>
                </div>
              ) : error ? (
                <EmptyState
                  icon={<ToolIcons.AlertCircle className="w-6 h-6" />}
                  title="Configuration Error"
                  description="Invalid TOTP parameters or secret."
                  className="w-full border-none shadow-none"
                  isError={true}
                />
              ) : (
                <div className="text-center space-y-8 w-full animate-in fade-in zoom-in-95 duration-500">
                  <div className="space-y-1">
                    <H4 className="text-xs font-black tracking-[0.2em] text-primary uppercase border-none pb-0">
                      {issuer || "SECRET"}
                    </H4>
                    <Muted className="text-xs font-medium opacity-60 tracking-tight">
                      {label}
                    </Muted>
                  </div>

                  <div className="flex items-center justify-center gap-4 py-2">
                    {token ? (
                      token
                        .match(
                          new RegExp(
                            `.{1,${Math.ceil(token.length / 2)}}`,
                            "g",
                          ),
                        )
                        ?.map((part, i) => (
                          <span
                            key={i}
                            className="text-6xl md:text-7xl font-black tracking-wider text-foreground tabular-nums"
                          >
                            {part}
                          </span>
                        ))
                    ) : (
                      <span className="text-6xl md:text-7xl font-black tracking-wider text-muted-foreground/10 tabular-nums">
                        {"0".repeat(digits)}
                      </span>
                    )}
                  </div>

                  <div className="flex items-center justify-center gap-8">
                    <div className="relative w-14 h-14 flex items-center justify-center group/timer">
                      <svg className="w-full h-full -rotate-90">
                        <circle
                          cx="28"
                          cy="28"
                          r="24"
                          stroke="currentColor"
                          strokeWidth="3.5"
                          fill="transparent"
                          className="text-muted-foreground/10"
                        />
                        <circle
                          cx="28"
                          cy="28"
                          r="24"
                          stroke="currentColor"
                          strokeWidth="3.5"
                          fill="transparent"
                          strokeDasharray={150.8}
                          strokeDashoffset={150.8 - (150.8 * progress) / 100}
                          className={cn(
                            "transition-all duration-1000 ease-linear",
                            timeLeft < 5 ? "text-destructive" : "text-primary",
                          )}
                        />
                      </svg>
                      <div className="absolute flex flex-col items-center justify-center leading-none">
                        <span className="text-sm font-black font-mono text-foreground">
                          {timeLeft}
                        </span>
                        <span className="text-[8px] font-bold text-muted-foreground/50 uppercase">
                          Sec
                        </span>
                      </div>
                    </div>

                    <div className="h-10 w-px bg-border/30" />

                    <CopyButtonWithLabel
                      value={token}
                      label="Copy"
                      className="h-8 text-xs px-3 rounded-lg"
                    />
                  </div>
                </div>
              )}
            </Card>
          </Section>

          <Section
            title="QR Code"
            description="Scan with your mobile app"
            icon={ToolIcons.QrCode}
          >
            <Card className="flex flex-col items-center justify-center p-6 text-center min-h-[260px]">
              {!uri ? (
                <div className="opacity-30 space-y-3">
                  <div className="w-12 h-12 bg-muted rounded-full flex items-center justify-center mx-auto">
                    <ToolIcons.QrCode size={24} />
                  </div>
                  <Muted className="text-xs font-bold uppercase tracking-widest leading-none">
                    Not Available
                  </Muted>
                </div>
              ) : (
                <div className="space-y-6 animate-in fade-in zoom-in-95">
                  <div className="p-4 bg-white rounded-2xl inline-block ring-1 ring-border/5">
                    <div ref={qrRef} className="rounded-lg overflow-hidden">
                      <QRCodeCanvas value={uri} size={140} />
                    </div>
                  </div>
                  <div className="flex flex-wrap items-center gap-2 justify-center">
                    <Tooltip>
                      <TooltipTrigger asChild>
                        <span>
                          <CopyButton
                            value={uri}
                            label="URI"
                            variant="outline"
                            className="h-8 text-xs px-3 rounded-lg"
                          />
                        </span>
                      </TooltipTrigger>
                      <TooltipContent>
                        <p>Copy URI</p>
                      </TooltipContent>
                    </Tooltip>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={downloadQR}
                      className="h-8 gap-2 text-xs font-bold uppercase tracking-tight hover:bg-primary/5 hover:text-primary transition-all rounded-lg"
                    >
                      <ToolIcons.Download size={14} /> Download
                    </Button>
                  </div>
                </div>
              )}
            </Card>
          </Section>
        </div>
      </div>
    </div>
  );
}

// --- Developer View Component ---
function DeveloperView({ secret }: { secret: string }) {
  const [activeLang, setActiveLang] = useState<"node" | "python" | "go">(
    "node",
  );
  const [copiedSecret, setCopiedSecret] = useState(false);
  const [hexInput, setHexInput] = useState("");
  const [base32Input, setBase32Input] = useState(secret || "");
  const [currentTime, setCurrentTime] = useState(0);

  // URL Builder State
  const [urlLabel, setUrlLabel] = useState("MyApp");
  const [urlIssuer, setUrlIssuer] = useState("LabUser");
  const [urlSecret, setUrlSecret] = useState("");

  // Sync time every second
  useEffect(() => {
    const i = setInterval(
      () => setCurrentTime(Math.floor(Date.now() / 1000)),
      1000,
    );
    return () => clearInterval(i);
  }, []);

  const generatedUrl = useMemo(() => {
    try {
      if (!urlSecret) return "";
      const totp = new OTPAuth.TOTP({
        issuer: urlIssuer,
        label: urlLabel,
        secret: OTPAuth.Secret.fromBase32(urlSecret.replace(/\s/g, "")),
      });
      return totp.toString();
    } catch {
      return "Invalid Configuration";
    }
  }, [urlLabel, urlIssuer, urlSecret]);

  const handleCopySecret = () => {
    const newSecret = generateBase32();
    navigator.clipboard.writeText(newSecret);
    setCopiedSecret(true);
    setBase32Input(newSecret);
    setHexInput(base32ToHex(newSecret));
    setTimeout(() => setCopiedSecret(false), 2000);
  };

  const handleHexChange = (val: string) => {
    const clean = val.replace(/[^0-9A-Fa-f]/g, "");
    setHexInput(clean);
    setBase32Input(hexToBase32(clean));
  };

  const handleBase32Change = (val: string) => {
    const clean = val.toUpperCase().replace(/[^A-Z2-7]/g, "");
    setBase32Input(clean);
    setHexInput(base32ToHex(clean));
  };

  const snippets = useMemo(
    () => ({
      node: `const OTPAuth = require('otpauth');\n\n// Setup\nlet totp = new OTPAuth.TOTP({\n  issuer: 'MyApp',\n  label: 'User',\n  algorithm: 'SHA1',\n  digits: 6,\n  period: 30,\n  secret: OTPAuth.Secret.fromBase32('${secret || "SECRET..."}')\n});\n\n// Generate\nlet token = totp.generate();\n\n// Validate\nlet delta = totp.validate({ token, window: 1 });`,
      python: `import pyotp\n\n# Setup\ntotp = pyotp.TOTP('${secret || "SECRET..."}')\n\n# Generate\nprint("Current OTP:", totp.now())\n\n# Verify\ntotp.verify('123456') # => True/False`,
      go: `package main\n\nimport (\n\t"fmt"\n\t"time"\n\t"github.com/pquerna/otp/totp"\n)\n\nfunc main() {\n    // Validate\n    valid := totp.Validate("123456", "${secret || "SECRET..."}")\n    \n    if valid {\n        fmt.Println("Valid!")\n    }\n}`,
    }),
    [secret],
  );

  const timeProgress = ((currentTime % 30) / 30) * 100;

  return (
    <div className="space-y-12 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <Section
          title="Secret Generator"
          description="Create secure Base32 keys"
          icon={ToolIcons.RefreshCw}
        >
          <Card>
            <CardContent className="p-6 space-y-4">
              <Muted className="text-xs italic leading-relaxed">
                Generate a cryptographically secure 16-character Base32 secret
                key for storage in your database.
              </Muted>
              <div className="flex items-center gap-3">
                <div className="flex-1 font-mono text-sm bg-background/50 border border-border/50 rounded-lg h-12 flex items-center px-4 overflow-hidden truncate">
                  {copiedSecret
                    ? "Generated Secret..."
                    : base32Input || "JBSWY3DPEHPK3PXP..."}
                </div>
                <TooltipProvider>
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <Button
                        variant="outline"
                        size="icon"
                        onClick={handleCopySecret}
                        className={cn(
                          "h-12 w-12 border-border/50 bg-background/50 hover:bg-primary/5 hover:text-primary transition-all",
                          copiedSecret && "border-green-500/50 text-green-500",
                        )}
                      >
                        {copiedSecret ? (
                          <ToolIcons.Check size={18} />
                        ) : (
                          <ToolIcons.RefreshCw size={18} />
                        )}
                      </Button>
                    </TooltipTrigger>
                    <TooltipContent>
                      <p>Generate & Copy New Secret</p>
                    </TooltipContent>
                  </Tooltip>
                </TooltipProvider>
              </div>
            </CardContent>
          </Card>
        </Section>

        <Section
          title="Epoch Time"
          description="Real-time timestamp monitor"
          icon={ToolIcons.Clock}
        >
          <Card>
            <CardContent className="p-6 space-y-6">
              <div className="flex items-center justify-between">
                <div className="space-y-1">
                  <Small className="text-xs font-bold uppercase text-muted-foreground/50">
                    Current Timestamp
                  </Small>
                  <div className="font-mono text-2xl font-black text-foreground tabular-nums">
                    {currentTime || "..."}
                  </div>
                </div>
                <div className="text-right space-y-1">
                  <Small className="text-xs font-bold uppercase text-muted-foreground/50">
                    Current Step
                  </Small>
                  <div className="font-mono text-sm font-bold text-primary tabular-nums">
                    {Math.floor(currentTime / 30)}
                  </div>
                </div>
              </div>
              <div className="space-y-2">
                <div className="h-2 w-full bg-muted/30 rounded-full overflow-hidden">
                  <div
                    className="h-full bg-primary transition-all duration-1000 linear"
                    style={{ width: `${timeProgress}%` }}
                  />
                </div>
                <div className="flex justify-between items-center text-xs font-bold uppercase text-muted-foreground/30 px-1">
                  <span>0s</span>
                  <span>15s</span>
                  <span>30s</span>
                </div>
              </div>
            </CardContent>
          </Card>
        </Section>

        <Section
          title="Converters"
          description="Base32 to Hex transformations"
          icon={ToolIcons.Settings}
        >
          <Card className="p-6">
            <div className="space-y-4">
              <div className="space-y-2">
                <Label className="text-xs uppercase font-bold text-muted-foreground/60 ml-1">
                  Base32 Format
                </Label>
                <div className="relative">
                  <Input
                    value={base32Input}
                    onChange={(e) => handleBase32Change(e.target.value)}
                    className="h-10 bg-background/50 border-border/50 focus-visible:ring-primary/20 font-mono text-xs pr-10"
                    placeholder="JBSWY3DPEHPK3PXP..."
                  />
                  <div className="absolute right-1 top-1">
                    <Tooltip>
                      <TooltipTrigger asChild>
                        <span>
                          <CopyButton
                            value={base32Input}
                            variant="ghost"
                            iconOnly
                            className="h-8 w-8 p-0"
                          />
                        </span>
                      </TooltipTrigger>
                      <TooltipContent>
                        <p>Copy Base32</p>
                      </TooltipContent>
                    </Tooltip>
                  </div>
                </div>
              </div>
              <div className="space-y-2">
                <Label className="text-xs uppercase font-bold text-muted-foreground/60 ml-1">
                  Hexadecimal Format
                </Label>
                <div className="relative">
                  <Input
                    value={hexInput}
                    onChange={(e) => handleHexChange(e.target.value)}
                    className="h-10 bg-background/50 border-border/50 focus-visible:ring-primary/20 font-mono text-xs pr-10"
                    placeholder="48656c6c6f20576f726c64..."
                  />
                  <div className="absolute right-1 top-1">
                    <Tooltip>
                      <TooltipTrigger asChild>
                        <span>
                          <CopyButton
                            value={hexInput}
                            variant="ghost"
                            iconOnly
                            className="h-8 w-8 p-0"
                          />
                        </span>
                      </TooltipTrigger>
                      <TooltipContent>
                        <p>Copy Hex</p>
                      </TooltipContent>
                    </Tooltip>
                  </div>
                </div>
              </div>
            </div>
          </Card>
        </Section>

        <Section
          title="URI Builder"
          description="Create otpauth:// URIs"
          icon={ToolIcons.Link}
        >
          <Card className="p-6">
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label className="text-xs uppercase font-bold text-muted-foreground/60 ml-1">
                    Label
                  </Label>
                  <Input
                    value={urlLabel}
                    onChange={(e) => setUrlLabel(e.target.value)}
                    className="h-10 bg-background/50 border-border/50 text-xs"
                    placeholder="User"
                  />
                </div>
                <div className="space-y-2">
                  <Label className="text-xs uppercase font-bold text-muted-foreground/60 ml-1">
                    Issuer
                  </Label>
                  <Input
                    value={urlIssuer}
                    onChange={(e) => setUrlIssuer(e.target.value)}
                    className="h-10 bg-background/50 border-border/50 text-xs"
                    placeholder="Service"
                  />
                </div>
              </div>
              <div className="relative group">
                <Input
                  value={urlSecret}
                  onChange={(e) => setUrlSecret(e.target.value.toUpperCase())}
                  placeholder="Secret Key..."
                  className="h-10 bg-background/50 border-border/50 text-xs font-mono pr-10"
                />
                {urlSecret && (
                  <button
                    onClick={() => setUrlSecret("")}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground/30 hover:text-destructive transition-colors"
                  >
                    <ToolIcons.X size={12} />
                  </button>
                )}
              </div>
            </div>
            <div className="space-y-3 pt-2">
              <Label className="text-xs uppercase font-bold text-muted-foreground/60 ml-1">
                Generated URI
              </Label>
              <CodeBlock language="uri" className="text-xs">
                {generatedUrl || "otpauth://..."}
              </CodeBlock>
            </div>
          </Card>
        </Section>
      </div>

      <Section
        title="Implementation Snippets"
        description="Ready-to-use code for various languages"
        icon={ToolIcons.Code}
      >
        <Card className="overflow-hidden">
          <Tabs
            value={activeLang}
            onValueChange={(v) => setActiveLang(v as "node" | "python" | "go")}
            className="w-full"
          >
            <CardHeader className="p-0 border-b border-border/30">
              <TabsList className="w-full justify-start rounded-none h-auto bg-muted/10 p-0 gap-0">
                {[
                  {
                    id: "node",
                    label: "Node.js",
                    icon: <TechIcons.NodeJS className="w-4 h-4" />,
                  },
                  {
                    id: "python",
                    label: "Python",
                    icon: <TechIcons.Python className="w-4 h-4" />,
                  },
                  {
                    id: "go",
                    label: "Go",
                    icon: <TechIcons.Go className="w-4 h-4" />,
                  },
                ].map((lang) => (
                  <TabsTrigger
                    key={lang.id}
                    value={lang.id}
                    className="flex items-center gap-2.5 px-6 py-4 text-xs font-bold uppercase tracking-tight transition-all relative rounded-none border-b-2 border-transparent data-[state=active]:border-primary data-[state=active]:bg-background/50 data-[state=active]:text-primary text-muted-foreground/50 hover:text-foreground"
                  >
                    {lang.icon}
                    {lang.label}
                  </TabsTrigger>
                ))}
              </TabsList>
            </CardHeader>
            <div className="relative group">
              <CodeBlock
                language={activeLang === "node" ? "javascript" : activeLang}
                showLineNumbers
              >
                {snippets[activeLang]}
              </CodeBlock>
            </div>
          </Tabs>
        </Card>
      </Section>
    </div>
  );
}

// --- Shared Components ---
