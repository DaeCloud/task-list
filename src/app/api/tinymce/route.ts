export async function GET() {
  return new Response(process.env.NEXT_PUBLIC_TINYMCE_API_KEY || "", {
    status: 200,
  });
}