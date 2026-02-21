"use client";

import { useState, useMemo, useEffect, useCallback } from "react";
import { ToolIcons } from "@/app/components/ui/tool-icons";
import { Card, CardContent } from "@/app/components/ui/card";
import { Button } from "@/app/components/ui/button";
import { CopyIconButtonGhost } from "@/app/components/ui/copy-button";
import { EmptyState } from "@/app/components/ui/empty-state";
import { Textarea } from "@/app/components/ui/textarea";
import { Input } from "@/app/components/ui/input";
import { Label } from "@/app/components/ui/label";
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@/app/components/ui/tabs";
import { H3, P, Muted } from "@/app/components/ui/typography";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/app/components/ui/tooltip";
import { Badge } from "@/app/components/ui/badge";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/app/components/ui/select";
import { cn } from "@/lib/utils";
import { motion, AnimatePresence } from "framer-motion";
import { faker } from "@faker-js/faker";

// --- Types ---
type VerificationStatus = "idle" | "valid" | "invalid";

type DecodedToken = {
  header: string;
  parsedHeader: Record<string, unknown>;
  payload: string;
  signature: string;
  valid: boolean;
  raw?: { header: string; payload: string };
  error?: string;
};

// --- Helpers ---

const generateMockData = () => {
  const user = {
    sub: faker.string.uuid(),
    name: faker.person.fullName(),
    email: faker.internet.email(),
    avatar: faker.image.avatar(),
    role: faker.helpers.arrayElement(["admin", "user", "moderator"]),
    company: faker.company.name(),
    iat: Math.floor(Date.now() / 1000),
    exp: Math.floor(Date.now() / 1000) + 60 * 60 * 24,
    iss: "fachriaziz.my.id",
    jti: faker.string.nanoid(10),
  };
  const secret = "secret_" + faker.string.alphanumeric(8);
  return { payload: user, secret };
};

const base64UrlEncode = (str: string) =>
  btoa(str).replace(/\+/g, "-").replace(/\//g, "_").replace(/=+$/, "");

const signJwt = async (
  header: Record<string, unknown>,
  payload: Record<string, unknown>,
  secret: string,
) => {
  const encodedHeader = base64UrlEncode(JSON.stringify(header));
  const encodedPayload = base64UrlEncode(JSON.stringify(payload));
  const dataToSign = `${encodedHeader}.${encodedPayload}`;

  const algMap: Record<string, { name: string; hash: string }> = {
    HS256: { name: "HMAC", hash: "SHA-256" },
    HS384: { name: "HMAC", hash: "SHA-384" },
    HS512: { name: "HMAC", hash: "SHA-512" },
  };

  const alg = (header.alg as string) || "HS256";
  const cryptoAlg = algMap[alg];

  if (!cryptoAlg) throw new Error(`Unsupported algorithm: ${alg}`);

  const enc = new TextEncoder();
  const key = await window.crypto.subtle.importKey(
    "raw",
    enc.encode(secret || ""),
    cryptoAlg,
    false,
    ["sign"],
  );

  const signatureBuffer = await window.crypto.subtle.sign(
    "HMAC",
    key,
    enc.encode(dataToSign),
  );

  const signature = btoa(
    String.fromCharCode(...new Uint8Array(signatureBuffer)),
  )
    .replace(/\+/g, "-")
    .replace(/\//g, "_")
    .replace(/=+$/, "");

  return `${dataToSign}.${signature}`;
};

const validateJson = (str: string): string | null => {
  try {
    JSON.parse(str);
    return null;
  } catch (e) {
    return (e as Error).message;
  }
};

// --- Main Component ---

export function JwtDebugger() {
  const [activeTab, setActiveTab] = useState("decoder");

  // Lifted State for Persistence
  const [decoderToken, setDecoderToken] = useState("");
  const [decoderSecret, setDecoderSecret] = useState("");

  const [encoderHeader, setEncoderHeader] = useState(
    JSON.stringify({ alg: "HS256", typ: "JWT" }, null, 2),
  );
  const [encoderPayload, setEncoderPayload] = useState("");
  const [encoderSecret, setEncoderSecret] = useState("");

  useEffect(() => {
    const timer = setTimeout(() => {
      const { payload, secret } = generateMockData();
      setEncoderPayload(JSON.stringify(payload, null, 2));
      setEncoderSecret(secret);
    }, 0);
    return () => clearTimeout(timer);
  }, []);

  const handleEditInEncoder = useCallback(
    (header: string, payload: string, secret: string) => {
      setEncoderHeader(header);
      setEncoderPayload(payload);
      setEncoderSecret(secret);
      setActiveTab("encoder");
    },
    [],
  );

  return (
    <div className="w-full max-w-6xl mx-auto space-y-6">
      <Card className="border-none shadow-none bg-transparent">
        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <div className="flex justify-between items-center mb-6">
            <TabsList className="grid w-[300px] grid-cols-2">
              <TabsTrigger
                value="decoder"
                className="text-xs uppercase font-bold tracking-wider"
              >
                Decoder
              </TabsTrigger>
              <TabsTrigger
                value="encoder"
                className="text-xs uppercase font-bold tracking-wider"
              >
                Encoder
              </TabsTrigger>
            </TabsList>
          </div>

          <TabsContent value="decoder" className="mt-0">
            <Card>
              <CardContent className="p-0">
                <DecoderView
                  token={decoderToken}
                  setToken={setDecoderToken}
                  secret={decoderSecret}
                  setSecret={setDecoderSecret}
                  onEdit={handleEditInEncoder}
                />
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="encoder" className="mt-0">
            <Card>
              <CardContent className="p-0">
                <EncoderView
                  headerStr={encoderHeader}
                  setHeaderStr={setEncoderHeader}
                  payloadStr={encoderPayload}
                  setPayloadStr={setEncoderPayload}
                  secret={encoderSecret}
                  setSecret={setEncoderSecret}
                />
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </Card>
    </div>
  );
}

// --- DECODER VIEW --- //

interface DecoderProps {
  token: string;
  setToken: (t: string) => void;
  secret: string;
  setSecret: (s: string) => void;
  onEdit: (h: string, p: string, s: string) => void;
}

function DecoderView({
  token,
  setToken,
  secret,
  setSecret,
  onEdit,
}: DecoderProps) {
  const [verificationStatus, setVerificationStatus] =
    useState<VerificationStatus>("idle");

  const generateSample = useCallback(async () => {
    try {
      const header = { alg: "HS256", typ: "JWT" };
      const { payload: user, secret: secretKey } = generateMockData();
      const generatedToken = await signJwt(header, user, secretKey);
      setToken(generatedToken);
      setSecret(secretKey);
    } catch (e) {
      console.error("Failed to generate sample", e);
    }
  }, [setToken, setSecret]);

  const decoded = useMemo<DecodedToken | null>(() => {
    if (!token) return null;
    try {
      const parts = token.split(".");
      if (parts.length !== 3) throw new Error("Invalid JWT format");

      const decodePart = (part: string) => {
        const json = atob(part.replace(/-/g, "+").replace(/_/g, "/"));
        return {
          str: JSON.stringify(JSON.parse(json), null, 2),
          obj: JSON.parse(json),
        };
      };

      const header = decodePart(parts[0]);
      const payload = decodePart(parts[1]);

      return {
        header: header.str,
        parsedHeader: header.obj,
        payload: payload.str,
        signature: parts[2],
        valid: true,
        raw: { header: parts[0], payload: parts[1] },
      };
    } catch (e) {
      return {
        header: "",
        parsedHeader: {},
        payload: "",
        signature: "",
        valid: false,
        error: (e as Error).message,
      };
    }
  }, [token]);

  useEffect(() => {
    const verify = async () => {
      if (!decoded?.valid || !secret || !token || !decoded.raw) {
        setVerificationStatus("idle");
        return;
      }
      try {
        const headerObj = JSON.parse(decoded.header || "{}");
        const payloadObj = JSON.parse(decoded.payload || "{}");
        const reSignedToken = await signJwt(headerObj, payloadObj, secret);
        const reSignedSignature = reSignedToken.split(".")[2];
        setVerificationStatus(
          reSignedSignature === decoded.signature ? "valid" : "invalid",
        );
      } catch {
        setVerificationStatus("invalid");
      }
    };
    const t = setTimeout(verify, 300);
    return () => clearTimeout(t);
  }, [decoded, secret, token]);

  return (
    <div className="grid grid-cols-1 lg:grid-cols-12 divide-y lg:divide-y-0 lg:divide-x border-border">
      {/* Input Side */}
      <div className="lg:col-span-5 p-6 md:p-8 space-y-6 lg:border-r border-border">
        <div className="space-y-4">
          <div className="flex items-center justify-between mb-2">
            <Label className="text-xs uppercase font-bold text-muted-foreground/90 tracking-wider">
              Encoded Token
            </Label>
            <div className="flex items-center gap-1">
              <TooltipProvider>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={generateSample}
                      className="h-8 w-8 text-muted-foreground hover:text-foreground transition-colors"
                    >
                      <ToolIcons.Reset size={16} />
                    </Button>
                  </TooltipTrigger>
                  <TooltipContent>
                    <p>Sample Token</p>
                  </TooltipContent>
                </Tooltip>

                <Tooltip>
                  <TooltipTrigger asChild>
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => setToken("")}
                      className="h-8 w-8 text-destructive/60 hover:text-destructive dark:text-red-400/60 dark:hover:text-red-400 transition-colors"
                    >
                      <ToolIcons.Clear size={16} />
                    </Button>
                  </TooltipTrigger>
                  <TooltipContent>
                    <p>Clear</p>
                  </TooltipContent>
                </Tooltip>

                <Tooltip>
                  <TooltipTrigger asChild>
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={async () => {
                        try {
                          const text = await navigator.clipboard.readText();
                          setToken(text);
                        } catch (err) {
                          console.error("Paste failed", err);
                        }
                      }}
                      className="h-8 w-8 text-muted-foreground hover:text-foreground transition-colors"
                    >
                      <ToolIcons.ClipboardPaste size={16} />
                    </Button>
                  </TooltipTrigger>
                  <TooltipContent>
                    <p>Paste Token</p>
                  </TooltipContent>
                </Tooltip>
              </TooltipProvider>
            </div>
          </div>
          <Textarea
            value={token}
            onChange={(e) => setToken(e.target.value)}
            placeholder="Paste your JWT here..."
            className="min-h-[400px] font-mono text-sm resize-none bg-muted/30 border-border/30 rounded-xl"
          />
        </div>

        <SignatureVerifier
          decoded={decoded}
          secret={secret}
          setSecret={setSecret}
          verificationStatus={verificationStatus}
        />
      </div>

      {/* Output Side */}
      <div className="lg:col-span-7 bg-muted/5 p-6 md:p-8">
        <DecoderOutput
          decoded={decoded}
          secret={secret}
          verificationStatus={verificationStatus}
          onEdit={onEdit}
        />
      </div>
    </div>
  );
}

function SignatureVerifier({
  decoded,
  secret,
  setSecret,
  verificationStatus,
}: {
  decoded: DecodedToken | null;
  secret: string;
  setSecret: (s: string) => void;
  verificationStatus: VerificationStatus;
}) {
  return (
    <AnimatePresence>
      {decoded?.valid && (
        <motion.div
          initial={{ opacity: 0, height: 0 }}
          animate={{ opacity: 1, height: "auto" }}
          exit={{ opacity: 0, height: 0 }}
        >
          <div className="bg-muted/30 p-5 space-y-4 rounded-xl border border-border/30">
            <div className="flex items-center justify-between pb-1">
              <H3 className="text-xs font-bold uppercase tracking-wider text-muted-foreground/80 border-none pb-0">
                Verify Signature
              </H3>
              <div className="h-6">
                {verificationStatus === "valid" ? (
                  <Badge
                    variant="success"
                    className="gap-1.5 px-2.5 py-1 uppercase tracking-wider text-xs font-bold border-emerald-500/30 bg-emerald-500/5 dark:bg-emerald-500/10"
                  >
                    <div className="h-1.5 w-1.5 rounded-full bg-emerald-500 shrink-0" />{" "}
                    Verified
                  </Badge>
                ) : (
                  verificationStatus === "invalid" && (
                    <Badge
                      variant="destructive"
                      className="gap-1.5 px-2.5 py-1 uppercase tracking-wider text-xs font-bold border-red-500/40 bg-red-500/10 dark:bg-red-500/20"
                    >
                      <div className="h-1.5 w-1.5 rounded-full bg-red-500 shrink-0" />{" "}
                      Invalid
                    </Badge>
                  )
                )}
              </div>
            </div>
            <Input
              type="text"
              value={secret}
              onChange={(e) => setSecret(e.target.value)}
              placeholder="Enter secret (HMAC-SHA256)"
              className={cn(
                "font-mono text-sm transition-all",
                verificationStatus === "valid"
                  ? "border-emerald-500/50 focus-visible:ring-emerald-500/20 text-emerald-600 dark:text-emerald-400"
                  : verificationStatus === "invalid"
                    ? "border-red-500/50 focus-visible:ring-red-500/20 text-red-600 dark:text-red-400"
                    : "focus-visible:ring-primary/20",
              )}
            />
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

function DecoderOutput({
  decoded,
  secret,
  verificationStatus,
  onEdit,
}: {
  decoded: DecodedToken | null;
  secret: string;
  verificationStatus: VerificationStatus;
  onEdit: (h: string, p: string, s: string) => void;
}) {
  if (!decoded) {
    return (
      <div className="h-full flex flex-col items-center justify-center text-muted-foreground/40 p-12">
        <div className="p-6 rounded-full bg-muted/30 mb-4 opacity-50">
          <ToolIcons.Copy size={48} strokeWidth={1.5} />
        </div>
        <p>Paste a token to see details</p>
      </div>
    );
  }

  if (!decoded.valid) {
    return (
      <div className="h-full flex flex-col items-center justify-center p-8 text-center text-red-600 dark:text-red-400">
        <div className="p-4 bg-red-500/10 rounded-full mb-4 animate-in zoom-in duration-300">
          <ToolIcons.Alert size={32} />
        </div>
        <P className="font-bold">Invalid Token</P>
        <Muted className="text-xs mt-1 opacity-60">
          Please check the encoding and format.
        </Muted>
      </div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="space-y-6"
    >
      {/* Header */}
      <div className="space-y-2">
        <div className="flex items-center justify-between px-1">
          <Label className="text-xs uppercase font-bold text-muted-foreground/80 tracking-wider">
            Header
          </Label>
          <CopyIconButtonGhost value={decoded.header || ""} />
        </div>
        <pre className="bg-muted/30 border border-border/30 p-4 rounded-xl overflow-x-auto text-xs font-mono scrollbar-hide">
          {decoded.header}
        </pre>
      </div>

      {/* Payload */}
      <div className="space-y-2">
        <div className="flex items-center justify-between px-1">
          <Label className="text-xs uppercase font-bold text-muted-foreground/80 tracking-wider">
            Payload
          </Label>
          <div className="flex items-center gap-1">
            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger asChild>
                  <Button
                    variant="ghost"
                    size="sm"
                    className="h-6 px-2 text-xs font-bold uppercase tracking-tight gap-1 text-primary/70 hover:text-primary dark:text-foreground/70 dark:hover:text-foreground"
                    onClick={() =>
                      onEdit(
                        decoded.header || "",
                        decoded.payload || "",
                        secret || "secret",
                      )
                    }
                  >
                    <ToolIcons.Edit size={12} /> Edit in Encoder
                  </Button>
                </TooltipTrigger>
                <TooltipContent>
                  <p>Edit in Encoder</p>
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>

            <CopyIconButtonGhost value={decoded.payload || ""} />
          </div>
        </div>
        <pre className="bg-muted/30 border border-border/30 p-4 rounded-xl overflow-x-auto text-xs font-mono scrollbar-hide">
          {decoded.payload}
        </pre>
      </div>

      {/* Signature */}
      <div className="space-y-2">
        <Label className="text-xs uppercase font-bold text-muted-foreground/80 tracking-wider px-1">
          Signature
        </Label>
        <div
          className={cn(
            "border p-4 rounded-xl font-mono text-xs break-all transition-all flex items-start gap-3",
            verificationStatus === "valid"
              ? "bg-emerald-500/5 border-emerald-500/20 text-emerald-600 dark:text-emerald-400"
              : verificationStatus === "invalid"
                ? "bg-red-500/10 border-red-500/30 text-red-600 dark:text-red-400"
                : "bg-muted/30 border-border/30 text-muted-foreground",
          )}
        >
          <div className="shrink-0 mt-1">
            {verificationStatus === "valid" ? (
              <div className="h-2 w-2 rounded-full bg-emerald-500" />
            ) : verificationStatus === "invalid" ? (
              <div className="h-2 w-2 rounded-full bg-red-500" />
            ) : (
              <div className="h-2 w-2 rounded-full bg-muted-foreground/30" />
            )}
          </div>
          <div className="flex-1 opacity-90 leading-relaxed">
            HMAC
            {((decoded.parsedHeader?.alg as string) || "HS256").replace(
              "HS",
              "SHA",
            )}
            ({base64UrlEncode(decoded.raw?.header || "")}
            <span className="text-muted-foreground/30 font-mono">.</span>
            {base64UrlEncode(decoded.raw?.payload || "")}
            <span className="text-muted-foreground/30 font-mono">, </span>
            <span className="font-bold underline decoration-dotted underline-offset-4">
              {secret || "secret"}
            </span>{" "}
            )
          </div>
        </div>
      </div>
    </motion.div>
  );
}

// --- ENCODER VIEW --- //

interface EncoderProps {
  headerStr: string;
  setHeaderStr: (v: string) => void;
  payloadStr: string;
  setPayloadStr: (v: string) => void;
  secret: string;
  setSecret: (v: string) => void;
}

function EncoderView({
  headerStr,
  setHeaderStr,
  payloadStr,
  setPayloadStr,
  secret,
  setSecret,
}: EncoderProps) {
  const [encodedToken, setEncodedToken] = useState("");
  const [error, setError] = useState<string | null>(null);

  const headerError = validateJson(headerStr);
  const payloadError = validateJson(payloadStr);

  const validateAndFormat = useCallback(
    (str: string, setStr: (s: string) => void) => {
      try {
        const parsed = JSON.parse(str);
        setStr(JSON.stringify(parsed, null, 2));
      } catch {
        // Validation handled by error derivation
      }
    },
    [],
  );

  const generateRandom = useCallback(() => {
    const { payload, secret } = generateMockData();
    setPayloadStr(JSON.stringify(payload, null, 2));
    setSecret(secret);
  }, [setPayloadStr, setSecret]);

  const parsedHeader = useMemo(() => {
    try {
      return JSON.parse(headerStr);
    } catch {
      return {};
    }
  }, [headerStr]);

  const updateAlg = useCallback(
    (newAlg: string) => {
      try {
        const header = JSON.parse(headerStr);
        header.alg = newAlg;
        setHeaderStr(JSON.stringify(header, null, 2));
      } catch {
        setHeaderStr(JSON.stringify({ alg: newAlg, typ: "JWT" }, null, 2));
      }
    },
    [headerStr, setHeaderStr],
  );

  useEffect(() => {
    const generateFn = async () => {
      setError(null);
      try {
        let header, payload;
        try {
          header = JSON.parse(headerStr);
        } catch {
          throw new Error("Invalid Header JSON");
        }
        try {
          payload = JSON.parse(payloadStr);
        } catch {
          throw new Error("Invalid Payload JSON");
        }

        const token = await signJwt(header, payload, secret);
        setEncodedToken(token);
      } catch (e) {
        setError((e as Error).message);
        setEncodedToken("");
      }
    };
    const t = setTimeout(generateFn, 300);
    return () => clearTimeout(t);
  }, [headerStr, payloadStr, secret]);

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 divide-y lg:divide-y-0 lg:divide-x border-border">
      <div className="p-6 md:p-8 space-y-6 lg:border-r border-border">
        {/* HEADER */}
        <div>
          <div className="flex items-center justify-between mb-2">
            <div className="flex items-center gap-2">
              <Label className="text-xs uppercase font-bold text-muted-foreground/90 tracking-wider px-1">
                Header
              </Label>
              <Select
                value={parsedHeader.alg || "HS256"}
                onValueChange={updateAlg}
              >
                <SelectTrigger className="w-[90px] h-7 text-xs font-bold uppercase tracking-wider border-border/30 bg-muted/30">
                  <SelectValue placeholder="Alg" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="HS256">HS256</SelectItem>
                  <SelectItem value="HS384">HS384</SelectItem>
                  <SelectItem value="HS512">HS512</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="flex items-center gap-1">
              <TooltipProvider>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <Button
                      variant="ghost"
                      size="icon"
                      className="h-8 w-8 text-muted-foreground hover:text-foreground transition-colors"
                      onClick={() => validateAndFormat(headerStr, setHeaderStr)}
                    >
                      <ToolIcons.Code size={16} />
                    </Button>
                  </TooltipTrigger>
                  <TooltipContent>
                    <p>Format JSON</p>
                  </TooltipContent>
                </Tooltip>
              </TooltipProvider>

              <CopyIconButtonGhost value={headerStr} />
            </div>
          </div>
          <Textarea
            value={headerStr}
            onChange={(e) => setHeaderStr(e.target.value)}
            className={cn(
              "h-[150px] font-mono text-xs bg-muted/30 border-border/30 rounded-xl scrollbar-hide focus-visible:ring-primary/20",
              headerError
                ? "border-red-500/50 focus-visible:ring-red-500/20"
                : "",
            )}
          />
          {headerError && (
            <Muted className="text-xs text-destructive mt-1 flex items-center gap-1 animate-in fade-in slide-in-from-top-1 font-mono">
              <ToolIcons.AlertCircle size={16} className="shrink-0" />{" "}
              {headerError}
            </Muted>
          )}
        </div>

        {/* PAYLOAD */}
        <div>
          <div className="flex items-center justify-between mb-2">
            <Label className="text-xs uppercase font-bold text-muted-foreground/90 tracking-wider">
              Payload
            </Label>
            <div className="flex items-center gap-1">
              <TooltipProvider>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={generateRandom}
                      className="h-8 w-8 text-muted-foreground hover:text-foreground"
                    >
                      <ToolIcons.Reset size={16} />
                    </Button>
                  </TooltipTrigger>
                  <TooltipContent>
                    <p>Random Data</p>
                  </TooltipContent>
                </Tooltip>

                <Tooltip>
                  <TooltipTrigger asChild>
                    <Button
                      variant="ghost"
                      size="icon"
                      className="h-8 w-8 text-muted-foreground hover:text-foreground"
                      onClick={() =>
                        validateAndFormat(payloadStr, setPayloadStr)
                      }
                    >
                      <ToolIcons.Code size={16} />
                    </Button>
                  </TooltipTrigger>
                  <TooltipContent>
                    <p>Format JSON</p>
                  </TooltipContent>
                </Tooltip>
              </TooltipProvider>

              <CopyIconButtonGhost value={payloadStr} />
            </div>
          </div>
          <Textarea
            value={payloadStr}
            onChange={(e) => setPayloadStr(e.target.value)}
            className={cn(
              "h-[250px] font-mono text-xs bg-muted/30 border-border/30 rounded-xl",
              payloadError
                ? "border-red-500/50 focus-visible:ring-red-500/20"
                : "",
            )}
          />
          {payloadError && (
            <Muted className="text-xs text-destructive mt-1 flex items-center gap-1 animate-in fade-in slide-in-from-top-1 font-mono">
              <ToolIcons.AlertCircle size={16} className="shrink-0" />{" "}
              {payloadError}
            </Muted>
          )}
        </div>

        {/* SECRET */}
        <div>
          <Label className="text-xs uppercase font-bold text-muted-foreground/90 tracking-wider mb-2 block">
            Secret
          </Label>
          <Input
            type="text"
            value={secret}
            onChange={(e) => setSecret(e.target.value)}
            placeholder="Enter secret (HMAC-SHA256)"
            className={cn(
              "font-mono text-sm",
              secret.length > 0 && secret.length < 8
                ? "border-warning focus-visible:ring-warning"
                : "focus-visible:ring-primary/20",
            )}
          />
          {secret.length > 0 && secret.length < 8 && (
            <Muted className="text-xs text-amber-500 mt-1 flex items-center gap-1 animate-in fade-in slide-in-from-top-1 font-bold tracking-wider uppercase">
              <ToolIcons.AlertCircle size={14} /> Weak secret (min 8 chars rec.)
            </Muted>
          )}
        </div>
      </div>

      {/* OUTPUT */}
      <div className="p-6 md:p-8 bg-muted/5">
        <div>
          <div className="flex items-center justify-between mb-2">
            <Label className="text-xs uppercase font-bold text-muted-foreground/90 tracking-wider">
              Generated Token
            </Label>
            <CopyIconButtonGhost value={encodedToken} />
          </div>
          <div className="relative">
            {error ? (
              <EmptyState
                icon={<ToolIcons.AlertCircle className="w-6 h-6" />}
                title="Invalid Token"
                description={error}
                className="w-full min-h-[550px]"
                isError={true}
              />
            ) : (
              <Textarea
                readOnly
                value={encodedToken}
                className="h-[550px] font-mono text-xs bg-muted/30 border-border/30 rounded-xl resize-none scrollbar-hide focus-visible:ring-primary/20"
              />
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
