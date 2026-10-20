import { z } from "zod";
import { states } from "./catalog.mjs";
import { sourceUrl } from "../validation.mjs";
export const MAX_UPLOAD = 3 * 1024 * 1024;
export const documentInput = z.object({
  title: z.string().trim().min(2).max(160),
  type_key: z.string().regex(/^[a-z_]{2,40}$/),
  subject: z.enum(["self", "spouse", "sponsor"]),
  category: z.string().max(40).default("Other"),
});
export const transitionInput = z
  .object({
    id: z.uuid(),
    axis: z.enum(Object.keys(states)),
    target: z.string(),
    revision: z.coerce.number().int().nonnegative(),
  })
  .refine((v) => states[v.axis].includes(v.target));
export const metadataInput = z.object({
  id: z.uuid(),
  issuer: z.string().max(200),
  issue_date: z.union([z.iso.date(), z.literal("")]),
  expiry_date: z.union([z.iso.date(), z.literal("")]),
  due_date: z.union([z.iso.date(), z.literal("")]),
  notes: z.string().max(4000),
  destination: z.string().max(100),
  process_url: z.union([sourceUrl, z.literal("")]),
  next_action: z.string().max(500),
});
export function inspectFile(bytes, filename, mime) {
  if (!bytes.length || bytes.length > MAX_UPLOAD)
    throw new Error("Use a file no larger than 3 MB.");
  const types = [
    ["application/pdf", "pdf", Buffer.from("%PDF-")],
    ["image/png", "png", Buffer.from([137, 80, 78, 71, 13, 10, 26, 10])],
    ["image/jpeg", "jpg", Buffer.from([255, 216, 255])],
  ];
  const type = types.find(
    ([m, , magic]) =>
      m === mime && bytes.subarray(0, magic.length).equals(magic),
  );
  if (!type)
    throw new Error("Only genuine PDF, PNG or JPEG files are accepted.");
  if (!/\.(pdf|png|jpe?g)$/i.test(filename))
    throw new Error("Use a PDF, PNG or JPEG filename.");
  return {
    mime: type[0],
    extension: type[1],
    filename: filename.replace(/[^a-zA-Z0-9._ -]/g, "_").slice(0, 160),
  };
}
