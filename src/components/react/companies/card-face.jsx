// One size for every card, wherever it is rendered. The hand flies to the deck
// under a transform, which scales the border and the corner radius with it --
// so if the two differed by even a little, the swap between them would show.
// Sized in viewport units so it does not depend on who the parent happens to be.
// A row of five has to fit across, and a card is taller than it is wide, so the
// width answers to the shorter of the two axes before it hits its ceiling.
export const CARD_SIZE =
  "w-[62vw] max-w-68 lg:w-[min(18vw,34vh)] lg:max-w-88 aspect-3/4";

// Shared shell for both faces, so a flipped card keeps the same silhouette.
const CARD_SHELL =
  "w-full h-full border-2 rounded-2xl p-5 bg-white shadow-xl flex flex-col justify-center items-center";

// The visual front of a card, with no positioning or interaction of its own.
// Both the deck and the dealt hand wrap this in their own motion element.
const CardFace = ({ source, description, role }) => {
  return (
    <div className={CARD_SHELL + " gap-2 md:gap-5"}>
      <img
        src={source.src}
        alt={description}
        className="pointer-events-none p-2 max-w-1/2"
      />

      <p className="lowercase text-xl md:text-2xl font-semibold">
        {description}
      </p>
      <p className="lowercase text-base md:text-xl font-light">{role}</p>
    </div>
  );
};

// The back of a card. Only the dealt hand flips, so the deck never renders it.
// The logo sits in opposite corners the way a suit does on a playing card, so
// the back still says whose card it is without repeating the front.
export const CardBack = ({ source, description, blurb }) => {
  return (
    <div className={CARD_SHELL + " relative gap-2 text-center"}>
      <img
        src={source.src}
        alt=""
        aria-hidden="true"
        className="pointer-events-none absolute top-3 left-3 size-7 object-contain"
      />

      <p className="lowercase text-lg md:text-xl font-semibold">
        {description}
      </p>
      <p className="text-xs md:text-sm font-light leading-snug">{blurb}</p>

      <img
        src={source.src}
        alt=""
        aria-hidden="true"
        className="pointer-events-none absolute bottom-3 right-3 size-7 object-contain rotate-180"
      />
    </div>
  );
};

export default CardFace;
