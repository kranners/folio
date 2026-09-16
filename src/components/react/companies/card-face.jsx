const CardShell = ({ className, children }) => (
  <div
    className={`w-full h-full border-2 rounded-2xl p-5 bg-white shadow-xl flex flex-col justify-center items-center ${className}`}
  >
    {children}
  </div>
);

export const CardFace = ({ logo, name, role }) => {
  return (
    <CardShell className="gap-2 md:gap-5">
      <img
        src={logo.src}
        alt={name}
        className="pointer-events-none p-2 max-w-1/2"
      />

      <p className="lowercase text-xl md:text-2xl font-semibold">{name}</p>
      <p className="lowercase text-base md:text-xl font-light">{role}</p>
    </CardShell>
  );
};

export const CardBack = ({ logo, name, blurb }) => {
  return (
    <CardShell className="relative gap-2 text-center">
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
    </CardShell>
  );
};
