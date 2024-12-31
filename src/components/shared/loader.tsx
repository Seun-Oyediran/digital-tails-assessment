"use client";
import React, { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { useAppContext } from "@/state/context";

// import { emojiPaths } from "@/utils/static";
// import { SvgMorph } from "./svg-morph";

export function Loader() {
  const { state } = useAppContext();
  const progress = 50;

  // console.log(progress);

  const [shown, setShown] = useState(true);

  if (!state.loading) return null;

  return (
    <div className="app_loader">
      <div className="app_loader_line">
        <motion.div
          className="app_loader_line_ctt"
          animate={{ width: `${state.loadingProgress}%` }}
        ></motion.div>
      </div>
    </div>
  );
}
