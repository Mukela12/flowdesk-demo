import { cn } from "@/shared/lib/utils";
import { Check, X } from "lucide-react";

export function TeamInvitation() {
    return (
        <div className="w-full max-w-xl mx-auto">
            <div className="relative bg-card border border-border shadow-[0_1px_6px_0_rgba(0,0,0,0.02)] rounded-xl p-4">
                <div className="flex items-center gap-4">
                    <div className="relative h-10 w-10 flex-shrink-0">
                        <img
                            src="https://ferf1mheo22r9ira.public.blob.vercel-storage.com/avatar-01-n0x8HFv8EUetf9z6ht0wScJKoTHqf8.png"
                            alt="Sarah Chen"
                            loading="lazy"
                            className="rounded-full object-cover"
                            style={{ position: 'absolute', inset: 0, width: '100%', height: '100%' }}
                        />
                        <div className="absolute bottom-0 right-0 h-2.5 w-2.5 rounded-full bg-green-500 ring-2 ring-card" />
                    </div>

                    <div className="flex-1 min-w-0">
                        <div className="flex items-center justify-between gap-4">
                            <div>
                                <p className="text-sm font-medium text-foreground">
                                    Team Invitation
                                </p>
                                <p className="text-[13px] text-muted-foreground mt-0.5">
                                    Kokonut invited you to join{" "}
                                    <span className="font-medium text-foreground">
                                        Design Team
                                    </span>
                                </p>
                            </div>
                        </div>
                    </div>
                    <div className="flex items-center gap-2">
                        <button
                            type="button"
                            className="rounded-lg flex items-center justify-center h-8 w-8 p-0 hover:bg-red-50 text-muted-foreground hover:text-red-600 transition-colors"
                        >
                            <X className="h-4 w-4" />
                        </button>
                        <button
                            type="button"
                            className={cn(
                                "rounded-lg flex items-center justify-center h-8 w-8 p-0",
                                "hover:bg-emerald-50",
                                "text-muted-foreground hover:text-emerald-600",
                                "transition-colors"
                            )}
                        >
                            <Check className="h-4 w-4" />
                        </button>
                    </div>
                </div>

                <div className="mt-2 ml-14">
                    <p className="text-[12px] text-muted-foreground">
                        Invited 5 minutes ago
                    </p>
                </div>
            </div>
        </div>
    );
}
