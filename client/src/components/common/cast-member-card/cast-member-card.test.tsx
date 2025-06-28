import { describe, expect, test } from "vitest";
import { CastMemberCard } from "./cast-member-card";
import type { CastMember } from "../cast-carousel/cast-carousel";
import { render, screen } from "@testing-library/react";

const castMember: CastMember = {
  id: 1,
  name: "Mock Cast Member Name",
  character: "Mock Cast Member Character",
  profileUrl: "https://example.com/profile.jpg",
  imdbUrl: "https://example.com/imdb",
  tmdbUrl: "https://example.com/tmdb",
};

const renderCastMemberCard = (customProps?: Partial<CastMember>) => {
  render(<CastMemberCard member={{ ...castMember, ...customProps }} />);
};

describe("cast-member-card", () => {
  test("renders the cast memeber image", () => {
    renderCastMemberCard();
    const castMemberImage = screen.getByRole("img", {
      name: castMember.name,
    });
    expect(castMemberImage).toBeInTheDocument();
    expect(castMemberImage).toHaveAttribute("src", castMember.profileUrl);
    expect(castMemberImage).toHaveAttribute("alt", castMember.name);
  });

  test("renders a placeholder when profileUrl is not provided", () => {
    renderCastMemberCard({ profileUrl: null });
    const castMemberImage = screen.queryByRole("img", {
      name: castMember.name,
    });
    expect(castMemberImage).not.toBeInTheDocument();
    const placeholderIcon = screen.getByTestId("cast-member-placeholder");
    expect(placeholderIcon).toBeInTheDocument();
  });

  test("renders the cast memeber name", () => {
    renderCastMemberCard();
    const castMemberName = screen.getByText(castMember.name);
    expect(castMemberName).toBeInTheDocument();
  });

  test("renders the cast memeber character", () => {
    renderCastMemberCard();
    const castMemberCharacter = screen.getByText(castMember.character);
    expect(castMemberCharacter).toBeInTheDocument();
  });

  test("links to the cast memeber's imdb page when imdbUrl is provided and the link has the correct href", () => {
    renderCastMemberCard();
    const castMemberLink = screen.getByRole("link", {
      name: `View ${castMember.name} on IMDb`,
    });
    expect(castMemberLink).toBeInTheDocument();
    expect(castMemberLink).toHaveAttribute("href", castMember.imdbUrl);
  });

  test("links to the cast memeber's tmdb page when tmdbUrl is provided and the link has the correct href", () => {
    renderCastMemberCard({
      imdbUrl: null,
      tmdbUrl: "https://example.com/tmdb",
    });
    const castMemberLink = screen.getByRole("link", {
      name: `View ${castMember.name} on TMDB`,
    });
    expect(castMemberLink).toBeInTheDocument();
    expect(castMemberLink).toHaveAttribute("href", castMember.tmdbUrl);
  });
});
