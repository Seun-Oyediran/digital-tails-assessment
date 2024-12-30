'use client';
import useOutsideClick from '@/hooks/use-outside-click';
import { AnimatePresence, motion, type Variants } from 'framer-motion';
import React, { type ReactNode } from 'react';

interface IProps {
  isOpen: boolean;
  handleClose: () => void;
  className?: string;
  children: ReactNode;
  maxWidth?: string;
  centered?: boolean;
}

const ModalContainerVariants: Variants = {
  hidden: { opacity: 0 },
  visible: { opacity: 1 },
  exit: { opacity: 0, transition: { delay: 0.15 } },
};

const ModalVariants: Variants = {
  hidden: { y: '-100px', opacity: 0.3 },
  visible: { y: '0', opacity: 1 },
  exit: { y: '-100px', opacity: 0.3 },
};

export function ModalContainer(props: IProps) {
  const {
    handleClose,
    isOpen,
    className = '',
    children,
    maxWidth = '767px',
    centered = true,
  } = props;

  const callback = () => {
    handleClose();
  };

  const ref = useOutsideClick<HTMLDivElement>(callback);

  return (
    <AnimatePresence mode="wait">
      {isOpen && (
        <motion.div
          variants={ModalContainerVariants}
          initial="hidden"
          animate="visible"
          exit="exit"
          className={`app_modal_container px-4 ${className}`}
        >
          <motion.div
            className={`m-4 app_modal_container__dialog mx-auto max-w-[${maxWidth}] ${
              centered ? 'centered' : ''
            }`}
            variants={ModalVariants}
            style={{ maxWidth }}
          >
            <div ref={ref} className={`app_modal_container__dialog__content flex flex-col w-full`}>
              {children}
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
