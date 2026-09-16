// One size for every card, wherever it is rendered, so the swap between the
// hand and the deck does not show. A row of five has to fit across, and a card
// is taller than it is wide, so the width answers to the shorter axis.
//
// The height term is what the column has left over: the section minus the
// deck's top padding (20dvh + 5.5rem), the deal button (5rem, 7rem past lg),
// the gap under it (2rem) and the stack's own offset (1.5rem), turned back
// into a width by the aspect ratio. Without it a short viewport has no budget
// and the stack is clipped rather than shrunk.
export const CARD_SIZE =
  "w-[min(62vw,calc((80dvh_-_14rem)*3/4))] max-w-68 " +
  "lg:w-[min(18vw,calc((80dvh_-_16rem)*3/4))] lg:max-w-88 aspect-3/4";

const CARD_SHELL =
  "w-full h-full border-2 rounded-2xl p-5 bg-white shadow-xl flex flex-col justify-center items-center";

export const CardFace = ({ logo, name, role }) => {
  return (
    <div className={`${CARD_SHELL} gap-2 md:gap-5`}>
      <img
        src={logo.src}
        alt={name}
        className="pointer-events-none p-2 max-w-1/2"
      />

      <p className="lowercase text-xl md:text-2xl font-semibold">{name}</p>
      <p className="lowercase text-base md:text-xl font-light">{role}</p>
    </div>
  );
};

// The logo sits in opposite corners the way a suit does on a playing card.
export const CardBack = ({ logo, name, blurb }) => {
  return (
    <div className={`${CARD_SHELL} relative gap-2 text-center`}>
      <img
        src={logo.src}
        alt=""
        aria-hidden="true"
        className="pointer-events-none absolute top-3 left-3 size-7 object-contain"
      />

      <p className="lowercase text-lg md:text-xl font-semibold">{name}</p>
      <p className="text-xs md:text-sm font-light leading-snug">{blurb}</p>

      <img
        src={logo.src}
        alt=""
        aria-hidden="true"
        className="pointer-events-none absolute bottom-3 right-3 size-7 object-contain rotate-180"
      />
    </div>
  );
};
