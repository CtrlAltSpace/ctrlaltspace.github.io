<?xml version="1.0" encoding="UTF-8"?>
<xsl:stylesheet
  version="1.0"
  xmlns:xsl="http://www.w3.org/1999/XSL/Transform"
  xmlns:sitemap="http://www.sitemaps.org/schemas/sitemap/0.9"
>
  <xsl:output method="html" encoding="UTF-8" indent="yes" />

  <xsl:template match="/">
    <html lang="en">
      <head>
        <meta charset="UTF-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
        <title>Sitemap | CtrlAltSpace Productions</title>
        <style>
          :root {
            color-scheme: dark;
            --bg: #07111f;
            --panel: rgba(10, 21, 38, 0.84);
            --border: rgba(255, 255, 255, 0.16);
            --text: #f5f7fb;
            --muted: #9fb0c7;
            --accent: #6ee7ff;
          }

          * {
            box-sizing: border-box;
          }

          body {
            margin: 0;
            font-family: Inter, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif;
            color: var(--text);
            background:
              radial-gradient(circle at top left, rgba(132, 106, 38, 0.45), transparent 30%),
              linear-gradient(135deg, #06101d 0%, #091424 100%);
            line-height: 1.6;
            min-height: 100vh;
          }

          main {
            width: min(1100px, calc(100% - 2rem));
            margin: 0 auto;
            padding: 4rem 0;
          }

          h1 {
            margin: 0;
            font-size: clamp(2.4rem, 5vw, 4rem);
            line-height: 1.05;
          }

          p {
            color: var(--muted);
            margin: 0.9rem 0 2rem;
          }

          a {
            color: var(--accent);
            overflow-wrap: anywhere;
          }

          table {
            width: 100%;
            border-collapse: collapse;
            overflow: hidden;
            border: 1px solid var(--border);
            border-radius: 18px;
            background: var(--panel);
            box-shadow: 0 20px 60px rgba(0, 0, 0, 0.26);
          }

          th,
          td {
            padding: 0.9rem 1rem;
            text-align: left;
            border-bottom: 1px solid var(--border);
            vertical-align: top;
          }

          th {
            color: var(--text);
            font-size: 0.82rem;
            letter-spacing: 0.08em;
            text-transform: uppercase;
          }

          td {
            color: var(--muted);
          }

          tr:last-child td {
            border-bottom: 0;
          }

          .count {
            color: var(--accent);
            font-weight: 700;
          }

          @media (max-width: 720px) {
            table,
            thead,
            tbody,
            tr,
            th,
            td {
              display: block;
            }

            thead {
              display: none;
            }

            tr {
              border-bottom: 1px solid var(--border);
              padding: 0.8rem 0;
            }

            tr:last-child {
              border-bottom: 0;
            }

            td {
              border-bottom: 0;
              padding: 0.35rem 1rem;
            }

            td::before {
              content: attr(data-label);
              display: block;
              color: var(--text);
              font-size: 0.72rem;
              font-weight: 700;
              letter-spacing: 0.08em;
              text-transform: uppercase;
            }
          }
        </style>
      </head>
      <body>
        <main>
          <h1>Sitemap</h1>
          <p>
            <span class="count">
              <xsl:value-of select="count(sitemap:urlset/sitemap:url)" />
            </span>
            indexed pages for CtrlAltSpace Productions.
          </p>

          <table>
            <thead>
              <tr>
                <th>URL</th>
                <th>Last Modified</th>
                <th>Change Frequency</th>
                <th>Priority</th>
              </tr>
            </thead>
            <tbody>
              <xsl:for-each select="sitemap:urlset/sitemap:url">
                <tr>
                  <td data-label="URL">
                    <a href="{sitemap:loc}">
                      <xsl:value-of select="sitemap:loc" />
                    </a>
                  </td>
                  <td data-label="Last Modified">
                    <xsl:value-of select="sitemap:lastmod" />
                  </td>
                  <td data-label="Change Frequency">
                    <xsl:value-of select="sitemap:changefreq" />
                  </td>
                  <td data-label="Priority">
                    <xsl:value-of select="sitemap:priority" />
                  </td>
                </tr>
              </xsl:for-each>
            </tbody>
          </table>
        </main>
      </body>
    </html>
  </xsl:template>
</xsl:stylesheet>
