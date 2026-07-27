import { Reveal } from "@damc/ui";
import type { Milestone } from "@damc/db";

export function MilestonesTimeline({ milestones }: { milestones: Milestone[] }) {
  return (
    <ol className="relative border-l border-ink/15 pl-8 dark:border-parchment/15">
      {milestones.map((m, i) => (
        <Reveal key={m.id} delay={i * 0.08}>
          <li className="mb-10 last:mb-0">
            <span className="absolute -left-[7px] mt-1.5 h-3.5 w-3.5 rounded-full border-2 border-parchment-paper bg-gold-deep dark:border-ink dark:bg-gold-bright" />
            <div className="font-display text-xl font-semibold text-gold-deep dark:text-gold-bright">{m.year}</div>
            <div className="mt-1 font-display text-lg font-semibold text-ink dark:text-parchment">{m.title}</div>
            {m.description && (
              <p className="mt-1.5 max-w-xl text-sm text-bronze dark:text-parchment/70">{m.description}</p>
            )}
          </li>
        </Reveal>
      ))}
    </ol>
  );
}
