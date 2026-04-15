import { z } from "zod";
import { CompositionProps } from "./constants";

export const RenderRequest = z.object({
  inputProps: CompositionProps,
});

// Any other remaining types...
