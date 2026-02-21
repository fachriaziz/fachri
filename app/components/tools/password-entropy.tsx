"use client";

import { useState, useMemo, useEffect, useCallback } from "react";
import { ToolIcons } from "@/app/components/ui/tool-icons";
import { cn } from "@/lib/utils";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/app/components/ui/card";
import { Button } from "@/app/components/ui/button";
import { CopyButtonWithLabel } from "@/app/components/ui/copy-button";
import { Slider } from "@/app/components/ui/slider";
import { Input } from "@/app/components/ui/input";
import { Checkbox } from "@/app/components/ui/checkbox";
import { Label } from "@/app/components/ui/label";
import { Muted, Small } from "@/app/components/ui/typography";
import { motion } from "framer-motion";
import { TooltipProvider } from "@/app/components/ui/tooltip";

// --- Constants ---
const MIN_LENGTH = 8;
const MAX_LENGTH = 64;

type CharOptions = {
  uppercase: boolean;
  lowercase: boolean;
  numbers: boolean;
  symbols: boolean;
};

// --- Main Component ---
export function PasswordEntropy() {
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(true);
  const [length, setLength] = useState(16);
  const [options, setOptions] = useState<CharOptions>({
    uppercase: true,
    lowercase: true,
    numbers: true,
    symbols: true,
  });

  // Calculate Entropy & Stats
  const stats = useMemo(() => {
    const len = password.length;
    let poolSize = 0;
    if (/[a-z]/.test(password)) poolSize += 26;
    if (/[A-Z]/.test(password)) poolSize += 26;
    if (/[0-9]/.test(password)) poolSize += 10;
    if (/[^a-zA-Z0-9]/.test(password)) poolSize += 32;

    const entropy = len > 0 ? Math.round(len * Math.log2(poolSize || 1)) : 0;

    let strength = "Critical";
    let color = "bg-destructive";
    let textColor = "text-destructive";

    if (entropy > 128) {
      strength = "Paranoid";
      color = "bg-primary";
      textColor = "text-primary";
    } else if (entropy > 80) {
      strength = "Strong";
      color = "bg-green-600";
      textColor = "text-green-600";
    } else if (entropy > 60) {
      strength = "Reasonable";
      color = "bg-yellow-600";
      textColor = "text-yellow-600";
    } else if (entropy > 40) {
      strength = "Weak";
      color = "bg-orange-600";
      textColor = "text-orange-600";
    }

    return {
      length: len,
      poolSize,
      entropy,
      strength,
      color,
      textColor,
    };
  }, [password]);

  const generatePassword = useCallback(() => {
    let chars = "";
    if (options.lowercase) chars += "abcdefghijklmnopqrstuvwxyz";
    if (options.uppercase) chars += "ABCDEFGHIJKLMNOPQRSTUVWXYZ";
    if (options.numbers) chars += "0123456789";
    if (options.symbols) chars += "!@#$%^&*()_+~`|}{[]:;?><,./-=";

    if (chars === "") chars = "abcdefghijklmnopqrstuvwxyz";

    let newPass = "";
    const array = new Uint32Array(length);
    window.crypto.getRandomValues(array);

    for (let i = 0; i < length; i++) {
      newPass += chars.charAt(array[i] % chars.length);
    }
    setPassword(newPass);
  }, [length, options]);

  // Generate initial password on mount
  useEffect(() => {
    generatePassword();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Regenerate when options change
  useEffect(() => {
    generatePassword();
  }, [length, options, generatePassword]);

  const toggleOption = (key: keyof CharOptions) => {
    const nextOptions = { ...options, [key]: !options[key] };
    if (!Object.values(nextOptions).some(Boolean)) return;
    setOptions(nextOptions);
  };

  return (
    <div className="w-full max-w-5xl mx-auto space-y-6 pb-20">
      <TooltipProvider>
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          {/* Settings Panel (Left) */}
          <ConfigurationPanel
            length={length}
            setLength={setLength}
            options={options}
            toggleOption={toggleOption}
          />

          {/* Results Panel (Right) - Sticky } */}
          <div className="lg:col-span-5 space-y-6 lg:sticky lg:top-24">
            <ResultCard
              label="Generated Password"
              value={password}
              isHidden={!showPassword}
              onToggleHidden={() => setShowPassword(!showPassword)}
              onRefresh={generatePassword}
              onChange={(e) => setPassword(e.target.value)}
            />

            <EntropyStats stats={stats} />
            <SecurityTip />
          </div>
        </div>
      </TooltipProvider>
    </div>
  );
}

// --- Sub Components ---

function ConfigurationPanel({
  length,
  setLength,
  options,
  toggleOption,
}: {
  length: number;
  setLength: (val: number) => void;
  options: CharOptions;
  toggleOption: (key: keyof CharOptions) => void;
}) {
  return (
    <Card className="lg:col-span-7">
      <CardHeader>
        <CardTitle>Configuration</CardTitle>
        <CardDescription>Customize your password requirements.</CardDescription>
      </CardHeader>
      <CardContent className="space-y-8">
        <div className="space-y-4">
          <div className="flex justify-between items-end">
            <Label>
              Length:{" "}
              <span className="font-mono text-foreground font-bold">
                {length}
              </span>
            </Label>
          </div>
          <Slider
            value={[length]}
            onValueChange={(val) => setLength(val[0])}
            min={MIN_LENGTH}
            max={MAX_LENGTH}
            step={1}
            className="w-full"
          />
          <div className="flex justify-between text-[10px] text-muted-foreground font-mono uppercase tracking-widest">
            <span>min ({MIN_LENGTH})</span>
            <span>max ({MAX_LENGTH})</span>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-4">
          {[
            {
              key: "uppercase",
              label: "Uppercase",
              sub: "ABC",
            },
            {
              key: "lowercase",
              label: "Lowercase",
              sub: "abc",
            },
            {
              key: "numbers",
              label: "Numbers",
              sub: "123",
            },
            {
              key: "symbols",
              label: "Symbols",
              sub: "@#$",
            },
          ].map((opt) => (
            <div
              key={opt.key}
              className="flex flex-row items-center space-x-3 space-y-0 rounded-md border p-4"
            >
              <Checkbox
                id={opt.key}
                checked={options[opt.key as keyof CharOptions]}
                onCheckedChange={() =>
                  toggleOption(opt.key as keyof CharOptions)
                }
              />
              <div className="space-y-1 leading-none">
                <Label htmlFor={opt.key} className="cursor-pointer">
                  {opt.label}
                </Label>
                <Muted className="text-xs font-mono">{opt.sub}</Muted>
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}

type EntropyStatsType = {
  length: number;
  poolSize: number;
  entropy: number;
  strength: string;
  color: string;
  textColor: string;
};

function EntropyStats({ stats }: { stats: EntropyStatsType }) {
  return (
    <Card>
      <CardContent className="p-6 space-y-4">
        <div className="flex justify-between items-start">
          <div>
            <Small className="text-[10px] font-mono uppercase text-muted-foreground tracking-widest font-bold">
              Entropy Score
            </Small>
            <div className="flex items-baseline gap-2 mt-1">
              <span className="text-4xl font-bold tracking-tight">
                {stats.entropy}
              </span>
              <span className="text-sm text-muted-foreground">bits</span>
            </div>
          </div>
          <div
            className={cn(
              "px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wide border bg-opacity-10",
              stats.textColor,
              stats.color.replace("bg-", "border-"),
            )}
          >
            {stats.strength}
          </div>
        </div>

        {/* Progress Bar */}
        <div className="h-2 w-full bg-secondary rounded-full overflow-hidden">
          <motion.div
            className={cn("h-full", stats.color)}
            initial={{ width: 0 }}
            animate={{ width: `${Math.min(stats.entropy, 128) / 1.28}%` }} // Scale to ~128 bits
            transition={{ type: "spring", stiffness: 100 }}
          />
        </div>

        <div className="grid grid-cols-2 gap-4 pt-4 border-t mt-2">
          <div>
            <Small className="text-[10px] uppercase text-muted-foreground font-bold tracking-widest">
              Pool Size
            </Small>
            <div className="text-sm font-mono">{stats.poolSize} chars</div>
          </div>
          <div className="text-right">
            <Small className="text-[10px] uppercase text-muted-foreground font-bold tracking-widest">
              Crack Time
            </Small>
            <div className="text-sm font-medium">
              {stats.entropy < 40
                ? "Instant"
                : stats.entropy < 60
                  ? "< 1 Hr"
                  : stats.entropy < 80
                    ? "Years"
                    : "Centuries"}
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

function SecurityTip() {
  return (
    <div className="bg-muted/50 border p-5 rounded-xl text-sm text-muted-foreground">
      <div className="flex items-start gap-3">
        <ToolIcons.ShieldCheck
          size={18}
          className="shrink-0 mt-0.5 text-foreground"
        />
        <div className="space-y-1">
          <Small className="font-bold text-foreground">Security Standard</Small>
          <Muted className="leading-relaxed text-xs">
            <strong>60 bits</strong> minimum for standard logins.{" "}
            <strong>80 bits</strong> for financial accounts.{" "}
            <strong>100+ bits</strong> for top secret keys.
          </Muted>
        </div>
      </div>
    </div>
  );
}

// Reusable Result Card similar to Chmod's but adapted for password
// Reusable Result Card adapted for password
function ResultCard({
  label,
  value,
  isHidden,
  onToggleHidden,
  onRefresh,
  onChange,
}: {
  label: string;
  value: string;
  isHidden: boolean;
  onToggleHidden: () => void;
  onRefresh: () => void;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
}) {
  return (
    <Card>
      <CardContent className="p-0">
        <div className="p-6">
          <div className="flex items-center justify-between mb-4">
            <Small className="text-[10px] font-mono uppercase text-muted-foreground tracking-widest font-bold">
              {label}
            </Small>
            <div className="flex items-center gap-1">
              <Button
                variant="ghost"
                size="icon"
                onClick={onToggleHidden}
                className="h-8 w-8 text-muted-foreground hover:text-foreground"
              >
                {isHidden ? (
                  <ToolIcons.EyeOff size={14} />
                ) : (
                  <ToolIcons.Eye size={14} />
                )}
              </Button>
              <Button
                variant="ghost"
                size="icon"
                onClick={onRefresh}
                className="h-8 w-8 text-muted-foreground hover:text-foreground"
              >
                <ToolIcons.RefreshCw size={14} />
              </Button>
            </div>
          </div>

          <div className="min-h-12 flex items-center">
            <Input
              type={isHidden ? "password" : "text"}
              value={value}
              onChange={onChange}
              spellCheck={false}
              className="font-mono text-xl md:text-2xl font-bold tracking-tight bg-transparent border-none shadow-none focus-visible:ring-0 px-0 h-auto"
              placeholder="Type or generate..."
            />
          </div>
        </div>

        {/* Footer */}
        <div className="p-3 bg-muted/50 border-t flex items-center justify-between gap-3">
          <Muted className="text-muted-foreground text-[10px] font-mono font-medium truncate px-2">
            {value.length} characters
          </Muted>
          <CopyButtonWithLabel value={value} className="h-7 text-xs gap-1.5" />
        </div>
      </CardContent>
    </Card>
  );
}
