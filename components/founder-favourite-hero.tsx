import Image from "next/image";

const LEFT_LAUREL =
  "/deco/ic-system-gf-gold-left-laurel-32-3x.d074c7557225d2a0f3f1289a3dde7a7d.png";
const RIGHT_LAUREL =
  "/deco/ic-system-gf-gold-right-laurel-32-3x.f972b95c999d29e144d9ef970585906d.png";

/**
 * Airbnb-style laurel hero that celebrates a founder-favourite spot — gold
 * laurels flanking the "Founder favourite" headline.
 */
export function FounderFavouriteHero() {
  return (
    <div className="flex items-center flex-col sm:flex-row sm:justify-between gap-1.5 p-4 border rounded-2xl">
      <div className="flex items-center gap-3">
        <Image
          src={LEFT_LAUREL}
          alt=""
          width={54}
          height={96}
          className="h-12 w-auto select-none"
        />
        <span className="font-heading text-2xl font-bold tracking-tight">
          Founder favourite
        </span>
        <Image
          src={RIGHT_LAUREL}
          alt=""
          width={54}
          height={96}
          className="h-12 w-auto select-none"
        />
      </div>
      <p className="max-w-[240px] text-center sm:text-right text-md font-semibold">
        One of our personal go-to spots to study
      </p>
    </div>
  );
}
