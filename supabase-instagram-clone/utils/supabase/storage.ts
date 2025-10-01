export function getImageUrl(path: string) {
  const supabaseProjectURl = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const defaultValue = process.env.NEXT_PUBLIC_STORAGE_DEFAULT_VALUE;
  const storage = process.env.NEXT_PUBLIC_STORAGE_BUCKET;
  return `${supabaseProjectURl}/${defaultValue}/${storage}/${path}`;
}
