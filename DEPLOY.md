# Wander with Rohan — Deploy to Netlify (No-Terminal Guide)

This guide gets your site live on the internet. **No coding, no terminal, no technical skills needed.** Just click buttons on three websites.

**Total time:** ~40 minutes
**Total cost:** ~₹400-800 in Anthropic API credits (with a hard spending cap)

---

## What you'll end up with

A public URL like `https://wander-with-rohan.netlify.app` that you can share with friends and family. They open it, generate itineraries, save savings goals — everything works.

---

## Part 1 — Set up the three accounts (10 minutes)

You need accounts on these three websites. **Use the same email everywhere** so your future self doesn't get confused.

### 1.1 — GitHub account

1. Go to **github.com**
2. Click "Sign up" (top right)
3. Use your email, pick a username (e.g. `rohanjagtap29`), pick a password
4. Verify your email
5. Done. Leave the tab open.

### 1.2 — Netlify account

1. Go to **netlify.com**
2. Click "Sign up" (top right)
3. Choose **"Sign up with GitHub"** (this is the easiest path)
4. It will ask you to authorize Netlify to read your GitHub. Click "Authorize Netlify."
5. Done. Leave this tab open too.

### 1.3 — Anthropic Console account (for the AI key)

1. Go to **console.anthropic.com**
2. Click "Sign Up"
3. Use your email, verify it
4. Once inside the dashboard, click "Billing" in the left sidebar
5. Click "Add credit" or "Buy credits" — buy **$5 worth** (about ₹420). That's enough for hundreds of itineraries.
6. **CRITICAL — set a spending cap:** Still in Billing, find "Limits" or "Usage limits". Set the monthly limit to **$10**. This means no matter what happens, you can NEVER spend more than $10 in a month. Click Save.

### 1.4 — Get your secret API key

1. In Anthropic Console, click "API Keys" in the left sidebar
2. Click "Create Key"
3. Give it a name like `wander-with-rohan-netlify`
4. **Copy the key immediately** (it starts with `sk-ant-...`). Paste it somewhere safe like a note on your phone. **You won't be able to see it again** — Anthropic only shows it once.

---

## Part 2 — Upload code to GitHub (10 minutes)

You have a folder called `wander-with-rohan` with all the project files. Now we put it on GitHub.

### 2.1 — Create a new GitHub repository

1. Go to **github.com**
2. Click the **"+"** button in the top right → **"New repository"**
3. Repository name: `wander-with-rohan`
4. Set it to **Public** (Private also works, but Public is simpler)
5. **Do NOT** check "Add a README" or anything else. Leave all options unchecked.
6. Click **"Create repository"**

### 2.2 — Upload your files

After creating the repo, you'll see a mostly empty page with a link that says:

> "uploading an existing file"

1. Click that link
2. **Open your `wander-with-rohan` folder on your computer** in a separate window
3. Select ALL files and folders inside (Cmd+A on Mac, Ctrl+A on Windows). Make sure you select everything: `src/`, `netlify/`, `public/`, `index.html`, `package.json`, etc.
4. **Drag them ALL onto the GitHub upload page**
5. Wait for the upload to finish (you'll see a list of uploaded files)
6. Scroll down. In the "Commit changes" box, type a message: `Initial upload`
7. Click **"Commit changes"** (green button)

Your code is now on GitHub.

---

## Part 3 — Deploy to Netlify (10 minutes)

### 3.1 — Connect Netlify to your GitHub repo

1. Go to **netlify.com** (the tab you left open)
2. Click **"Add new site"** → **"Import an existing project"**
3. Click **"Deploy with GitHub"**
4. If it asks you to authorize Netlify on GitHub, click "Authorize" and select "Only select repositories" → choose `wander-with-rohan`
5. You'll see a list of your GitHub repos. Click **`wander-with-rohan`**

### 3.2 — Configure the build

Netlify will auto-detect the settings, but verify they look like this:

- **Branch to deploy:** `main` (already set)
- **Build command:** `npm run build` (already set)
- **Publish directory:** `dist` (already set)

If anything is missing, type it in. Then click **"Deploy"**.

### 3.3 — Add your API key as a secret

This is the most important step. Without it, the AI generator won't work.

1. After the first deploy completes (may show "Failed" or "Success" — doesn't matter yet), click **"Site configuration"** in the left sidebar
2. Click **"Environment variables"**
3. Click **"Add a variable"** → **"Add a single variable"**
4. **Key:** `ANTHROPIC_API_KEY`
5. **Value:** paste your API key from Anthropic (the `sk-ant-...` thing you saved earlier)
6. Click **"Create variable"**

### 3.4 — Redeploy with the key

1. Click **"Deploys"** in the left sidebar
2. Click **"Trigger deploy"** (top right) → **"Deploy site"**
3. Wait ~2-3 minutes for the build to finish
4. Once you see a green ✓ "Published", click the URL at the top (something like `https://random-words-1234.netlify.app`)

**Your site is live.**

---

## Part 4 — Test it (5 minutes)

1. Open the URL in your browser
2. Try generating a Vietnam itinerary from Hyderabad, 7 days, Balanced
3. Try the savings tracker — set a goal, log savings, download calendar
4. Click your WhatsApp links

If any step fails, see "Troubleshooting" below.

---

## Part 5 — Rename your URL (2 minutes, optional)

Netlify gives you a random URL by default. You can change it for free:

1. In Netlify, go to **"Site configuration"** → **"General"** → **"Site details"**
2. Click **"Change site name"**
3. Type: `wander-with-rohan` (or whatever's available)
4. Save

Your new URL is `https://wander-with-rohan.netlify.app`

---

## Part 6 — Share with friends (1 minute)

1. Copy your URL
2. Send it via WhatsApp/text: "Hey, I built a travel site. Try it and let me know what you think: [URL]"
3. Done.

---

## Troubleshooting

### "The build failed"
- Click on the failed build to see the error log
- Most common cause: a typo or missing file. Re-check that ALL files from the folder were uploaded to GitHub.

### "Itinerary generation fails / shows an error"
- Check that you added `ANTHROPIC_API_KEY` to Environment Variables (Part 3.3)
- Check Anthropic Console → Billing → confirm you have credits left
- After adding the key, you must trigger a redeploy (Part 3.4)

### "The site loads but looks broken"
- Wait 2 minutes for the deploy to fully complete
- Hard refresh: Ctrl+Shift+R (Windows) or Cmd+Shift+R (Mac)

### "I'm scared I'll get charged a lot"
- You set a $10/month spending cap in Anthropic billing (Part 1.3 step 6). They CANNOT charge you more than that.
- Each itinerary costs ~₹0.50-₹1. You'd need to generate 1000+ itineraries to hit the cap.

---

## When you make changes later

To update the site (change copy, add destinations, etc.):

1. Edit the file on GitHub directly (click any file → click the pencil icon → edit → "Commit changes")
2. Netlify auto-detects the change and deploys within 2 minutes
3. Refresh your site URL to see updates

No commands needed. Pure web interface.

---

## What to do if something feels stuck

Tell your CTO (me) exactly:
1. What step you're on
2. What you see on screen
3. Any error message

We'll fix it in one round.
