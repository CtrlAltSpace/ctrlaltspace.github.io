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
 
**bold with asterisks** and __bold with underscores__
 
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
 
[Inline link](https://www.anthropic.com)
 
[Link with title](https://www.anthropic.com "Anthropic's homepage")
 
[Reference-style link][ref1]
 
[ref1]: https://www.anthropic.com "Reference link title"
 
<https://www.anthropic.com> (bare autolink)
 
<hello@example.com> (autolinked email)
 
[Relative link to another file](./other-file.md)
 
[Link to a heading in this doc](#text-emphasis)
 
---
 
## Images
 
![Alt text for an image](https://placekitten.com/300/200)
 
![Alt text with title](https://placekitten.com/300/200 "A kitten, obviously")
 
[![Clickable image](https://placekitten.com/100/100)](https://www.anthropic.com)
 
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
 
## Mentions and Issue References (GitHub-flavored, platform-specific)
 
@username (mentions a user on platforms that support it)
 
#123 (references issue/PR #123 on platforms that support it)
 
---
 
## Comments (hidden in rendered output)
 
[//]: # (This is a comment and won't be visible in rendered markdown)
 
<!-- This is an HTML-style comment, also hidden on render -->
 
---
 
*End of the markdown showcase — basically every syntax element you'll run into, from CommonMark core to GitHub Flavored Markdown (GFM) extensions.*