"""Static site generator. Run: python3 build.py   (optional: SITE_URL=https://yourdomain.com)"""
import os, json, shutil, html
SITE = os.environ.get("SITE_URL", "https://movingbuddy.example").rstrip("/")
OUT = "public"
NAV = [("box-calculator.html","Boxes"),("moving-volume-calculator.html","Volume"),("truck-size-calculator.html","Truck"),("moving-checklist.html","Checklist"),("moving-cost-calculator.html","Costs")]
ICON = '<svg width="26" height="26" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"%s>%s</svg>'
IC = {"box":'<path d="M21 8 12 3 3 8v8l9 5 9-5z"/><path d="m3 8 9 5 9-5M12 13v8"/>',
      "vol":'<path d="M3 3v18h18"/><path d="M7 14l4-4 3 3 5-6"/>',
      "truck":'<path d="M1 6h13v10H1zM14 9h4l4 4v3h-8z"/><circle cx="6" cy="18" r="2"/><circle cx="18" cy="18" r="2"/>',
      "list":'<path d="m4 6 2 2 3-3M4 14l2 2 3-3M13 7h8M13 15h8"/>',
      "cost":'<circle cx="12" cy="12" r="9"/><path d="M15 9.5C14 8 10 8 10 10.5c0 3 5 1.5 5 4.5-.5 2.500-4.500 2.500-6 .5M12 6v2M12 16v2"/>'}
def ic(k, extra=""): return ICON % (extra, IC[k])

TOOLS = [
 dict(slug="box-calculator.html", key="box", mode="box", name="Moving Box Calculator",
  h1="Moving Box Calculator: how many boxes do you need?",
  desc="Estimate how many small, medium, large and wardrobe boxes you need to move, plus tape, paper and bubble wrap. Free, no sign-up.",
  short="Estimate small, medium, large and wardrobe boxes plus packing materials.",
  intro="Tell us about your home and what you own, and MovingBuddy estimates the boxes and packing materials for your move. Every number is editable, so you can adjust it to your real belongings.",
  body="""<h2>How the estimate works</h2><p>Each belongings category (clothes, books, kitchen items and so on) starts with a base number of boxes that grows with the number of people, bedrooms and floor area. That number is then multiplied by your amount of belongings: 0.75 for minimalist, 1 for average and 1.3 for a lot. Each category is split across box sizes using a fixed mix, for example books mostly go in small boxes because they are heavy, while bedding goes mostly in large ones.</p><h2>Choosing box sizes</h2><p>Small boxes suit books, tins and anything dense. Medium boxes are the all-rounder for kitchenware, electronics and decorations. Large boxes are for light, bulky things such as pillows and duvets. Wardrobe boxes let you move hanging clothes without folding them.</p><h2>Packing tips</h2><ul><li>Keep each box under about 15 kg so it can be lifted safely.</li><li>Label every box with its room and a short description.</li><li>Pack a separate essentials box for your first night.</li><li>Order about 10% extra boxes. Running out on packing day is the most common problem.</li></ul><p>Assumptions: a roll of tape for about 12 boxes, 0.3 kg of packing paper and 1.5 m of bubble wrap per box. These are rules of thumb, not measurements.</p>""",
  faq=[("How many boxes does a two-bedroom home need?","With two people and an average amount of belongings, this calculator typically gives roughly 50 boxes. Your own result depends on what you own, so adjust the quantities."),("Should I buy or borrow boxes?","Borrowing or reusing saves money, but new boxes are stronger and uniform in size, which makes them easier to stack and load."),("Are the results exact?","No. They are estimates based on documented rules of thumb. Use the editable quantities to match your belongings.")]),
 dict(slug="moving-volume-calculator.html", key="vol", mode="vol", name="Moving Volume Calculator",
  h1="Moving Volume Calculator: how many cubic meters are you moving?",
  desc="Add your furniture and appliances to estimate the total volume of your move in cubic meters, with a packing allowance and category breakdown.",
  short="Add furniture and appliances to estimate your total volume in m³.",
  intro="Volume decides which vehicle you need and how long loading takes. Pick your furniture and appliances, add anything unusual with its dimensions, and see your total in cubic meters.",
  body="""<h2>What the numbers mean</h2><p>Each item has a typical volume in cubic meters (m³), based on common sizes and including the space it takes up when loaded. A double bed, for example, is counted at 2 m³ because the frame, slats and mattress rarely stack tightly. Your actual furniture may be larger or smaller, which is why you can add custom items using length, width and height in centimetres. The formula is length × width × height ÷ 1,000,000.</p><h2>The packing allowance</h2><p>Items never fit together perfectly. The allowance adds a percentage (15% by default) to cover gaps, awkward shapes and padding. Increase it for lots of fragile or irregular items, or reduce it if you will load carefully.</p><h2>Using your result</h2><p>As a rough guide, a studio is often a few cubic meters and a family home is often several times that, but there is no substitute for counting your own items. Once you have a total, the <a href="truck-size-calculator.html">Truck Size Calculator</a> uses it automatically.</p>""",
  faq=[("Does the volume include boxes?","Yes, if you enter a quantity for Boxes. If you used the Box Calculator first you can copy that number across with one click."),("What allowance should I use?","15% suits most moves. Use 20-25% for many awkward items and 5-10% for neatly stackable loads."),("How do I add an item that is not listed?","Use the custom item form with its dimensions and quantity.")]),
 dict(slug="truck-size-calculator.html", key="truck", mode="truck", name="Moving Truck Size Calculator",
  h1="Moving Truck Size Calculator: which van or truck do you need?",
  desc="Find out whether a small van, large van, Luton van or moving truck fits your load, and how many trips you may need. Free estimate.",
  short="Match your volume to a van or truck and see how many trips you need.",
  intro="Enter your volume, or use the one saved from the Volume Calculator, and compare typical vehicle sizes. Capacities are editable reference values so you can match the vehicle you are actually renting.",
  body="""<h2>How the recommendation is made</h2><p>Each vehicle has a reference cargo volume. Because nobody loads a van perfectly, the calculator multiplies it by a loading efficiency (85% by default) to get usable volume. Trips are your volume divided by usable volume, rounded up. The smallest vehicle that moves everything in one trip is recommended; if none can, the one needing the fewest trips is shown.</p><h2>Things volume does not tell you</h2><ul><li><b>Item length and height.</b> A long sofa or tall wardrobe may need a vehicle with a taller or longer load area.</li><li><b>Payload.</b> Appliances and books are heavy. Check the vehicle's maximum load.</li><li><b>Licence rules.</b> Larger vehicles may need a different driving licence category. Check the rental company and your local rules.</li><li><b>Access.</b> Narrow streets, low bridges and parking restrictions can rule out a larger vehicle.</li></ul><p>The default capacities (3.5, 7, 11, 20 and 35 m³) are generic estimates, not manufacturer specifications. Always confirm dimensions with the rental provider.</p>""",
  faq=[("Is it better to make two trips with a smaller van?","It can be cheaper, but add the extra time, fuel and helper hours. For long distances one larger vehicle is often simpler."),("Why is my result more than one trip?","Your volume exceeds the usable volume of the largest vehicle you entered. Increase efficiency only if you can load very tightly."),("Are the vehicle sizes exact?","No. They are editable reference values.")]),
 dict(slug="moving-checklist.html", key="list", mode="list", name="Moving Checklist",
  h1="Moving Checklist: a week-by-week plan for your move",
  desc="A free interactive moving checklist with due dates based on your moving date. Tick tasks off, add your own and print it.",
  short="Dated week-by-week tasks with progress tracking and printing.",
  intro="Choose your moving date and get a checklist split into 8 weeks before, 4 weeks, 2 weeks, 1 week, moving day and after the move. Your progress is saved automatically in this browser.",
  body="""<h2>Why plan in stages</h2><p>Most moving stress comes from tasks that were left too late: a van that is fully booked, a utility transfer that takes ten working days, or a landlord notice period you forgot. Working backwards from your moving date puts each job in the window where it is easiest.</p><h2>What each stage is for</h2><ul><li><b>8 weeks:</b> decisions and bookings, such as budget, mover, vehicle and decluttering.</li><li><b>4 weeks:</b> gathering supplies and giving notices.</li><li><b>2 weeks:</b> notifying utilities and changing your address.</li><li><b>1 week:</b> confirmations and the essentials box.</li><li><b>Moving day and after:</b> handover, checks at the new home and settling in.</li></ul><p>Your checks and custom tasks stay on this device only. Clearing your browser data removes them, so print the list if you want a copy.</p>""",
  faq=[("Is my progress saved?","Yes, automatically in your browser's localStorage. It is not sent to a server."),("Can I add my own tasks?","Yes. Type a task, choose a section and press Add task."),("What if I have less than 8 weeks?","Start with the closest stage and work through the earlier ones as quickly as you can. Moving company and utility tasks are the most urgent.")]),
 dict(slug="moving-cost-calculator.html", key="cost", mode="cost", name="Moving Cost Calculator",
  h1="Moving Cost Calculator: estimate what your move will cost",
  desc="Estimate your total moving cost from movers, vehicle rental, packing materials, fuel, storage and extras. Enter your own prices.",
  short="Add your own prices to see a total and cost breakdown.",
  intro="MovingBuddy does not know local prices, so you type in the quotes or estimates you have. The calculator adds them up, works out fuel from distance, and shows where your money goes.",
  body="""<h2>What to include</h2><ul><li><b>Moving company:</b> the quoted price, including labour and insurance.</li><li><b>Rental vehicle:</b> daily rate, mileage charges and any deposit you will not get back.</li><li><b>Packing materials:</b> the Box Calculator gives you quantities to price up.</li><li><b>Storage:</b> monthly cost multiplied by the months you need.</li><li><b>Additional services:</b> cleaning, furniture assembly, disposal, parking permits.</li></ul><h2>How fuel is calculated</h2><p>Fuel = one-way distance × 2 for the return journey × number of trips × consumption per 100 km ÷ 100 × fuel price. Trips come from the Truck Size Calculator when you have used it. If you hire a driver, fuel is normally in the quote, so set distance to zero.</p><p>This is a budgeting aid, not a quotation. Ask each supplier for a written quote and check what is excluded.</p>""",
  faq=[("Why is there no default price?","Prices vary a lot by country, season and distance. Using your own numbers is more honest than guessing."),("Does it include tips or taxes?","Only if you enter them. Use Other expenses for anything not covered."),("Can I change the currency?","Yes, choose €, $ or £ at the top.")])]

def head(title, desc, path, extra=""):
    url = f"{SITE}/{path}" if path != "index.html" else f"{SITE}/"
    return f'''<!doctype html><html lang="en"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><title>{html.escape(title)}</title><meta name="description" content="{html.escape(desc)}"><link rel="canonical" href="{url}"><meta name="theme-color" content="#0b2545"><link rel="icon" href="favicon.svg" type="image/svg+xml"><meta property="og:type" content="website"><meta property="og:site_name" content="MovingBuddy"><meta property="og:title" content="{html.escape(title)}"><meta property="og:description" content="{html.escape(desc)}"><meta property="og:url" content="{url}"><meta name="twitter:card" content="summary"><link rel="stylesheet" href="assets/style.css">{extra}</head><body><a class="skip" href="#main">Skip to content</a>
<header class="top"><div class="wrap"><a class="logo" href="index.html">{ic("box")} MovingBuddy</a><nav aria-label="Main">{"".join(f'<a href="{u}">{t}</a>' for u,t in NAV)}</nav></div></header>'''

def foot():
    L = [("about.html","About Us"),("contact.html","Contact"),("privacy.html","Privacy Policy"),("terms.html","Terms of Use"),("cookies.html","Cookie Policy")]
    return f'''<footer><div class="wrap"><p><b>MovingBuddy</b> — Your move, made simple.</p><p>{"".join(f'<a href="{u}">{t}</a>' for u,t in L)}</p><p class="note" style="color:#b8c7e0">Results are estimates, not quotations or professional advice.</p></div></footer><script src="assets/app.js" defer></script></body></html>'''

def write(name, content):
    open(f"{OUT}/{name}", "w", encoding="utf-8").write(content)

def ld(o): return '<script type="application/ld+json">' + json.dumps(o) + '</script>'
def faqhtml(fq): return "".join(f"<details><summary>{html.escape(q)}</summary><p>{html.escape(a)}</p></details>" for q, a in fq)
def faqld(fq): return {"@context":"https://schema.org","@type":"FAQPage","mainEntity":[{"@type":"Question","name":q,"acceptedAnswer":{"@type":"Answer","text":a}} for q,a in fq]}

shutil.rmtree(OUT, ignore_errors=True); os.makedirs(OUT + "/assets")
shutil.copy("src/style.css", OUT + "/assets/style.css"); shutil.copy("src/app.js", OUT + "/assets/app.js")
write("favicon.svg", '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 64 64"><rect width="64" height="64" rx="14" fill="#0b2545"/><path d="M32 12 14 22v20l18 10 18-10V22z" fill="none" stroke="#e8710a" stroke-width="4" stroke-linejoin="round"/></svg>')
write("_headers", "/assets/*\n  Cache-Control: public, max-age=31536000, immutable\n/*\n  X-Content-Type-Options: nosniff\n  Referrer-Policy: strict-origin-when-cross-origin\n")

HFAQ = [("Is MovingBuddy really free?","Yes. All tools are free and need no account."),("Where is my data stored?","Only in your own browser using localStorage. MovingBuddy has no server database."),("How accurate are the results?","They are estimates based on documented assumptions on each tool's page. Adjust the numbers to match your situation."),("Do the tools work together?","Yes. Your box count feeds the volume calculator, volume feeds the truck calculator, and trips feed the cost calculator.")]
cards = "".join(f'<a class="card" href="{t["slug"]}">{ic(t["key"])}<h3>{t["name"]}</h3><p>{t["short"]}</p></a>' for t in TOOLS)
home = head("MovingBuddy — Free Moving Planner, Box, Volume and Truck Calculators", "Free moving planner: calculate boxes, estimate volume, choose a truck, follow a dated checklist and estimate costs. No sign-up.", "index.html",
  ld({"@context":"https://schema.org","@type":"WebSite","name":"MovingBuddy","url":SITE+"/","description":"Free moving planning tools."}) + ld(faqld(HFAQ)))
home += f'''<main id="main"><section class="hero"><div class="wrap"><h1>Plan Your Move Without the Stress</h1><p>Calculate your moving boxes, estimate your moving volume, choose the right truck and organize your entire move — all for free.</p><a class="btn" href="box-calculator.html">Start Planning My Move</a><a class="btn sec" href="#tools">Explore Free Tools</a></div></section>
<div class="wrap"><div class="cards" id="tools">{cards}</div>
<!-- AD SLOT 1 (after intro): add an AdSense unit here only after approval -->
<section class="prose narrow"><h2>One plan, five tools that share your numbers</h2><p>Most moving calculators answer one question and forget it. MovingBuddy keeps your answers on your device so each tool builds on the last, and you never have to retype anything.</p></section></div>
<section class="alt"><div class="wrap"><h2>How MovingBuddy works</h2><ol class="steps"><li><b>Count what you have.</b> Enter your home and belongings in the box and volume tools.</li><li><b>Pick transport.</b> The truck tool turns your volume into a vehicle and number of trips.</li><li><b>Budget it.</b> Add your quotes and see the total and breakdown.</li><li><b>Follow the checklist.</b> Set your moving date and tick off dated tasks.</li></ol></div></section>
<div class="wrap narrow"><section><h2>Frequently asked questions</h2>{faqhtml(HFAQ)}</section></div></main>'''
write("index.html", home + foot())

for i, t in enumerate(TOOLS):
    nxt = TOOLS[(i + 1) % len(TOOLS)]
    others = "".join(f'<li><a href="{o["slug"]}">{o["name"]}</a></li>' for o in TOOLS if o is not t)
    pg = head(f'{t["name"]} | MovingBuddy', t["desc"], t["slug"],
      ld({"@context":"https://schema.org","@type":"WebApplication","name":t["name"],"url":f'{SITE}/{t["slug"]}',"applicationCategory":"UtilitiesApplication","operatingSystem":"Any","offers":{"@type":"Offer","price":"0","priceCurrency":"USD"}}) + ld(faqld(t["faq"])))
    pg += f'''<main id="main"><div class="wrap narrow"><section><p class="note"><a href="index.html">Home</a> / {t["name"]}</p><h1>{t["h1"]}</h1><p>{t["intro"]}</p><div id="saved"></div>
<!-- AD SLOT 1 (below introduction) -->
<div data-tool="{t["mode"]}"><noscript>This tool needs JavaScript enabled.</noscript></div>
<!-- AD SLOT 2 (below results, never inside controls) -->
</section><section class="prose">{t["body"]}</section>
<!-- AD SLOT 3 (between guide and FAQ) -->
<section><h2>Frequently asked questions</h2>{faqhtml(t["faq"])}</section>
<section><p><a class="btn" href="{nxt["slug"]}">Next: {nxt["name"]}</a></p><h2>More free tools</h2><ul>{others}</ul></section></div></main>'''
    write(t["slug"], pg + foot())

PH = "[YOUR NAME OR COMPANY]"
LEGAL = {
 "about.html": ("About MovingBuddy", "Learn what MovingBuddy is and how its tools work.", f"<p>MovingBuddy is a free set of tools for planning a house or apartment move: box, volume, truck, checklist and cost calculators that work together. Our aim is simple: make your move easier to plan.</p><p>All results are estimates built on assumptions we document on each tool page. They are not quotations or professional advice.</p><p>MovingBuddy is operated by {PH}. <em>Edit this page with your real details.</em></p>"),
 "contact.html": ("Contact", "How to contact MovingBuddy.", "<p>Questions, corrections or feedback are welcome.</p><p>Email: <strong>[YOUR EMAIL ADDRESS]</strong></p><p>Postal address: <strong>[YOUR ADDRESS IF REQUIRED]</strong></p><p><em>Replace these placeholders before launch. This site has no contact form because it has no backend.</em></p>"),
 "privacy.html": ("Privacy Policy", "How MovingBuddy handles your data.", f"<p><em>Draft template. Have it reviewed against the laws that apply to you before relying on it.</em></p><h2>Who we are</h2><p>Controller: {PH}, [ADDRESS], [EMAIL].</p><h2>What we collect</h2><p>The tools run in your browser. Numbers you enter are saved in your browser's localStorage so you can come back later. They are not sent to our servers.</p><h2>Hosting and logs</h2><p>The site is hosted on [HOSTING PROVIDER, e.g. Cloudflare Pages], which may process technical data such as IP addresses to deliver the site.</p><h2>Advertising and analytics</h2><p>[Update this section if you add Google AdSense or analytics: describe the providers, the data they collect, and how visitors can give or withdraw consent.]</p><h2>Your rights</h2><p>[Describe the rights that apply in your jurisdiction and how to exercise them.]</p><h2>Clearing your data</h2><p>Clear this site's data in your browser settings to remove everything saved locally.</p>"),
 "terms.html": ("Terms of Use", "Terms for using MovingBuddy.", f"<p><em>Draft template. Review before launch.</em></p><p>MovingBuddy is provided free and as is. Results are estimates only and are not quotations, professional, legal or financial advice. You are responsible for decisions you make using them, including vehicle choice and booking. To the extent the law allows, {PH} is not liable for losses arising from use of the tools. We may change or remove the site at any time. [Add governing law and jurisdiction.]</p>"),
 "cookies.html": ("Cookie Policy", "How MovingBuddy uses browser storage.", "<p><em>Draft template. Review before launch.</em></p><p>At present MovingBuddy sets no cookies. It uses your browser's localStorage for two purposes: saving your plan (key <code>mb_state</code>) and remembering that you dismissed the storage notice (key <code>mb_notice</code>). Both are strictly necessary for the features you use.</p><p><strong>Before adding advertising or analytics:</strong> those services may set cookies or similar identifiers. Replace the storage notice with a consent mechanism that meets the rules of the regions you serve, and update this policy and the Privacy Policy. [Describe cookies here once added.]</p>")}
for slug, (t, d, b) in LEGAL.items():
    write(slug, head(f"{t} | MovingBuddy", d, slug) + f'<main id="main"><div class="wrap narrow prose" style="padding-top:2rem"><h1>{t}</h1>{b}</div></main>' + foot())

pages = ["index.html"] + [t["slug"] for t in TOOLS] + list(LEGAL)
write("sitemap.xml", '<?xml version="1.0" encoding="UTF-8"?><urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">' + "".join(f"<url><loc>{SITE}/{'' if p=='index.html' else p}</loc></url>" for p in pages) + "</urlset>")
write("robots.txt", f"User-agent: *\nAllow: /\nSitemap: {SITE}/sitemap.xml\n")
print("built", len(pages), "pages")
