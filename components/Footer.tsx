import Link from "next/link";

import { styled } from "@/stitches.config";
import { Heading } from "./Heading";

const Footer = () => {
  return (
    <FooterStyled>
      <Heading sansSerif italic size="h6" as="h6">
        Thank you <Link href="https://lens.dev">Lens Protocol</Link> :)
      </Heading>

      <Heading sansSerif italic size="h6" as="h6">
        This project is open source at{" "}
      </Heading>
    </FooterStyled>
  );
};

export default Footer;

const FooterStyled = styled("footer", {
  display: "flex",
  flexDirection: "column",
  justifyContent: "center",
  alignItems: "center",
  gap: "1rem",

  width: "100%",
  height: "fit-content",
});
