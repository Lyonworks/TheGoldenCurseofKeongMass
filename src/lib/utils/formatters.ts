export function formatDate(dateString: string, format: "full" | "short" = "short"): string {
  const date = new Date(dateString);

  if (format === "short") {
    return date.toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  }

  return date.toLocaleDateString("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
}

export function formatCurrency(amount: number): string {
  return new Intl.NumberFormat("id-ID", {
    style: "currency",
    currency: "IDR",
    minimumFractionDigits: 0,
  }).format(amount);
}

export function truncateText(text: string, length: number): string {
  if (text.length <= length) return text;
  return text.slice(0, length) + "...";
}

export function stripHtmlTags(html: string): string {
  const div = document.createElement("div");
  div.innerHTML = html;
  return div.textContent || div.innerText || "";
}

/**
 * Resolve an image column to a usable `src`.
 *
 * Images uploaded through the admin panel go to Supabase Storage and are stored
 * as absolute URLs. Rows carried over from the PHP site hold a bare filename
 * relative to /assets/img, so a plain prefix would break them. Absolute values
 * pass through untouched.
 */
export function imageSrc(path: string | null | undefined, folder = ""): string {
  if (!path) return "";
  if (path.startsWith("http")) return path;
  return `/assets/img/${folder}${path}`;
}
