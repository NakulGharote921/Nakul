import { CERTIFICATES } from "@/lib/certificates";
import { siteConfig } from "@/lib/metadata";
import { PROJECTS } from "@/lib/projects";
import { resumeDownloadPath } from "@/lib/resume";

const CONTACT = {
  email: "nakulgharote@gmail.com",
  phone: "+91 8766678066",
  linkedin: "https://linkedin.com/in/nakul-gharote",
  github: "https://github.com/NakulGharote921",
  location: "Nagpur, India",
} as const;

const projectLines = PROJECTS.map((project, index) =>
  [
    `${index + 1}. ${project.iconLabel} - ${project.description}`,
    project.href,
  ].join("\n")
).join("\n\n");

const certificateTitles = CERTIFICATES.map(
  (certificate) => certificate.title
).join(", ");

type Rule = {
  test: RegExp;
  reply: string;
};

const RULES: Rule[] = [
  {
    test: /\b(resume|cv|curriculum vitae|download.*profile|profile.*download)\b/i,
    reply: [
      "You can download Nakul Gharote's latest resume here:",
      "",
      `${siteConfig.url}${resumeDownloadPath}`,
      "",
      `For an opportunity or interview, you can also reach Nakul at ${CONTACT.email} or ${CONTACT.linkedin}.`,
    ].join("\n"),
  },
  {
    test: /\b(certificat|certification|courses?|credential|quizverse|cc[e]?)\b/i,
    reply: [
      `Nakul has ${CERTIFICATES.length} certificate documents published on the Certificate page: ${certificateTitles}.`,
      "",
      `Every one of them is downloadable from ${siteConfig.url}/certificate`,
    ].join("\n"),
  },
  {
    test: /\b(project|portfolio|built|build|app|application|website|site|show me|showcase|demo)\b/i,
    reply: [
      "Nakul has three portfolio projects, all live:",
      "",
      projectLines,
      "",
      `The Projects page has the full write-up: ${siteConfig.url}/projects`,
    ].join("\n"),
  },
  {
    test: /\b(contact|reach|email|hire|connect|message|call|phone|talk|dm)\b/i,
    reply: [
      `Reach Nakul by email at ${CONTACT.email} or by phone on ${CONTACT.phone}. He is based in ${CONTACT.location}.`,
      "",
      `LinkedIn: ${CONTACT.linkedin}`,
      `GitHub: ${CONTACT.github}`,
      `Portfolio: ${siteConfig.url}`,
    ].join("\n"),
  },
  {
    test: /\b(intern|internship|job opening|vacancy|hiring)\b/i,
    reply: [
      "Internship availability is not listed in this portfolio, so I cannot confirm it here.",
      "",
      `The fastest way to check is to email ${CONTACT.email} or message him on LinkedIn: ${CONTACT.linkedin}`,
    ].join("\n"),
  },
  {
    test: /\b(skill|skills|stack|technolog|tech|tool|library|framework|language|learn|learning|studying)\b/i,
    reply: [
      "Nakul's core skills are JavaScript (ES6+), React, Python, Tailwind CSS, Bootstrap 5, responsive web design, DOM manipulation, Firebase and Supabase, SQL and MySQL, Git and GitHub, and GSAP and Three.js.",
      "",
      "His working stack adds Next.js, TypeScript, shadcn/ui, Express.js, Django, Spring Boot, MongoDB, SQL/MySQL, Figma, Vercel, Cursor and Nvidia NIM. He is currently learning Angular, Node.js, Spring Boot and MongoDB, and works with ChatGPT, Claude, Gemini, Opencode and Stitch as AI tooling.",
    ].join("\n"),
  },
  {
    test: /\b(who|about|introduce|him|profile|bio|developer|person|tell me about|what does)\b/i,
    reply: [
      "Nakul Gharote is a full stack developer from Nagpur, India. He builds responsive, interactive web applications with clean, maintainable code and thoughtful user experiences.",
      "",
      "He is currently a Frontend Developer at ResoluteAI Software (5 Oct 2026 - 5 Jan 2027) and previously worked as a Full Stack Developer at Codekafters (3 Jul 2026 - 3 Oct 2026). He holds a Bachelor of Commerce in Computer Applications and is pursuing a Master's in Full Stack Development with a JFSD specialization, expected 2027.",
      "",
      `More detail lives on the About page: ${siteConfig.url}/about`,
    ].join("\n"),
  },
  {
    test: /\b(experience|worked|work|job|role|company|employer|history|career)\b/i,
    reply: [
      "Nakul's work history so far:",
      "",
      "1. Frontend Developer at ResoluteAI Software, 5 Oct 2026 - 5 Jan 2027. He is building the company's official website end to end.",
      "2. Full Stack Developer at Codekafters, 3 Jul 2026 - 3 Oct 2026.",
      "",
      `The About page has the full timeline: ${siteConfig.url}/about`,
    ].join("\n"),
  },
  {
    test: /\b(education|degree|college|school|university|master|bachelor|studied|study|b\.com|m\.com)\b/i,
    reply: [
      "Nakul's education:",
      "",
      "1. Bachelor of Commerce in Computer Applications at Santaji Mahavidyalaya, Nagpur. 2023 - 2026, completed.",
      "2. Master's in Full Stack Development with a JFSD specialization at Itvedant Education. Expected 2027.",
      "3. Web Development Certification from IT Vedant, 2026.",
    ].join("\n"),
  },
];

const FALLBACK =
  "I can answer questions about Nakul's profile, technical skills and stack, the projects he has built, his certificates, work history, education and how to contact him. Try asking \"Who is Nakul?\", \"Show me his projects.\" or \"What certificates has he earned?\"";

/**
 * Local, portfolio-aware fallback used when no AI provider is configured.
 * Every answer is derived from the portfolio data in `lib/` - nothing here is
 * invented.
 */
export function demoAssistantReply(question: string): string {
  const normalized = question.trim().toLowerCase();

  if (!normalized) return FALLBACK;

  for (const rule of RULES) {
    if (rule.test.test(normalized)) return rule.reply;
  }

  return FALLBACK;
}
