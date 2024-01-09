import dynamic from "next/dynamic";

/** Must be client-side only */
const ZoomSession = dynamic(
  () => import("@/components/ZoomSession").then((module) => module.ZoomSession),
  {
    ssr: false,
  }
);

export default function Home() {
  return <ZoomSession />;
}
