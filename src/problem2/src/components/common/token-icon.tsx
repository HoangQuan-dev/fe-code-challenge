import { memo, useState } from "react";
import { Avatar } from "@mui/material";

interface TokenIconProps {
  src: string;
  alt: string;
  size?: number;
}

/**
 * Displays a token icon with an Avatar fallback on load error.
 */
const TokenIcon = memo(({ src, alt, size = 24 }: TokenIconProps) => {
  const [hasError, setHasError] = useState(false);

  return (
    <Avatar
      src={hasError ? undefined : src}
      alt={alt}
      sx={{
        width: size,
        height: size,
        fontSize: size * 0.45,
        bgcolor: hasError ? "action.selected" : "transparent",
      }}
      imgProps={{ onError: () => setHasError(true) }}
    >
      {alt.charAt(0).toUpperCase()}
    </Avatar>
  );
});

TokenIcon.displayName = "TokenIcon";

export default TokenIcon;
