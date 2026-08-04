"use client";

import { createContext, useContext } from "react";

/**
 * Set to `true` by Stagger so nested FadeUp elements know they should inherit
 * the parent's variants cascade rather than managing their own viewport trigger.
 */
export const StaggerContext = createContext(false);
export const useInStagger = () => useContext(StaggerContext);
