import { User } from "lucide-react";
import type { CastMember } from "../ui/cast-carousel";

export const CastMemberCard = ({ member }: { member: CastMember }) => {
  return (
    <div
      data-testid="cast-member"
      className="flex-grow-0 flex-shrink-0 px-4 w-32"
    >
      <a
        aria-label={`View ${member.name} on ${
          member.imdbUrl ? "IMDb" : "TMDB"
        }`}
        href={member.imdbUrl || member.tmdbUrl}
        target="_blank"
        rel="noopener noreferrer"
        className="flex flex-col items-center hover:scale-105 transition-transform"
      >
        {member.profileUrl ? (
          <img
            src={member.profileUrl}
            alt={member.name}
            className="w-20 h-20 rounded-full object-cover shadow-md mb-2 border-2 border-transparent hover:border-primary"
          />
        ) : (
          <div className="w-20 h-20 rounded-full bg-muted flex items-center justify-center mb-2 text-muted-foreground text-xl border-2 border-transparent hover:border-primary">
            <User
              className="w-8 h-8"
              data-testid="cast-member-placeholder"
            />
          </div>
        )}
        <span
          data-testid="cast-member-name"
          className="font-semibold text-sm text-center line-clamp-2 hover:underline"
        >
          {member.name}
        </span>
        <span
          data-testid="cast-member-character"
          className="text-xs text-muted-foreground text-center line-clamp-2"
        >
          {member.character}
        </span>
      </a>
    </div>
  );
};
