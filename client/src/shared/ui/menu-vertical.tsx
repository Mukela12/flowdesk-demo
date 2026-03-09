import { motion } from "framer-motion";
import { ArrowRight } from "lucide-react";

type MenuItem = {
  label: string;
  href: string;
};

interface MenuVerticalProps {
  menuItems: MenuItem[];
  color?: string;
  skew?: number;
}

const MotionLink = motion.create("a");

export const MenuVertical = ({
  menuItems = [],
  color = "#ff6900",
  skew = 0,
}: MenuVerticalProps) => {
  return (
    <div className="flex w-fit flex-col gap-4 px-10">
      {menuItems.map((item, index) => (
        <motion.div
          key={`${item.href}-${index}`}
          className="group/nav flex items-center gap-2 cursor-pointer text-foreground"
          initial="initial"
          whileHover="hover"
        >
          <motion.div
            variants={{
              initial: { x: "-100%", color: "inherit", opacity: 0 },
              hover: { x: 0, color, opacity: 1 },
            }}
            transition={{ duration: 0.3, ease: "easeOut" as const }}
            className="z-0"
          >
            <ArrowRight strokeWidth={3} className="size-10" />
          </motion.div>

          <MotionLink
            href={item.href}
            variants={{
              initial: { x: -40, color: "inherit" },
              hover: { x: 0, color, skewX: skew },
            }}
            transition={{ duration: 0.3, ease: "easeOut" as const }}
            className="font-semibold text-4xl no-underline"
          >
            {item.label}
          </MotionLink>
        </motion.div>
      ))}
    </div>
  );
};
