
export const metadata = {
  title: "StageEase",
  description: "Page description",
};

import PageIllustration from "@/components/page-illustration";
import Hero from "@/components/hero-home";
import Workflows from "@/components/workflows"
import Cta from "@/components/cta";

export default function Home() {
  return (
    <>
      <PageIllustration />
      <Hero />
      <Workflows />
      <Cta />
    </>
  );
}
