import { requireOwner } from "@/lib/study-hub/server";
import Shell from "@/components/study-hub/Shell";
export default async function PrivateLayout({ children }) {
  await requireOwner();
  return <Shell>{children}</Shell>;
}
