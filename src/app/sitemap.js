import { studies } from "@/assets/studies";
export default function sitemap() {
  const origin = "https://abdullah-al-tamim.vercel.app";
  return [
    { url: origin, changeFrequency: "monthly", priority: 1 },
    ...studies.map((s) => ({
      url: origin + "/work/" + s.id,
      changeFrequency: "monthly",
      priority: 0.7,
    })),
  ];
}
