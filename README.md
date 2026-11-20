Graham Cohick, Nathan Morelli, Krish Batra, Momrez Mohsin - Super Cool Software Engineers

MoMoneyMoProblems

Tech stack: TypeScript, React + Vite + TypeScript, Convex, Claude/Gemini, AWS Bedrock, Convex Auth, Vercel (frontend), Convex Cloud

Architecture: See architecture figs folder

Pre reqs: Node.js 20.19+ or 22.12+, and npm.

Instructions:
  cd App
  npm install
  npm run dev

`npm run dev` starts the Convex backend and the Vite frontend, then opens the app in the browser. The first run creates `App/.env.local` (gitignored). You do not set these by hand:

  CONVEX_DEPLOYMENT
  VITE_CONVEX_URL
  VITE_CONVEX_SITE_URL

The frontend reads `VITE_CONVEX_URL` to connect to Convex. If that file is missing, run `npm run dev` again from `App` so Convex can rewrite it.

We plan to build a personal finance and budgeting application designed specifically to help college students track their spending, manage budgets, and make better day-to-day financial decisions. We are unsure how we are going to split tasks up so we don't run into a lot of git conflicts during development.

Implemented features:

Add an expense. On the main page, click Add Expense. Enter a positive amount and choose a category (Food, Transportation, Entertainment, Housing, School, or Other). Date and location are optional; leave the date blank and it is saved as today. Click Confirm. The expense shows up in the list. Spent this month and remaining budget update right away. Remaining budget is this month's budget minus this month's expenses. No monthly budget is set yet, so the budget stays $0.00 and remaining goes down as you add expenses. An expense dated in another month still appears in the list and does not change this month's totals.

Add an income stream. On the main page, under Income, click Add Income. Enter a name, a positive amount per paycheck, and how often it is paid (weekly, biweekly, or monthly). Click Confirm. The stream shows up in the income list with its monthly equivalent, and Total monthly income updates right away. Weekly pay is converted with 52 paychecks a year (amount × 52 ÷ 12) and biweekly pay with 26 (amount × 26 ÷ 12), rounded to the cent; monthly pay is used as entered. A missing name or an amount that is not a positive number shows an error and nothing is saved.

Currently: Add an expense and add an income stream work on the Convex backend with the Vite app. Setting a monthly budget, editing, and deleting are not built yet.

AI was used in the generation of code. 



Nathan: runs on mac
Graham: runs on mac
Krish: runs on windows
Momrez: runs on windows
