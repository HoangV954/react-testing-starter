import { Theme } from "@radix-ui/themes";
import "@radix-ui/themes/styles.css";
import { PropsWithChildren } from "react";
import AuthProvider from "./AuthProvider";
import { CartProvider } from "./CartProvider";
import ReactQueryProvider from "./ReactQueryProvider";
import { LanguageProvider } from "./language/LanguageProvider";

const Providers = ({ children }: PropsWithChildren) => {
  return (
    <AuthProvider> {/* Need to modify setups Auth so it works normally (children rendering) */}
      <ReactQueryProvider>
        <CartProvider>
          <LanguageProvider language="en">
            <Theme>{children}</Theme>
          </LanguageProvider>
        </CartProvider>
      </ReactQueryProvider>
    </AuthProvider>
  );
};

export default Providers;
