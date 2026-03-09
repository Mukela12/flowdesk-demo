import * as React from "react";
import { motion } from "framer-motion";
import { Star, Bookmark } from "lucide-react";

import { cn } from "@/shared/lib/utils";
import { Avatar, AvatarFallback, AvatarImage } from "@/shared/ui/avatar";
import { Button } from "@/shared/ui/button";

interface FreelancerProfileCardProps extends React.HTMLAttributes<HTMLDivElement> {
  name: string;
  title: string;
  avatarSrc: string;
  bannerSrc: string;
  rating: number;
  duration: string;
  rate: string;
  tools: React.ReactNode;
  onGetInTouch?: () => void;
  onBookmark?: () => void;
  className?: string;
}

const cardVariants = {
  initial: { opacity: 0, y: 20 },
  animate: { opacity: 1, y: 0, transition: { duration: 0.5, ease: "easeOut" as const } },
  hover: { scale: 1.03, transition: { duration: 0.3 } },
};

const contentVariants = {
  initial: {},
  animate: { transition: { staggerChildren: 0.1, delayChildren: 0.3 } },
};

const itemVariants = {
  initial: { opacity: 0, y: 10 },
  animate: { opacity: 1, y: 0, transition: { duration: 0.3 } },
};

export const FreelancerProfileCard = React.forwardRef<HTMLDivElement, FreelancerProfileCardProps>(
  ({ className, name, title, avatarSrc, bannerSrc, rating, duration, rate, tools, onGetInTouch, onBookmark, ...props }, ref) => {
    const avatarName = name.split(" ").map((n) => n[0]).join("");

    return (
      <motion.div
        ref={ref}
        className={cn("relative w-full max-w-sm overflow-hidden rounded-2xl bg-card shadow-lg", className)}
        variants={cardVariants}
        initial="initial"
        animate="animate"
        whileHover="hover"
        {...(props as any)}
      >
        <div className="h-32 w-full">
          <img src={bannerSrc} alt={`${name}'s banner`} className="h-full w-full object-cover" />
        </div>

        <Button
          variant="secondary"
          size="icon"
          className="absolute right-4 top-4 h-9 w-9 rounded-lg bg-background/50 backdrop-blur-sm text-card-foreground/80 hover:bg-background/70"
          onClick={onBookmark}
          aria-label="Bookmark profile"
        >
          <Bookmark className="h-4 w-4" />
        </Button>

        <div className="absolute left-1/2 top-32 -translate-x-1/2 -translate-y-1/2">
          <Avatar className="h-20 w-20 border-4 border-card">
            <AvatarImage src={avatarSrc} alt={name} />
            <AvatarFallback>{avatarName}</AvatarFallback>
          </Avatar>
        </div>

        <motion.div className="px-6 pb-6 pt-12" variants={contentVariants}>
          <motion.div className="mb-4 flex items-start justify-between" variants={itemVariants}>
            <div>
              <h2 className="text-xl font-semibold text-card-foreground">{name}</h2>
              <p className="text-sm text-muted-foreground">{title}</p>
            </div>
            <div className="flex flex-col items-end gap-1.5">
              <div className="flex gap-1.5">{tools}</div>
              <span className="text-xs text-muted-foreground">Tools</span>
            </div>
          </motion.div>

          <motion.div className="my-6 flex items-center justify-around rounded-lg border border-border bg-background/30 p-4" variants={itemVariants}>
            <StatItem icon={Star} value={rating.toFixed(1)} label="rating" />
            <Divider />
            <StatItem value={duration} label="duration" />
            <Divider />
            <StatItem value={rate} label="rate" />
          </motion.div>

          <motion.div variants={itemVariants}>
            <Button className="w-full" size="lg" onClick={onGetInTouch}>Get in touch</Button>
          </motion.div>
        </motion.div>
      </motion.div>
    );
  }
);
FreelancerProfileCard.displayName = "FreelancerProfileCard";

const StatItem = ({ icon: Icon, value, label }: { icon?: React.ElementType; value: string | number; label: string }) => (
  <div className="flex flex-1 flex-col items-center justify-center px-2 text-center">
    <div className="flex items-center gap-1">
      {Icon && <Icon className="h-4 w-4 text-muted-foreground" />}
      <span className="text-base font-semibold text-card-foreground">{value}</span>
    </div>
    <span className="text-xs capitalize text-muted-foreground">{label}</span>
  </div>
);

const Divider = () => <div className="h-10 w-px bg-border" />;
