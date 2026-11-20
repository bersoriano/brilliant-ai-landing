export const FAQS: [question: string, answer: string][] = [
  [
    "Do you work with teams in the United States, Canada, and Mexico?",
    "Yes. We work with finance and healthcare teams in all three countries, and we can come to your office for the review, including in Mexico City. The site is in English and Mexican Spanish.",
  ],
  [
    "What happens in the first workflow review?",
    "Bring one task your team repeats. In 20 minutes we’ll go over where it comes from, which tools it touches, who hands it off, and who approves it. You’ll leave knowing where we’d start and what we’d still need to look at before scoping a pilot. You don’t need to prepare anything technical.",
  ],
  [
    "Do we need an AI specialist on our team?",
    "No. You need someone who knows the process and can check the results. We handle discovery, the build, and running it. Your team decides what a good result looks like, approves access, and signs off on the output. The infrastructure is our job.",
  ],
  [
    "How long does an implementation take?",
    "It depends on the workflow, the integrations, how clean your data is, and how much review you need. After discovery we agree on a delivery plan: a pilot with a set scope and clear criteria for accepting it, before anything expands. Your team reviews the system before it goes live.",
  ],
  [
    "Can you work with our existing tools?",
    "Yes, that’s where we start. We look at the systems you have and what they let us connect to, then pick the simplest integration that will hold up. During discovery we confirm access, licensing, and any vendor limits, so the scope matches what your tools can actually do.",
  ],
  [
    "How do you handle sensitive financial or patient data?",
    "On your terms. First we agree on what data the workflow needs, who can see it, where it’s processed, and how long it’s kept. Before any sensitive data is connected, your team approves which AI providers can process it and which agreement we work under (BAA, DPA, or NDA). Keep in mind that automating a process doesn’t make it compliant on its own.",
  ],
  [
    "What if the AI gets something wrong?",
    "We assume it sometimes will. Every result is checked against rules your team agrees to in writing. Anything that fails a check stops and goes to the person you named, with the reason. Nothing is recorded, paid, or submitted without their approval, and you can pause it at any time.",
  ],
  [
    "What does it cost, and what happens after launch?",
    "The workflow review is free and takes 20 minutes. A pilot covers one workflow with a fixed scope, usually takes 3 to 6 weeks, and is quoted after discovery. After launch, a monthly retainer covers monitoring and updates. Every proposal lists the build, third-party and API costs, and ongoing support separately.",
  ],
];

/**
 * The homepage keeps the questions a first visit asks; the full list lives on
 * /services. The homepage FAQ schema follows what it shows.
 */
const SERVICES_ONLY = new Set([
  "Do we need an AI specialist on our team?",
  "How long does an implementation take?",
]);
export const HOMEPAGE_FAQS = FAQS.filter(([question]) => !SERVICES_ONLY.has(question));
