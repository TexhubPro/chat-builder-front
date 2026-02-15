import { useEffect } from "react";

const DEFAULT_OG_IMAGE = "/ceo-image.jpg";

type UsePageSeoInput = {
  title: string;
  description: string;
  locale?: string;
  image?: string;
};

function upsertMeta(
  selector: string,
  attributeName: "name" | "property",
  attributeValue: string,
  content: string,
): void {
  const head = document.head;
  let tag = head.querySelector<HTMLMetaElement>(selector);

  if (!tag) {
    tag = document.createElement("meta");
    tag.setAttribute(attributeName, attributeValue);
    head.appendChild(tag);
  }

  tag.setAttribute("content", content);
}

function upsertCanonical(href: string): void {
  const head = document.head;
  let link = head.querySelector<HTMLLinkElement>('link[rel="canonical"]');

  if (!link) {
    link = document.createElement("link");
    link.setAttribute("rel", "canonical");
    head.appendChild(link);
  }

  link.setAttribute("href", href);
}

function toAbsoluteUrl(pathOrUrl: string): string {
  if (/^https?:\/\//i.test(pathOrUrl)) {
    return pathOrUrl;
  }

  return `${window.location.origin}${pathOrUrl.startsWith("/") ? "" : "/"}${pathOrUrl}`;
}

export function usePageSeo({
  title,
  description,
  locale,
  image = DEFAULT_OG_IMAGE,
}: UsePageSeoInput): void {
  useEffect(() => {
    document.title = title;

    if (locale) {
      document.documentElement.setAttribute("lang", locale);
    }

    const absoluteImage = toAbsoluteUrl(image);
    const canonicalUrl = window.location.href;

    upsertMeta('meta[name="description"]', "name", "description", description);
    upsertMeta('meta[property="og:type"]', "property", "og:type", "website");
    upsertMeta('meta[property="og:title"]', "property", "og:title", title);
    upsertMeta(
      'meta[property="og:description"]',
      "property",
      "og:description",
      description,
    );
    upsertMeta('meta[property="og:image"]', "property", "og:image", absoluteImage);
    upsertMeta('meta[name="twitter:card"]', "name", "twitter:card", "summary_large_image");
    upsertMeta('meta[name="twitter:title"]', "name", "twitter:title", title);
    upsertMeta(
      'meta[name="twitter:description"]',
      "name",
      "twitter:description",
      description,
    );
    upsertMeta('meta[name="twitter:image"]', "name", "twitter:image", absoluteImage);
    upsertCanonical(canonicalUrl);
  }, [description, image, locale, title]);
}
