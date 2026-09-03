# H1 — The Biggest Header
## H2 — Still Pretty Big
### H3 — Getting Smaller
#### H4 — Smaller Still
##### H5 — Tiny
###### H6 — Smallest
 
Alt H1
======
 
Alt H2
------
 
---
 
## Text Emphasis
 
*italic with asterisks* and _italic with underscores_
 
**bold with asterisks** (use asterisks for bold — double underscores are repurposed for underline in this pipeline, see the Platform-Specific section)
 
***bold italic*** and **_mixed bold italic_**
 
~~strikethrough~~
 
`inline code`
 
Regular text with a  
line break (two trailing spaces above)
 
You can also ==highlight text== in some flavors (GitHub doesn't support this natively, but many renderers do).
 
Super^script^ and Sub~script~ (extended syntax, not universal).
 
---
 
## Blockquotes
 
> A single-line blockquote.
 
> A multi-line blockquote.
> Second line of the same quote.
>
> A new paragraph inside the quote.
>
>> A nested blockquote inside another.
>>> And nested again.
 
> **Note:** Blockquotes can contain other markdown like *emphasis* or `code`.
 
---
 
## Lists
 
### Unordered
 
- Item one
- Item two
  - Nested item
    - Deeply nested item
- Item three
* Alternate bullet using asterisk
+ Alternate bullet using plus
### Ordered
 
1. First item
2. Second item
   1. Nested ordered item
   2. Another nested item
3. Third item
### Task Lists (GFM)
 
- [x] Completed task
- [ ] Incomplete task
- [ ] Another pending task
  - [x] Nested completed subtask
### Definition Lists (extended syntax)
 
Term 1
: Definition of term 1
 
Term 2
: Definition A
: Definition B
 
---
 
## Links
 
[Inline link](https://www.google.com)
 
[Link with title](https://www.google.com "Google's homepage")
 
[Reference-style link][ref1]
 
[ref1]: https://www.google.com "Reference link title"
 
<https://www.google.com> (bare autolink)
 
<hello@example.com> (autolinked email)
 
[Relative link to another file](./other-file.md)
 
[Link to a heading in this doc](#text-emphasis)
 
---
 
## Images
 
![Alt text for an image](https://placekitten.com/300/200)
 
![Alt text with title](https://placekitten.com/300/200 "A kitten, obviously")
 
[![Clickable image](https://placekitten.com/100/100)](https://www.google.com)
 
Reference-style image:
 
![Alt text][img1]
 
[img1]: https://placekitten.com/200/200 "Reference image title"
 
---
 
## Code
 
Inline: use `code spans` like `this` for short snippets.
 
Indented code block (4 spaces):
 
    def hello():
        print("indented code block")
 
Fenced code block, no language:
 
```
plain fenced code block
no syntax highlighting
```
 
Fenced code block with language (syntax highlighting):
 
```python
def fibonacci(n):
    a, b = 0, 1
    for _ in range(n):
        a, b = b, a + b
    return a
```
 
```javascript
const greet = (name) => `Hello, ${name}!`;
console.log(greet("world"));
```
 
Fenced with tildes instead of backticks:
 
~~~
tilde-fenced code block
~~~
 
---
 
## Tables (GFM)
 
| Left aligned | Center aligned | Right aligned |
|:-------------|:--------------:|--------------:|
| a            | b              | c             |
| longer cell  | x              | 1             |
| short        | yy             | 22            |
 
Simple table without alignment colons:
 
| Header 1 | Header 2 |
| -------- | -------- |
| Cell 1   | Cell 2   |
| Cell 3   | Cell 4   |
 
Table with inline formatting:
 
| Name | Notes |
|------|-------|
| **Bold** | *italic* and `code` |
| [Link](https://example.com) | ~~strike~~ |
 
---
 
## Horizontal Rules
 
Three or more of these, on their own line, all create a horizontal rule:
 
---
***
___
 
---
 
## Footnotes (extended syntax)
 
Here's a sentence with a footnote.[^1]
 
Here's another with a named footnote.[^note]
 
[^1]: This is the first footnote's content.
[^note]: Named footnotes work too, and can contain multiple lines.
    Indented continuation line stays part of the footnote.
 
---
 
## Escaping Characters
 
Use a backslash to escape special characters: \*not italic\*, \# not a header, \[not a link\].
 
Literal backtick inside code span: `` `backtick` ``
 
---
 
## HTML in Markdown
 
Most markdown renderers (including GitHub) allow raw HTML:
 
<div align="center">
  <strong>Centered bold text via raw HTML</strong>
</div>
<details>
<summary>Click to expand a collapsible section</summary>
Hidden content revealed on click — handy for FAQs or spoilers.
 
</details>
<kbd>Ctrl</kbd> + <kbd>C</kbd> (keyboard key styling, HTML-based)
 
<sub>subscript via HTML</sub> and <sup>superscript via HTML</sup>
 
---
 
## Emoji (GFM shorthand, renderer-dependent)
 
:tada: :rocket: :warning: :white_check_mark:
 
---
 
## Math (extended syntax, e.g. via KaTeX/MathJax — not in base Markdown)
 
Inline math: $E = mc^2$
 
Block math:
 
$$
\int_{a}^{b} f(x)\,dx = F(b) - F(a)
$$
 
---
 
## Comments (hidden in rendered output)
 
[//]: # (This is a comment and won't be visible in rendered markdown)
 
<!-- This is an HTML-style comment, also hidden on render -->
 
---
 
## Custom syntax
 
These aren't part of CommonMark or GFM — they're custom made.
 
### Subtext (Discord-style)
 
-# This renders as small, muted gray text in Discord.
-# Handy for footnotes, timestamps, or de-emphasized asides.
 
### Underline (Discord-style)
 
__This text is underlined__ (this pipeline treats double underscores as underline, not bold — heads up if you ever copy content from a standard CommonMark/GFM source, since there it means bold instead).
 
### Callout / Admonition Boxes
 
:::note
This is a note callout — good for extra context or a side comment that isn't critical to follow the main text.
:::
 
:::warning
This is a warning callout — use it to flag something risky, a gotcha, or a common mistake.
:::
 
:::tip
This is a tip callout — good for optional advice, shortcuts, or "here's a faster way to do this."
:::
 
### YouTube Embeds
 
{{youtube: dQw4w9WgXcQ}}
 
A custom parser would detect this pattern and expand it into an `<iframe>` pointing at the YouTube embed URL for that video ID.
 
### Smart Typography
 
Straight quotes "like this" become curly quotes "like this" when smart typography is on.
 
Double hyphens -- become an en-dash, and triple hyphens --- become an em-dash.
 
Apostrophes in contractions like don't or it's get curled automatically too.
 
---
 
*End of the markdown showcase — basically every syntax element you'll run into, from CommonMark core to GitHub Flavored Markdown (GFM) extensions, plus the custom stuff platforms and blog pipelines bolt on top.*

-# This test file is made by Claude AI.