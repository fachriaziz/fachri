"use client";

import { useState } from "react";
import { ToolIcons } from "@/app/components/ui/tool-icons";
import { cn } from "@/lib/utils";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/app/components/ui/card";
import {
  CopyIconButton,
  CopyIconButtonGhost,
  CopyIconButtonDarkContainer,
} from "@/app/components/ui/copy-button";
import { Checkbox } from "@/app/components/ui/checkbox";
import { Label } from "@/app/components/ui/label";
import { Small, Muted } from "@/app/components/ui/typography";
import { TooltipProvider } from "@/app/components/ui/tooltip";

type PermissionType = "read" | "write" | "execute";
type UserType = "owner" | "group" | "public";

interface PermissionState {
  owner: { read: boolean; write: boolean; execute: boolean };
  group: { read: boolean; write: boolean; execute: boolean };
  public: { read: boolean; write: boolean; execute: boolean };
}

const PRESETS = [
  { name: "Public Read", val: "644", desc: "Standard for files" },
  { name: "Public Exec", val: "755", desc: "Standard for directories/scripts" },
  { name: "Private", val: "600", desc: "Only owner can read/write" },
  { name: "Full", val: "777", desc: "Unsafe: everyone can do everything" },
];

export function ChmodCalculator() {
  const [permissions, setPermissions] = useState<PermissionState>({
    owner: { read: true, write: true, execute: false },
    group: { read: true, write: false, execute: false },
    public: { read: true, write: false, execute: false },
  });

  // Derived state calculation
  let octal = "";
  let symbolic = "-";
  const types: UserType[] = ["owner", "group", "public"];

  types.forEach((type) => {
    let val = 0;
    if (permissions[type].read) val += 4;
    if (permissions[type].write) val += 2;
    if (permissions[type].execute) val += 1;
    octal += val;

    symbolic += permissions[type].read ? "r" : "-";
    symbolic += permissions[type].write ? "w" : "-";
    symbolic += permissions[type].execute ? "x" : "-";
  });

  const togglePermission = (user: UserType, type: PermissionType) => {
    setPermissions((prev) => ({
      ...prev,
      [user]: {
        ...prev[user],
        [type]: !prev[user][type],
      },
    }));
  };

  const applyPreset = (octalVal: string) => {
    const newPerms = JSON.parse(JSON.stringify(permissions)); // Deep copy
    const nums = octalVal.split("").map(Number);

    const types: UserType[] = ["owner", "group", "public"];

    nums.forEach((num, idx) => {
      const type = types[idx];
      newPerms[type].read = (num & 4) === 4;
      newPerms[type].write = (num & 2) === 2;
      newPerms[type].execute = (num & 1) === 1;
    });

    setPermissions(newPerms);
  };

  return (
    <div className="w-full max-w-5xl mx-auto space-y-6">
      <TooltipProvider>
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          {/* Main Calculator */}
          <Card className="lg:col-span-7">
            <CardHeader>
              <CardTitle>Permissions Calculator</CardTitle>
              <CardDescription>
                Select permissions for Owner, Group, and Public.
              </CardDescription>
            </CardHeader>
            <CardContent className="p-0">
              {/* Table Header */}
              <div className="grid grid-cols-4 gap-4 p-6 border-b bg-muted/30">
                <Small className="text-[10px] font-bold uppercase text-muted-foreground tracking-widest pt-1">
                  Target
                </Small>
                <div className="text-center">
                  <Small className="font-bold text-xs">Read (4)</Small>
                </div>
                <div className="text-center">
                  <Small className="font-bold text-xs">Write (2)</Small>
                </div>
                <div className="text-center">
                  <Small className="font-bold text-xs">Execute (1)</Small>
                </div>
              </div>

              {/* Table Body */}
              <div className="p-6 space-y-6">
                {/* Owner Row */}
                <div className="grid grid-cols-4 gap-4 items-center">
                  <div className="flex items-center gap-3 font-medium">
                    <ToolIcons.Shield size={18} className="text-primary" />
                    <Small className="font-bold">Owner</Small>
                  </div>
                  <div className="flex justify-center">
                    <Checkbox
                      checked={permissions.owner.read}
                      onCheckedChange={() => togglePermission("owner", "read")}
                      className="h-5 w-5"
                    />
                  </div>
                  <div className="flex justify-center">
                    <Checkbox
                      checked={permissions.owner.write}
                      onCheckedChange={() => togglePermission("owner", "write")}
                      className="h-5 w-5"
                    />
                  </div>
                  <div className="flex justify-center">
                    <Checkbox
                      checked={permissions.owner.execute}
                      onCheckedChange={() =>
                        togglePermission("owner", "execute")
                      }
                      className="h-5 w-5"
                    />
                  </div>
                </div>

                <div className="h-px bg-border w-full" />

                {/* Group Row */}
                <div className="grid grid-cols-4 gap-4 items-center">
                  <div className="flex items-center gap-3 font-medium">
                    <ToolIcons.Server size={18} className="text-chart-4" />
                    <Small className="font-bold">Group</Small>
                  </div>
                  <div className="flex justify-center">
                    <Checkbox
                      checked={permissions.group.read}
                      onCheckedChange={() => togglePermission("group", "read")}
                      className="h-5 w-5"
                    />
                  </div>
                  <div className="flex justify-center">
                    <Checkbox
                      checked={permissions.group.write}
                      onCheckedChange={() => togglePermission("group", "write")}
                      className="h-5 w-5"
                    />
                  </div>
                  <div className="flex justify-center">
                    <Checkbox
                      checked={permissions.group.execute}
                      onCheckedChange={() =>
                        togglePermission("group", "execute")
                      }
                      className="h-5 w-5"
                    />
                  </div>
                </div>

                <div className="h-px bg-border w-full" />

                {/* Public Row */}
                <div className="grid grid-cols-4 gap-4 items-center">
                  <div className="flex items-center gap-3 font-medium">
                    <ToolIcons.FileCode size={18} className="text-success" />
                    <Small className="font-bold">Public</Small>
                  </div>
                  <div className="flex justify-center">
                    <Checkbox
                      checked={permissions.public.read}
                      onCheckedChange={() => togglePermission("public", "read")}
                      className="h-5 w-5"
                    />
                  </div>
                  <div className="flex justify-center">
                    <Checkbox
                      checked={permissions.public.write}
                      onCheckedChange={() =>
                        togglePermission("public", "write")
                      }
                      className="h-5 w-5"
                    />
                  </div>
                  <div className="flex justify-center">
                    <Checkbox
                      checked={permissions.public.execute}
                      onCheckedChange={() =>
                        togglePermission("public", "execute")
                      }
                      className="h-5 w-5"
                    />
                  </div>
                </div>
              </div>

              {/* Presets */}
              <div className="bg-muted/30 border-t p-6">
                <Label className="text-[10px] uppercase text-muted-foreground font-bold tracking-widest mb-4 block">
                  Quick Presets
                </Label>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                  {PRESETS.map((preset) => (
                    <button
                      key={preset.val}
                      onClick={() => applyPreset(preset.val)}
                      className={cn(
                        "group p-3 rounded-lg border text-left transition-all duration-200",
                        octal === preset.val
                          ? "bg-background border-blue-500"
                          : "bg-transparent border-transparent hover:bg-background hover:border-border",
                      )}
                    >
                      <div
                        className={cn(
                          "font-mono font-bold text-lg mb-1",
                          octal === preset.val
                            ? "text-primary"
                            : "text-foreground",
                        )}
                      >
                        {preset.val}
                      </div>
                      <Muted className="text-[10px] group-hover:text-foreground transition-colors uppercase font-bold tracking-tight">
                        {preset.name}
                      </Muted>
                    </button>
                  ))}
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Results Panel */}
          <div className="lg:col-span-5 space-y-6 lg:sticky lg:top-24">
            <ResultCard
              label="Octal Mode"
              value={octal}
              command={`chmod ${octal} filename`}
              accentColor="text-primary"
            />
            <ResultCard
              label="Symbolic Mode"
              value={symbolic}
              command={`chmod ${symbolic} filename`}
              accentColor="text-chart-4"
            />

            <div className="bg-muted/50 p-5 rounded-xl">
              <div className="flex items-start gap-3">
                <ToolIcons.Terminal
                  size={18}
                  className="shrink-0 mt-0.5 text-foreground"
                />
                <div className="space-y-2">
                  <Small className="font-bold text-foreground">Pro Tip</Small>
                  <Muted className="leading-relaxed text-xs">
                    The first digit represents the User, the second the Group,
                    and the third Others.
                  </Muted>
                  <div className="grid grid-cols-3 gap-2 pt-2">
                    <div className="bg-background px-2 py-1 rounded text-center">
                      <Small className="font-mono text-[10px]">r = 4</Small>
                    </div>
                    <div className="bg-background px-2 py-1 rounded text-center">
                      <Small className="font-mono text-[10px]">w = 2</Small>
                    </div>
                    <div className="bg-background px-2 py-1 rounded text-center">
                      <Small className="font-mono text-[10px]">x = 1</Small>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </TooltipProvider>
    </div>
  );
}

function ResultCard({
  label,
  value,
  command,
  accentColor,
}: {
  label: string;
  value: string;
  command: string;
  accentColor?: string;
}) {
  return (
    <Card className="overflow-hidden shadow-none">
      <CardContent className="p-0">
        <div className="p-6 border-b bg-muted/5">
          <div className="flex items-center justify-between mb-4">
            <Small className="text-[10px] font-mono uppercase text-muted-foreground tracking-widest font-bold">
              {label}
            </Small>
            <CopyIconButton value={value} />
          </div>
          <div
            className={cn(
              "font-mono text-4xl font-bold tracking-tight",
              accentColor || "text-foreground",
            )}
          >
            {value}
          </div>
        </div>
        <div className="p-4 bg-zinc-950 text-zinc-400 font-mono text-xs flex items-center justify-between gap-3 overflow-x-auto scrollbar-hide dark">
          <div className="flex items-center gap-3">
            <ToolIcons.Terminal
              size={18}
              className="text-success shrink-0 select-none"
            />
            <span className="whitespace-nowrap selection:bg-primary/30 selection:text-primary-foreground">
              {command}
            </span>
          </div>
          <CopyIconButtonDarkContainer value={command} />
        </div>
      </CardContent>
    </Card>
  );
}
