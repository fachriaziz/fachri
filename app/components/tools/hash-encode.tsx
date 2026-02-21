"use client";

import * as React from "react";
import { useState, useEffect, useMemo, useRef } from "react";
import { ToolIcons } from "@/app/components/ui/tool-icons";
import { cn } from "@/lib/utils";
import { Button } from "@/app/components/ui/button";
import { Textarea } from "@/app/components/ui/textarea";
import { Input } from "@/app/components/ui/input";
import { Label } from "@/app/components/ui/label";
import { Tabs, TabsList, TabsTrigger } from "@/app/components/ui/tabs";
import {
  Card,
  CardHeader,
  CardTitle,
  CardContent,
} from "@/app/components/ui/card";
import { CopyButtonWithLabel, CopyIconButton } from "@/app/components/ui/copy-button";
import { EmptyState } from "@/app/components/ui/empty-state";
import { Collapsible, CollapsibleTrigger, CollapsibleContent } from "@/app/components/ui/collapsible";
import { motion, AnimatePresence } from "framer-motion";

// --- Types ---
type TabMode = "hashing" | "encoding";

type EncodingMethod = "base64" | "base32" | "base58" | "url" | "hex" | "binary" | "html" | "gzip" | "deflate";
type EncodingDirection = "encode" | "decode";

// --- Helpers ---
async function computeHash(message: string | ArrayBuffer, algorithm: string, secretKey?: string) {
  if (!message) return "";
  
  let msgBuffer: ArrayBuffer | Uint8Array;
  if (typeof message === "string") {
    const encoder = new TextEncoder();
    msgBuffer = encoder.encode(message);
  } else {
    msgBuffer = message;
  }

  let hashBuffer: ArrayBuffer;

  if (secretKey) {
    const encoder = new TextEncoder();
    const keyBuffer = encoder.encode(secretKey);
    const cryptoKey = await crypto.subtle.importKey(
      "raw",
      keyBuffer,
      { name: "HMAC", hash: algorithm },
      false,
      ["sign"]
    );
    hashBuffer = await crypto.subtle.sign("HMAC", cryptoKey, msgBuffer as BufferSource);
  } else {
    hashBuffer = await crypto.subtle.digest(algorithm, msgBuffer as BufferSource);
  }

  const hashArray = Array.from(new Uint8Array(hashBuffer));
  return hashArray.map((b) => b.toString(16).padStart(2, "0")).join("");
}

// Minimal Base58
const ALPHABET = "123456789ABCDEFGHJKLMNPQRSTUVWXYZabcdefghijkmnopqrstuvwxyz";
const ALPHABET_MAP = ALPHABET.split("").reduce(
  (map, char, i) => {
    map[char] = i;
    return map;
  },
  {} as Record<string, number>
);

function base58Encode(buffer: Uint8Array): string {
  if (buffer.length === 0) return "";
  const digits = [0];
  for (let i = 0; i < buffer.length; i++) {
    let carry = buffer[i];
    for (let j = 0; j < digits.length; ++j) {
      carry += digits[j] << 8;
      digits[j] = carry % 58;
      carry = (carry / 58) | 0;
    }
    while (carry > 0) {
      digits.push(carry % 58);
      carry = (carry / 58) | 0;
    }
  }
  let i = 0;
  while (buffer[i] === 0 && i < buffer.length - 1) i++;
  return (
    "1".repeat(i) +
    digits
      .reverse()
      .map((digit) => ALPHABET[digit])
      .join("")
  );
}

function base58Decode(string: string): Uint8Array {
  if (string.length === 0) return new Uint8Array(0);
  const bytes = [0];
  for (let i = 0; i < string.length; i++) {
    const char = string[i];
    if (!(char in ALPHABET_MAP)) throw new Error("Invalid base58");
    let carry = ALPHABET_MAP[char];
    for (let j = 0; j < bytes.length; ++j) {
      carry += bytes[j] * 58;
      bytes[j] = carry & 0xff;
      carry >>= 8;
    }
    while (carry > 0) {
      bytes.push(carry & 0xff);
      carry >>= 8;
    }
  }
  let i = 0;
  while (string[i] === "1" && i < string.length - 1) i++;
  return new Uint8Array(new Array(i).fill(0).concat(bytes.reverse()));
}

// Minimal Base32
const RFC4648_ALPHABET = "ABCDEFGHIJKLMNOPQRSTUVWXYZ234567";

function base32Encode(buffer: Uint8Array): string {
  let bits = 0;
  let value = 0;
  let output = "";
  for (let i = 0; i < buffer.length; i++) {
    value = (value << 8) | buffer[i];
    bits += 8;
    while (bits >= 5) {
      output += RFC4648_ALPHABET[(value >>> (bits - 5)) & 31];
      bits -= 5;
    }
  }
  if (bits > 0) {
    output += RFC4648_ALPHABET[(value << (5 - bits)) & 31];
  }
  while (output.length % 8 !== 0) {
    output += "=";
  }
  return output;
}

function base32Decode(input: string): Uint8Array {
  const cleanedInput = input.replace(/=/g, "").toUpperCase();
  const output = new Uint8Array(((cleanedInput.length * 5) / 8) | 0);
  let bits = 0;
  let value = 0;
  let index = 0;
  for (let i = 0; i < cleanedInput.length; i++) {
    const char = cleanedInput[i];
    const val = RFC4648_ALPHABET.indexOf(char);
    if (val === -1) throw new Error("Invalid base32");
    value = (value << 5) | val;
    bits += 5;
    if (bits >= 8) {
      output[index++] = (value >>> (bits - 8)) & 255;
      bits -= 8;
    }
  }
  return output;
}

// --- Main Component ---
export function HashEncode() {
  const [mode, setMode] = useState<TabMode>("hashing");

  return (
    <div className="w-full max-w-6xl mx-auto space-y-6 pb-20">
      <div className="flex items-center px-1">
        <Tabs value={mode} onValueChange={(v) => setMode(v as TabMode)}>
          <TabsList className="h-auto">
            <TabsTrigger value="hashing" className="text-sm font-semibold px-6 py-2">
              Hash
            </TabsTrigger>
            <TabsTrigger value="encoding" className="text-sm font-semibold px-6 py-2">
              Encode
            </TabsTrigger>
          </TabsList>
        </Tabs>
      </div>

      <AnimatePresence mode="wait">
        <motion.div
          key={mode}
          initial={{ opacity: 0, scale: 0.99 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0.99 }}
          transition={{ duration: 0.15 }}
        >
          {mode === "hashing" && <HashingView />}
          {mode === "encoding" && <EncodingView />}
        </motion.div>
      </AnimatePresence>
    </div>
  );
}

// --- HASHING VIEW ---
function HashingView() {
  const [input, setInput] = useState("");
  const [secretKey, setSecretKey] = useState("");
  const [targetVerify, setTargetVerify] = useState("");
  const [showKey, setShowKey] = useState(false);
  
  const [hashes, setHashes] = useState({
    sha1: "",
    sha256: "",
    sha384: "",
    sha512: "",
  });

  useEffect(() => {
    const updateHashes = async () => {
      if (!input) {
        setHashes({ sha1: "", sha256: "", sha384: "", sha512: "" });
        return;
      }
      const sha1 = await computeHash(input, "SHA-1", secretKey);
      const sha256 = await computeHash(input, "SHA-256", secretKey);
      const sha384 = await computeHash(input, "SHA-384", secretKey);
      const sha512 = await computeHash(input, "SHA-512", secretKey);
      setHashes({ sha1, sha256, sha384, sha512 });
    };
    updateHashes();
  }, [input, secretKey]);

  // Verification Logic
  const allHashes = Object.values(hashes).filter(Boolean);
  const isMatch = targetVerify && allHashes.some(h => h.toLowerCase() === targetVerify.toLowerCase().trim());
  const isMismatch = targetVerify && !isMatch && input;

  return (
    <div className="space-y-4">
      {/* Top section: Input & Key */}
      <Card className="shadow-none relative">
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-semibold uppercase tracking-wider text-muted-foreground flex items-center gap-2">
            <ToolIcons.Terminal size={14} /> Input Data
          </CardTitle>
          <div className="flex items-center gap-3">
            <span className="text-[10px] font-mono text-muted-foreground bg-muted hover:bg-muted/80 px-2 py-0.5 rounded cursor-default">
              {input ? `${new Blob([input]).size} Bytes` : '0 Bytes'}
            </span>
            <Button
              variant="ghost"
              size="icon"
              className="h-8 w-8 text-muted-foreground hover:text-foreground hover:bg-muted"
              onClick={() => setInput("")}
            >
              <ToolIcons.Refresh size={14} />
            </Button>
          </div>
        </CardHeader>
        <CardContent className="p-0 flex flex-col min-h-[200px] relative">
          <Textarea
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Enter strictly raw text to generate hash algorithms..."
            className="flex-1 border-none bg-transparent rounded-none p-5 font-mono text-sm shadow-none focus-visible:ring-0 resize-y min-h-[200px]"
          />
          
          {/* Optional Secret Key for HMAC */}
          <div className="border-t border-border/40 p-4 flex flex-col sm:flex-row gap-4 items-center">
            <Label className="text-xs font-semibold uppercase tracking-wider text-muted-foreground shrink-0 sm:w-20">
              HMAC Key
            </Label>
            <div className="relative w-full">
              <Input
                type={showKey ? "text" : "password"}
                value={secretKey}
                onChange={(e) => setSecretKey(e.target.value)}
                placeholder="Optional secret key for HMAC..."
                className="border-border/40 shadow-none font-mono text-sm bg-background h-9 pr-10"
              />
              <Button
                variant="ghost"
                size="icon"
                type="button"
                className="absolute right-1 top-1/2 -translate-y-1/2 h-7 w-7 text-muted-foreground hover:text-foreground hover:bg-muted"
                onClick={() => setShowKey(!showKey)}
              >
                {showKey ? <ToolIcons.EyeOff size={14} /> : <ToolIcons.Eye size={14} />}
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Middle section: Target Hash Verification */}
      <Card className={cn(
        "shadow-none transition-colors",
        isMatch && "bg-green-500/5 border-green-500/20",
        isMismatch && "bg-destructive/5 border-destructive/20"
      )}>
        <CardContent className="p-4 flex flex-col sm:flex-row gap-4 items-center">
          <Label className="text-xs font-semibold uppercase tracking-wider text-muted-foreground shrink-0 w-24">
            Verify Hash
          </Label>
        <div className="relative flex-1">
          <Input
            value={targetVerify}
            onChange={(e) => setTargetVerify(e.target.value)}
            placeholder="Paste a hash here to check if it matches the input..."
            className={cn(
               "border-border/40 shadow-none font-mono text-sm bg-background/50 h-9 pr-24",
               isMatch && "border-green-500/20 focus-visible:ring-green-500/20",
               isMismatch && "border-destructive/20 focus-visible:ring-destructive/20"
            )}
          />
          {targetVerify && input && (
             <div className="absolute right-2 top-1/2 -translate-y-1/2">
               {isMatch ? (
                 <span className="text-green-600 dark:text-green-400 text-[10px] font-bold flex items-center gap-1 bg-green-500/10 px-2 py-0.5 rounded border border-green-500/20">
                   <ToolIcons.Check size={12} strokeWidth={3} /> MATCH
                 </span>
               ) : (
                 <span className="text-destructive dark:text-destructive text-[10px] font-bold flex items-center gap-1 bg-destructive/10 px-2 py-0.5 rounded border border-destructive/20">
                   <ToolIcons.X size={12} strokeWidth={3} /> MISMATCH
                 </span>
               )}
            </div>
          )}
        </div>
        </CardContent>
      </Card>

      {/* Bottom section: Hash Results List */}
      <Card className="shadow-none overflow-hidden">
        <div className="flex flex-col divide-y divide-border/40">
          <HashRow label={secretKey ? "HMAC SHA-1" : "SHA-1"} value={hashes.sha1} />
          <HashRow label={secretKey ? "HMAC SHA-256" : "SHA-256"} value={hashes.sha256} />
          <HashRow label={secretKey ? "HMAC SHA-384" : "SHA-384"} value={hashes.sha384} />
          <HashRow label={secretKey ? "HMAC SHA-512" : "SHA-512"} value={hashes.sha512} />
        </div>
      </Card>
    </div>
  );
}

function HashRow({ label, value, multiline = false }: { label: string; value: string, multiline?: boolean }) {
  return (
    <div className="flex flex-col sm:flex-row sm:items-stretch p-0 transition-colors hover:bg-muted/10 group">
      <div className="px-5 py-4 sm:w-48 shrink-0 border-b sm:border-b-0 border-border/40 sm:border-r flex items-start sm:items-center">
        <span className="text-xs font-semibold uppercase tracking-wider text-muted-foreground mt-1 sm:mt-0">{label}</span>
      </div>
      <div className="px-5 py-4 flex-1 flex flex-col sm:flex-row sm:items-start justify-between gap-4 font-mono text-[11px] sm:text-sm min-w-0">
        <span className={cn("break-all", multiline && "whitespace-pre-wrap max-h-60 overflow-y-auto leading-relaxed", !value && "text-muted-foreground/30")}>
          {value || "..."}
        </span>
        <div className="shrink-0 opacity-0 group-hover:opacity-100 transition-opacity self-end sm:self-start">
           <CopyIconButton value={value} />
        </div>
      </div>
    </div>
  );
}


// --- ENCODING VIEW ---
function EncodingView() {
  const [method, setMethod] = useState<EncodingMethod>("base64");
  const [direction, setDirection] = useState<EncodingDirection>("encode");
  const [input, setInput] = useState("");
  const [result, setResult] = useState("");
  const [error, setError] = useState<string | null>(null);

  const inputBytes = new Blob([input]).size;
  const resultBytes = new Blob([result]).size;

  useEffect(() => {
    let isMounted = true;
    const process = async () => {
      if (!input) {
        if (isMounted) { setResult(""); setError(null); }
        return;
      }
      try {
        let output = "";
        const encoder = new TextEncoder();
        const decoder = new TextDecoder();

        if (method === "base64") {
          if (direction === "encode") {
            output = btoa(input);
          } else {
            try { output = atob(input); } catch { throw new Error("Invalid Base64 format"); }
          }
        } else if (method === "base32") {
          if (direction === "encode") output = base32Encode(encoder.encode(input));
          else output = decoder.decode(base32Decode(input));
        } else if (method === "base58") {
          if (direction === "encode") output = base58Encode(encoder.encode(input));
          else output = decoder.decode(base58Decode(input));
        } else if (method === "url") {
          if (direction === "encode") output = encodeURIComponent(input);
          else output = decodeURIComponent(input);
        } else if (method === "hex") {
          if (direction === "encode") {
            output = Array.from(encoder.encode(input)).map((b) => b.toString(16).padStart(2, "0")).join("");
          } else {
            const hex = input.replace(/\s+/g, "");
            if (hex.length % 2 !== 0 || !/^[0-9a-fA-F]*$/.test(hex)) throw new Error("Invalid Hexadecimal Sequence");
            const bytes = new Uint8Array(hex.length / 2);
            for (let i = 0; i < hex.length; i += 2) bytes[i / 2] = parseInt(hex.substring(i, i + 2), 16);
            output = decoder.decode(bytes);
          }
        } else if (method === "binary") {
          if (direction === "encode") {
            output = Array.from(encoder.encode(input)).map((b) => b.toString(2).padStart(8, "0")).join(" ");
          } else {
            const bins = input.replace(/[^01]/g, " ").trim().split(/\s+/);
            const bytes = new Uint8Array(bins.length);
            for (let i = 0; i < bins.length; i++) {
              if (bins[i].length !== 8) throw new Error("Invalid Binary Sequence");
              bytes[i] = parseInt(bins[i], 2);
            }
            output = decoder.decode(bytes);
          }
        } else if (method === "html") {
          if (direction === "encode") {
            output = input.replace(/[\u00A0-\u9999<>\&]/g, (i) => `&#${i.charCodeAt(0)};`);
          } else {
            const doc = new DOMParser().parseFromString(input, 'text/html');
            output = doc.documentElement.textContent || "";
          }
        } else if (method === "gzip" || method === "deflate") {
          if (direction === "encode") {
            const stream = new Blob([input]).stream().pipeThrough(new CompressionStream(method));
            const buffer = await new Response(stream).arrayBuffer();
            output = Array.from(new Uint8Array(buffer)).map(b => b.toString(16).padStart(2, '0')).join('');
          } else {
            const hex = input.replace(/\s+/g, "");
            if (hex.length % 2 !== 0 || !/^[0-9a-fA-F]*$/.test(hex)) throw new Error("Invalid Hex Payload (Expected compressed bytes)");
            const bytes = new Uint8Array(hex.length / 2);
            for (let i = 0; i < hex.length; i += 2) bytes[i / 2] = parseInt(hex.substring(i, i + 2), 16);
            const stream = new Blob([bytes]).stream().pipeThrough(new DecompressionStream(method));
            const buffer = await new Response(stream).arrayBuffer();
            output = decoder.decode(buffer);
          }
        }
        
        if (isMounted) { setResult(output); setError(null); }
      } catch (err) {
        if (isMounted) { setResult(""); setError(err instanceof Error ? err.message : "Invalid input format"); }
      }
    };
    process();
    return () => { isMounted = false; };
  }, [input, method, direction]);

  return (
    <div className="space-y-6">
      <Card className="shadow-none">
        <CardContent className="p-4 flex flex-col sm:flex-row items-center justify-between gap-4">
          <Tabs 
            value={method} 
            onValueChange={(v) => setMethod(v as EncodingMethod)} 
            className="w-full sm:w-auto"
          >
            <TabsList className="w-full flex flex-wrap h-auto">
              {(["base64", "base32", "base58", "url", "hex", "binary", "html", "gzip", "deflate"] as const).map((m) => (
                <TabsTrigger
                  key={m}
                  value={m}
                  className="text-[11px] font-bold uppercase tracking-wider h-8 px-4 flex-1 sm:flex-none"
                >
                  {m}
                </TabsTrigger>
              ))}
            </TabsList>
          </Tabs>

          <div className="flex items-center gap-2 w-full sm:w-auto">
            <Tabs value={direction} onValueChange={(v) => {
                const prevResult = result;
                setDirection(v as EncodingDirection);
                if (!error && prevResult) setInput(prevResult);
            }} className="w-full sm:w-auto">
              <TabsList className="h-10 w-full">
                <TabsTrigger value="encode" className="text-xs font-semibold h-full px-5">Encode</TabsTrigger>
                <TabsTrigger value="decode" className="text-xs font-semibold h-full px-5">Decode</TabsTrigger>
              </TabsList>
            </Tabs>
          </div>
        </CardContent>
      </Card>

      {/* Two Pane Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 relative">

        {/* Input Pane */}
        <Card className="shadow-none flex flex-col h-[400px]">
          <CardHeader className="h-14 flex flex-row items-center justify-between p-4 border-b border-border/40 space-y-0">
            <CardTitle className="text-xs font-semibold uppercase tracking-wider text-muted-foreground flex items-center gap-2">
              <ToolIcons.Terminal size={14} /> Input Data
            </CardTitle>
            <div className="flex items-center gap-3">
              <span className="text-[10px] font-mono text-muted-foreground bg-muted hover:bg-muted/80 px-2 py-0.5 rounded cursor-default">
                {inputBytes} Bytes
              </span>
              <span className="text-[10px] font-mono text-muted-foreground bg-muted hover:bg-muted/80 px-2 py-0.5 rounded cursor-default">
                {input.length} Chars
              </span>
              <Button variant="ghost" size="icon" className="h-6 w-6 text-muted-foreground hover:text-foreground hover:bg-muted/50" onClick={() => setInput("")}>
                 <ToolIcons.Refresh size={12} />
              </Button>
            </div>
          </CardHeader>
          <CardContent className="p-0 flex-1">
            <Textarea
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder={direction === "encode" ? "Enter raw data to encode..." : `Paste encoded ${method.toUpperCase()} data here...`}
              className="flex-1 border-0 bg-transparent rounded-none p-5 font-mono text-sm shadow-none focus-visible:ring-0 resize-none h-full"
            />
          </CardContent>
        </Card>

        {/* Output Pane */}
        <Card className="shadow-none flex flex-col h-[400px]">
          <CardHeader className="h-14 flex flex-row items-center justify-between p-4 border-b border-border/40 space-y-0">
            <CardTitle className="text-xs font-semibold uppercase tracking-wider text-muted-foreground flex items-center gap-2">
              <ToolIcons.FileCode size={14} /> Result
            </CardTitle>
            <div className="flex items-center gap-3">
              <span className="text-[10px] font-mono text-muted-foreground bg-muted hover:bg-muted/80 px-2 py-0.5 rounded cursor-default">
                {resultBytes} Bytes
              </span>
              <span className="text-[10px] font-mono text-muted-foreground bg-muted hover:bg-muted/80 px-2 py-0.5 rounded cursor-default">
                {result.length} Chars
              </span>
            </div>
          </CardHeader>
          <CardContent className="flex-1 p-5 overflow-auto font-mono text-sm break-all relative group">
            {error ? (
              <div className="absolute inset-0 m-5">
                <EmptyState
                  icon={<ToolIcons.AlertCircle className="w-6 h-6" />}
                  title="Encoding Error"
                  description={error}
                  className="w-full h-full border-none shadow-none"
                  isError={true}
                />
              </div>
            ) : result ? (
              <div className="h-full whitespace-pre-wrap">
                {result}
                <div className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity">
                   <CopyButtonWithLabel value={result} />
                </div>
              </div>
            ) : (
              <span className="text-muted-foreground/30 absolute inset-5 flex items-start">Output will appear here instantly...</span>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

