"use client";
import React from "react";
import { motion } from "framer-motion";

interface IProps {
  color: string;
  layoutId?: string;
  activeColor: string;
  onClick: () => void;
}

export function Color(props: IProps) {
  const { activeColor, color, onClick, layoutId } = props;

  return (
    <div className="app_category_options">
      <button
        className="app_category_options__item"
        type="button"
        onClick={onClick}
        style={{ background: color }}
      >
        {activeColor === color && (
          <motion.div
            layoutId={`app_colors_${layoutId}`}
            className="app_category_options__item__border"
          />
        )}
      </button>
    </div>
  );
}
