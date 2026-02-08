import { NextRequest, NextResponse } from "next/server";

const BASE_URL = "https://moldpredict.com";

const knowledgeBase: { keywords: string[]; response: string }[] = [
  {
    keywords: ["hello", "hi", "hey"],
    response:
      `Hi 👋 I’m <strong>Moth AI</strong>, here to help you with MoldPredict.<br/>
      You can ask me about buying MoldPredict, creating predictions, reports, or security.`,
  },
  {
    keywords: ["MoldPredict", "moldpredict", "Moldpredict"],
    response:
    `MoldPredict is a predictive analytics tool that helps manufacturers estimate mold risk, expected costs, and time-to-overhaul using operational, environmental, and usage data.<br/>
    👉 <a href="https://predilyticsinc.com/moldpredict" target="_blank">Go to <strong>MoldPredict</strong> website</a><br/>
    Need more info? <a href="https://predilyticsinc.com/#contact" target="_blank">Contact Us</a>.`,
  },
  {
    keywords: ["signup", "register", "login", "account"],
    response:
      `If you've purchased a subscription, you can create an account through the login page in your downloaded MoldPredict desktop app, or during checkout on our website.<br/>
      👉 <a href="https://predilyticsinc.com/pricing" target="_blank">Go to Pricing/Checkout page</a><br/>
      Having trouble? <a href="https://predilyticsinc.com/moldpredict/ticket" target="_blank">Submit a ticket</a>.`,
  },
  {
    keywords: ["pricing", "subscription", "plan"],
    response:
      `MoldPredict Enterprise costs <strong>$2,399/year</strong>.<br/>
      🎉 Get $500 Pre-launch discount: <strong>$1899/year</strong> (limited time).<br/>
      👉 <a href="https://predilyticsinc.com/pricing" target="_blank">View pricing</a>`,
  },
  {
    keywords: ["buy", "purchase", "subscribe"],
    response:
      `To buy MoldPredict:<br/>
      1️⃣ Download and install the desktop app<br/>
      2️⃣ Purchase a subscription<br/>
      3️⃣ Sign in with your Clerk account<br/><br/>
      👉 <a href="https://predilyticsinc.com/moldpredict/downloads" target="_blank">Download MoldPredict</a>`,
  },
  {
    keywords: ["prediction", "mold prediction"],
    response:
      `To create a mold prediction, enter your inputs in the MoldPredict dashboard.<br/>
      You can save predictions, generate reports, and share them via email.<br/>
      👉 <a href="https://predilyticsinc.com/tutorials" target="_blank">View tutorials</a>`,
  },
  {
    keywords: ["share", "report"],
    response:
      `Reports can be shared via email directly from MoldPredict Online Console.<br/>
      Open a saved prediction and click <strong>Email Report</strong>.`,
  },
  {
    keywords: ["risk score", "risk"],
    response:
      `The risk score shows the likelihood of mold overhaul based on your inputs.<br/>
      👉 <a href="https://predilyticsinc.com/tutorials" target="_blank">How to interpret risk scores</a>`,
  },
  {
    keywords: ["security", "data", "privacy"],
    response:
      `All data is securely stored and encrypted.<br/>
      👉 <a href="https://predilyticsinc.com/privacy-policy" target="_blank">Privacy Policy</a><br/>
      👉 <a href="https://predilyticsinc.com/terms-and-conditions" target="_blank">Terms of Service</a>`,
  },
  {
    keywords: ["bug", "error", "issue"],
    response:
      `Sorry about that 😕<br/>
      👉 <a href="https://predilyticsinc.com/moldpredict/ticket" target="_blank">Submit a support ticket</a><br/>
      📞 +1 (415) 907-0704`,
  },
];

export async function POST(req: NextRequest) {
  const { message } = await req.json();

  if (!message) {
    return NextResponse.json({
      reply:
        "I didn’t quite catch that. You can check our tutorials or contact support.",
    });
  }

  const lower = message.toLowerCase();
  const match = knowledgeBase.find(entry =>
    entry.keywords.some(k => lower.includes(k))
  );

  return NextResponse.json({
    reply:
      match?.response ??
      `I’m not sure about that yet.<br/>
       👉 <a href="https://predilyticsinc.com/tutorials" target="_blank">Tutorials</a> |
       <a href="https://predilyticsinc.com/moldpredict/ticket" target="_blank">Submit a ticket</a>`,
  });
}
