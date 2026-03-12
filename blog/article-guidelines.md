# Precision — Article Page Guidelines

## Overview

Every article is a WordPress **Post** (not a Page) built in Bricks Builder using two per-article code blocks. Three shared sections (Newsletter, Related Articles, CTA) are injected automatically via Bricks Section Templates — no action needed when creating new articles.

---

## Page Structure (top to bottom)

| Order | Section | Type | File |
|-------|---------|------|------|
| 1 | Header | Global Bricks Template | — |
| 2 | Article Hero | Per-article Code Block | `section-article-hero.html` |
| 3 | Article Body | Per-article Code Block | `section-article-body--[slug].html` |
| 4 | Newsletter CTA | Global Bricks Template (priority 10) | `section-blog-newsletter.html` |
| 5 | Related Articles | Global Bricks Template (priority 20) | `section-article-related.html` |
| 6 | Book a Call CTA | Global Bricks Template (priority 30) | `section-article-cta.html` |
| 7 | Footer | Global Bricks Template | — |

---

## Creating a New Article — Step by Step

### 1. Create the WordPress Post
- Go to **WordPress Admin → Posts → Add New**
- Set the **title**, **slug**, **category**, and **publish date**
- Assign a **category** using one of the approved slugs (see Categories below)
- **Add a manual Excerpt** (Post sidebar → Excerpt): 1-2 sentence summary of the article. This is used on the blog listing page cards. If Excerpt panel is not visible, enable it via the three-dot menu → Preferences → Panels.
- Fill in **Yoast meta title** and **meta description** for SEO
- Click **Edit with Bricks**

### 2. Add Code Block 1 — Article Hero
- Add a **Code** element
- Enable **Execute code** and **Render without wrapper**
- Paste the contents of `section-article-hero.html`
- Edit the following per article:
  - Category class: `art-cat-tag--[slug]` and label text
  - `<h1>` title text
  - Read time (e.g. `10 min read`)
  - Date (e.g. `March 10, 2026`)

### 3. Add Code Block 2 — Article Body
- Add a second **Code** element below the hero
- Enable **Execute code** and **Render without wrapper**
- Use the existing article body file as a template
- Name the new file: `section-article-body--[article-slug].html`
- Edit all article-specific content (copy, images, headings)
- Keep all CSS classes unchanged — the design system is consistent across all articles

### 4. Publish
- Save and publish the post
- The three global templates (Newsletter, Related Articles, CTA) apply automatically
- Clear Bricks cache: **Bricks → Settings → Regenerate CSS files**
- Clear server cache (GoDaddy dashboard)

---

## Categories

Use these exact slugs in both the WordPress category and the hero code block class.

| Category | Slug | Hero class | Colour |
|----------|------|-----------|--------|
| CRO | `cro` | `art-cat-tag--cro` | `#00BFFF` cyan |
| E-Commerce | `e-commerce` | `art-cat-tag--e-commerce` | `#A78BFA` purple |
| AOV | `aov` | `art-cat-tag--aov` | `#FCD34D` yellow |
| UI/UX | `ui-ux` | `art-cat-tag--ui-ux` | `#F472B6` pink |
| Product Psychology | `product-psychology` | `art-cat-tag--product-psychology` | `#C084FC` violet |
| Experimentation | `experimentation` | `art-cat-tag--experimentation` | `#4ADE80` green |

The same slug drives the tag colour in the Related Articles section automatically.

---

## Article Body — Content Components

All components are CSS classes defined in the article body file. Copy the HTML pattern from the reference article.

### Typography

| Element | Class | Usage |
|---------|-------|-------|
| Body paragraph | `.art-p` | All running copy |
| Section heading | `.art-h2` | Major sections (numbered or named) |
| Sub-heading | `.art-h3` | Sub-sections within a major section |
| Cyan highlight | `.art-cyan` | Key metrics, stats (cyan `#06B6D4`) |
| Amber highlight | `.art-amber` | Key metrics, stats (gold `#FFD166`) |

### Callout Boxes

| Component | Class | Icon | Usage |
|-----------|-------|------|-------|
| Stat / intro callout | `.art-callout` | Custom per article | Opening stat or key claim |
| Psychology callout | `.art-psych` | 🧠 (auto) | Explain the behavioural principle |
| Fix box | `.art-fix` | 💡 (auto) | Actionable recommendation |
| Blockquote | `.art-quote` | — | Pull quote or strong statement |
| Revenue math box | `.art-math-box` | — | Financial calculations or data tables |

### Lists

| Component | Class | Usage |
|-----------|-------|-------|
| Unordered list | `.art-ul` | General bullet points |
| Ordered list | `.art-ol` | Numbered steps |
| Reason list | `.art-reason-list` | Arrow-prefixed items (▸) with stat callouts |
| Conditional list | `.art-cond-list` | "If [condition]" action items |
| Key takeaways | `.art-takeaways` | Checkmark (✓) summary list |

### Section Divider

```html
<div class="art-divider" aria-hidden="true"></div>
```

Use between every major section. Also use before Key Takeaways, FAQ, and Author box.

### Images

```html
<figure class="art-img-wrap">
  <img src="https://goprecision.co/wp-content/uploads/[year]/[month]/[filename].svg"
       alt="[descriptive alt text]"
       loading="lazy"/>
</figure>
<p class="art-img-caption">[Caption text.]</p>
```

**Image guidelines:**
- Format: **SVG preferred** (scales perfectly at any width)
- Upload to: WordPress Media Library → note the exact URL
- Alt text: always descriptive, describe the chart/infographic content
- Caption: one sentence, ends with a period
- Tap-to-zoom lightbox is built in — no extra setup needed
- Images auto-trim empty SVG whitespace via JavaScript — no manual cropping needed

### FAQ Section

```html
<div class="art-faq">
  <div class="art-faq-item">
    <p class="art-faq-q">Question here?</p>
    <p class="art-faq-a">Answer here.</p>
  </div>
</div>
```

Aim for 3–5 questions targeting common search queries related to the article topic.

### Author Box

```html
<div class="art-author">
  <p class="art-author-name">Ammarah Ahmed</p>
  <p class="art-author-role">Founder, Precision Consulting Group</p>
  <p class="art-author-bio">...</p>
</div>
```

This is identical on every article — copy as-is from the reference file.

---

## Article Body — Recommended Section Order

1. **Intro paragraphs** (2–4 × `.art-p`) — hook, stat, problem, Precision proof point
2. **Opening image** (`.art-img-wrap` + `.art-img-caption`) — main infographic
3. `<div class="art-divider">`
4. **Numbered sections** — repeat this pattern per point:
   - `.art-h2` heading
   - `.art-p` paragraphs
   - `.art-psych` callout (behavioural principle)
   - `.art-fix` callout (actionable recommendation)
   - Optional: image after fix box
   - `<div class="art-divider">`
5. **The Real Cost / Data section** — `.art-math-box` with revenue calculations
6. Final image (ROI or summary infographic)
7. `<div class="art-divider">`
8. **What to Do Next** — `.art-cond-list` items
9. `.art-outro` — italic closing paragraph with Calendly link
10. `<div class="art-divider">`
11. **Key Takeaways** — `.art-takeaways` list (5 items)
12. `<div class="art-divider">`
13. **FAQ** — `.art-faq` (3–5 items)
14. `<div class="art-divider">`
15. **Author box** — `.art-author`

---

## Writing Guidelines

- **No em dashes** — use commas or restructure the sentence instead
- **No contractions** — write "do not" not "don't", "we have" not "we've"
- **Sentence case** for headings — "Your product pages are not doing their job" not "Your Product Pages Are Not Doing Their Job"
- **Amber highlights** for statistics and data points
- **Cyan highlights** for Precision-specific results (e.g. "+35% AOV")
- Every major section should have one `.art-psych` and one `.art-fix` callout
- Aim for 1,500–2,500 words of body copy
- Read time = word count ÷ 200, rounded up to nearest minute

---

## Global Templates (automatic — do not add manually)

These are Bricks Section Templates set to `Post type = Post`. They render via the `bricks_before_footer` hook in this order:

| Template | Bricks ID | Priority | Purpose |
|----------|-----------|----------|---------|
| Article — Newsletter | 601 | 10 | Email signup, first below body |
| Article — Related | 596 | 20 | 3 auto-queried posts, same category |
| Article — CTA | 589 | 30 | Book a Call, just above footer |

**Never add these as code blocks on individual article pages.**

---

## Files Reference

| File | Purpose |
|------|---------|
| `section-article-hero.html` | Hero template — edit per article |
| `section-article-body--why-ecommerce-store-gets-traffic-but-no-sales.html` | Reference article body — copy as starting point |
| `section-article-cta.html` | Global CTA template (do not edit per article) |
| `section-article-related.html` | Dynamic related posts — PHP query loop (do not edit per article) |
| `section-blog-newsletter.html` | Newsletter signup (do not edit per article) |

---

## Checklist for Every New Article

- [ ] Created as WordPress **Post** (not Page)
- [ ] Category assigned using approved slug
- [ ] Slug set to match intended URL
- [ ] Hero code block: category class, title, read time, date updated
- [ ] Body code block: all content updated, image URLs correct
- [ ] Both code blocks have **Execute code** and **Render without wrapper** ON
- [ ] Post published
- [ ] Bricks CSS regenerated
- [ ] Server cache cleared
- [ ] Live URL checked — all 3 global templates visible
- [ ] Article added to repo: `blog/section-article-body--[slug].html`
