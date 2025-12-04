import nodeHtmlToImage from 'node-html-to-image';

export async function POST(request: Request) {
  const { input_html } = await request.json();

  const html = `
    <html>
      <head>
        <script src="https://cdn.tailwindcss.com"></script>
        <style>
          .prose ul {
            list-style-type: disc;
            padding-left: 1.5em;
          }
        </style>
      </head>
      <body class="bg-white">
        ${input_html}
      </body>
    </html>
  `;

  const buffer = await nodeHtmlToImage({
    html,
    type: 'png',
  }) as Buffer;

  // Convert Node Buffer → Web Uint8Array
  const uint8 = new Uint8Array(buffer);

  return new Response(uint8, {
    status: 200,
    headers: {
      'Content-Type': 'image/png',
      'Content-Disposition': 'inline; filename="generated.png"',
    },
  });
}
