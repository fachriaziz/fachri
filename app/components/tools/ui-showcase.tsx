"use client";

import React, { useState } from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import {
  Search,
  Plus,
  Minus,
  Trash2,
  Loader2,
  CalendarIcon,
  Star,
  Bell,
  Info,
  AlertTriangle,
  CheckCircle2,
  XCircle,
  Activity,
  ChevronDown,
  Zap,
  LayoutTemplate,
  Navigation,
  FormInput,
  PanelTop,
  Database,
  Sparkles,
  User,
  Settings,
  LogOut,
  BoxSelect,
  Palette,
} from "lucide-react";
import {
  Bar,
  BarChart,
  Line,
  LineChart,
  Pie,
  PieChart,
  Cell,
  CartesianGrid,
  XAxis,
  Label as RechartsLabel,
} from "recharts";
import { toast as sonnerToast } from "sonner";

import { Button } from "../ui/button";
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
  CardFooter,
} from "../ui/card";
import { Badge } from "../ui/badge";
import { Input } from "../ui/input";
import { Label } from "../ui/label";
import { Textarea } from "../ui/textarea";
import { Separator } from "../ui/separator";
import { Skeleton } from "../ui/skeleton";
import { H1, H2, H3, H4, H5, H6, P, Lead, Blockquote } from "../ui/typography";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "../ui/tabs";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "../ui/dialog";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "../ui/dropdown-menu";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "../ui/tooltip";
import {
  Sheet,
  SheetContent,
  SheetFooter,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "../ui/sheet";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "../ui/accordion";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "../ui/command";
import { Slider } from "../ui/slider";
import { Switch } from "../ui/switch";
import { Checkbox } from "../ui/checkbox";
import { ScrollArea, ScrollBar } from "../ui/scroll-area";
import { useToast } from "../ui/use-toast";
import { Toaster } from "../ui/toaster";
import { Toaster as Sonner } from "../ui/sonner";
import { Popover, PopoverContent, PopoverTrigger } from "../ui/popover";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "../ui/alert-dialog";
import { Progress } from "../ui/progress";
import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "../ui/table";
import { Calendar } from "../ui/calendar";
import { RadioGroup, RadioGroupItem } from "../ui/radio-group";
import { PasswordInput } from "../ui/password-input";
import { DatePicker } from "../ui/date-picker";
import { FileUpload } from "../ui/file-upload";
import { Pagination } from "../ui/pagination";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "../ui/collapsible";
import {
  ContextMenu,
  ContextMenuContent,
  ContextMenuItem,
  ContextMenuTrigger,
} from "../ui/context-menu";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../ui/select";
import { Alert, AlertTitle, AlertDescription } from "../ui/alert";
import { CopyButton } from "../ui/copy-button";
import { CodeBlock } from "../ui/code-block";
import { EmptyState } from "../ui/empty-state";
import { Spinner } from "../ui/spinner";
import { Kbd } from "../ui/kbd";
import { PageHeader } from "../ui/page-header";
import { FeatureCard } from "../ui/feature-card";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "../ui/form";
import { ChartContainer, ChartTooltip, ChartTooltipContent } from "../ui/chart";
import {
  Drawer,
  DrawerClose,
  DrawerContent,
  DrawerDescription,
  DrawerFooter,
  DrawerHeader,
  DrawerTitle,
  DrawerTrigger,
} from "../ui/drawer";
import {
  FadeIn,
  SlideUp,
  ScaleOnHover,
  StaggerContainer,
  StaggerItem,
} from "../ui/motion-primitives";
import { TechIcons } from "../ui/icons";

import { ToolIcons } from "@/app/components/ui/tool-icons";

// Import components that are actually used in the app
import { ProjectList } from "../sections/projects/project-list";
import { ToolList } from "../sections/tools/tool-list";
import { getAllProjects } from "@/app/data/projects";
import { getAllTools } from "@/app/data/tools";

// ─────────────── Section wrapper ─────────────── */
function Section({
  title,
  children,
}: {
  title: string;
  children: React.ReactNode;
}) {
  return (
    <section className="space-y-6">
      <div className="flex items-center gap-3">
        <div className="h-6 w-1 rounded-full bg-primary/20" />
        <H3 className="text-sm font-bold text-muted-foreground uppercase tracking-wider border-none pb-0">
          {title}
        </H3>
      </div>
      <div className="grid grid-cols-1 gap-6">{children}</div>
    </section>
  );
}

/* ─────────────── Configuration ─────────────── */

/* ─────────────── Components for Performance Optimization ─────────────── */

function SliderSection() {
  const [progress, setProgress] = useState(60);
  return (
    <Section title="Slider">
      <Card>
        <CardContent className="pt-6 space-y-4 max-w-sm">
          <div className="flex justify-between">
            <Label>Volume</Label>
            <span className="text-sm text-muted-foreground">{progress}%</span>
          </div>
          <Slider
            defaultValue={[60]}
            max={100}
            step={1}
            onValueChange={(v) => setProgress(v[0])}
          />
        </CardContent>
      </Card>
    </Section>
  );
}

function DrawerDemo() {
  const [goal, setGoal] = useState(350);

  function onClick(adjustment: number) {
    setGoal(Math.max(200, Math.min(400, goal + adjustment)));
  }

  return (
    <Drawer>
      <DrawerTrigger asChild>
        <Button variant="outline">Open Drawer</Button>
      </DrawerTrigger>
      <DrawerContent>
        <div className="mx-auto w-full max-w-sm">
          <DrawerHeader>
            <DrawerTitle>Move Goal</DrawerTitle>
            <DrawerDescription>Set your daily activity goal.</DrawerDescription>
          </DrawerHeader>
          <div className="p-4 pb-0">
            <div className="flex items-center justify-center space-x-2">
              <Button
                variant="outline"
                size="icon"
                className="h-8 w-8 shrink-0 rounded-full"
                onClick={() => onClick(-10)}
                disabled={goal <= 200}
              >
                <Minus className="h-4 w-4" />
                <span className="sr-only">Decrease</span>
              </Button>
              <div className="flex-1 text-center">
                <div className="text-7xl font-bold tracking-tighter">
                  {goal}
                </div>
                <div className="text-[0.70rem] uppercase text-muted-foreground">
                  Calories/day
                </div>
              </div>
              <Button
                variant="outline"
                size="icon"
                className="h-8 w-8 shrink-0 rounded-full"
                onClick={() => onClick(10)}
                disabled={goal >= 400}
              >
                <Plus className="h-4 w-4" />
                <span className="sr-only">Increase</span>
              </Button>
            </div>
            {/* 
            <div className="mt-3 h-[120px]">
               // Placeholder for chart in drawer
            </div> 
            */}
          </div>
          <DrawerFooter>
            <Button>Submit</Button>
            <DrawerClose asChild>
              <Button variant="outline">Cancel</Button>
            </DrawerClose>
          </DrawerFooter>
        </div>
      </DrawerContent>
    </Drawer>
  );
}

const chartData = [
  { month: "January", desktop: 186, mobile: 80 },
  { month: "February", desktop: 305, mobile: 200 },
  { month: "March", desktop: 237, mobile: 120 },
  { month: "April", desktop: 73, mobile: 190 },
  { month: "May", desktop: 209, mobile: 130 },
  { month: "June", desktop: 214, mobile: 140 },
];

const chartConfig = {
  desktop: {
    label: "Desktop",
    color: "hsl(var(--chart-1))",
  },
  mobile: {
    label: "Mobile",
    color: "hsl(var(--chart-2))",
  },
  tablet: {
    label: "Tablet",
    color: "hsl(var(--chart-3))",
  },
  other: {
    label: "Other",
    color: "hsl(var(--chart-4))",
  },
};

const profileFormSchema = z.object({
  username: z.string().min(2, {
    message: "Username must be at least 2 characters.",
  }),
});

function ProfileForm() {
  const form = useForm<z.infer<typeof profileFormSchema>>({
    resolver: zodResolver(profileFormSchema),
    defaultValues: {
      username: "",
    },
  });

  function onSubmit(values: z.infer<typeof profileFormSchema>) {
    sonnerToast.success(`You submitted: ${values.username}`);
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
        <FormField
          control={form.control}
          name="username"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Username</FormLabel>
              <FormControl>
                <Input placeholder="shadcn" {...field} />
              </FormControl>
              <FormDescription>
                This is your public display name.
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />
        <Button type="submit">Submit</Button>
      </form>
    </Form>
  );
}
// ListItem component removed - NavigationMenu was deleted
// const ListItem = React.forwardRef<
//   React.ElementRef<"a">,
//   React.ComponentPropsWithoutRef<"a">
// >(({ className, title, children, ...props }, ref) => {
//   return (
//     <li>
//       <NavigationMenuLink asChild>
//         <a
//           ref={ref}
//           className={cn(
//             "block select-none space-y-1 rounded-md p-3 leading-none no-underline outline-none transition-all hover:bg-accent/40 focus:bg-accent/40 group",
//             className,
//           )}
//           {...props}
//         >
//           <div className="text-sm font-medium leading-none group-hover:text-foreground transition-colors">
//             {title}
//           </div>
//           <p className="line-clamp-2 text-sm leading-snug text-muted-foreground/70 group-hover:text-muted-foreground transition-colors">
//             {children}
//           </p>
//         </a>
//       </NavigationMenuLink>
//     </li>
//   );
// });
// ListItem.displayName = "ListItem";

export function UIShowcase() {
  const { toast } = useToast();
  const [date, setDate] = useState<Date | undefined>(new Date());

  const [page, setPage] = useState(1);

  return (
    <div className="w-full max-w-7xl mx-auto space-y-6 pb-20">
      <Toaster />
      <Sonner />

      <Tabs defaultValue="general" className="w-full">
        <div className="flex flex-col lg:flex-row gap-6">
          {/* ── Sidebar ── */}
          <aside className="lg:w-56 shrink-0 lg:sticky lg:top-20 lg:h-[calc(100vh-5rem)] lg:overflow-y-auto">
            <div className="lg:pr-6">
              <TabsList className="flex flex-row lg:flex-col h-auto w-full justify-start overflow-x-auto lg:overflow-visible p-1 gap-1 rounded-xl border border-border bg-card/50 backdrop-blur-sm text-card-foreground">
                <TabsTrigger
                  value="general"
                  className="justify-start gap-3 px-3 py-2.5 w-full text-sm font-medium transition-all"
                >
                  <Zap className="h-4 w-4 shrink-0 opacity-70" /> General &
                  Typography
                </TabsTrigger>
                <TabsTrigger
                  value="layout"
                  className="justify-start gap-3 px-3 py-2.5 w-full text-sm font-medium transition-all"
                >
                  <LayoutTemplate className="h-4 w-4 shrink-0 opacity-70" />{" "}
                  Layout & Structure
                </TabsTrigger>
                <TabsTrigger
                  value="navigation"
                  className="justify-start gap-3 px-3 py-2.5 w-full text-sm font-medium transition-all"
                >
                  <Navigation className="h-4 w-4 shrink-0 opacity-70" />{" "}
                  Navigation
                </TabsTrigger>
                <TabsTrigger
                  value="forms"
                  className="justify-start gap-3 px-3 py-2.5 w-full text-sm font-medium transition-all"
                >
                  <FormInput className="h-4 w-4 shrink-0 opacity-70" /> Forms &
                  Inputs
                </TabsTrigger>
                <TabsTrigger
                  value="surfaces"
                  className="justify-start gap-3 px-3 py-2.5 w-full text-sm font-medium transition-all"
                >
                  <PanelTop className="h-4 w-4 shrink-0 opacity-70" /> Surfaces
                  & Overlays
                </TabsTrigger>
                <TabsTrigger
                  value="display"
                  className="justify-start gap-3 px-3 py-2.5 w-full text-sm font-medium transition-all"
                >
                  <Database className="h-4 w-4 shrink-0 opacity-70" /> Data
                  Display
                </TabsTrigger>
                <TabsTrigger
                  value="feedback"
                  className="justify-start gap-3 px-3 py-2.5 w-full text-sm font-medium transition-all"
                >
                  <Activity className="h-4 w-4 shrink-0 opacity-70" /> Feedback
                  & Status
                </TabsTrigger>
                <TabsTrigger
                  value="motion"
                  className="justify-start gap-3 px-3 py-2.5 w-full text-sm font-medium transition-all"
                >
                  <Sparkles className="h-4 w-4 shrink-0 opacity-70" /> Motion &
                  Advanced
                </TabsTrigger>
              </TabsList>
            </div>
          </aside>

          {/* ── Content ── */}
          <main className="flex-1 min-w-0 space-y-8">
            {/* ━━━ 1. GENERAL & TYPOGRAPHY ━━━ */}
            <TabsContent
              value="general"
              className="mt-0 space-y-8 animate-in fade-in-50 duration-500"
            >
              <Section title="Buttons">
                <Card>
                  <CardContent className="pt-6 space-y-6">
                    <div className="space-y-3">
                      <Label>Variants</Label>
                      <div className="flex flex-wrap gap-3">
                        <Button>Default</Button>
                        <Button variant="secondary">Secondary</Button>
                        <Button variant="destructive">Destructive</Button>
                        <Button variant="outline">Outline</Button>
                        <Button variant="ghost">Ghost</Button>
                        <Button variant="link">Link</Button>
                      </div>
                    </div>
                    <Separator />
                    <div className="space-y-3">
                      <Label>Sizes & States</Label>
                      <div className="flex flex-wrap items-center gap-3">
                        <Button size="sm">Small</Button>
                        <Button size="default">Default</Button>
                        <Button size="lg">Large</Button>
                        <Button disabled>Disabled</Button>
                        <Button disabled>
                          <Loader2 className="h-4 w-4 mr-2 animate-spin" />{" "}
                          Loading
                        </Button>
                        <Button size="icon" variant="outline">
                          <Plus className="h-4 w-4" />
                        </Button>
                        <Button size="icon" variant="ghost">
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </Section>

              <Section title="Badges">
                <Card>
                  <CardContent className="pt-6 flex flex-wrap gap-3">
                    <Badge>Default</Badge>
                    <Badge variant="secondary">Secondary</Badge>
                    <Badge variant="destructive">Destructive</Badge>
                    <Badge variant="outline">Outline</Badge>
                    <Badge variant="success">Success</Badge>
                    <Badge variant="warning">Warning</Badge>
                    <Badge variant="info">Info</Badge>
                  </CardContent>
                </Card>
              </Section>

              <Section title="Typography">
                <Card>
                  <CardContent className="pt-6 space-y-6">
                    <div className="space-y-2">
                      <H1>Heading 1</H1>
                      <H2>Heading 2</H2>
                      <H3>Heading 3</H3>
                      <H4>Heading 4</H4>
                      <H5>Heading 5</H5>
                      <H6>Heading 6</H6>
                    </div>
                    <Separator />
                    <div className="space-y-3">
                      <Lead>Lead text — used for introductory paragraphs.</Lead>
                      <P>
                        Body paragraph with standard sizing and line height for
                        readability.
                      </P>
                      <Blockquote>
                        &ldquo;Design is not just what it looks like. Design is
                        how it works.&rdquo;
                      </Blockquote>
                    </div>
                    <Separator />
                    <div className="flex gap-4 items-center">
                      <Kbd>⌘ K</Kbd>
                      <code className="bg-muted px-1.5 py-0.5 rounded text-sm font-mono">
                        inline code
                      </code>
                    </div>
                  </CardContent>
                </Card>
              </Section>

              <Section title="Icons">
                <Card>
                  <CardContent className="pt-6">
                    <div className="grid grid-cols-4 md:grid-cols-6 lg:grid-cols-8 gap-6">
                      {Object.entries(TechIcons).map(([name, Icon]) => (
                        <div
                          key={name}
                          className="flex flex-col items-center gap-2 group cursor-pointer"
                          onClick={() => {
                            navigator.clipboard.writeText(name);
                            sonnerToast.success(
                              `Copied "${name}" to clipboard`,
                            );
                          }}
                        >
                          <Icon className="h-8 w-8 text-muted-foreground group-hover:text-primary transition-colors" />
                          <span className="text-[10px] text-muted-foreground group-hover:text-foreground">
                            {name}
                          </span>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              </Section>

              {/* Brand Icon section removed - component was deleted */}
              {/* <Section title="Brand Icon">
                <Card>
                  <CardContent className="pt-6">
                    <div className="space-y-4">
                      <P className="text-sm text-muted-foreground">
                        Auto-switches between light and dark variants based on
                        the active theme.
                      </P>
                      <div className="flex items-end gap-6">
                        <div className="flex flex-col items-center gap-2">
                          <BrandIcon size={24} />
                          <Small className="text-muted-foreground">24px</Small>
                        </div>
                        <div className="flex flex-col items-center gap-2">
                          <BrandIcon size={32} />
                          <Small className="text-muted-foreground">32px</Small>
                        </div>
                        <div className="flex flex-col items-center gap-2">
                          <BrandIcon size={48} />
                          <Small className="text-muted-foreground">48px</Small>
                        </div>
                        <div className="flex flex-col items-center gap-2">
                          <BrandIcon size={64} />
                          <Small className="text-muted-foreground">64px</Small>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </Section> */}

              <Section title="Tool Icons">
                <Card>
                  <CardContent className="pt-6">
                    <P className="text-xs text-muted-foreground mb-4">
                      Consolidated icon set used across tools. Click to copy
                      name.
                    </P>
                    <div className="grid grid-cols-4 md:grid-cols-6 lg:grid-cols-8 gap-6">
                      {Object.entries(ToolIcons)
                        .filter(([, Icon]) => typeof Icon === "function")
                        .map(([name, Icon]) => {
                          const IconComponent = Icon as React.ComponentType<{
                            className?: string;
                          }>;
                          return (
                            <div
                              key={name}
                              className="flex flex-col items-center gap-2 group cursor-pointer"
                              onClick={() => {
                                navigator.clipboard.writeText(name);
                                sonnerToast.success(
                                  `Copied "${name}" to clipboard`,
                                );
                              }}
                            >
                              <IconComponent className="h-8 w-8 text-muted-foreground group-hover:text-primary transition-colors" />
                              <span className="text-[10px] text-muted-foreground group-hover:text-foreground">
                                {name}
                              </span>
                            </div>
                          );
                        })}
                    </div>
                  </CardContent>
                </Card>
              </Section>
            </TabsContent>

            {/* ━━━ 2. LAYOUT & STRUCTURE ━━━ */}
            <TabsContent
              value="layout"
              className="mt-0 space-y-8 animate-in fade-in-50 duration-500"
            >
              <Section title="Page Header">
                <Card>
                  <CardHeader>
                    <CardTitle>Standard Header</CardTitle>
                    <CardDescription>
                      Simple title and description.
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <PageHeader
                      title="Page Title"
                      description="A consistent header component for page titles and descriptions."
                    />
                  </CardContent>
                </Card>

                {/* Complex Header with Breadcrumb removed - component was deleted */}
                {/* <Card>
                  <CardHeader>
                    <CardTitle>Complex Header</CardTitle>
                    <CardDescription>
                      Header with breadcrumbs and actions.
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      <Breadcrumb>
                        <BreadcrumbList>
                          <BreadcrumbItem>
                            <BreadcrumbLink href="#">Dashboard</BreadcrumbLink>
                          </BreadcrumbItem>
                          <BreadcrumbSeparator />
                          <BreadcrumbItem>
                            <BreadcrumbPage>Settings</BreadcrumbPage>
                          </BreadcrumbItem>
                        </BreadcrumbList>
                      </Breadcrumb>
                      <div className="flex items-center justify-between">
                        <div className="space-y-0.5">
                          <h2 className="text-2xl font-bold tracking-tight">
                            Settings
                          </h2>
                          <p className="text-muted-foreground">
                            Manage your account settings and preferences.
                          </p>
                        </div>
                        <div className="flex items-center gap-2">
                          <Button variant="outline" size="sm">
                            Discard
                          </Button>
                          <Button size="sm">Save Changes</Button>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card> */}
              </Section>

              <Section title="Scroll Area">
                <Card>
                  <CardHeader>
                    <CardTitle>Vertical Scroll</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <ScrollArea className="h-[200px] w-full rounded-md border p-4">
                      {Array.from({ length: 20 }).map((_, i) => (
                        <div key={i} className="text-sm">
                          Item {i + 1} — scrollable content
                          <Separator className="my-2" />
                        </div>
                      ))}
                    </ScrollArea>
                  </CardContent>
                </Card>
                <Card>
                  <CardHeader>
                    <CardTitle>Horizontal Scroll</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <ScrollArea className="w-full whitespace-nowrap rounded-md border">
                      <div className="flex w-max space-x-4 p-4">
                        {Array.from({ length: 10 }).map((_, i) => (
                          <figure key={i} className="shrink-0">
                            <div className="overflow-hidden rounded-md">
                              <div className="h-[150px] w-[100px] bg-muted/50 flex items-center justify-center text-muted-foreground">
                                Img {i + 1}
                              </div>
                            </div>
                            <figcaption className="pt-2 text-xs text-muted-foreground">
                              Photo by{" "}
                              <span className="font-semibold text-foreground">
                                Author {i + 1}
                              </span>
                            </figcaption>
                          </figure>
                        ))}
                      </div>
                      <ScrollBar orientation="horizontal" />
                    </ScrollArea>
                  </CardContent>
                </Card>
              </Section>

              <Section title="Separator">
                <Card>
                  <CardContent className="pt-6 space-y-4">
                    <div className="flex h-5 items-center gap-4 text-sm justify-center">
                      <span>Blog</span>
                      <Separator orientation="vertical" />
                      <span>Docs</span>
                      <Separator orientation="vertical" />
                      <span>Source</span>
                    </div>
                    <Separator />
                    <div className="text-center text-sm text-muted-foreground">
                      Above is a vertical separator, and this is below a
                      horizontal one.
                    </div>
                  </CardContent>
                </Card>
              </Section>
            </TabsContent>

            {/* ━━━ 3. NAVIGATION ━━━ */}
            <TabsContent
              value="navigation"
              className="mt-0 space-y-8 animate-in fade-in-50 duration-500"
            >
              {/* Navigation Menu section removed - component was deleted */}
              {/* <Section title="Navigation Menu">
                <Card className="relative z-20 overflow-visible">
                  <CardContent className="pt-6 flex justify-center h-[200px]">
                    <NavigationMenu className="z-[50]">
                      <NavigationMenuList>
                        <NavigationMenuItem>
                          <NavigationMenuTrigger>
                            Getting started
                          </NavigationMenuTrigger>
                          <NavigationMenuContent>
                            <ul className="grid gap-3 p-4 md:w-[400px] lg:w-[500px] lg:grid-cols-[.75fr_1fr]">
                              <li className="row-span-3">
                                <NavigationMenuLink asChild>
                                  <Link
                                    className="flex h-full w-full select-none flex-col justify-end rounded-md bg-muted/40 p-6 no-underline outline-none transition-all hover:bg-accent hover:text-accent-foreground border border-transparent"
                                    href="/"
                                  >
                                    <div className="h-8 w-8 rounded-md bg-foreground/10 mb-4 flex items-center justify-center">
                                      <Zap className="h-4 w-4 text-foreground/80" />
                                    </div>
                                    <div className="mb-2 text-lg font-medium tracking-tight">
                                      shadcn/ui
                                    </div>
                                    <p className="text-sm leading-relaxed text-muted-foreground/80">
                                      Beautifully designed components built with
                                      Radix UI and Tailwind CSS.
                                    </p>
                                  </Link>
                                </NavigationMenuLink>
                              </li>
                              <ListItem href="#" title="Introduction">
                                Re-usable components built using Radix UI and
                                Tailwind CSS.
                              </ListItem>
                              <ListItem href="#" title="Installation">
                                How to install dependencies and structure your
                                app.
                              </ListItem>
                              <ListItem href="#" title="Typography">
                                Styles for headings, paragraphs, lists...etc
                              </ListItem>
                            </ul>
                          </NavigationMenuContent>
                        </NavigationMenuItem>
                        <NavigationMenuItem>
                          <NavigationMenuLink
                            className={navigationMenuTriggerStyle()}
                            href="#"
                          >
                            Documentation
                          </NavigationMenuLink>
                        </NavigationMenuItem>
                      </NavigationMenuList>
                    </NavigationMenu>
                  </CardContent>
                </Card>
              </Section> */}

              <Section title="Tabs">
                <Card>
                  <CardContent className="pt-6">
                    <Tabs defaultValue="tab1" className="w-[400px]">
                      <TabsList>
                        <TabsTrigger value="tab1">Account</TabsTrigger>
                        <TabsTrigger value="tab2">Password</TabsTrigger>
                      </TabsList>
                      <TabsContent
                        value="tab1"
                        className="p-4 border rounded-md mt-2"
                      >
                        <Label>Name</Label>
                        <Input defaultValue="Fachri Aziz" className="mt-2" />
                      </TabsContent>
                      <TabsContent
                        value="tab2"
                        className="p-4 border rounded-md mt-2"
                      >
                        <Label>Current Password</Label>
                        <Input type="password" className="mt-2" />
                      </TabsContent>
                    </Tabs>
                  </CardContent>
                </Card>
              </Section>

              {/* Breadcrumb section removed - component was deleted */}
              {/* <Section title="Breadcrumb">
                <Card>
                  <CardContent className="pt-6">
                    <Breadcrumb>
                      <BreadcrumbList>
                        <BreadcrumbItem>
                          <BreadcrumbLink href="#">Home</BreadcrumbLink>
                        </BreadcrumbItem>
                        <BreadcrumbSeparator />
                        <BreadcrumbItem>
                          <BreadcrumbLink href="#">Components</BreadcrumbLink>
                        </BreadcrumbItem>
                        <BreadcrumbSeparator />
                        <BreadcrumbItem>
                          <BreadcrumbPage>Breadcrumb</BreadcrumbPage>
                        </BreadcrumbItem>
                      </BreadcrumbList>
                    </Breadcrumb>
                  </CardContent>
                </Card>
              </Section> */}

              <Section title="Pagination">
                <Card>
                  <CardContent className="pt-6">
                    <Pagination
                      currentPage={page}
                      totalPages={10}
                      onPageChange={setPage}
                    />
                  </CardContent>
                </Card>
              </Section>

              <Section title="Command Palette">
                <Card>
                  <CardContent className="pt-6">
                    <div className="max-w-md mx-auto">
                      <Command>
                        <CommandInput placeholder="Search commands…" />
                        <CommandList>
                          <CommandEmpty>No results.</CommandEmpty>
                          <CommandGroup heading="Suggestions">
                            <CommandItem>
                              <Search className="mr-2 h-4 w-4" /> Search docs
                            </CommandItem>
                            <CommandItem>
                              <CalendarIcon className="mr-2 h-4 w-4" /> Calendar
                            </CommandItem>
                          </CommandGroup>
                          <CommandGroup heading="Settings">
                            <CommandItem>
                              <User className="mr-2 h-4 w-4" /> Profile
                            </CommandItem>
                            <CommandItem>
                              <Settings className="mr-2 h-4 w-4" /> Settings
                            </CommandItem>
                          </CommandGroup>
                        </CommandList>
                      </Command>
                    </div>
                  </CardContent>
                </Card>
              </Section>
            </TabsContent>

            {/* ━━━ 4. FORMS & INPUTS ━━━ */}
            <TabsContent
              value="forms"
              className="mt-0 space-y-8 animate-in fade-in-50 duration-500"
            >
              <Section title="Text Inputs">
                <Card>
                  <CardHeader>
                    <CardTitle>Basic Inputs</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="space-y-2">
                      <Label>Email</Label>
                      <Input placeholder="name@example.com" type="email" />
                    </div>
                    <div className="space-y-2">
                      <Label>Password</Label>
                      <PasswordInput placeholder="••••••••" />
                    </div>
                    <div className="space-y-2">
                      <Label>Textarea</Label>
                      <Textarea placeholder="Type your message here." />
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle>Select & Date</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="space-y-2">
                      <Label>Select</Label>
                      <Select>
                        <SelectTrigger>
                          <SelectValue placeholder="Select a timezone" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="est">
                            Eastern Standard Time (EST)
                          </SelectItem>
                          <SelectItem value="pst">
                            Pacific Standard Time (PST)
                          </SelectItem>
                          <SelectItem value="utc">
                            Coordinated Universal Time (UTC)
                          </SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <div className="space-y-2">
                      <Label>Date Picker</Label>
                      <div className="w-full">
                        <DatePicker date={date} setDate={setDate} />
                      </div>
                    </div>
                    <div className="space-y-2">
                      <Label>File Upload</Label>
                      <FileUpload accept="image/*" />
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle>Calendar (Standalone)</CardTitle>
                    <CardDescription>
                      Full calendar with month/year selector dropdowns.
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="flex justify-center">
                    <Calendar
                      mode="single"
                      selected={date}
                      onSelect={setDate}
                      className="rounded-md border"
                    />
                  </CardContent>
                </Card>
              </Section>

              <Section title="Selection Controls">
                <Card>
                  <CardContent className="pt-6 grid md:grid-cols-2 gap-8">
                    <div className="space-y-4">
                      <h4 className="text-sm font-medium">Checkboxes</h4>
                      <div className="space-y-2">
                        <div className="flex items-center gap-2">
                          <Checkbox id="terms" />
                          <Label
                            htmlFor="terms"
                            className="text-sm font-normal"
                          >
                            Accept terms
                          </Label>
                        </div>
                        <div className="flex items-center gap-2">
                          <Checkbox id="marketing" defaultChecked />
                          <Label
                            htmlFor="marketing"
                            className="text-sm font-normal"
                          >
                            Receive emails
                          </Label>
                        </div>
                      </div>
                    </div>
                    <div className="space-y-4">
                      <h4 className="text-sm font-medium">Radio Group</h4>
                      <RadioGroup defaultValue="comfortable">
                        <div className="flex items-center space-x-2">
                          <RadioGroupItem value="default" id="r1" />
                          <Label htmlFor="r1" className="text-sm font-normal">
                            Default
                          </Label>
                        </div>
                        <div className="flex items-center space-x-2">
                          <RadioGroupItem value="comfortable" id="r2" />
                          <Label htmlFor="r2" className="text-sm font-normal">
                            Comfortable
                          </Label>
                        </div>
                      </RadioGroup>
                    </div>
                    <div className="space-y-4">
                      <h4 className="text-sm font-medium">Switch</h4>
                      <div className="flex items-center space-x-2">
                        <Switch id="airplane-mode" />
                        <Label
                          htmlFor="airplane-mode"
                          className="text-sm font-normal"
                        >
                          Airplane Mode
                        </Label>
                      </div>
                    </div>
                    {/* Toggle removed - component was deleted */}
                    {/* <div className="space-y-4">
                      <h4 className="text-sm font-medium">Toggle</h4>
                      <div className="flex gap-2">
                        <Toggle aria-label="Toggle italic">
                          <Italic className="h-4 w-4" />
                        </Toggle>
                        <Toggle variant="outline" aria-label="Toggle bold">
                          <Bold className="h-4 w-4" />
                        </Toggle>
                      </div>
                    </div> */}
                  </CardContent>
                </Card>
              </Section>

              <SliderSection />

              <Section title="Complex Form Example">
                <Card>
                  <CardHeader>
                    <CardTitle>Profile Form</CardTitle>
                    <CardDescription>
                      Full form with validation using zod and react-hook-form.
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <ProfileForm />
                  </CardContent>
                </Card>
              </Section>
            </TabsContent>

            {/* ━━━ 5. SURFACES & OVERLAYS ━━━ */}
            <TabsContent
              value="surfaces"
              className="mt-0 space-y-8 animate-in fade-in-50 duration-500"
            >
              <Section title="Dialogs & Sheets">
                <Card>
                  <CardHeader>
                    <CardTitle>Dialogs</CardTitle>
                  </CardHeader>
                  <CardContent className="flex flex-wrap gap-3">
                    <Dialog>
                      <DialogTrigger asChild>
                        <Button variant="outline">Edit Profile</Button>
                      </DialogTrigger>
                      <DialogContent>
                        <DialogHeader>
                          <DialogTitle>Edit Profile</DialogTitle>
                          <DialogDescription>
                            Make changes to your profile here.
                          </DialogDescription>
                        </DialogHeader>
                        <div className="grid gap-4 py-4">
                          <div className="grid grid-cols-4 items-center gap-4">
                            <Label className="text-right">Name</Label>
                            <Input
                              defaultValue="Pedro Duarte"
                              className="col-span-3"
                            />
                          </div>
                        </div>
                        <DialogFooter>
                          <Button type="submit">Save changes</Button>
                        </DialogFooter>
                      </DialogContent>
                    </Dialog>

                    <AlertDialog>
                      <AlertDialogTrigger asChild>
                        <Button variant="destructive">Delete Account</Button>
                      </AlertDialogTrigger>
                      <AlertDialogContent>
                        <AlertDialogHeader>
                          <AlertDialogTitle>
                            Are you absolutely sure?
                          </AlertDialogTitle>
                          <AlertDialogDescription>
                            This action cannot be undone.
                          </AlertDialogDescription>
                        </AlertDialogHeader>
                        <AlertDialogFooter>
                          <AlertDialogCancel>Cancel</AlertDialogCancel>
                          <AlertDialogAction>Continue</AlertDialogAction>
                        </AlertDialogFooter>
                      </AlertDialogContent>
                    </AlertDialog>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle>Side Sheets & Drawers</CardTitle>
                  </CardHeader>
                  <CardContent className="flex flex-wrap gap-3">
                    <Sheet>
                      <SheetTrigger asChild>
                        <Button variant="outline">Open Sheet</Button>
                      </SheetTrigger>
                      <SheetContent>
                        <SheetHeader>
                          <SheetTitle>Edit profile</SheetTitle>
                        </SheetHeader>
                        <div className="grid gap-4 py-4">
                          <Input placeholder="Name" />
                          <Input placeholder="Username" />
                        </div>
                        <SheetFooter>
                          <Button>Save changes</Button>
                        </SheetFooter>
                      </SheetContent>
                    </Sheet>
                    <DrawerDemo />
                  </CardContent>
                </Card>
              </Section>

              <Section title="Popovers & Tooltips">
                <Card>
                  <CardContent className="pt-6 flex flex-wrap gap-6 items-center">
                    <Popover>
                      <PopoverTrigger asChild>
                        <Button variant="outline">Open Popover</Button>
                      </PopoverTrigger>
                      <PopoverContent className="w-80">
                        <div className="grid gap-4">
                          <div className="space-y-2">
                            <h4 className="font-medium leading-none">
                              Dimensions
                            </h4>
                            <p className="text-sm text-muted-foreground">
                              Set the dimensions for the layer.
                            </p>
                          </div>
                          <div className="grid gap-2">
                            <div className="grid grid-cols-3 items-center gap-4">
                              <Label>Width</Label>
                              <Input
                                defaultValue="100%"
                                className="col-span-2 h-8"
                              />
                            </div>
                          </div>
                        </div>
                      </PopoverContent>
                    </Popover>

                    <TooltipProvider>
                      <Tooltip>
                        <TooltipTrigger asChild>
                          <Button variant="outline" size="icon">
                            <Info className="h-4 w-4" />
                          </Button>
                        </TooltipTrigger>
                        <TooltipContent>
                          <p>Add to library</p>
                        </TooltipContent>
                      </Tooltip>
                    </TooltipProvider>

                    {/* HoverCard removed - component was deleted */}
                    {/* <HoverCard>
                      <HoverCardTrigger asChild>
                        <Button variant="link">@nextjs</Button>
                      </HoverCardTrigger>
                      <HoverCardContent className="w-80">
                        <div className="flex justify-between space-x-4">
                          <Avatar>
                            <AvatarImage src="https://github.com/vercel.png" />
                            <AvatarFallback>VC</AvatarFallback>
                          </Avatar>
                          <div className="space-y-1">
                            <h4 className="text-sm font-semibold">@nextjs</h4>
                            <p className="text-sm">
                              The React Framework – created and maintained by
                              @vercel.
                            </p>
                            <div className="flex items-center pt-2">
                              <CalendarIcon className="mr-2 h-4 w-4 opacity-70" />{" "}
                              <span className="text-xs text-muted-foreground">
                                Joined December 2021
                              </span>
                            </div>
                          </div>
                        </div>
                      </HoverCardContent>
                    </HoverCard> */}
                  </CardContent>
                </Card>
              </Section>

              <Section title="Menus">
                <Card>
                  <CardContent className="pt-6 flex gap-6">
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="outline">Open Menu</Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent className="w-56">
                        <DropdownMenuLabel>My Account</DropdownMenuLabel>
                        <DropdownMenuSeparator />
                        <DropdownMenuItem>
                          <User className="mr-2 h-4 w-4" /> Profile
                        </DropdownMenuItem>
                        <DropdownMenuItem>
                          <Settings className="mr-2 h-4 w-4" /> Settings
                        </DropdownMenuItem>
                        <DropdownMenuSeparator />
                        <DropdownMenuItem>
                          <LogOut className="mr-2 h-4 w-4" /> Log out
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>

                    <ContextMenu>
                      <ContextMenuTrigger className="flex h-[40px] w-[150px] items-center justify-center rounded-md border border-dashed text-sm">
                        Right click here
                      </ContextMenuTrigger>
                      <ContextMenuContent className="w-64">
                        <ContextMenuItem inset>Back</ContextMenuItem>
                        <ContextMenuItem inset disabled>
                          Forward
                        </ContextMenuItem>
                        <ContextMenuItem inset>Reload</ContextMenuItem>
                        <DropdownMenuSeparator />
                        <ContextMenuItem inset>Save Page As...</ContextMenuItem>
                      </ContextMenuContent>
                    </ContextMenu>
                  </CardContent>
                </Card>
              </Section>
            </TabsContent>

            {/* ━━━ 6. DATA DISPLAY ━━━ */}
            <TabsContent
              value="display"
              className="mt-0 space-y-8 animate-in fade-in-50 duration-500"
            >
              <Section title="Cards">
                <Card>
                  <CardHeader>
                    <CardTitle>Simple Card</CardTitle>
                    <CardDescription>
                      Usual card header and content.
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <p className="text-sm text-muted-foreground">
                      This is a standard card component used for grouping
                      related content.
                    </p>
                  </CardContent>
                  <CardFooter>
                    <Button size="sm" variant="secondary">
                      Action
                    </Button>
                  </CardFooter>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <Bell className="h-5 w-5" /> Notifications
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-2">
                    <div className="flex items-start gap-3 p-3 rounded-lg border bg-muted/20">
                      <div className="mt-1 h-2 w-2 rounded-full bg-blue-500 shrink-0" />
                      <div>
                        <p className="text-sm font-medium">
                          Deployment Successful
                        </p>
                        <p className="text-xs text-muted-foreground">
                          5 minutes ago
                        </p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </Section>

              <Section title="Feature Card (Custom)">
                <FeatureCard
                  title="Next.js Portfolio"
                  description="A performant portfolio template built with the latest Next.js 14 features."
                  tags={["Next.js", "React", "Tailwind"]}
                  links={{ demo: "#", repo: "#" }}
                />
                <FeatureCard
                  title="SaaS Dashboard"
                  description="Comprehensive dashboard layout with data visualization and charts."
                  tags={["Dashboard", "Recharts"]}
                  links={{ demo: "#" }}
                />
              </Section>

              <Section title="Statistics & Charts">
                <div className="grid lg:grid-cols-2 gap-6">
                  <Card>
                    <CardHeader>
                      <CardTitle>Monthly Revenue</CardTitle>
                      <CardDescription>Blue theme bar chart.</CardDescription>
                    </CardHeader>
                    <CardContent>
                      <ChartContainer
                        config={chartConfig}
                        className="min-h-[200px] w-full"
                      >
                        <BarChart accessibilityLayer data={chartData}>
                          <CartesianGrid vertical={false} />
                          <XAxis
                            dataKey="month"
                            tickLine={false}
                            tickMargin={10}
                            axisLine={false}
                            tickFormatter={(value) => value.slice(0, 3)}
                          />
                          <ChartTooltip content={<ChartTooltipContent />} />
                          <Bar
                            dataKey="desktop"
                            fill="var(--color-desktop)"
                            radius={4}
                          />
                          <Bar
                            dataKey="mobile"
                            fill="var(--color-mobile)"
                            radius={4}
                          />
                        </BarChart>
                      </ChartContainer>
                    </CardContent>
                  </Card>

                  <Card>
                    <CardHeader>
                      <CardTitle>User Growth</CardTitle>
                      <CardDescription>Blue theme line chart.</CardDescription>
                    </CardHeader>
                    <CardContent>
                      <ChartContainer
                        config={chartConfig}
                        className="min-h-[200px] w-full"
                      >
                        <LineChart
                          accessibilityLayer
                          data={chartData}
                          margin={{
                            left: 12,
                            right: 12,
                          }}
                        >
                          <CartesianGrid vertical={false} />
                          <XAxis
                            dataKey="month"
                            tickLine={false}
                            axisLine={false}
                            tickMargin={8}
                            tickFormatter={(value) => value.slice(0, 3)}
                          />
                          <ChartTooltip
                            cursor={false}
                            content={<ChartTooltipContent hideLabel />}
                          />
                          <Line
                            dataKey="desktop"
                            type="monotone"
                            stroke="var(--color-desktop)"
                            strokeWidth={2}
                            dot={{
                              fill: "var(--color-desktop)",
                            }}
                            activeDot={{
                              r: 6,
                            }}
                          />
                        </LineChart>
                      </ChartContainer>
                    </CardContent>
                  </Card>

                  <Card className="lg:col-span-2">
                    <CardHeader className="items-center pb-0">
                      <CardTitle>Device Distribution</CardTitle>
                      <CardDescription>Blue theme donut chart.</CardDescription>
                    </CardHeader>
                    <CardContent className="flex-1 pb-0">
                      <ChartContainer
                        config={chartConfig}
                        className="mx-auto aspect-square max-h-[250px]"
                      >
                        <PieChart>
                          <ChartTooltip
                            cursor={false}
                            content={<ChartTooltipContent hideLabel />}
                          />
                          <Pie
                            data={chartData}
                            dataKey="desktop"
                            nameKey="month"
                            innerRadius={60}
                            strokeWidth={5}
                          >
                            {chartData.map((entry, index) => (
                              <Cell
                                key={`cell-${index}`}
                                fill={`hsl(var(--chart-${(index % 5) + 1}))`}
                              />
                            ))}
                            <RechartsLabel
                              content={({ viewBox }) => {
                                if (
                                  viewBox &&
                                  "cx" in viewBox &&
                                  "cy" in viewBox
                                ) {
                                  return (
                                    <text
                                      x={viewBox.cx}
                                      y={viewBox.cy}
                                      textAnchor="middle"
                                      dominantBaseline="middle"
                                    >
                                      <tspan
                                        x={viewBox.cx}
                                        y={viewBox.cy}
                                        className="fill-foreground text-3xl font-bold"
                                      >
                                        {chartData
                                          .reduce(
                                            (acc, curr) => acc + curr.desktop,
                                            0,
                                          )
                                          .toLocaleString()}
                                      </tspan>
                                      <tspan
                                        x={viewBox.cx}
                                        y={(viewBox.cy || 0) + 24}
                                        className="fill-muted-foreground text-xs"
                                      >
                                        Total Visitors
                                      </tspan>
                                    </text>
                                  );
                                }
                              }}
                            />
                          </Pie>
                        </PieChart>
                      </ChartContainer>
                    </CardContent>
                    <CardFooter className="flex-col gap-2 text-sm">
                      <div className="flex items-center gap-2 font-medium leading-none">
                        Trending up by 5.2% this month{" "}
                        <Activity className="h-4 w-4" />
                      </div>
                      <div className="leading-none text-muted-foreground">
                        Showing total visitors for the last 6 months
                      </div>
                    </CardFooter>
                  </Card>
                </div>
              </Section>

              <Section title="Table">
                <Card>
                  <CardContent className="pt-6">
                    <Table>
                      <TableCaption>A list of recent invoices.</TableCaption>
                      <TableHeader>
                        <TableRow>
                          <TableHead className="w-[100px]">Invoice</TableHead>
                          <TableHead>Status</TableHead>
                          <TableHead>Method</TableHead>
                          <TableHead className="text-right">Amount</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        <TableRow>
                          <TableCell className="font-medium">INV001</TableCell>
                          <TableCell>Paid</TableCell>
                          <TableCell>Credit Card</TableCell>
                          <TableCell className="text-right">$250.00</TableCell>
                        </TableRow>
                        <TableRow>
                          <TableCell className="font-medium">INV002</TableCell>
                          <TableCell>Pending</TableCell>
                          <TableCell>PayPal</TableCell>
                          <TableCell className="text-right">$150.00</TableCell>
                        </TableRow>
                      </TableBody>
                    </Table>
                  </CardContent>
                </Card>
              </Section>

              {/* Avatars section removed - component was deleted */}
              {/* <Section title="Avatars">
                <div className="grid md:grid-cols-2 gap-6">
                  <Card>
                    <CardHeader>
                      <CardTitle>Sizes</CardTitle>
                    </CardHeader>
                    <CardContent className="flex items-center gap-4">
                      <Avatar className="w-6 h-6">
                        <AvatarFallback className="text-[10px]">
                          SM
                        </AvatarFallback>
                      </Avatar>
                      <Avatar className="w-10 h-10">
                        <AvatarFallback>MD</AvatarFallback>
                      </Avatar>
                      <Avatar className="w-16 h-16">
                        <AvatarFallback>LG</AvatarFallback>
                      </Avatar>
                    </CardContent>
                  </Card>
                  <Card>
                    <CardHeader>
                      <CardTitle>Avatar Group</CardTitle>
                    </CardHeader>
                    <CardContent className="flex items-center">
                      <Avatar className="w-10 h-10 border-2 border-background">
                        <AvatarImage src="https://github.com/shadcn.png" />
                        <AvatarFallback>CN</AvatarFallback>
                      </Avatar>
                      <Avatar className="w-10 h-10 border-2 border-background ml-[-10px]">
                        <AvatarFallback>FA</AvatarFallback>
                      </Avatar>
                      <Avatar className="w-10 h-10 border-2 border-background ml-[-10px]">
                        <AvatarFallback>AB</AvatarFallback>
                      </Avatar>
                      <div className="w-10 h-10 rounded-full bg-muted border-2 border-background ml-[-10px] flex items-center justify-center text-xs font-medium text-muted-foreground">
                        +3
                      </div>
                    </CardContent>
                  </Card>
                </div>
              </Section> */}

              {/* Project Components section removed - ProjectCard and ProjectSkeleton were deleted */}
              {/* <Section title="Project Components">
                <div className="space-y-6">
                  <Card>
                    <CardHeader>
                      <CardTitle>Project Card</CardTitle>
                      <CardDescription>
                        Interactive project card with hover effects
                      </CardDescription>
                    </CardHeader>
                    <CardContent>
                      <div className="grid md:grid-cols-2 gap-4">
                        <ProjectCard
                          project={getAllProjects()[0]}
                          onViewDetails={() => {}}
                        />
                        <ProjectCard
                          project={getAllProjects()[1]}
                          onViewDetails={() => {}}
                        />
                      </div>
                    </CardContent>
                  </Card>

                  <Card>
                    <CardHeader>
                      <CardTitle>Project Skeleton</CardTitle>
                      <CardDescription>
                        Loading state for project cards
                      </CardDescription>
                    </CardHeader>
                    <CardContent>
                      <div className="grid md:grid-cols-3 gap-4">
                        <ProjectSkeleton count={3} />
                      </div>
                    </CardContent>
                  </Card>

                  <Card>
                    <CardHeader>
                      <CardTitle>Project List</CardTitle>
                      <CardDescription>
                        Complete project list with tabs, filtering, and
                        pagination
                      </CardDescription>
                    </CardHeader>
                    <CardContent>
                      <ProjectList
                        projects={getAllProjects()}
                        itemsPerPage={3}
                      />
                    </CardContent>
                  </Card>
                </div>
              </Section> */}

              <Section title="Project List">
                <Card>
                  <CardHeader>
                    <CardTitle>Project List</CardTitle>
                    <CardDescription>
                      Complete project list with tabs, filtering, and pagination
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <ProjectList projects={getAllProjects()} itemsPerPage={3} />
                  </CardContent>
                </Card>
              </Section>

              {/* Tool Components section - ToolTable removed, keeping ToolList */}
              <Section title="Tool List">
                <Card>
                  <CardHeader>
                    <CardTitle>Tool List</CardTitle>
                    <CardDescription>
                      Complete tool list with search and command palette
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <ToolList tools={getAllTools()} />
                  </CardContent>
                </Card>
              </Section>

              <Section title="Code Block">
                <Card>
                  <CardContent className="pt-6">
                    <CodeBlock language="bash">{`npm install shadcn-ui`}</CodeBlock>
                  </CardContent>
                </Card>
              </Section>

              <Section title="Collapse & Accordion">
                <div className="grid md:grid-cols-2 gap-6 items-start">
                  <Card>
                    <CardContent className="pt-6">
                      <Accordion type="single" collapsible className="w-full">
                        <AccordionItem value="item-1">
                          <AccordionTrigger>Is it accessible?</AccordionTrigger>
                          <AccordionContent>
                            Yes. It adheres to the WAI-ARIA design pattern.
                          </AccordionContent>
                        </AccordionItem>
                        <AccordionItem value="item-2">
                          <AccordionTrigger>Is it styled?</AccordionTrigger>
                          <AccordionContent>
                            Yes. It comes with default styles that matches the
                            other components.
                          </AccordionContent>
                        </AccordionItem>
                      </Accordion>
                    </CardContent>
                  </Card>
                  <Card>
                    <CardContent className="pt-6">
                      <Collapsible className="group">
                        <CollapsibleTrigger asChild>
                          <div className="flex items-center justify-between p-2 rounded-lg hover:bg-accent/50 transition-colors cursor-pointer w-full group/trigger">
                            <div className="flex items-center gap-3">
                              <div className="h-8 w-8 rounded-full bg-muted/50 flex items-center justify-center group-hover/trigger:bg-primary/10 text-muted-foreground group-hover/trigger:text-primary transition-colors">
                                <Star className="h-4 w-4 fill-current/10" />
                              </div>
                              <h4 className="text-sm font-medium">
                                @peduarte starred 3 repos
                              </h4>
                            </div>
                            <div className="h-8 w-8 p-0 rounded-full flex items-center justify-center bg-transparent text-muted-foreground group-hover/trigger:text-foreground transition-colors">
                              <ChevronDown className="h-4 w-4 transition-transform duration-200 group-data-[state=open]:rotate-180" />
                            </div>
                          </div>
                        </CollapsibleTrigger>
                        <CollapsibleContent>
                          <div className="mt-2 space-y-1 rounded-xl bg-muted/30 p-2 border border-border/40">
                            <div className="rounded-lg hover:bg-accent/50 px-3 py-2.5 font-mono text-xs flex items-center gap-3 text-muted-foreground hover:text-accent-foreground transition-all cursor-pointer border border-transparent hover:border-border">
                              <BoxSelect className="h-3.5 w-3.5 opacity-60" />
                              @radix-ui/primitives
                            </div>
                            <div className="rounded-lg hover:bg-accent/50 px-3 py-2.5 font-mono text-xs flex items-center gap-3 text-muted-foreground hover:text-accent-foreground transition-all cursor-pointer border border-transparent hover:border-border">
                              <Palette className="h-3.5 w-3.5 opacity-60" />
                              @radix-ui/colors
                            </div>
                          </div>
                        </CollapsibleContent>
                      </Collapsible>
                    </CardContent>
                  </Card>
                </div>
              </Section>
            </TabsContent>

            {/* ━━━ 7. FEEDBACK & STATUS ━━━ */}
            <TabsContent
              value="feedback"
              className="mt-0 space-y-8 animate-in fade-in-50 duration-500"
            >
              <Section title="Alerts">
                <Card>
                  <CardContent className="pt-6 space-y-4">
                    <Alert>
                      <Zap className="h-4 w-4" />
                      <AlertTitle>Default Alert</AlertTitle>
                      <AlertDescription>
                        You can add components to your app using the cli.
                      </AlertDescription>
                    </Alert>
                    <Alert variant="success">
                      <CheckCircle2 className="h-4 w-4" />
                      <AlertTitle>Success</AlertTitle>
                      <AlertDescription>
                        Your changes have been saved successfully.
                      </AlertDescription>
                    </Alert>
                    <Alert variant="info">
                      <Info className="h-4 w-4" />
                      <AlertTitle>Note</AlertTitle>
                      <AlertDescription>
                        A software update is available for download.
                      </AlertDescription>
                    </Alert>
                    <Alert variant="warning">
                      <AlertTriangle className="h-4 w-4" />
                      <AlertTitle>Warning</AlertTitle>
                      <AlertDescription>
                        Your subscription is expiring soon.
                      </AlertDescription>
                    </Alert>
                    <Alert variant="destructive">
                      <XCircle className="h-4 w-4" />
                      <AlertTitle>Error</AlertTitle>
                      <AlertDescription>
                        Your session has expired. Please log in again.
                      </AlertDescription>
                    </Alert>
                  </CardContent>
                </Card>
              </Section>

              <Section title="Toasts (Sonner & Standard)">
                <Card>
                  <CardContent className="pt-6 flex flex-wrap gap-4">
                    <Button
                      variant="outline"
                      onClick={() =>
                        sonnerToast("Event has been created", {
                          description: "Sunday, December 03, 2023 at 9:00 AM",
                          action: {
                            label: "Undo",
                            onClick: () => console.log("Undo"),
                          },
                        })
                      }
                    >
                      Show Sonner Toast
                    </Button>

                    <Button
                      variant="outline"
                      onClick={() =>
                        toast({
                          title: "Scheduled: Catch up",
                          description: "Friday, February 10, 2023 at 5:57 PM",
                        })
                      }
                    >
                      Show Standard Toast
                    </Button>
                  </CardContent>
                </Card>
              </Section>

              <Section title="Loading & Empty States">
                <div className="grid md:grid-cols-2 gap-6">
                  <Card>
                    <CardHeader>
                      <CardTitle>Progress & Spinners</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-6">
                      <Progress value={33} />
                      <div className="flex items-center gap-4">
                        <Spinner size="sm" />
                        <Spinner size="md" />
                        <Spinner size="lg" />
                      </div>
                    </CardContent>
                  </Card>

                  <Card>
                    <CardHeader>
                      <CardTitle>Skeletons</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-2">
                      <Skeleton className="h-4 w-[250px]" />
                      <Skeleton className="h-4 w-[200px]" />
                      <div className="flex items-center space-x-4 pt-2">
                        <Skeleton className="h-10 w-10 rounded-full" />
                        <div className="space-y-2">
                          <Skeleton className="h-4 w-[150px]" />
                          <Skeleton className="h-4 w-[100px]" />
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </div>
              </Section>

              <Section title="Empty State">
                <Card>
                  <CardContent className="pt-6">
                    <EmptyState
                      icon={<Database className="h-16 w-16" />}
                      title="No results found"
                      description="Your search did not return any results. Check your spelling."
                      action={{ label: "Clear search", onClick: () => {} }}
                    />
                  </CardContent>
                </Card>
              </Section>
            </TabsContent>

            {/* ━━━ 8. MOTION & ADVANCED ━━━ */}
            <TabsContent
              value="motion"
              className="mt-0 space-y-8 animate-in fade-in-50 duration-500"
            >
              <Section title="Motion Primitives">
                <div className="grid md:grid-cols-2 gap-4">
                  <Card>
                    <CardHeader>
                      <CardTitle>Fade & Slide</CardTitle>
                      <CardDescription>Basic entry animations.</CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      <FadeIn delay={0.2}>
                        <div className="p-4 bg-muted/50 rounded-lg text-center">
                          Fade In (0.2s delay)
                        </div>
                      </FadeIn>
                      <SlideUp delay={0.4}>
                        <div className="p-4 bg-muted/50 rounded-lg text-center">
                          Slide Up (0.4s delay)
                        </div>
                      </SlideUp>
                    </CardContent>
                  </Card>
                  <Card>
                    <CardHeader>
                      <CardTitle>Interactions & Stagger</CardTitle>
                      <CardDescription>
                        Hover effects and lists.
                      </CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      <div className="flex justify-center">
                        <ScaleOnHover>
                          <Button>Hover to Scale</Button>
                        </ScaleOnHover>
                      </div>
                      <StaggerContainer className="grid grid-cols-3 gap-2">
                        {[1, 2, 3].map((i) => (
                          <StaggerItem key={i}>
                            <div className="aspect-square bg-muted/50 rounded-lg flex items-center justify-center">
                              {i}
                            </div>
                          </StaggerItem>
                        ))}
                      </StaggerContainer>
                    </CardContent>
                  </Card>
                </div>
              </Section>

              <Section title="Copy Button">
                <Card>
                  <CardContent className="pt-6 flex flex-wrap gap-6">
                    <div className="flex items-center gap-2">
                      <span className="text-sm font-medium">Default:</span>
                      <CopyButton value="npm install" />
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="text-sm font-medium">Icon only:</span>
                      <CopyButton value="git clone repo" iconOnly />
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="text-sm font-medium">Ghost:</span>
                      <CopyButton
                        value="ApiKey_12345"
                        variant="ghost"
                        label="Copy API Key"
                      />
                    </div>
                  </CardContent>
                </Card>
              </Section>
            </TabsContent>
          </main>
        </div>
      </Tabs>
    </div>
  );
}
